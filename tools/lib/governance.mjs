import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, scanEntities, sha256 } from './common.mjs';
import { checkFreshness } from './freshness.mjs';
import { evaluateSpec, resolveSpec } from './specification.mjs';

export function entityIndex() {
  const { entities } = scanEntities();
  return { entities, byCode: new Map(entities.map(e => [e.code, e])) };
}

function normalizeList(value) { return Array.isArray(value) ? value.map(String) : value ? [String(value)] : []; }

export function evaluateGate(gateName, entityCode) {
  const rules = loadJson('registry/readiness-rules.json', { gates: {} });
  const config = rules.gates?.[gateName];
  if (!config) throw new Error(`Unknown gate: ${gateName}`);
  const { entities, byCode } = entityIndex();
  const entity = byCode.get(String(entityCode));
  if (!entity) throw new Error(`Entity not found: ${entityCode}`);
  const checks = [];
  const add = (pass, code, message) => checks.push({ pass, code, message });

  if (config.entityType) add(entity.type === config.entityType, 'ENTITY_TYPE', `${entity.code} type is ${entity.type}; expected ${config.entityType}`);
  if (config.allowedEntityStatuses?.length) add(config.allowedEntityStatuses.includes(entity.status), 'ENTITY_STATUS', `${entity.code} status ${entity.status || '(none)'} must be one of: ${config.allowedEntityStatuses.join(', ')}`);

  for (const rule of config.requiredRelations || []) {
    const values = normalizeList(entity.meta.related?.[rule.field]);
    add(values.length >= Number(rule.min || 1), `RELATION_MIN:${rule.field}`, `${entity.code}.${rule.field} has ${values.length}; requires at least ${rule.min || 1}`);
  }

  for (const rule of config.relatedStatuses || []) {
    const values = normalizeList(entity.meta.related?.[rule.field]);
    if (!values.length) continue;
    const invalid = values.map(code => byCode.get(code)).filter(target => !target || !(rule.allowed || []).includes(target.status));
    add(invalid.length === 0, `RELATED_STATUS:${rule.field}`, invalid.length ? `Invalid ${rule.field}: ${invalid.map(x => x ? `${x.code}(${x.status})` : 'missing').join(', ')}; allowed: ${(rule.allowed || []).join(', ')}` : `${rule.field} statuses are acceptable`);
  }

  for (const rule of config.blockingRelated || []) {
    const values = normalizeList(entity.meta.related?.[rule.field]);
    const blocking = values.map(code => byCode.get(code)).filter(target => target && (rule.statuses || []).includes(target.status));
    add(blocking.length === 0, `BLOCKING_RELATED:${rule.field}`, blocking.length ? `Blocking ${rule.field}: ${blocking.map(x => `${x.code}(${x.status})`).join(', ')}` : `No blocking ${rule.field}`);
  }

  for (const rule of config.incomingRelations || []) {
    const incoming = entities.filter(source => source.type === rule.sourceType && normalizeList(source.meta.related?.[rule.field]).includes(entity.code));
    add(incoming.length >= Number(rule.min || 1), `INCOMING_MIN:${rule.sourceType}.${rule.field}`, `Incoming ${rule.sourceType}.${rule.field}: ${incoming.length}; requires at least ${rule.min || 1}`);
    if (incoming.length && rule.allowedStatuses?.length) {
      const invalid = incoming.filter(source => !rule.allowedStatuses.includes(source.status));
      add(invalid.length === 0, `INCOMING_STATUS:${rule.sourceType}.${rule.field}`, invalid.length ? `Incomplete incoming ${rule.sourceType}: ${invalid.map(x => `${x.code}(${x.status})`).join(', ')}` : `Incoming ${rule.sourceType} statuses are acceptable`);
    }
  }

  if (config.requireApprovedPackReviews) {
    const lock = loadJson('.project-docs/packs.lock.json', { packs: {} });
    const pending = Object.entries(lock.packs || {}).filter(([, p]) => p.reviewStatus !== 'approved');
    add(pending.length === 0, 'PACK_REVIEW', pending.length ? `Pack review pending: ${pending.map(([id,p]) => `${id}@${p.version}`).join(', ')}` : 'All imported packs are approved');
  }

  if (config.specProfile && entity.type === 'feature') {
    const spec = evaluateSpec(entity, { gate: gateName });
    for (const c of spec.checks) {
      const pass = c.pass || (c.severity === 'warning' && c.blocking !== true);
      add(pass, c.code, c.message);
      checks[checks.length - 1].severity = c.severity || (pass ? 'info' : 'error');
      checks[checks.length - 1].specLevel = spec.effectiveLevel;
    }
  }

  if (config.freshness) {
    const freshness = checkFreshness(entity.code);
    const allowUntracked = config.freshness.allowUntracked !== false;
    const pass = freshness.status === 'untracked' ? allowUntracked : freshness.pass;
    add(pass, `DOCUMENT_FRESHNESS:${freshness.status}`, freshness.status === 'stale' ? `Documentation is stale because dependencies changed: ${freshness.changes.map(x => x.code).join(', ')}` : freshness.status === 'untracked' ? `No freshness snapshot exists for ${entity.code}; reconcile to start dependency tracking.` : `Documentation freshness is ${freshness.status}.`);
  }

  return { gate: gateName, entityCode: entity.code, pass: checks.every(c => c.pass), checks };
}

export function featureContext(featureCode) {
  const { entities, byCode } = entityIndex();
  const feature = byCode.get(String(featureCode));
  if (!feature || feature.type !== 'feature') throw new Error(`Feature not found: ${featureCode}`);
  const relatedCodes = [...new Set(Object.values(feature.meta.related || {}).flatMap(normalizeList))].sort();
  const related = relatedCodes.map(code => byCode.get(code)).filter(Boolean);
  const incomingRequests = entities.filter(e => e.type === 'request' && normalizeList(e.meta.related?.promoted_to).includes(feature.code));
  const spec = resolveSpec(feature);
  return {
    feature: { code: feature.code, title: feature.title, status: feature.status, path: feature.path, related: feature.meta.related || {}, specLevel: spec.effectiveLevel, requestedSpecLevel: spec.requestedLevel, targetMaturity: spec.targetMaturity, recommendedSpecLevel: spec.recommendedLevel },
    related: related.map(e => ({ code: e.code, type: e.type, status: e.status, title: e.title, path: e.path })),
    requests: incomingRequests.map(e => ({ code: e.code, status: e.status, title: e.title, path: e.path }))
  };
}

export function featureContextHash(featureCode) {
  const { byCode } = entityIndex();
  const context = featureContext(featureCode);
  const codes = [context.feature.code, ...context.related.map(x => x.code), ...context.requests.map(x => x.code)];
  const parts = [];
  for (const code of [...new Set(codes)].sort()) {
    const e = byCode.get(code);
    if (!e) continue;
    parts.push(`${code}\n${fs.readFileSync(path.join(ROOT, e.path), 'utf8')}`);
  }
  return sha256(parts.join('\n---ENTITY---\n'));
}

export function workplanDir() { return path.join(ROOT, '.project-docs/workplans'); }
export function workplanPath(id) { return path.join(workplanDir(), `${id}.json`); }
export function loadWorkplan(id) {
  const p = workplanPath(id);
  if (!fs.existsSync(p)) throw new Error(`WorkPlan not found: ${id}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}
export function saveWorkplan(plan) {
  fs.mkdirSync(workplanDir(), { recursive: true });
  plan.updatedAt = new Date().toISOString();
  fs.writeFileSync(workplanPath(plan.id), JSON.stringify(plan, null, 2) + '\n');
  return plan;
}
export function listWorkplans() {
  const dir = workplanDir();
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

export function validateWorkplan(plan) {
  const errors = [];
  for (const key of ['id','schemaVersion','featureCode','title','status','createdAt','updatedAt','requiresAuthoring','tasks']) if (plan[key] === undefined || plan[key] === null || plan[key] === '') errors.push(`Missing ${key}`);
  if (!['1.0','1.1','1.2'].includes(plan.schemaVersion)) errors.push(`schemaVersion must be 1.0, 1.1 or 1.2`);
  if (!/^WP-[A-Z0-9-]+$/.test(String(plan.id || ''))) errors.push(`id must match WP-[A-Z0-9-]+`);
  if (!['draft','submitted','approved','rejected','materialized','cancelled'].includes(plan.status)) errors.push(`Invalid status ${plan.status}`);
  if (!Array.isArray(plan.tasks) || !plan.tasks.length) errors.push('tasks must contain at least one task');
  const codes = new Set();
  for (const [i, task] of (plan.tasks || []).entries()) {
    for (const k of ['code','title','kind','description','related']) if (task[k] === undefined || task[k] === null || task[k] === '') errors.push(`tasks[${i}] missing ${k}`);
    if (task.code && codes.has(task.code)) errors.push(`Duplicate task code ${task.code}`);
    if (task.code) codes.add(task.code);
  }
  return errors;
}
