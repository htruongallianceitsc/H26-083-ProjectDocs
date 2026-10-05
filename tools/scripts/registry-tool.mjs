import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, ensureDir } from '../lib/common.mjs';

const action = process.argv[2] || 'check';
const generatedDir = path.join(ROOT, 'registry/_generated');
const sources = [
  ['entity-types.json', 'entity-types.yaml'],
  ['relation-map.json', 'relation-map.yaml'],
  ['quality-rules.json', 'quality-rules.yaml']
];

function quote(value) {
  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  const s = String(value);
  if (/^[A-Za-z0-9_.\/-]+$/.test(s) && !['true','false','null','yes','no'].includes(s.toLowerCase())) return s;
  return JSON.stringify(s);
}
function yaml(value, indent = 0) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    return value.map(v => {
      if (v && typeof v === 'object') {
        const rendered = yaml(v, indent + 2);
        const lines = rendered.split('\n');
        return `${pad}- ${lines[0].trimStart()}${lines.length > 1 ? '\n' + lines.slice(1).join('\n') : ''}`;
      }
      return `${pad}- ${quote(v)}`;
    }).join('\n');
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    if (!entries.length) return '{}';
    return entries.map(([k,v]) => {
      if (v && typeof v === 'object' && ((Array.isArray(v) && v.length) || (!Array.isArray(v) && Object.keys(v).length))) {
        return `${pad}${k}:\n${yaml(v, indent + 2)}`;
      }
      return `${pad}${k}: ${v && typeof v === 'object' ? yaml(v, indent + 2) : quote(v)}`;
    }).join('\n');
  }
  return quote(value);
}
function generatedText(sourceName) {
  const data = loadJson(`registry/${sourceName}`);
  return `# GENERATED FILE - DO NOT EDIT\n# Source: registry/${sourceName}\n${yaml(data)}\n`;
}
function statusLifecycleText() {
  const reg = loadJson('registry/entity-types.json', {types:{}});
  const statuses = [...new Set(Object.values(reg.types || {}).flatMap(x => x.statuses || []))].sort();
  return `# GENERATED FILE - DO NOT EDIT\n# Source: registry/entity-types.json\nstatuses:\n${statuses.map(s => `  - ${s}`).join('\n')}\n`;
}
function sync() {
  ensureDir(generatedDir);
  for (const [source,target] of sources) fs.writeFileSync(path.join(generatedDir,target), generatedText(source));
  fs.writeFileSync(path.join(generatedDir,'status-lifecycle.yaml'), statusLifecycleText());
  console.log(`Registry mirrors generated in ${path.relative(ROOT, generatedDir).replaceAll(path.sep,'/')}/`);
}
function check() {
  const errors = [];
  const types = loadJson('registry/entity-types.json', {types:{}}).types || {};
  const relations = loadJson('registry/relation-map.json', {relations:[]}).relations || [];
  const quality = loadJson('registry/quality-rules.json', {rules:[]}).rules || [];
  const legacy = ['entity-types.yaml','relation-map.yaml','quality-rules.yaml','status-lifecycle.yaml'];
  for (const f of legacy) if (fs.existsSync(path.join(ROOT,'registry',f))) errors.push(`Legacy hand-maintained registry mirror still exists: registry/${f}`);
  for (const r of relations) {
    if (r.from !== '*' && !types[r.from]) errors.push(`relation-map: unknown from type ${r.from}`);
    if (r.to !== '*' && !types[r.to]) errors.push(`relation-map: unknown to type ${r.to}`);
    if (!r.field) errors.push('relation-map: relation missing field');
  }
  for (const q of quality) {
    if (q.entityType && !types[q.entityType]) errors.push(`quality-rules: ${q.id} references unknown entity type ${q.entityType}`);
    if (q.type === 'relation-min' && q.entityType && q.field) {
      const mapped = relations.some(r => (r.from === q.entityType || r.from === '*') && r.field === q.field);
      if (!mapped) errors.push(`quality-rules: ${q.id} uses unmapped relation ${q.entityType}.${q.field}`);
    }
  }
  for (const [source,target] of sources) {
    const p = path.join(generatedDir,target);
    if (!fs.existsSync(p)) errors.push(`Missing generated mirror registry/_generated/${target}; run npm run registry:sync`);
    else if (fs.readFileSync(p,'utf8') !== generatedText(source)) errors.push(`Generated mirror drift: registry/_generated/${target}`);
  }
  const statusPath = path.join(generatedDir,'status-lifecycle.yaml');
  if (!fs.existsSync(statusPath)) errors.push('Missing generated mirror registry/_generated/status-lifecycle.yaml; run npm run registry:sync');
  else if (fs.readFileSync(statusPath,'utf8') !== statusLifecycleText()) errors.push('Generated mirror drift: registry/_generated/status-lifecycle.yaml');
  const starter = loadJson('starter-kit.json',{});
  if (starter.version !== '4.1.0' || starter.schemaVersion !== '4.1.0') errors.push(`starter-kit.json expected version/schemaVersion 4.1.0, got ${starter.version}/${starter.schemaVersion}`);
  console.log(`Registry check: ${errors.length} error(s); ${Object.keys(types).length} entity type(s), ${relations.length} relation rule(s), ${quality.length} quality rule(s).`);
  for (const e of errors) console.log(`[ERROR] ${e}`);
  return errors.length === 0;
}

if (action === 'sync') sync();
else if (action === 'check') { if (!check()) process.exitCode = 1; }
else { console.log('registry-tool commands: sync, check'); process.exitCode = 1; }
