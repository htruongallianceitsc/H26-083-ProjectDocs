import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = process.env.PROJECT_DOCS_ROOT ? path.resolve(process.env.PROJECT_DOCS_ROOT) : path.resolve(__dirname, '..', '..');

export function loadJson(rel, fallback = null) {
  const p = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
export function writeJson(rel, value) {
  const p = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n');
}
export function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }
export function sha256(text) { return crypto.createHash('sha256').update(text).digest('hex'); }
export function fileHash(p) { return sha256(fs.readFileSync(p)); }
export function rel(p) { return path.relative(ROOT, p).split(path.sep).join('/'); }
export function walk(dir, predicate = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, predicate));
    else if (predicate(p)) out.push(p);
  }
  return out;
}
function scalar(v) {
  const s = v.trim();
  if (s === '') return '';
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(x => scalar(x.trim()));
  }
  return s.replace(/^['"]|['"]$/g, '');
}
export function parseFrontmatter(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { data: {}, body: normalized, hasFrontmatter: false };
  const end = normalized.indexOf('\n---\n', 4);
  if (end < 0) return { data: {}, body: normalized, hasFrontmatter: false };
  const raw = normalized.slice(4, end);
  const body = normalized.slice(end + 5);
  const data = {};
  let parent = null;
  for (const line of raw.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const indent = line.match(/^\s*/)[0].length;
    const m = line.trim().match(/^([^:]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim(); const val = m[2];
    if (indent === 0) {
      if (val === '') { data[key] = {}; parent = key; }
      else { data[key] = scalar(val); parent = null; }
    } else if (parent) {
      if (typeof data[parent] !== 'object' || Array.isArray(data[parent])) data[parent] = {};
      data[parent][key] = scalar(val);
    }
  }
  return { data, body, raw, hasFrontmatter: true };
}
export function markdownFiles({ includeGenerated = false } = {}) {
  const excluded = ['site/', 'node_modules/', 'tools/vendor/', 'reusable-modules/', 'reusable-patterns/', '.project-docs/', 'apps/', 'packages/', 'tests/', 'infra/', 'source-bases/'];
  if (!includeGenerated) excluded.push('docs/_generated/');
  return walk(ROOT, p => p.endsWith('.md')).filter(p => !excluded.some(x => rel(p).startsWith(x)));
}
export function scanEntities() {
  const docs = [];
  const entities = [];
  for (const p of markdownFiles()) {
    const text = fs.readFileSync(p, 'utf8');
    const parsed = parseFrontmatter(text);
    const item = { path: rel(p), title: parsed.data.title || firstHeading(parsed.body) || path.basename(p), text, body: parsed.body, meta: parsed.data };
    docs.push(item);
    if (item.path.startsWith('docs/') && !item.path.startsWith('docs/_generated/') && parsed.data.code && parsed.data.type) entities.push({ ...item, code: String(parsed.data.code), uid: parsed.data.uid ? String(parsed.data.uid) : '', revision: Number(parsed.data.revision || 0), type: String(parsed.data.type), status: String(parsed.data.status || '') });
  }
  return { docs, entities };
}
export function firstHeading(body) {
  const m = body.match(/^#\s+(.+)$/m); return m ? m[1].trim() : '';
}
export function slugPath(p) {
  return p.toLowerCase().replace(/\.md$/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '.html';
}
export function escapeHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
export function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g,'\n').split('\n');
  let html = ''; let inCode = false; let codeLang = ''; let code=[]; let inList=false; let table=[];
  const flushList=()=>{ if(inList){ html+='</ul>'; inList=false; } };
  const flushTable=()=>{ if(!table.length) return; const rows=table.splice(0); const cells=rows.map(r=>r.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim())); const sep=cells[1]&&cells[1].every(x=>/^:?-{3,}:?$/.test(x)); const body=sep?cells.filter((_,i)=>i!==1):cells; html+='<table>'; body.forEach((r,i)=>{html+='<tr>'+r.map(c=>`<${i===0?'th':'td'}>${inline(c)}</${i===0?'th':'td'}>`).join('')+'</tr>';}); html+='</table>'; };
  const inline=(s)=>escapeHtml(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
  for (let i=0;i<lines.length;i++) {
    const line=lines[i];
    const fence=line.match(/^```(.*)$/);
    if(fence){
      flushList(); flushTable();
      if(!inCode){inCode=true;codeLang=fence[1].trim();code=[];} else { const raw=code.join('\n'); html += codeLang==='mermaid' ? `<div class="mermaid">${escapeHtml(raw)}</div>` : `<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(raw)}</code></pre>`; inCode=false; codeLang=''; code=[]; }
      continue;
    }
    if(inCode){code.push(line);continue;}
    if(line.includes('|') && (lines[i+1]||'').includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i+1]||'')){ flushList(); table.push(line); table.push(lines[++i]); while(i+1<lines.length && lines[i+1].includes('|') && lines[i+1].trim()){table.push(lines[++i]);} flushTable(); continue; }
    const h=line.match(/^(#{1,6})\s+(.+)$/); if(h){flushList();flushTable();html+=`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`;continue;}
    const li=line.match(/^\s*[-*]\s+(.+)$/); if(li){flushTable(); if(!inList){html+='<ul>';inList=true;} html+=`<li>${inline(li[1])}</li>`;continue;}
    const ol=line.match(/^\s*\d+[.)]\s+(.+)$/); if(ol){flushTable(); if(!inList){html+='<ul>';inList=true;} html+=`<li>${inline(ol[1])}</li>`;continue;}
    if(!line.trim()){flushList();flushTable();continue;}
    flushList();flushTable(); html+=`<p>${inline(line)}</p>`;
  }
  flushList();flushTable(); if(inCode) html+=`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`; return html;
}
export function parseArgs(argv) {
  const args={_:[]};
  for(let i=0;i<argv.length;i++){
    const a=argv[i];
    if(!a.startsWith('--')){args._.push(a);continue;}
    const key=a.slice(2); const next=argv[i+1];
    if(next && !next.startsWith('--')){ if(args[key]===undefined) args[key]=next; else args[key]=[].concat(args[key],next); i++; }
    else args[key]=true;
  }
  return args;
}
export function coerce(v){ if(v==='true')return true;if(v==='false')return false;if(v==='null')return null;if(v!==''&&!Number.isNaN(Number(v)))return Number(v);return v; }
export function resolveStandards(profile=loadJson('project.profile.json',{})) {
  const result=[];
  const core=loadJson('registry/core-standards.json',{standards:[]}); result.push(...core.standards.map(p=>({layer:'core',path:p})));
  const pts=loadJson('registry/project-types.json',{projectTypes:{}}).projectTypes;
  for(const t of profile.projectTypes||[]) for(const p of pts[t]?.standards||[]) result.push({layer:`project-type:${t}`,path:p});
  const stacks=loadJson('registry/technology-stacks.json',{stacks:{}}).stacks;
  for(const s of profile.technologyStacks||[]) for(const p of stacks[s]?.standards||[]) result.push({layer:`stack:${s}`,path:p});
  return result;
}

function frontmatterScalar(value) {
  if (Array.isArray(value)) return `[${value.map(frontmatterScalar).join(', ')}]`;
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const s = String(value ?? '');
  if (/^[A-Za-z0-9_.\/@:+-]+$/.test(s) && !['true','false','null','yes','no'].includes(s.toLowerCase())) return s;
  return JSON.stringify(s);
}

export function serializeFrontmatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const [childKey, childValue] of Object.entries(value)) lines.push(`  ${childKey}: ${frontmatterScalar(childValue)}`);
    } else lines.push(`${key}: ${frontmatterScalar(value)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

export function writeMarkdownEntity(relPath, meta, body) {
  const p = path.isAbsolute(relPath) ? relPath : path.join(ROOT, relPath);
  const next = structuredClone(meta || {});
  if (next.code && next.type) {
    if (!next.uid) next.uid = crypto.randomUUID();
    if (!Number.isFinite(Number(next.revision)) || Number(next.revision) < 1) next.revision = 1;
  }
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${serializeFrontmatter(next)}\n\n${String(body || '').trim()}\n`);
  return p;
}

export function findEntityByCode(code) {
  return scanEntities().entities.find(e => e.code === String(code)) || null;
}

export function updateMarkdownEntityMeta(entityOrCode, mutator) {
  const entity = typeof entityOrCode === 'string' ? findEntityByCode(entityOrCode) : entityOrCode;
  if (!entity) throw new Error(`Entity not found: ${entityOrCode}`);
  const p = path.join(ROOT, entity.path);
  const parsed = parseFrontmatter(fs.readFileSync(p, 'utf8'));
  const next = structuredClone(parsed.data);
  mutator(next);
  writeMarkdownEntity(p, next, parsed.body);
  return findEntityByCode(next.code || entity.code);
}
