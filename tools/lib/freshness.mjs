import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, scanEntities, sha256 } from './common.mjs';

function normalizeList(value) { return Array.isArray(value) ? value.map(String) : value ? [String(value)] : []; }
function stateDir() { return path.join(ROOT, '.project-docs/freshness'); }
function statePath(code) { return path.join(stateDir(), `${String(code).replace(/[^A-Za-z0-9_.-]/g, '_')}.json`); }
function entityMap() { const { entities } = scanEntities(); return { entities, byCode: new Map(entities.map(e => [e.code, e])) }; }
function textHash(entity) { return sha256(fs.readFileSync(path.join(ROOT, entity.path), 'utf8')); }

export function dependencyCodes(entity) {
  const rules = loadJson('registry/freshness-rules.json', { tracking: { default: { mode: 'outgoing-relations' } } });
  const config = rules.tracking?.[entity.type] || rules.tracking?.default || {};
  const excluded = new Set(config.excludeFields || []);
  const { entities } = entityMap();
  const codes = [];
  for (const [field, value] of Object.entries(entity.meta.related || {})) {
    if (excluded.has(field)) continue;
    codes.push(...normalizeList(value));
  }
  for (const incoming of config.includeIncoming || []) {
    for (const source of entities) {
      if (incoming.sourceType && source.type !== incoming.sourceType) continue;
      if (normalizeList(source.meta.related?.[incoming.field]).includes(entity.code)) codes.push(source.code);
    }
  }
  return [...new Set(codes)].sort();
}

export function currentFreshnessPayload(code) {
  const { byCode } = entityMap();
  const entity = byCode.get(String(code));
  if (!entity) throw new Error(`Entity not found: ${code}`);
  const dependencies = {};
  for (const depCode of dependencyCodes(entity)) {
    const target = byCode.get(depCode);
    dependencies[depCode] = target ? { code: depCode, type: target.type, path: target.path, hash: textHash(target) } : { code: depCode, missing: true, hash: null };
  }
  return { entity: { code: entity.code, type: entity.type, path: entity.path, hash: textHash(entity) }, dependencies };
}

export function loadFreshnessSnapshot(code) {
  const p = statePath(code);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

export function checkFreshness(code) {
  const current = currentFreshnessPayload(code);
  const snapshot = loadFreshnessSnapshot(code);
  if (!snapshot) return { code: current.entity.code, status: 'untracked', pass: true, current, changes: [], snapshot: null };
  const changes = [];
  const before = snapshot.dependencies || {};
  const after = current.dependencies || {};
  for (const depCode of [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()) {
    if (!before[depCode]) changes.push({ kind: 'dependency-added', code: depCode, after: after[depCode] });
    else if (!after[depCode]) changes.push({ kind: 'dependency-removed', code: depCode, before: before[depCode] });
    else if (before[depCode].hash !== after[depCode].hash) changes.push({ kind: after[depCode].missing ? 'dependency-missing' : 'dependency-changed', code: depCode, beforeHash: before[depCode].hash, afterHash: after[depCode].hash });
  }
  const selfChanged = snapshot.entity?.hash !== current.entity.hash;
  let status = changes.length ? 'stale' : selfChanged ? 'self_changed' : 'fresh';
  const policy = loadJson('registry/freshness-rules.json', { gates: { blockStatuses: ['stale'] } });
  const pass = !(policy.gates?.blockStatuses || ['stale']).includes(status);
  return { code: current.entity.code, status, pass, current, changes, snapshot, selfChanged };
}

export function reconcileFreshness(code, reviewer, note = '') {
  const current = currentFreshnessPayload(code);
  const snapshot = {
    schemaVersion: '1.0',
    entity: current.entity,
    dependencies: current.dependencies,
    reconciledAt: new Date().toISOString(),
    reviewer: String(reviewer || ''),
    note: String(note || '')
  };
  fs.mkdirSync(stateDir(), { recursive: true });
  fs.writeFileSync(statePath(code), JSON.stringify(snapshot, null, 2) + '\n');
  return snapshot;
}

export function freshnessSummary() {
  const { entities } = entityMap();
  return entities.map(e => {
    const r = checkFreshness(e.code);
    return { code: e.code, type: e.type, title: e.title, status: r.status, pass: r.pass, changedDependencies: r.changes.map(x => x.code), reconciledAt: r.snapshot?.reconciledAt || null };
  });
}
