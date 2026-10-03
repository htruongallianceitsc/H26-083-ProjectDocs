import fs from 'node:fs';
import path from 'node:path';
import {root, loadConfig, loadEntities, registry, entityIndex, reverseIndex, sha, writeJson, writeText} from './lib/core.mjs';
import {loadPackLock} from './lib/packs.mjs';
const cfg=loadConfig(), entities=loadEntities(cfg), reg=registry(), idx=entityIndex(entities), rev=reverseIndex(entities);
const gen=cfg.generatedDir;
fs.mkdirSync(path.resolve(root,gen),{recursive:true}); fs.mkdirSync(path.resolve(root,'tools/.cache'),{recursive:true});
const statePath=path.resolve(root,'tools/.cache/dependency-state.json');
const prev=fs.existsSync(statePath)?JSON.parse(fs.readFileSync(statePath,'utf8')):{records:{}};
const records={}; const health=[];
function directDeps(e){ const s=new Set(); for(const arr of Object.values(e.related||{})) if(Array.isArray(arr)) for(const c of arr) if(idx.has(String(c))) s.add(String(c)); for(const x of rev.get(e.code)||[]) s.add(x.source.code); return [...s].sort(); }
for(const e of entities){
 const deps=directDeps(e); const depsHash=sha(deps.map(c=>`${c}:${idx.get(c).sourceHash}`).join('|'));
 const old=prev.records?.[e.code]; const sourceChanged=!old||old.sourceHash!==e.sourceHash;
 const baseline=sourceChanged?depsHash:(old.baselineDepsHash||depsHash); const stale=!sourceChanged && baseline!==depsHash;
 records[e.code]={sourceHash:e.sourceHash,baselineDepsHash:baseline,currentDepsHash:depsHash,dependencies:deps,stale,file:e.file};
 if(stale) health.push({severity:'warning',code:e.code,type:'stale-dependency',message:'Related source changed after this document baseline.'});
}
fs.writeFileSync(statePath,JSON.stringify({generatedAt:new Date().toISOString(),records},null,2)+'\n');
// Catalog
const catalog=entities.map(e=>({code:e.code,type:e.type,title:e.title,status:e.status,owner:e.owner,file:e.file,related:e.related}));
writeJson(`${gen}/catalog.json`,catalog);
let md='# DOCUMENT INDEX\n\n| Code | Type | Title | Status | Owner | File |\n|---|---|---|---|---|---|\n';
for(const e of entities) md+=`| ${e.code} | ${e.type} | ${String(e.title).replaceAll('|','\\|')} | ${e.status} | ${e.owner} | ${e.file} |\n`;
writeText(`${gen}/DOCUMENT_INDEX.md`,md);
// Graph
const edges=[]; for(const e of entities) for(const [key,arr] of Object.entries(e.related||{})) if(Array.isArray(arr)) for(const c of arr) if(idx.has(String(c))) edges.push({from:e.code,to:String(c),relationKey:key});
writeJson(`${gen}/graph.json`,{nodes:catalog.map(({related,...x})=>x),edges});
let gmd='# PROJECT GRAPH\n\n```mermaid\nflowchart LR\n'; for(const e of entities) gmd+=`  ${e.code.replace(/[^A-Za-z0-9_]/g,'_')}["${e.code}: ${String(e.title).replaceAll('"','\\"')}"]\n`; for(const x of edges) gmd+=`  ${x.from.replace(/[^A-Za-z0-9_]/g,'_')} -->|${x.relationKey}| ${x.to.replace(/[^A-Za-z0-9_]/g,'_')}\n`; gmd+='```\n'; writeText(`${gen}/PROJECT_GRAPH.md`,gmd);
// Typed traceability. Direct edges plus explicitly configured via requirements for tests.
function both(rootEntity,key,targetType){ const out=new Set(); for(const c of rootEntity.related?.[key]||[]) if(idx.get(String(c))?.type===targetType) out.add(String(c)); for(const x of rev.get(rootEntity.code)||[]) if(x.relationKey===key&&x.source.type===targetType) out.add(x.source.code); return [...out].sort(); }
const rows=[]; for(const f of entities.filter(e=>e.type==='feature')){
 const requirements=both(f,'requirements','requirement');
 const tests=new Set(both(f,'tests','test-case')); for(const rc of requirements){ const r=idx.get(rc); for(const t of both(r,'tests','test-case')) tests.add(t); }
 rows.push({feature:f.code,title:f.title,requirements,business_rules:both(f,'business_rules','business-rule'),screens:both(f,'screens','screen'),flows:both(f,'flows','flow'),apis:both(f,'apis','api'),database_objects:both(f,'database_objects','database-object'),tests:[...tests].sort(),permissions:both(f,'permissions','permission'),deep_links:both(f,'deep_links','deep-link'),sync_policies:both(f,'sync_policies','sync-policy')});
}
writeJson(`${gen}/traceability.json`,rows);
let tmd='# TRACEABILITY MATRIX\n\n> Typed/direct paths only. No generic untyped 2-hop traversal.\n\n| Feature | Requirements | Rules | Screens | APIs | DB | Tests | Mobile contracts |\n|---|---|---|---|---|---|---|---|\n';
for(const r of rows){const mob=[...r.permissions,...r.deep_links,...r.sync_policies];tmd+=`| ${r.feature} | ${r.requirements.join('<br>')} | ${r.business_rules.join('<br>')} | ${r.screens.join('<br>')} | ${r.apis.join('<br>')} | ${r.database_objects.join('<br>')} | ${r.tests.join('<br>')} | ${mob.join('<br>')} |\n`;}
writeText(`${gen}/TRACEABILITY_MATRIX.md`,tmd);
writeJson(`${gen}/health.json`,health);
writeText(`${gen}/DOCUMENT_HEALTH.md`,'# DOCUMENT HEALTH\n\n'+(health.length?health.map(x=>`- ${x.severity.toUpperCase()} ${x.code}: ${x.message}`).join('\n'):'No stale dependency findings.')+'\n');
console.log(`Synced ${entities.length} entities, ${edges.length} typed edges, ${rows.length} feature traceability rows.`);

// Capability pack inventory (governance metadata, not business facts).
const packLock=loadPackLock(); const library=[]; const libRoot=path.resolve(root,'reusable-modules');
if(fs.existsSync(libRoot)) for(const ent of fs.readdirSync(libRoot,{withFileTypes:true})) if(ent.isDirectory()){
 const mp=path.join(libRoot,ent.name,'manifest.json'); if(fs.existsSync(mp)){try{const m=JSON.parse(fs.readFileSync(mp,'utf8'));library.push({packageId:m.packageId,version:m.version,description:m.description||'',upgradePolicy:m.upgradePolicy,features:m.features});}catch{}}
}
const imports=Object.values(packLock.imports||{}).map(x=>({packageId:x.packageId,version:x.version,reviewStatus:x.reviewStatus,enabledFeatures:x.enabledFeatures||[],targetRoot:x.targetRoot,upgradePolicy:x.upgradePolicy,updatedAt:x.updatedAt}));
writeJson(`${gen}/packs.json`,{library,imports});
let pmd='# CAPABILITY PACK INVENTORY\n\n## Installed\n\n| Package | Version | Review | Features | Target | Policy |\n|---|---|---|---|---|---|\n';
for(const x of imports)pmd+=`| ${x.packageId} | ${x.version} | ${x.reviewStatus||''} | ${(x.enabledFeatures||[]).join(', ')} | ${x.targetRoot||''} | ${x.upgradePolicy||''} |\n`;
pmd+='\n## Library\n\n| Package | Version | Description | Policy |\n|---|---|---|---|\n';for(const x of library)pmd+=`| ${x.packageId} | ${x.version} | ${String(x.description).replaceAll('|','\\|')} | ${x.upgradePolicy||''} |\n`;writeText(`${gen}/PACK_INVENTORY.md`,pmd);
