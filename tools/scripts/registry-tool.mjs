import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, ensureDir, workspaceAbs, workspaceRel } from '../lib/common.mjs';

const action = process.argv[2] || 'check';
const generatedDir = workspaceAbs('registry', '_generated');
const sources = [
  ['entity-types.json', 'entity-types.yaml'],
  ['relation-map.json', 'relation-map.yaml'],
  ['quality-rules.json', 'quality-rules.yaml'],
  ['readiness-rules.json', 'readiness-rules.yaml'],
  ['freshness-rules.json', 'freshness-rules.yaml'],
  ['impact-rules.json', 'impact-rules.yaml'],
  ['spec-profiles.json', 'spec-profiles.yaml'],
  ['source-profiles.json', 'source-profiles.yaml'],
  ['entity-policy.json', 'entity-policy.yaml'],
  ['source-intelligence.json', 'source-intelligence.yaml'],
  ['local-engine.json', 'local-engine.yaml'],
  ['views.json', 'views.yaml'],
  ['brownfield.json', 'brownfield.yaml']
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
  return `# GENERATED FILE - DO NOT EDIT\n# Source: ${workspaceRel('registry', sourceName)}\n${yaml(data)}\n`;
}
function statusLifecycleText() {
  const reg = loadJson('registry/entity-types.json', {types:{}});
  const statuses = [...new Set(Object.values(reg.types || {}).flatMap(x => x.statuses || []))].sort();
  return `# GENERATED FILE - DO NOT EDIT\n# Source: ${workspaceRel('registry', 'entity-types.json')}\nstatuses:\n${statuses.map(s => `  - ${s}`).join('\n')}\n`;
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
  const readiness = loadJson('registry/readiness-rules.json', {gates:{}}).gates || {};
  const freshness = loadJson('registry/freshness-rules.json', {tracking:{}});
  const impact = loadJson('registry/impact-rules.json', {relations:[]});
  const spec = loadJson('registry/spec-profiles.json', {levels:[],profiles:{}});
  const sourceProfiles = loadJson('registry/source-profiles.json', {profiles:{}});
  const entityPolicy = loadJson('registry/entity-policy.json', {});
  const brownfield = loadJson('registry/brownfield.json', {});
  const legacy = ['entity-types.yaml','relation-map.yaml','quality-rules.yaml','status-lifecycle.yaml'];
  for (const id of Object.keys(brownfield.adapters || {})) if (!sourceProfiles.profiles?.[id]) errors.push(`brownfield: adapter references unknown source profile ${id}`);
  if (brownfield.candidatePolicy?.autoPromote !== false) errors.push('brownfield: candidatePolicy.autoPromote must default to false');
  if (!brownfield.runtimeDirectory) errors.push('brownfield: runtimeDirectory is required');
  if (brownfield.normalization?.allowDirectMove !== false) errors.push('brownfield: normalization.allowDirectMove must default to false');
  for (const f of legacy) if (fs.existsSync(workspaceAbs('registry', f))) errors.push(`Legacy hand-maintained registry mirror still exists: ${workspaceRel('registry', f)}`);
  for (const r of relations) {
    if (r.from !== '*' && !types[r.from]) errors.push(`relation-map: unknown from type ${r.from}`);
    if (r.to !== '*' && !types[r.to]) errors.push(`relation-map: unknown to type ${r.to}`);
    if (!r.field) errors.push('relation-map: relation missing field');
    if (!r.key) errors.push(`relation-map: ${r.from}.${r.field}.${r.to} missing key`);
    if (!r.relation || !r.reverse) errors.push(`relation-map: ${r.key || r.field} missing semantic relation/reverse`);
    if (r.max !== null && r.max !== undefined && Number(r.max) < Number(r.min || 0)) errors.push(`relation-map: ${r.key || r.field} max < min`);
  }
  for (const [typeName,cfg] of Object.entries(types)) {
    if (!cfg.initialStatus || !(cfg.statuses || []).includes(cfg.initialStatus)) errors.push(`entity-types: ${typeName} has invalid initialStatus`);
    for (const status of cfg.statuses || []) {
      if (!Array.isArray(cfg.transitions?.[status])) errors.push(`entity-types: ${typeName}.${status} missing transitions array`);
      for (const target of cfg.transitions?.[status] || []) if (!(cfg.statuses || []).includes(target)) errors.push(`entity-types: ${typeName}.${status} transitions to unknown status ${target}`);
    }
  }
  if (entityPolicy.identity?.uidFormat !== 'uuid') errors.push('entity-policy: identity.uidFormat must be uuid');
  for (const [gateName, gate] of Object.entries(readiness)) {
    if (gate.entityType && !types[gate.entityType]) errors.push(`readiness-rules: ${gateName} references unknown entity type ${gate.entityType}`);
    for (const r of gate.incomingRelations || []) if (r.sourceType && !types[r.sourceType]) errors.push(`readiness-rules: ${gateName} incoming source type ${r.sourceType} is unknown`);
    for (const r of [...(gate.requiredRelations || []), ...(gate.relatedStatuses || []), ...(gate.blockingRelated || [])]) {
      if (!r.field) errors.push(`readiness-rules: ${gateName} rule missing field`);
      else { const mapped=relations.some(x => (x.from===gate.entityType || x.from==='*') && x.field===r.field); if(!mapped) errors.push(`readiness-rules: ${gateName} uses unmapped relation ${gate.entityType}.${r.field}`); }
    }
  }
  for (const q of quality) {
    if (q.entityType && !types[q.entityType]) errors.push(`quality-rules: ${q.id} references unknown entity type ${q.entityType}`);
    if (q.type === 'relation-min' && q.entityType && q.field) {
      const mapped = relations.some(r => (r.from === q.entityType || r.from === '*') && r.field === q.field);
      if (!mapped) errors.push(`quality-rules: ${q.id} uses unmapped relation ${q.entityType}.${q.field}`);
    }
  }
  for (const [typeName, cfg] of Object.entries(freshness.tracking || {})) {
    if (typeName !== 'default' && !types[typeName]) errors.push(`freshness-rules: unknown entity type ${typeName}`);
    for (const incoming of cfg.includeIncoming || []) {
      if (incoming.sourceType && !types[incoming.sourceType]) errors.push(`freshness-rules: ${typeName} incoming source type ${incoming.sourceType} is unknown`);
      if (!incoming.field) errors.push(`freshness-rules: ${typeName} incoming rule missing field`);
    }
  }
  for (const r of impact.relations || []) if (!relations.some(x => x.field === r.field)) errors.push(`impact-rules: field ${r.field} is not present in relation-map`);
  const specLevels = new Set(spec.levels || []);
  for (const level of ['lightweight','standard','full']) if (!specLevels.has(level) || !spec.profiles?.[level]) errors.push(`spec-profiles: missing required level/profile ${level}`);
  for (const [level, cfg] of Object.entries(spec.profiles || {})) {
    if (cfg.extends && !spec.profiles[cfg.extends]) errors.push(`spec-profiles: ${level} extends unknown profile ${cfg.extends}`);
    for (const gateName of ['ready','done']) for (const rule of cfg[gateName]?.requiredRelations || []) {
      if (!relations.some(r => (r.from === 'feature' || r.from === '*') && r.field === rule.field)) errors.push(`spec-profiles: ${level}.${gateName} uses unmapped feature relation ${rule.field}`);
    }
  }
  for (const rule of spec.riskEscalation?.rules || []) if (!specLevels.has(rule.minimumLevel)) errors.push(`spec-profiles: risk rule ${rule.id} has invalid minimumLevel ${rule.minimumLevel}`);

  const technologyStacks = loadJson('registry/technology-stacks.json', {stacks:{}}).stacks || {};
  for (const [id, cfg] of Object.entries(sourceProfiles.profiles || {})) {
    if (!cfg.applicationType) errors.push(`source-profiles: ${id} missing applicationType`);
    if (!cfg.technologyStack || !technologyStacks[cfg.technologyStack]) errors.push(`source-profiles: ${id} references unknown technologyStack ${cfg.technologyStack}`);
    if (!cfg.defaultRoot) errors.push(`source-profiles: ${id} missing defaultRoot`);
    if (cfg.sourceBase && !fs.existsSync(workspaceAbs('sourceBases', cfg.sourceBase))) errors.push(`source-profiles: ${id} sourceBase not found ${cfg.sourceBase}`);
  }

  for (const [source,target] of sources) {
    const p = path.join(generatedDir,target);
    if (!fs.existsSync(p)) errors.push(`Missing generated mirror ${workspaceRel('registry','_generated',target)}; run npm run registry:sync`);
    else if (fs.readFileSync(p,'utf8') !== generatedText(source)) errors.push(`Generated mirror drift: ${workspaceRel('registry','_generated',target)}`);
  }
  const statusPath = path.join(generatedDir,'status-lifecycle.yaml');
  if (!fs.existsSync(statusPath)) errors.push(`Missing generated mirror ${workspaceRel('registry','_generated','status-lifecycle.yaml')}; run npm run registry:sync`);
  else if (fs.readFileSync(statusPath,'utf8') !== statusLifecycleText()) errors.push(`Generated mirror drift: ${workspaceRel('registry','_generated','status-lifecycle.yaml')}`);
  const starter = loadJson('starter-kit.json',{});
  if (starter.version !== '5.7.0' || starter.schemaVersion !== '5.7.0') errors.push(`starter-kit.json expected version/schemaVersion 5.7.0, got ${starter.version}/${starter.schemaVersion}`);
  const layout = starter.documentationLayout || {};
  if (!layout.historyDirectory) errors.push('starter-kit.json documentationLayout.historyDirectory is required');
  else if (!fs.existsSync(path.join(ROOT, layout.historyDirectory))) errors.push(`Configured history directory does not exist: ${layout.historyDirectory}`);
  for (const raw of layout.rootHistoryPatterns || []) { try { new RegExp(raw); } catch { errors.push(`Invalid documentationLayout.rootHistoryPatterns regex: ${raw}`); } }
  console.log(`Registry check: ${errors.length} error(s); ${Object.keys(types).length} entity type(s), ${relations.length} relation rule(s), ${quality.length} quality rule(s).`);
  for (const e of errors) console.log(`[ERROR] ${e}`);
  return errors.length === 0;
}

if (action === 'sync') sync();
else if (action === 'check') { if (!check()) process.exitCode = 1; }
else { console.log('registry-tool commands: sync, check'); process.exitCode = 1; }
