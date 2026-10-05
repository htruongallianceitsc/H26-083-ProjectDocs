import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, scanEntities, updateMarkdownEntityMeta } from './common.mjs';

const LEVEL_RANK = { lightweight: 0, standard: 1, full: 2 };
const VALID_REQUESTED_LEVELS = ['lightweight', 'standard', 'full', 'auto'];

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function normalizeList(value) { return Array.isArray(value) ? value.map(String) : value ? [String(value)] : []; }
function maxLevel(a, b) { return LEVEL_RANK[b] > LEVEL_RANK[a] ? b : a; }
function headings(body) {
  return String(body || '').split(/\r?\n/).map(line => line.match(/^#{1,6}\s+(.+)$/)?.[1]).filter(Boolean).map(normalize);
}
function hasHeading(body, candidates) {
  const hs = headings(body);
  return (candidates || []).some(candidate => {
    const c = normalize(candidate);
    return hs.some(h => h === c || h.includes(c) || c.includes(h));
  });
}

export function loadSpecConfig() { return loadJson('registry/spec-profiles.json', {}); }
export function projectProfile() { return loadJson('project.profile.json', {}); }
export function featureByCode(code) {
  const feature = scanEntities().entities.find(e => e.code === String(code));
  if (!feature || feature.type !== 'feature') throw new Error(`Feature not found: ${code}`);
  return feature;
}
export function projectDefaultSpecLevel() {
  const cfg = loadSpecConfig();
  const requested = String(projectProfile().documentation?.defaultSpecLevel || cfg.defaultLevel || 'standard');
  return VALID_REQUESTED_LEVELS.includes(requested) ? requested : 'standard';
}
export function projectDefaultMaturity() {
  const cfg = loadSpecConfig();
  const value = String(projectProfile().documentation?.targetMaturity || 'production');
  return (cfg.maturities || []).includes(value) ? value : 'production';
}
export function requestedSpecLevel(feature) {
  const value = String(feature.meta.spec_level || projectDefaultSpecLevel());
  return VALID_REQUESTED_LEVELS.includes(value) ? value : 'standard';
}
export function targetMaturity(feature) {
  const cfg = loadSpecConfig();
  const value = String(feature.meta.target_maturity || projectDefaultMaturity());
  return (cfg.maturities || []).includes(value) ? value : projectDefaultMaturity();
}
export function riskAssessment(feature) {
  const cfg = loadSpecConfig();
  const maturity = targetMaturity(feature);
  let recommended = cfg.maturityMinimumLevel?.[maturity] || 'standard';
  const text = normalize([feature.title, feature.body, ...(feature.meta.tags || []), JSON.stringify(feature.meta.related || {})].join('\n'));
  const matches = [];
  for (const rule of cfg.riskEscalation?.rules || []) {
    const hit = (rule.terms || []).filter(term => text.includes(normalize(term)));
    if (!hit.length) continue;
    matches.push({ id: rule.id, minimumLevel: rule.minimumLevel, matchedTerms: hit });
    if (LEVEL_RANK[rule.minimumLevel] !== undefined) recommended = maxLevel(recommended, rule.minimumLevel);
  }
  return { maturity, recommendedLevel: recommended, matches };
}
export function resolveSpec(featureOrCode) {
  const feature = typeof featureOrCode === 'string' ? featureByCode(featureOrCode) : featureOrCode;
  const requested = requestedSpecLevel(feature);
  const risk = riskAssessment(feature);
  const effective = requested === 'auto' ? risk.recommendedLevel : requested;
  const enforcement = String(projectProfile().documentation?.riskEscalation || loadSpecConfig().riskEscalation?.defaultEnforcement || 'warn');
  const belowRecommended = LEVEL_RANK[effective] < LEVEL_RANK[risk.recommendedLevel];
  return { featureCode: feature.code, requestedLevel: requested, effectiveLevel: effective, targetMaturity: risk.maturity, recommendedLevel: risk.recommendedLevel, belowRecommended, enforcement, riskMatches: risk.matches };
}
function mergedProfile(level, seen = new Set()) {
  const cfg = loadSpecConfig();
  const raw = cfg.profiles?.[level];
  if (!raw) throw new Error(`Unknown spec profile: ${level}`);
  if (seen.has(level)) throw new Error(`Circular spec profile inheritance: ${level}`);
  seen.add(level);
  let base = { requiredSectionGroups: [], ready: { requiredRelations: [] }, done: { requiredRelations: [] } };
  if (raw.extends) base = mergedProfile(raw.extends, seen);
  return {
    ...base,
    ...raw,
    requiredSectionGroups: [...(base.requiredSectionGroups || []), ...(raw.requiredSectionGroups || [])],
    ready: { ...base.ready, ...raw.ready, requiredRelations: [...(base.ready?.requiredRelations || []), ...(raw.ready?.requiredRelations || [])] },
    done: { ...base.done, ...raw.done, requiredRelations: [...(base.done?.requiredRelations || []), ...(raw.done?.requiredRelations || [])] }
  };
}
export function evaluateSpec(featureOrCode, { targetLevel = null, gate = 'ready' } = {}) {
  const feature = typeof featureOrCode === 'string' ? featureByCode(featureOrCode) : featureOrCode;
  const resolved = resolveSpec(feature);
  const level = targetLevel || resolved.effectiveLevel;
  if (LEVEL_RANK[level] === undefined) throw new Error(`Invalid target spec level: ${level}`);
  const profile = mergedProfile(level);
  const checks = [];
  for (const group of profile.requiredSectionGroups || []) {
    const pass = hasHeading(feature.body, group.headings || []);
    checks.push({ pass, code: `SPEC_SECTION:${group.id}`, message: pass ? `Section group ${group.id} is documented.` : `Missing section for ${group.id}; accepted headings: ${(group.headings || []).join(', ')}` });
  }
  const gateProfile = profile[gate] || {};
  for (const rule of gateProfile.requiredRelations || []) {
    const values = normalizeList(feature.meta.related?.[rule.field]);
    const pass = values.length >= Number(rule.min || 1);
    checks.push({ pass, code: `SPEC_RELATION_MIN:${rule.field}`, message: `${feature.code}.${rule.field} has ${values.length}; ${level} requires at least ${rule.min || 1}` });
  }
  const riskBlocking = resolved.belowRecommended && resolved.enforcement === 'block';
  checks.push({
    pass: !riskBlocking,
    blocking: riskBlocking,
    severity: resolved.belowRecommended ? (resolved.enforcement === 'block' ? 'error' : (resolved.enforcement === 'off' ? 'info' : 'warning')) : 'info',
    code: 'SPEC_RISK_LEVEL',
    message: resolved.belowRecommended
      ? `${feature.code} uses ${level}, but risk/maturity assessment recommends at least ${resolved.recommendedLevel}. Matches: ${resolved.riskMatches.map(x => x.id).join(', ') || 'maturity policy'}`
      : `${feature.code} spec level ${level} meets the ${resolved.recommendedLevel} recommendation.`
  });
  const required = checks.filter(x => !x.code.startsWith('SPEC_RISK_LEVEL'));
  const passed = required.filter(x => x.pass).length;
  return { ...resolved, evaluatedLevel: level, gate, pass: checks.every(x => x.pass || x.blocking === false || x.severity === 'warning'), checks, completeness: required.length ? Math.round(passed * 100 / required.length) : 100 };
}
export function specSummary(featureOrCode) {
  const feature = typeof featureOrCode === 'string' ? featureByCode(featureOrCode) : featureOrCode;
  const ready = evaluateSpec(feature, { gate: 'ready' });
  return { code: feature.code, title: feature.title, status: feature.status, path: feature.path, requestedLevel: ready.requestedLevel, effectiveLevel: ready.effectiveLevel, targetMaturity: ready.targetMaturity, recommendedLevel: ready.recommendedLevel, belowRecommended: ready.belowRecommended, completeness: ready.completeness, riskMatches: ready.riskMatches, gaps: ready.checks.filter(x => !x.pass && x.code !== 'SPEC_RISK_LEVEL') };
}
export function allSpecSummaries() { return scanEntities().entities.filter(e => e.type === 'feature').map(specSummary); }
export function promotionReport(featureCode, toLevel) {
  const feature = featureByCode(featureCode);
  const from = resolveSpec(feature);
  if (LEVEL_RANK[toLevel] === undefined) throw new Error(`Invalid target level ${toLevel}`);
  if (LEVEL_RANK[toLevel] <= LEVEL_RANK[from.effectiveLevel]) throw new Error(`Promotion target ${toLevel} must be higher than current effective level ${from.effectiveLevel}`);
  const evaluation = evaluateSpec(feature, { targetLevel: toLevel, gate: 'ready' });
  const gaps = evaluation.checks.filter(x => !x.pass && x.code !== 'SPEC_RISK_LEVEL');
  return { schemaVersion: '1.0', featureCode, fromLevel: from.effectiveLevel, toLevel, createdAt: new Date().toISOString(), status: gaps.length ? 'not_complete' : 'ready_to_apply', completeness: evaluation.completeness, gaps, risk: { recommendedLevel: from.recommendedLevel, matches: from.riskMatches } };
}
export function applySpecLevel(featureCode, toLevel) {
  const today = new Date().toISOString().slice(0, 10);
  return updateMarkdownEntityMeta(featureCode, meta => { meta.spec_level = toLevel; meta.updated_at = today; });
}
export function specPromotionDir() { return path.join(ROOT, '.project-docs/spec-promotions'); }
export function savePromotionReport(report) {
  const dir = specPromotionDir(); fs.mkdirSync(dir, { recursive: true });
  const stamp = report.createdAt.replace(/[-:.TZ]/g, '').slice(0, 14);
  const p = path.join(dir, `${report.featureCode}-${report.fromLevel}-to-${report.toLevel}-${stamp}.json`);
  fs.writeFileSync(p, JSON.stringify(report, null, 2) + '\n');
  return p;
}
