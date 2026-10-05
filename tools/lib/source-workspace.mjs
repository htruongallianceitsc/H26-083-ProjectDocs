import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, writeJson, scanEntities, writeMarkdownEntity, existingWorkspaceAbs, workspaceRel } from './common.mjs';

export const sourceLockPath = '.project-docs/source.lock.json';
export function sourceProfiles(){ return loadJson('registry/source-profiles.json',{profiles:{}}); }
export function sourceLock(){ return loadJson(sourceLockPath,{schemaVersion:'1.0',applications:{}}); }
export function saveSourceLock(lock){ writeJson(sourceLockPath,lock); }
export function applications(){ return scanEntities().entities.filter(e=>e.type==='application'); }
export function applicationByCode(code){ return applications().find(e=>e.code===String(code))||null; }
export function profileById(id){ return sourceProfiles().profiles?.[id]||null; }
export function listBaseVersions(baseId){
  const dir=existingWorkspaceAbs('sourceBases',baseId); if(!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir,{withFileTypes:true}).filter(x=>x.isDirectory()&&fs.existsSync(path.join(dir,x.name,'manifest.json'))).map(x=>x.name).sort(compareVersions);
}
function compareVersions(a,b){ const pa=a.split('.').map(Number),pb=b.split('.').map(Number); for(let i=0;i<Math.max(pa.length,pb.length);i++){const d=(pa[i]||0)-(pb[i]||0);if(d)return d;} return 0; }
export function latestBaseVersion(baseId){ const v=listBaseVersions(baseId); return v.length?v[v.length-1]:null; }
export function loadBase(baseId,version=null){ const resolved=version||latestBaseVersion(baseId); if(!resolved) throw new Error(`Source Base not found: ${baseId}`); const manifest=loadJson(`source-bases/${baseId}/${resolved}/manifest.json`); if(!manifest) throw new Error(`Source Base manifest not found: ${baseId}@${resolved}`); return {version:resolved,manifest,dir:existingWorkspaceAbs('sourceBases',baseId,resolved)}; }
export function validateBase(baseId,version){
  const errors=[]; let loaded; try{loaded=loadBase(baseId,version);}catch(e){return [e.message];}
  const m=loaded.manifest; for(const k of ['schemaVersion','sourceBaseId','version','sourceProfile','applicationType','variants']) if(m[k]===undefined||m[k]===null||m[k]==='') errors.push(`${baseId}@${loaded.version}: missing ${k}`);
  if(m.sourceBaseId!==baseId) errors.push(`${baseId}@${loaded.version}: sourceBaseId mismatch ${m.sourceBaseId}`);
  if(m.version!==loaded.version) errors.push(`${baseId}@${loaded.version}: manifest version mismatch ${m.version}`);
  const p=profileById(m.sourceProfile); if(!p) errors.push(`${baseId}@${loaded.version}: unknown sourceProfile ${m.sourceProfile}`); else if(p.sourceBase && p.sourceBase!==baseId) errors.push(`${baseId}@${loaded.version}: profile ${m.sourceProfile} expects sourceBase ${p.sourceBase}`);
  for(const [variant,cfg] of Object.entries(m.variants||{})){
    if(!cfg.template) errors.push(`${baseId}@${loaded.version}/${variant}: missing template`);
    const t=cfg.template?path.join(loaded.dir,cfg.template):null; if(t&&!fs.existsSync(t)) errors.push(`${baseId}@${loaded.version}/${variant}: template path missing ${cfg.template}`);
    for(const req of cfg.requiredPaths||[]) if(t&&!fs.existsSync(path.join(t,req))) errors.push(`${baseId}@${loaded.version}/${variant}: required path missing from template ${req}`);
  }
  return errors;
}
export function validateAllBases(){ const errors=[]; const lib=existingWorkspaceAbs('sourceBases'); if(!fs.existsSync(lib)) return [`${workspaceRel('sourceBases')} directory missing`]; for(const entry of fs.readdirSync(lib,{withFileTypes:true})){ if(!entry.isDirectory())continue; for(const v of listBaseVersions(entry.name)) errors.push(...validateBase(entry.name,v)); } return errors; }
export function appMeta({code,title,profileId,sourceRoot,baseId='',baseVersion='',variant='',origin='existing',owner='Engineering'}){
  const p=profileById(profileId); if(!p) throw new Error(`Unknown source profile: ${profileId}`); const date=new Date().toISOString().slice(0,10);
  return {code,type:'application',title,status:'active',owner,created_at:date,updated_at:date,last_reviewed_at:date,tags:['application','source'],application_type:p.applicationType,source_profile:profileId,technology_stack:p.technologyStack,source_root:sourceRoot,source_base:baseId||'',source_base_version:baseVersion||'',source_variant:variant||'',source_origin:origin,related:{features:[]}};
}
export function createApplicationEntity(opts){ if(applicationByCode(opts.code)) throw new Error(`Application entity already exists: ${opts.code}`); const rel=`docs/24-applications/${String(opts.code).toLowerCase()}.md`; const meta=appMeta(opts); const body=`# ${opts.title}\n\n## Responsibility\n\nDeployable application boundary for \`${opts.code}\`.\n\n## Source Boundary\n\n- Root: \`${opts.sourceRoot}\`\n- Source Profile: \`${opts.profileId}\`\n- Origin: \`${opts.origin}\`\n${opts.baseId?`- Source Base: \`${opts.baseId}@${opts.baseVersion}\` (${opts.variant})\n`:''}\n## Architecture Notes\n\nKeep stack-specific implementation rules in the selected Source Profile and standards. Feature ownership is expressed through typed \`applications\` relations.\n`;
  writeMarkdownEntity(rel,meta,body); return rel;
}
export function copyTemplate(src,dst,replacements){
  if(fs.existsSync(dst)&&fs.readdirSync(dst).length) throw new Error(`Target source root is not empty: ${path.relative(ROOT,dst).replaceAll(path.sep,'/')}`);
  fs.mkdirSync(dst,{recursive:true});
  function cp(a,b){ for(const e of fs.readdirSync(a,{withFileTypes:true})){ const s=path.join(a,e.name),d=path.join(b,e.name); if(e.isDirectory()){fs.mkdirSync(d,{recursive:true});cp(s,d);} else { let buf=fs.readFileSync(s); let text; try{text=buf.toString('utf8'); if(text.includes('\u0000')) throw new Error('binary'); for(const [k,v] of Object.entries(replacements)) text=text.split(k).join(v); fs.mkdirSync(path.dirname(d),{recursive:true}); fs.writeFileSync(d,text);}catch{fs.mkdirSync(path.dirname(d),{recursive:true});fs.writeFileSync(d,buf);} } } }
  cp(src,dst);
}
export function ensureProjectSelectors(profileCfg){
  const projectProfile=loadJson('project.profile.json',{}); let changed=false;
  if(profileCfg.projectType && !(projectProfile.projectTypes||[]).includes(profileCfg.projectType)){projectProfile.projectTypes=[...(projectProfile.projectTypes||[]),profileCfg.projectType];changed=true;}
  if(profileCfg.technologyStack && !(projectProfile.technologyStacks||[]).includes(profileCfg.technologyStack)){projectProfile.technologyStacks=[...(projectProfile.technologyStacks||[]),profileCfg.technologyStack];changed=true;}
  if(changed) writeJson('project.profile.json',projectProfile); return changed;
}
export function checkApplication(app){
  const errors=[],warnings=[]; const meta=app.meta; const profile=profileById(meta.source_profile); if(!profile){errors.push(`Unknown source profile ${meta.source_profile}`);return {errors,warnings};}
  const sourceRoot=String(meta.source_root||''); if(!sourceRoot){errors.push('source_root is required');return {errors,warnings};}
  const abs=path.join(ROOT,sourceRoot); if(!fs.existsSync(abs)) errors.push(`Source root missing: ${sourceRoot}`);
  const lock=sourceLock().applications?.[app.code]; if(!lock) warnings.push(`No provenance lock for ${app.code}`);
  const required=new Set(profile.requiredPaths||[]);
  if(lock?.sourceBase?.id&&lock?.sourceBase?.version&&lock?.variant){ try{ const loaded=loadBase(lock.sourceBase.id,lock.sourceBase.version); for(const r of loaded.manifest.variants?.[lock.variant]?.requiredPaths||[]) required.add(r); }catch(e){errors.push(e.message);} }
  for(const req of required) if(fs.existsSync(abs)&&!fs.existsSync(path.join(abs,req))) errors.push(`Missing required path ${sourceRoot}/${req}`);
  return {errors,warnings};
}
