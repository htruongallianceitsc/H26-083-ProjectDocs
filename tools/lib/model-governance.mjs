import crypto from 'node:crypto';
import { loadJson } from './common.mjs';

export function entityPolicy() {
  return loadJson('registry/entity-policy.json', { identity:{legacyMissingUidSeverity:'warning'}, lifecycle:{}, relations:{} });
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

export function newUid() { return crypto.randomUUID(); }

export function lifecycleFor(type) {
  return loadJson('registry/entity-types.json', {types:{}}).types?.[type] || null;
}

export function allowedTransition(type, fromStatus, toStatus) {
  const cfg = lifecycleFor(type);
  if (!cfg) return { ok:false, reason:`Unknown entity type ${type}` };
  if (!(cfg.statuses || []).includes(toStatus)) return { ok:false, reason:`Status ${toStatus} is not valid for ${type}` };
  if (fromStatus === toStatus) return { ok:true, noop:true };
  const allowed = cfg.transitions?.[fromStatus] || [];
  return allowed.includes(toStatus)
    ? { ok:true, noop:false }
    : { ok:false, reason:`Transition ${type}: ${fromStatus} -> ${toStatus} is not allowed; allowed: ${allowed.join(', ') || '(none)'}` };
}

export function resolveRelationMapping(entityType, field, targetType = null) {
  const relations = loadJson('registry/relation-map.json', {relations:[]}).relations || [];
  const candidates = relations.filter(r => (r.from === entityType || r.from === '*') && r.field === field && (!targetType || r.to === targetType || r.to === '*'));
  candidates.sort((a,b) => {
    const score = r => (r.from === entityType ? 4 : 0) + (targetType && r.to === targetType ? 2 : 0) + (!r.fallback ? 1 : 0);
    return score(b) - score(a);
  });
  return candidates[0] || null;
}
