import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, loadJson, writeJson, scanEntities, fileHash, sha256, rel } from './common.mjs';
import { applications } from './source-workspace.mjs';
import { analyzeImpact } from './impact.mjs';

const INDEX_PATH = '.project-docs/indexes/source-index.json';

function cfg() { return loadJson('registry/source-intelligence.json', {scan:{},mapping:{},git:{}}); }
function norm(p) { return String(p).split(path.sep).join('/').replace(/^\.\//,''); }
function inside(child, parent) { return child === parent || child.startsWith(parent.endsWith('/') ? parent : parent + '/'); }
function globRegex(glob) {
  const escaped = String(glob).replace(/[.+^${}()|[\]\\]/g,'\\$&').replace(/\*\*/g,'__DOUBLE__').replace(/\*/g,'[^/]*').replace(/__DOUBLE__/g,'.*').replace(/\?/g,'.');
  return new RegExp('^' + escaped + '$');
}
function languageFor(p) {
  const ext=path.extname(p).toLowerCase();
  const known={'.js':'javascript','.jsx':'javascript','.mjs':'javascript','.cjs':'javascript','.ts':'typescript','.tsx':'typescript','.cs':'csharp','.dart':'dart','.swift':'swift','.kt':'kotlin','.kts':'kotlin','.java':'java','.sql':'sql','.json':'json','.yaml':'yaml','.yml':'yaml'}[ext]; return known || (path.basename(p)==='Dockerfile'?'dockerfile':'text');
}
function extractImports(text, language) {
  const out=[]; const add=x=>{if(x&&!out.includes(x))out.push(x);};
  if(['javascript','typescript'].includes(language)) {
    for(const m of text.matchAll(/(?:import|export)\s+(?:[^'"\n]+?\s+from\s+)?['"]([^'"]+)['"]/g)) add(m[1]);
    for(const m of text.matchAll(/require\(\s*['"]([^'"]+)['"]\s*\)/g)) add(m[1]);
  } else if(language==='csharp') for(const m of text.matchAll(/^\s*using\s+([A-Za-z0-9_.]+)\s*;/gm)) add(m[1]);
  else if(language==='dart') for(const m of text.matchAll(/^\s*import\s+['"]([^'"]+)['"]/gm)) add(m[1]);
  else if(language==='swift') for(const m of text.matchAll(/^\s*import\s+([A-Za-z0-9_.]+)/gm)) add(m[1]);
  else if(['kotlin','java'].includes(language)) for(const m of text.matchAll(/^\s*import\s+([A-Za-z0-9_.*]+)/gm)) add(m[1]);
  return out.slice(0,200);
}
function extractSymbols(text, language) {
  const out=[]; const add=(kind,name,line)=>{if(name&&!out.some(x=>x.kind===kind&&x.name===name))out.push({kind,name,line});};
  const lines=text.split(/\r?\n/);
  lines.forEach((line,i)=>{
    let m;
    if((m=line.match(/\b(class|interface|enum|record)\s+([A-Za-z_$][\w$]*)/))) add(m[1],m[2],i+1);
    if((m=line.match(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/))) add('function',m[1],i+1);
    if((m=line.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(/))) add('function',m[1],i+1);
    if(['csharp','dart','swift','kotlin','java'].includes(language) && (m=line.match(/\b([A-Za-z_$][\w$]*)\s*\([^;{}]*\)\s*(?:async\s*)?(?:\{|=>)/))) add('method',m[1],i+1);
  });
  return out.slice(0,200);
}
function sourceRoots() {
  const roots=[...(cfg().scan?.roots||[])];
  for(const app of applications()) if(app.meta.source_root) roots.push(String(app.meta.source_root));
  return [...new Set(roots.map(norm))];
}
function fileCandidates() {
  const c=cfg(); const exts=new Set((c.scan?.includeExtensions||[]).map(x=>String(x).toLowerCase())); const names=new Set(c.scan?.includeNames||[]); const ignored=new Set(c.scan?.ignoreDirectories||[]); const max=Number(c.scan?.maxFileBytes||1048576); const result=[];
  function visit(abs) {
    if(!fs.existsSync(abs)) return;
    const st=fs.statSync(abs); if(st.isFile()){const rp=norm(rel(abs)); if(st.size<=max&&(exts.has(path.extname(abs).toLowerCase())||names.has(path.basename(abs))))result.push(abs); return;}
    for(const e of fs.readdirSync(abs,{withFileTypes:true})) { if(e.isDirectory()&&ignored.has(e.name))continue; visit(path.join(abs,e.name)); }
  }
  for(const r of sourceRoots()) { const abs=path.resolve(ROOT,r); if(abs===ROOT||abs.startsWith(ROOT+path.sep))visit(abs); }
  return [...new Set(result)].sort();
}
function technicalIdentifiers(entity, fields) {
  const vals=[]; for(const f of fields||[]) { const v=entity.meta?.[f]; if(typeof v==='string'&&v.length>=4)vals.push({field:f,value:v}); }
  return vals;
}
function mappingEvidence(filePath,text,entities,apps,c) {
  const refs=[]; const push=(entity,kind,confidence,evidence)=>{if(!entity||refs.some(x=>x.code===entity.code&&x.kind===kind&&x.evidence===evidence))return; refs.push({uid:entity.uid||null,code:entity.code,type:entity.type,kind,confidence,evidence});};
  if(c.mapping?.applicationRootEvidence!==false) for(const app of apps){const r=norm(String(app.meta.source_root||''));if(r&&inside(filePath,r))push(app,'application-root','exact',r);}
  for(const rule of c.mapping?.explicit||[]) { if(!rule.path||!rule.entityRef)continue; if(globRegex(norm(rule.path)).test(filePath))push(entities.find(e=>e.code===String(rule.entityRef)||e.uid===String(rule.entityRef)),'explicit','exact',rule.path); }
  if(c.mapping?.scanEntityCodes!==false) for(const e of entities) if(e.code&&text.includes(e.code))push(e,'code-mention','medium',e.code);
  if(c.mapping?.scanTechnicalIdentifiers!==false) for(const e of entities) for(const t of technicalIdentifiers(e,c.mapping?.technicalFields||[])) if(text.includes(t.value))push(e,'technical-identifier','medium',`${t.field}=${t.value}`);
  return refs;
}
function resolveRelativeImport(fromPath,spec,known) {
  if(!spec.startsWith('.')) return null;
  const base=norm(path.posix.normalize(path.posix.join(path.posix.dirname(fromPath),spec)));
  const candidates=[base, ...['.ts','.tsx','.js','.jsx','.mjs','.cjs','.dart'].map(x=>base+x), ...['index.ts','index.tsx','index.js','index.jsx'].map(x=>base+'/'+x)];
  return candidates.find(x=>known.has(x))||null;
}
export function computeSourceFingerprint() {
  const entries=fileCandidates().map(p=>`${norm(rel(p))}:${fileHash(p)}`); return sha256(entries.join('\n'));
}
export function scanSource() {
  const c=cfg(); const {entities}=scanEntities(); const apps=entities.filter(e=>e.type==='application'); const files=[];
  for(const abs of fileCandidates()) { const filePath=norm(rel(abs)); let text=''; try{text=fs.readFileSync(abs,'utf8');}catch{continue;} if(text.includes('\u0000'))continue; const language=languageFor(abs); files.push({path:filePath,hash:fileHash(abs),bytes:fs.statSync(abs).size,lines:text.split(/\r?\n/).length,language,symbols:extractSymbols(text,language),imports:extractImports(text,language),dependencies:[],entityRefs:mappingEvidence(filePath,text,entities,apps,c)}); }
  const known=new Set(files.map(f=>f.path)); for(const f of files) f.dependencies=[...new Set(f.imports.map(x=>resolveRelativeImport(f.path,x,known)).filter(Boolean))];
  const dependents=new Map(files.map(f=>[f.path,[]])); for(const f of files)for(const d of f.dependencies)dependents.get(d)?.push(f.path); for(const f of files)f.dependents=[...new Set(dependents.get(f.path)||[])].sort();
  const index={schemaVersion:'1.0',generatedAt:new Date().toISOString(),configHash:sha256(JSON.stringify(c)),sourceFingerprint:computeSourceFingerprint(),roots:sourceRoots(),files}; writeJson(INDEX_PATH,index); return index;
}
export function loadSourceIndex({rebuildIfMissing=true}={}) { const p=path.join(ROOT,INDEX_PATH); if(!fs.existsSync(p)&&rebuildIfMissing)return scanSource(); return loadJson(INDEX_PATH,{schemaVersion:'1.0',files:[]}); }
export function sourceMap({path:targetPath=null,ref:entityRef=null}={}) { const idx=loadSourceIndex(); const files=idx.files||[]; if(targetPath)return files.filter(f=>f.path===norm(targetPath)); if(entityRef)return files.filter(f=>(f.entityRefs||[]).some(r=>r.code===entityRef||r.uid===entityRef)); return files; }

function git(args) { const r=spawnSync('git',['-C',ROOT,...args],{encoding:null}); if(r.status!==0)throw new Error((r.stderr||Buffer.from('git command failed')).toString('utf8').trim()); return r.stdout||Buffer.alloc(0); }
function nulList(buf){return buf.toString('utf8').split('\0').map(norm).filter(Boolean);}
export function gitChangedPaths(options={}) {
  if(options.commit) return nulList(git(['diff-tree','--no-commit-id','--name-only','-r','-z',String(options.commit)]));
  if(options.from || options.to) return nulList(git(['diff','--name-only','-z',String(options.from||'HEAD~1'),String(options.to||'HEAD')]));
  const paths=[...nulList(git(['diff','--name-only','-z'])),...nulList(git(['diff','--cached','--name-only','-z'])),...nulList(git(['ls-files','--others','--exclude-standard','-z']))]; return [...new Set(paths)];
}
function refsForChangedPath(filePath,idx) {
  const exact=(idx.files||[]).find(f=>f.path===filePath); if(exact)return exact.entityRefs||[];
  const {entities}=scanEntities(); const refs=[]; for(const app of entities.filter(e=>e.type==='application')){const r=norm(String(app.meta.source_root||''));if(r&&inside(filePath,r))refs.push({uid:app.uid||null,code:app.code,type:app.type,kind:'application-root','confidence':'exact',evidence:r});} return refs;
}
export function gitImpact(options={}) {
  const idx=loadSourceIndex(); const changed=gitChangedPaths(options); const directMap=new Map(); const files=changed.map(p=>{const refs=refsForChangedPath(p,idx);for(const r of refs)directMap.set(r.code,r);return {path:p,entityRefs:refs};});
  const maxDepth=Number(options.depth||cfg().git?.maxImpactDepth||3); const merged=new Map();
  for(const r of directMap.values()) { merged.set(r.code,{code:r.code,type:r.type,depth:0,level:'direct',roots:[r.code],reasons:[`source:${r.kind}:${r.evidence}`]}); try{const impact=analyzeImpact(r.code,{depth:maxDepth});for(const x of impact.impacted){const cur=merged.get(x.code);if(!cur||x.depth<cur.depth)merged.set(x.code,{...x,roots:[r.code]});else if(!cur.roots.includes(r.code))cur.roots.push(r.code);}}catch{} }
  const impacted=[...merged.values()].sort((a,b)=>a.depth-b.depth||String(a.code).localeCompare(String(b.code))); const report={schemaVersion:'1.0',generatedAt:new Date().toISOString(),mode:options.commit?'commit':(options.from||options.to?'range':'working-tree'),changedFiles:files,directEntities:[...directMap.values()],impacted,maxDepth}; writeJson('.project-docs/reports/git-impact.json',report); return report;
}
