import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, scanEntities } from '../lib/common.mjs';
import { entityPolicy, isUuid, resolveRelationMapping } from '../lib/model-governance.mjs';
import { entityFingerprint, buildKnowledgeIndexes, queryEntities, viewConfig } from '../lib/knowledge-engine.mjs';
import { computeSourceFingerprint, loadSourceIndex, scanSource } from '../lib/source-intelligence.mjs';

const args=Object.fromEntries(process.argv.slice(2).filter(x=>x.startsWith('--')).map(x=>[x.slice(2),true]));
function finding(level,code,message){return {level,code,message};}
function run(){const findings=[];const {entities}=scanEntities();const policy=entityPolicy();const byCode=new Map(),byUid=new Map();
  for(const e of entities){if(byCode.has(e.code))findings.push(finding('error','DUPLICATE_CODE',`${e.code} is duplicated`));else byCode.set(e.code,e);if(!e.uid)findings.push(finding(policy.identity?.legacyMissingUidSeverity||'warning','MISSING_UID',`${e.code} has no permanent uid`));else if(!isUuid(e.uid))findings.push(finding('error','INVALID_UID',`${e.code} has invalid uid ${e.uid}`));else if(byUid.has(e.uid))findings.push(finding('error','DUPLICATE_UID',`${e.code} duplicates uid from ${byUid.get(e.uid).code}`));else byUid.set(e.uid,e);}
  for(const e of entities)for(const [field,raw] of Object.entries(e.meta.related||{}))for(const code of (Array.isArray(raw)?raw:[raw]).filter(Boolean).map(String)){const target=byCode.get(code);const mapping=resolveRelationMapping(e.type,field,target?.type||null);if(!target)findings.push(finding('error','BROKEN_RELATION',`${e.code}.${field} -> ${code} not found`));else if(!mapping)findings.push(finding('error','RELATION_TYPE',`${e.code}.${field} cannot target ${target.type}`));else if(mapping.fallback&&policy.relations?.warnOnFallbackMappings)findings.push(finding('warning','BROAD_RELATION',`${e.code}.${field} -> ${code} uses fallback mapping`));}
  const fp=entityFingerprint();const eidx=loadJson('.project-docs/indexes/entity-index.json',null);if(!eidx)findings.push(finding('warning','INDEX_MISSING','Knowledge indexes are missing'));else if(eidx.entityFingerprint!==fp)findings.push(finding('warning','INDEX_STALE','Knowledge indexes are stale'));
  try{const sidx=loadSourceIndex({rebuildIfMissing:false});if(!sidx.generatedAt)findings.push(finding('warning','SOURCE_INDEX_MISSING','Source intelligence index is missing'));else if(sidx.sourceFingerprint!==computeSourceFingerprint())findings.push(finding('warning','SOURCE_INDEX_STALE','Source intelligence index is stale'));}catch(e){findings.push(finding('warning','SOURCE_INDEX_CHECK',e.message));}
  for(const [id,v] of Object.entries(viewConfig().views||{}))try{queryEntities(v.expression||'',{limit:1});}catch(e){findings.push(finding('error','INVALID_VIEW',`${id}: ${e.message}`));}
  for(const d of ['.project-docs/indexes','.project-docs/reports'])if(!fs.existsSync(path.join(ROOT,d)))findings.push(finding('warning','DIR_MISSING',`${d} is missing`));
  if(args.fix){fs.mkdirSync(path.join(ROOT,'.project-docs/indexes'),{recursive:true});fs.mkdirSync(path.join(ROOT,'.project-docs/reports'),{recursive:true});buildKnowledgeIndexes();scanSource();console.log('[FIX] Rebuilt knowledge and source indexes.');}
  const errors=findings.filter(x=>x.level==='error').length,warnings=findings.filter(x=>x.level==='warning').length;console.log(`Doctor: ${errors} error(s), ${warnings} warning(s), ${entities.length} entity(s).`);for(const f of findings)console.log(`[${f.level.toUpperCase()}] ${f.code}: ${f.message}`);if(errors)process.exitCode=1;
}
try{run();}catch(e){console.error(`[ERROR] ${e.message}`);process.exitCode=1;}
