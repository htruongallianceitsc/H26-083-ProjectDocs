import fs from 'node:fs';
import path from 'node:path';
import { ROOT, markdownFiles, parseFrontmatter, rel, sha256, loadJson } from './common.mjs';

function normalizePath(p){ return rel(p); }
function readText(p){ return fs.readFileSync(p,'utf8'); }
function metaForFile(p, text='') {
  const rp = normalizePath(p);
  if (rp.endsWith('.md')) {
    const parsed = parseFrontmatter(text || readText(p));
    return { code: parsed.data.code || null, type: parsed.data.type || null, title: parsed.data.title || null };
  }
  if (rp.startsWith('.project-docs/workplans/') && rp.endsWith('.json')) {
    try { const j=JSON.parse(text || readText(p)); return { code:j.id || null, type:'workplan', title:j.title || null }; } catch {}
  }
  return { code:null,type:null,title:null };
}

export function canonicalFiles() {
  const out = new Set();
  for (const p of markdownFiles()) out.add(path.resolve(p));
  const addFile = rp => { const p=path.join(ROOT,rp); if(fs.existsSync(p)&&fs.statSync(p).isFile()) out.add(path.resolve(p)); };
  addFile('project.profile.json'); addFile('starter-kit.json'); addFile('.project-docs/packs.lock.json');
  const addDir = rp => { const dir=path.join(ROOT,rp); if(!fs.existsSync(dir))return; for(const entry of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,entry.name); if(entry.isDirectory()) continue; if(entry.name==='.gitkeep')continue; if(entry.name.endsWith('.json')||entry.name.endsWith('.md'))out.add(path.resolve(p)); } };
  addDir('registry'); addDir('.project-docs/workplans'); addDir('.project-docs/freshness');
  return [...out].sort((a,b)=>normalizePath(a).localeCompare(normalizePath(b)));
}

export function workspaceSnapshot({includeContent=true}={}) {
  const files={};
  for(const p of canonicalFiles()) {
    const content=readText(p); const m=metaForFile(p,content);
    files[normalizePath(p)]={hash:sha256(content),...m,...(includeContent?{content}:{})};
  }
  return files;
}

export function diffSnapshots(before={},after={}) {
  const changes=[];
  for(const rp of [...new Set([...Object.keys(before),...Object.keys(after)])].sort()) {
    const b=before[rp], a=after[rp];
    if(!b) changes.push({path:rp,kind:'added',before:null,after:a});
    else if(!a) changes.push({path:rp,kind:'deleted',before:b,after:null});
    else if(b.hash!==a.hash) changes.push({path:rp,kind:'modified',before:b,after:a});
  }
  return changes;
}
function safeId(s){ return String(s).trim().replace(/[^A-Za-z0-9_.-]+/g,'-').replace(/^-+|-+$/g,''); }
export function changesetDir(){return path.join(ROOT,'.project-docs/changesets');}
export function baselineDir(){return path.join(ROOT,'.project-docs/baselines');}
export function auditStatePath(){return path.join(ROOT,'.project-docs/audit-state.json');}
export function nextChangesetId(){
  const date=new Date().toISOString().slice(0,10).replaceAll('-',''); const dir=changesetDir(); fs.mkdirSync(dir,{recursive:true});
  const prefix=`CHG-${date}-`; const nums=fs.readdirSync(dir).filter(x=>x.startsWith(prefix)&&x.endsWith('.json')).map(x=>Number(x.slice(prefix.length,-5))).filter(Number.isFinite);
  return `${prefix}${String((nums.length?Math.max(...nums):0)+1).padStart(3,'0')}`;
}
export function summarizeChanges(changes){
  const byKind={added:0,modified:0,deleted:0}; const byType={}; const codes=[];
  for(const c of changes){byKind[c.kind]=(byKind[c.kind]||0)+1; const m=c.after||c.before||{}; if(m.type)byType[m.type]=(byType[m.type]||0)+1;if(m.code)codes.push(m.code);}
  return {count:changes.length,byKind,byType,codes:[...new Set(codes)].sort()};
}
export function loadAuditState(){return loadJson('.project-docs/audit-state.json',{schemaVersion:'1.0',initializedAt:null,files:{}});}
export function saveAuditState(files, actor=''){
  const state={schemaVersion:'1.0',initializedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),actor:String(actor||''),files};
  fs.mkdirSync(path.dirname(auditStatePath()),{recursive:true});fs.writeFileSync(auditStatePath(),JSON.stringify(state,null,2)+'\n');return state;
}
export function createChangeset({actor,reason,related=[],id=null}={}){
  const state=loadAuditState(); if(!state.initializedAt)throw new Error('Audit state is not initialized. Run audit:init first.');
  const current=workspaceSnapshot({includeContent:true}); const changes=diffSnapshots(state.files||{},current); if(!changes.length)return null;
  const changeset={schemaVersion:'1.0',id:safeId(id||nextChangesetId()),createdAt:new Date().toISOString(),actor:String(actor||''),reason:String(reason||''),related:[...new Set((Array.isArray(related)?related:[related]).filter(Boolean).map(String))],summary:summarizeChanges(changes),changes};
  fs.mkdirSync(changesetDir(),{recursive:true}); fs.writeFileSync(path.join(changesetDir(),`${changeset.id}.json`),JSON.stringify(changeset,null,2)+'\n');
  saveAuditState(current,actor); return changeset;
}
export function listJsonRecords(dir){ if(!fs.existsSync(dir))return[]; return fs.readdirSync(dir).filter(x=>x.endsWith('.json')).sort().map(x=>JSON.parse(fs.readFileSync(path.join(dir,x),'utf8'))); }
export function loadChangeset(id){const p=path.join(changesetDir(),`${safeId(id)}.json`);if(!fs.existsSync(p))throw new Error(`ChangeSet not found: ${id}`);return JSON.parse(fs.readFileSync(p,'utf8'));}
export function createBaseline({name,actor,note=''}){
  const id=safeId(name); if(!id)throw new Error('Baseline name is required'); const p=path.join(baselineDir(),`${id}.json`);if(fs.existsSync(p))throw new Error(`Baseline already exists: ${id}`);
  const files=workspaceSnapshot({includeContent:false}); const baseline={schemaVersion:'1.0',id,name:String(name),createdAt:new Date().toISOString(),actor:String(actor||''),note:String(note||''),files,summary:{files:Object.keys(files).length,entities:Object.values(files).filter(x=>x.code&&x.type&&x.type!=='workplan').length}};
  fs.mkdirSync(baselineDir(),{recursive:true});fs.writeFileSync(p,JSON.stringify(baseline,null,2)+'\n');return baseline;
}
export function loadBaseline(name){const id=safeId(name);const p=path.join(baselineDir(),`${id}.json`);if(!fs.existsSync(p))throw new Error(`Baseline not found: ${name}`);return JSON.parse(fs.readFileSync(p,'utf8'));}
export function compareBaseline(name){const b=loadBaseline(name);const current=workspaceSnapshot({includeContent:false});const changes=diffSnapshots(b.files||{},current);return {baseline:{id:b.id,name:b.name,createdAt:b.createdAt},summary:summarizeChanges(changes),changes};}
