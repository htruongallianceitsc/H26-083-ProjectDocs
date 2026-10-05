import { loadJson, scanEntities } from './common.mjs';

function normalizeList(v) { return Array.isArray(v) ? v.map(String) : v ? [String(v)] : []; }
function classify(score, rules) {
  const sorted = [...(rules.classification || [])].sort((a,b) => b.minScore - a.minScore);
  return sorted.find(x => score >= x.minScore)?.level || 'low';
}

export function analyzeImpact(entityCode, options = {}) {
  const { entities } = scanEntities();
  const byCode = new Map(entities.map(e => [e.code, e]));
  const root = byCode.get(String(entityCode));
  if (!root) throw new Error(`Entity not found: ${entityCode}`);
  const rules = loadJson('registry/impact-rules.json', { defaults:{maxDepth:3,maxNodes:100}, relations:[], classification:[] });
  const maxDepth = Math.max(1, Number(options.depth || rules.defaults?.maxDepth || 3));
  const maxNodes = Math.max(1, Number(options.maxNodes || rules.defaults?.maxNodes || 100));
  const relationRules = new Map((rules.relations || []).map(r => [r.field, r]));
  const adjacency = new Map(entities.map(e => [e.code, []]));
  for (const source of entities) {
    for (const [field, raw] of Object.entries(source.meta.related || {})) {
      const rr = relationRules.get(field); if (!rr) continue;
      for (const targetCode of normalizeList(raw)) {
        if (!byCode.has(targetCode)) continue;
        if (rr.direction === 'out' || rr.direction === 'both' || !rr.direction) adjacency.get(source.code).push({ to:targetCode, field, direction:'out', weight:Number(rr.weight || 1), via:source.code });
        if (rr.direction === 'in' || rr.direction === 'both') adjacency.get(targetCode).push({ to:source.code, field, direction:'in', weight:Number(rr.weight || 1), via:source.code });
      }
    }
  }
  const queue = [{ code:root.code, depth:0, path:[root.code], score:0 }];
  const best = new Map();
  while (queue.length && best.size < maxNodes) {
    const cur = queue.shift(); if (cur.depth >= maxDepth) continue;
    for (const edge of adjacency.get(cur.code) || []) {
      if (edge.to === root.code || cur.path.includes(edge.to)) continue;
      const depth = cur.depth + 1;
      const stepScore = edge.weight + Math.max(0, maxDepth - depth);
      const score = Math.max(cur.score, stepScore);
      const reason = `${cur.code} ${edge.direction === 'in' ? '<-' : '--'}${edge.field}${edge.direction === 'in' ? '--' : '-->'} ${edge.to}`;
      const previous = best.get(edge.to);
      if (!previous || score > previous.score) {
        best.set(edge.to, { code:edge.to, depth, score, path:[...cur.path, edge.to], reasons:[reason] });
        queue.push({ code:edge.to, depth, score, path:[...cur.path, edge.to] });
      } else if (!previous.reasons.includes(reason)) previous.reasons.push(reason);
    }
  }
  const impacted = [...best.values()].map(x => {
    const e = byCode.get(x.code);
    return { ...x, type:e.type, title:e.title, status:e.status, level:classify(x.score, rules) };
  }).sort((a,b) => b.score-a.score || a.depth-b.depth || a.code.localeCompare(b.code));
  return { root:{code:root.code,type:root.type,title:root.title,status:root.status}, maxDepth, impacted, summary:{ high:impacted.filter(x=>x.level==='high').length, medium:impacted.filter(x=>x.level==='medium').length, low:impacted.filter(x=>x.level==='low').length, total:impacted.length } };
}
