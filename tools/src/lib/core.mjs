import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const toolsDir = path.resolve(here, '../..');
export const root = path.resolve(toolsDir, '..');

export function readJson(rel, fallback = null) {
  const p = path.resolve(root, rel);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
export function writeJson(rel, value) {
  const p = path.resolve(root, rel); fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
}
export function writeText(rel, value) {
  const p = path.resolve(root, rel); fs.mkdirSync(path.dirname(p), {recursive:true});
  fs.writeFileSync(p, value);
}
export function rel(p) { return path.relative(root, p).replaceAll(path.sep, '/'); }
export function sha(text) { return crypto.createHash('sha256').update(text).digest('hex'); }
export function fileSha(p) { return sha(fs.readFileSync(p)); }
export function exists(relPath) { return fs.existsSync(path.resolve(root, relPath)); }

export function loadConfig() {
  return JSON.parse(fs.readFileSync(path.resolve(toolsDir,'config.json'),'utf8'));
}
function isExcluded(r, cfg) {
  return cfg.exclude.some(x => r === x || r.startsWith(x.replace(/\/$/,'') + '/'));
}
export function walk(target, ext = null, cfg = loadConfig()) {
  const abs = path.resolve(root, target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return (!ext || abs.endsWith(ext)) ? [abs] : [];
  const out=[];
  for (const ent of fs.readdirSync(abs,{withFileTypes:true})) {
    const p=path.join(abs,ent.name), r=rel(p);
    if (isExcluded(r,cfg)) continue;
    if (ent.isDirectory()) out.push(...walk(r,ext,cfg));
    else if (!ext || ent.name.endsWith(ext)) out.push(p);
  }
  return out;
}
export function contentFiles(cfg=loadConfig()) {
  const s=new Set();
  for (const item of cfg.contentRoots) for (const p of walk(item,'.md',cfg)) s.add(p);
  return [...s].sort();
}
export function entityFiles(cfg=loadConfig()) {
  const s=new Set();
  for (const item of cfg.entityRoots) for (const p of walk(item,'.md',cfg)) s.add(p);
  return [...s].sort();
}
export function parseScalar(raw) {
  const v=raw.trim();
  if (v === '') return '';
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  if (v === '{}') return {};
  if (v === '[]') return [];
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner=v.slice(1,-1).trim(); if (!inner) return [];
    return inner.split(',').map(x => parseScalar(x.trim()));
  }
  if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) return v.slice(1,-1);
  return v;
}
export function parseFrontmatter(text) {
  const normalized=text.replace(/^\uFEFF/,'');
  const m=normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!m) return {data:null, body:normalized, raw:''};
  const lines=m[1].split(/\r?\n/); const data={}; const stack=[{indent:-1,obj:data}];
  for (let i=0;i<lines.length;i++) {
    const line=lines[i]; if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent=(line.match(/^\s*/)||[''])[0].length; const trimmed=line.trim();
    if (trimmed.startsWith('- ')) {
      const cur=stack[stack.length-1];
      if (Array.isArray(cur.obj)) cur.obj.push(parseScalar(trimmed.slice(2)));
      continue;
    }
    const idx=trimmed.indexOf(':'); if (idx<0) continue;
    const key=trimmed.slice(0,idx).trim(), raw=trimmed.slice(idx+1).trim();
    while (stack.length>1 && indent <= stack[stack.length-1].indent) stack.pop();
    const parent=stack[stack.length-1].obj;
    if (raw==='') {
      // Lookahead to decide object vs list.
      let next=''; for(let j=i+1;j<lines.length;j++){ if(lines[j].trim()){next=lines[j];break;} }
      const nextTrim=next.trim(); const child=nextTrim.startsWith('- ') ? [] : {};
      parent[key]=child; stack.push({indent,obj:child});
    } else parent[key]=parseScalar(raw);
  }
  return {data, body:normalized.slice(m[0].length), raw:m[1]};
}
export function loadEntities(cfg=loadConfig()) {
  const entities=[];
  for (const p of entityFiles(cfg)) {
    const text=fs.readFileSync(p,'utf8'); const fm=parseFrontmatter(text);
    if (!fm.data || !fm.data.code || !fm.data.type) continue;
    entities.push({...fm.data, related:fm.data.related||{}, file:rel(p), abs:p, body:fm.body, sourceHash:sha(text)});
  }
  return entities;
}
export function headings(body) {
  return [...body.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)].map(m=>m[1].trim().replace(/[*_`]/g,''));
}
export function findMermaid(text) {
  return [...text.matchAll(/```mermaid\s*\r?\n([\s\S]*?)```/g)].map(m=>m[1].trim());
}
export function loadProfile() {
  return readJson('project-profile.json', {projectCode:'STARTER',projectName:'Starter Template',projectTypes:[],technologyStacks:[],implementationGate:{}});
}
export function registry() {
  return {
    entities:readJson('registry/entity-types.json',{entityTypes:{}}),
    relations:readJson('registry/relation-map.json',{relationKeys:{},allowed:{},cardinality:{}}),
    schema:readJson('registry/frontmatter-schema.json',{}),
    projectTypes:readJson('registry/project-types.json',{projectTypes:{}}),
    stacks:readJson('registry/technology-stacks.json',{technologyStacks:{}}),
    trace:readJson('registry/traceability-profiles.json',{}),
    quality:readJson('registry/quality-rules.json',{rules:[]}),
    coreStandards:readJson('registry/core-standards.json',{standards:[]})
  };
}
export function entityIndex(entities) { return new Map(entities.map(e=>[String(e.code),e])); }
export function reverseIndex(entities) {
  const rev=new Map();
  for (const e of entities) for (const [key,targets] of Object.entries(e.related||{})) {
    if (!Array.isArray(targets)) continue;
    for (const code of targets) {
      if (!rev.has(code)) rev.set(code,[]);
      rev.get(code).push({source:e, relationKey:key});
    }
  }
  return rev;
}
export function relatedCodes(entity,key,entities,includeReverse=true) {
  const out=new Set(Array.isArray(entity.related?.[key])?entity.related[key]:[]);
  if (includeReverse) for (const e of entities) {
    const arr=e.related?.[key]; if (Array.isArray(arr)&&arr.includes(entity.code)) out.add(e.code);
  }
  return [...out];
}
export function escapeHtml(v='') { return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
export function slug(v='') { return String(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'doc'; }
