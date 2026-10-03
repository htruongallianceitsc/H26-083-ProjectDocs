import fs from 'node:fs';
import path from 'node:path';
import {root, loadConfig, loadEntities, loadProfile, registry, entityIndex, reverseIndex, headings, contentFiles, parseFrontmatter, findMermaid, rel} from './lib/core.mjs';
const cfg=loadConfig(), entities=loadEntities(cfg), profile=loadProfile(), reg=registry(), idx=entityIndex(entities), rev=reverseIndex(entities);
const errors=[], warnings=[], info=[];
const err=(c,m,e)=>errors.push({code:c,msg:m,file:e?.file}), warn=(c,m,e)=>warnings.push({code:c,msg:m,file:e?.file});
const required=reg.schema.required||[];
const typeDefs=reg.entities.entityTypes||{};
const dateRe=/^\d{4}-\d{2}-\d{2}$/;
const seen=new Map();
for(const e of entities){
  if(seen.has(e.code)) err('DUPLICATE_CODE',`${e.code} also in ${seen.get(e.code)}`,e); else seen.set(e.code,e.file);
  for(const k of required) if(e[k]===undefined||e[k]===null||e[k]==='') err('MISSING_FIELD',`${e.code} missing ${k}`,e);
  const td=typeDefs[e.type]; if(!td){err('UNKNOWN_TYPE',`${e.code} type ${e.type} not in registry`,e); continue;}
  if(td.statuses && !td.statuses.includes(e.status)) err('INVALID_STATUS',`${e.code} status ${e.status} invalid for ${e.type}`,e);
  if(td.codePrefix && !String(e.code).startsWith(td.codePrefix+'-')) warn('CODE_PREFIX',`${e.code} should start with ${td.codePrefix}-`,e);
  for(const k of ['created_at','updated_at','last_reviewed_at']) if(e[k] && !dateRe.test(String(e[k]))) err('INVALID_DATE',`${e.code} ${k} must YYYY-MM-DD`,e);
  const allowed=reg.relations.allowed[e.type]||[];
  for(const [key,targets] of Object.entries(e.related||{})){
    if(!reg.relations.relationKeys[key]) { err('UNKNOWN_RELATION_KEY',`${e.code} related.${key} not registered`,e); continue; }
    if(!allowed.includes(key)) err('RELATION_NOT_ALLOWED',`${e.type} ${e.code} may not use related.${key}`,e);
    if(!Array.isArray(targets)){err('RELATION_NOT_ARRAY',`${e.code} related.${key} must be array`,e);continue;}
    const cardinal=reg.relations.cardinality?.[e.type]?.[key];
    if(cardinal?.max!=null && targets.length>cardinal.max) err('CARDINALITY',`${e.code} related.${key} max ${cardinal.max}, found ${targets.length}`,e);
    if(cardinal?.min!=null && targets.length<cardinal.min) err('CARDINALITY',`${e.code} related.${key} min ${cardinal.min}, found ${targets.length}`,e);
    const expectedType=reg.relations.relationKeys[key];
    for(const code of targets){
      const target=idx.get(String(code));
      if(!target) { err('BROKEN_RELATION',`${e.code} -> ${key} -> ${code} not found`,e); continue; }
      if(target.type!==expectedType) err('RELATION_TARGET_TYPE',`${e.code} related.${key} expects ${expectedType}, got ${target.type} (${code})`,e);
    }
  }
}
// duplicate route and API contract
const routes=new Map(), apis=new Map();
for(const e of entities){
 if(e.route && !String(e.route).startsWith('/')) warn('ROUTE_FORMAT',`${e.code} route should start with /`,e);
 if(e.type==='api' && e.path && !String(e.path).startsWith('/')) warn('API_PATH_FORMAT',`${e.code} path should start with /`,e);
 if(e.type==='api' && e.method && !['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'].includes(String(e.method).toUpperCase())) err('API_METHOD',`${e.code} invalid HTTP method ${e.method}`,e);
 if(e.route){ const k=String(e.route).toLowerCase(); if(routes.has(k)) warn('DUPLICATE_ROUTE',`${e.route}: ${routes.get(k)} and ${e.code}`,e); else routes.set(k,e.code); }
 if(e.type==='api' && e.method && e.path){ const k=`${String(e.method).toUpperCase()} ${String(e.path).toLowerCase()}`; if(apis.has(k)) err('DUPLICATE_API',`${k}: ${apis.get(k)} and ${e.code}`,e); else apis.set(k,e.code); }
}
// overlink
const ov=reg.quality.overlink||{};
for(const e of entities){
 const outgoing=Object.values(e.related||{}).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0); const incoming=(rev.get(e.code)||[]).length; const degree=outgoing+incoming;
 if(ov.errorDegree && degree>=ov.errorDegree) err('OVERLINK_DEGREE',`${e.code} degree ${degree} >= ${ov.errorDegree}`,e); else if(ov.warningDegree && degree>=ov.warningDegree) warn('OVERLINK_DEGREE',`${e.code} degree ${degree} >= ${ov.warningDegree}`,e);
 for(const [key,a] of Object.entries(e.related||{})) if(Array.isArray(a)&&ov.maxSingleRelationTargets&&a.length>ov.maxSingleRelationTargets) warn('OVERLINK_RELATION',`${e.code} related.${key} has ${a.length} targets`,e);
}
// Quality rules
function activeRule(rule){ return !rule.projectTypes || rule.projectTypes.some(x=>(profile.projectTypes||[]).includes(x)); }
function relationCount(e,key,direction='outgoing'){
 let n=Array.isArray(e.related?.[key])?e.related[key].length:0;
 if(direction==='both'||direction==='incoming') n += (rev.get(e.code)||[]).filter(x=>x.relationKey===key).length;
 return n;
}
for(const rule of reg.quality.rules||[]){
 if(!activeRule(rule)) continue;
 for(const e of entities){
  if(!(rule.targetTypes||[]).includes(e.type)) continue;
  if(rule.statuses && !rule.statuses.includes(e.status)) continue;
  if(rule.tagsAny && !rule.tagsAny.some(t=>(e.tags||[]).includes(t))) continue;
  if(rule.technologyStacks && !rule.technologyStacks.some(t=>(profile.technologyStacks||[]).includes(t))) continue;
  const push=rule.severity==='error'?err:warn;
  if(rule.relationKey && relationCount(e,rule.relationKey,rule.direction||'outgoing')<(rule.min||0)) push('QUALITY_'+rule.id,`${e.code} needs >= ${rule.min} relation(s) ${rule.relationKey}`,e);
  if(rule.requiredAnyRelation && !rule.requiredAnyRelation.some(k=>relationCount(e,k,'both')>0)) push('QUALITY_'+rule.id,`${e.code} needs one of relations: ${rule.requiredAnyRelation.join(', ')}`,e);
  if(rule.requiredSections){ const hs=headings(e.body).map(x=>x.toLowerCase()); for(const s of rule.requiredSections) if(!hs.some(h=>h.includes(s.toLowerCase()))) push('QUALITY_'+rule.id,`${e.code} missing section: ${s}`,e); }
 }
}
// blocking open questions
if(profile.implementationGate?.blockOnOpenQuestions){
 for(const e of entities) if(e.type==='open-question' && e.blocking===true && ['open'].includes(e.status)) err('BLOCKING_OPEN_QUESTION',`${e.code} is open and blocking`,e);
}
// Reciprocal duplicate relation evidence: same pair linked in both directions.\nconst pairSeen=new Set();\nfor(const e of entities) for(const [key,arr] of Object.entries(e.related||{})) if(Array.isArray(arr)) for(const c of arr){\n const t=idx.get(String(c)); if(!t) continue; const back=Object.values(t.related||{}).some(a=>Array.isArray(a)&&a.includes(e.code));\n const pk=[e.code,t.code].sort().join('|'); if(back&&!pairSeen.has(pk)){pairSeen.add(pk);warn('RECIPROCAL_RELATION',`${e.code} and ${t.code} reference each other; keep one canonical relation direction unless both edges have distinct semantics`,e);}\n}\n// Broken stable-code references inside entity body. Only prefixes known to the registry are considered.\nconst prefixes=[...new Set(Object.values(typeDefs).map(x=>x.codePrefix).filter(Boolean))].sort((a,b)=>b.length-a.length);\nif(prefixes.length){const re=new RegExp(`\\b(?:${prefixes.join('|')})-[A-Z0-9][A-Z0-9-]*\\b`,'g'); for(const e of entities){for(const code of new Set(e.body.match(re)||[])){if(code.includes('XXX'))continue;if(!idx.has(code))warn('BROKEN_CODE_REFERENCE',`${e.code} body references ${code}, but no entity exists`,e);}}}\n\n// Mermaid structural lint over content
const starters=['flowchart','graph','sequenceDiagram','classDiagram','stateDiagram','stateDiagram-v2','erDiagram','journey','gantt','pie','mindmap','timeline','quadrantChart','xychart-beta','architecture-beta','gitGraph'];
for(const p of contentFiles(cfg)){
 const text=fs.readFileSync(p,'utf8'); for(const block of findMermaid(text)){
   const first=block.split(/\r?\n/).find(x=>x.trim())?.trim()||'';
   if(!starters.some(s=>first.startsWith(s))) warn('MERMAID_UNKNOWN',`${rel(p)} Mermaid starts with '${first.slice(0,40)}'`);
   const opens=(block.match(/[\[{(]/g)||[]).length, closes=(block.match(/[\]})]/g)||[]).length;
   if(Math.abs(opens-closes)>4) warn('MERMAID_BALANCE',`${rel(p)} Mermaid delimiter balance looks suspicious`);
 }
}
// stale dependency state generated by sync
const statePath=path.resolve(root,'tools/.cache/dependency-state.json');
if(fs.existsSync(statePath)){
 const state=JSON.parse(fs.readFileSync(statePath,'utf8'));
 for(const e of entities) if(state.records?.[e.code]?.stale) warn('STALE_DEPENDENCY',`${e.code} may be stale because a directly related source changed`,e);
}
console.log(`Entities: ${entities.length}`);
for(const x of errors) console.log(`ERROR [${x.code}] ${x.msg}${x.file?' @ '+x.file:''}`);
for(const x of warnings) console.log(`WARN  [${x.code}] ${x.msg}${x.file?' @ '+x.file:''}`);
console.log(`Validation: ${errors.length} error(s), ${warnings.length} warning(s).`);
process.exit(errors.length?1:0);
