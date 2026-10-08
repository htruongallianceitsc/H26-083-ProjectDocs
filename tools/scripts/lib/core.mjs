import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const toolsDir = path.resolve(path.dirname(__filename), '../..');
export const projectRoot = path.resolve(toolsDir, '..');

export async function loadConfig() {
  return JSON.parse(await fs.readFile(path.join(toolsDir, 'docs.config.json'), 'utf8'));
}
export function posix(p) { return p.split(path.sep).join('/'); }
export function isPlaceholder(v) {
  if (v === null || v === undefined) return true;
  const s = String(v).trim();
  return !s || /<[^>]+>/.test(s) || /^YYYY-MM-DD$/.test(s);
}
export function slugify(input) {
  return String(input || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'doc';
}
export function escapeHtml(value) {
  return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function parseScalar(raw) {
  const v = raw.trim();
  if (v === '') return {};
  if (v === '{}') return {};
  if (v === '[]') return [];
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null' || v === '~') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1,-1);
  if (v.startsWith('[') && v.endsWith(']')) {
    const inner = v.slice(1,-1).trim();
    if (!inner) return [];
    return inner.split(',').map((x)=>parseScalar(x.trim()));
  }
  return v;
}

export function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n') && !raw.startsWith('---\r\n')) return { data:{}, content:raw };
  const normalized = raw.replace(/\r\n/g,'\n');
  const end = normalized.indexOf('\n---\n',4);
  if (end < 0) return { data:{}, content:raw };
  const yaml = normalized.slice(4,end);
  const content = normalized.slice(end+5);
  const root = {};
  const stack = [{ indent:-1, obj:root, parent:null, key:null }];
  for (const rawLine of yaml.split('\n')) {
    if (!rawLine.trim() || rawLine.trim().startsWith('#')) continue;
    const indent = rawLine.match(/^\s*/)[0].length;
    const line = rawLine.trim();
    while (stack.length > 1 && indent <= stack[stack.length-1].indent) stack.pop();
    let frame = stack[stack.length-1];
    if (line.startsWith('- ')) {
      if (!Array.isArray(frame.obj) && frame.parent && Object.keys(frame.obj).length === 0) {
        frame.parent[frame.key] = [];
        frame.obj = frame.parent[frame.key];
      }
      if (Array.isArray(frame.obj)) frame.obj.push(parseScalar(line.slice(2).trim()));
      continue;
    }
    const colon = line.indexOf(':');
    if (colon < 0 || Array.isArray(frame.obj)) continue;
    const key = line.slice(0,colon).trim();
    const valueRaw = line.slice(colon+1).trim();
    const value = parseScalar(valueRaw);
    frame.obj[key] = value;
    if (valueRaw === '' && value && typeof value === 'object' && !Array.isArray(value)) stack.push({indent,obj:value,parent:frame.obj,key});
  }
  return { data:root, content };
}

function excluded(rel, config) {
  const p = posix(rel);
  return (config.exclude || []).some((rule)=>{
    const prefix = rule.replace('/**','').replace('**','');
    return p === prefix || p.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`);
  });
}
async function walkDir(abs, config, out) {
  let entries=[]; try { entries=await fs.readdir(abs,{withFileTypes:true}); } catch { return; }
  for (const e of entries) {
    const full=path.join(abs,e.name); const rel=path.relative(projectRoot,full);
    if (excluded(rel,config)) continue;
    if (e.isDirectory()) await walkDir(full,config,out);
    else if (e.isFile() && /\.md$/i.test(e.name)) out.add(path.resolve(full));
  }
}
export async function discoverMarkdown(config) {
  const files=new Set();
  for (const root of config.sourceRoots || ['docs']) {
    const abs=path.resolve(projectRoot,root);
    try { const st=await fs.stat(abs); if(st.isFile()&&/\.md$/i.test(abs))files.add(abs); else if(st.isDirectory())await walkDir(abs,config,files); } catch {}
  }
  const rootEntries=await fs.readdir(projectRoot,{withFileTypes:true});
  for(const e of rootEntries) if(e.isFile()&&/\.md$/i.test(e.name)) files.add(path.join(projectRoot,e.name));
  return [...files].sort();
}
function firstHeading(content){const m=content.match(/^#\s+(.+)$/m);return m?m[1].trim():null;}
function sectionFromPath(relPath){
  const parts=posix(relPath).split('/'); if(parts.length===1)return 'Project';
  const first=parts[0]; const labels={docs:parts[1]?parts[1].replace(/^\d+-/,'').replace(/-/g,' '):'docs',standards:'Standards',workflows:'Workflows',prompts:'Prompts',templates:'Templates',examples:'Examples',tools:'Tooling'};
  return labels[first]||first;
}
function extractMarkdownLinks(content){const a=[];const re=/!?(?:\[[^\]]*\])\(([^)]+)\)/g;let m;while((m=re.exec(content)))a.push(m[1].trim().replace(/^<|>$/g,''));return a;}
function extractMermaid(content){const a=[];const re=/```mermaid\s*\n([\s\S]*?)```/gi;let m;while((m=re.exec(content)))a.push(m[1].trim());return a;}
function flattenRelated(related){const r=[];if(!related||typeof related!=='object'||Array.isArray(related))return r;for(const [key,val] of Object.entries(related)){const vals=Array.isArray(val)?val:val?[val]:[];for(const code of vals)if(typeof code==='string'&&code.trim()&&!isPlaceholder(code))r.push({key,code:code.trim()});}return r;}
export async function readDocument(absPath){
  const raw=await fs.readFile(absPath,'utf8'); const parsed=parseFrontmatter(raw); const relPath=posix(path.relative(projectRoot,absPath)); const data=parsed.data||{};
  const title=!isPlaceholder(data.title)?String(data.title):(firstHeading(parsed.content)||path.basename(absPath,'.md'));
  const code=!isPlaceholder(data.code)?String(data.code).trim():null; const type=!isPlaceholder(data.type)?String(data.type).trim():null;
  const isTemplateLike=/^(templates|prompts)\//.test(relPath)||/-template\.md$/i.test(relPath); const isGenerated=relPath.startsWith('docs/_generated/'); const isEntity=Boolean(code&&type&&!isTemplateLike&&!isGenerated);
  return {absPath,relPath,title,code,type,status:data.status?String(data.status):null,owner:data.owner?String(data.owner):null,route:data.route?String(data.route):null,method:data.method?String(data.method).toUpperCase():null,apiPath:data.path?String(data.path):null,objectName:data.object_name?String(data.object_name):null,objectType:data.object_type?String(data.object_type):null,updatedAt:data.updated_at?String(data.updated_at):null,lastReviewedAt:data.last_reviewed_at?String(data.last_reviewed_at):null,tags:Array.isArray(data.tags)?data.tags.map(String):[],related:flattenRelated(data.related),frontmatter:data,content:parsed.content,raw,links:extractMarkdownLinks(parsed.content),mermaid:extractMermaid(parsed.content),section:sectionFromPath(relPath),isEntity,isTemplateLike,isGenerated,hash:crypto.createHash('sha256').update(raw).digest('hex')};
}
export async function scanDocuments(config){const files=await discoverMarkdown(config);return Promise.all(files.map(readDocument));}
export function codeIndex(docs){const m=new Map();for(const d of docs){if(!d.code)continue;if(!m.has(d.code))m.set(d.code,[]);m.get(d.code).push(d);}return m;}
export function buildRelations(docs){const byCode=codeIndex(docs);const edges=[],broken=[];for(const d of docs.filter(x=>x.isEntity)){for(const rel of d.related){const targets=byCode.get(rel.code)||[];if(targets.length===1)edges.push({from:d.code,to:rel.code,relation:rel.key});else broken.push({source:d.code,relation:rel.key,target:rel.code,reason:targets.length?'duplicate-target':'missing-target'});}}const inbound=new Map(),outbound=new Map();for(const e of edges){if(!inbound.has(e.to))inbound.set(e.to,[]);if(!outbound.has(e.from))outbound.set(e.from,[]);inbound.get(e.to).push(e);outbound.get(e.from).push(e);}return{edges,broken,inbound,outbound};}
export function docUrl(relPath){return `docs/${posix(relPath).replace(/\.md$/i,'')}.html`;}
export async function ensureDir(dir){await fs.mkdir(dir,{recursive:true});}
export async function writeJson(file,value){
  await ensureDir(path.dirname(file));
  try {
    if (value && !Array.isArray(value) && Object.prototype.hasOwnProperty.call(value,'generatedAt')) {
      const previous=JSON.parse(await fs.readFile(file,'utf8'));
      const a={...previous}, b={...value}; delete a.generatedAt; delete b.generatedAt;
      if(JSON.stringify(a)===JSON.stringify(b)){ value.generatedAt=previous.generatedAt; return false; }
    }
  } catch {}
  const text=JSON.stringify(value,null,2)+'\n';
  try { if(await fs.readFile(file,'utf8')===text) return false; } catch {}
  await fs.writeFile(file,text,'utf8'); return true;
}
export function daysSince(dateString){if(!dateString||isPlaceholder(dateString))return null;const d=new Date(`${dateString}T00:00:00Z`);if(Number.isNaN(d.getTime()))return null;return Math.floor((Date.now()-d.getTime())/86400000);}
