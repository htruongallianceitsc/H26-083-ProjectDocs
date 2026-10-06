import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, loadJson, writeJson, walk, rel, fileHash, sha256, scanEntities,
  parseFrontmatter, writeMarkdownEntity, findEntityByCode
} from './common.mjs';

const DEFAULTS = {
  assetRoot: 'mockups',
  runtimeDirectory: '.project-docs/mockups',
  supportedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'],
  naming: { separator: '__', convention: '<screen-key>__<state>__<variant>.<ext>' },
  analysis: { requireVisionAnalysisBeforePromotion: true },
  promotion: { requireReview: true, autoUpdateExistingScreens: false },
  validation: {
    requireEveryScreenMockupMapped: true,
    blockSeverities: ['high'],
    staleAnalysisSeverity: 'high',
    missingAnalysisSeverity: 'high',
    acceptedNotPromotedSeverity: 'high',
    unmappedMockupSeverity: 'high',
    screenWithoutFeatureSeverity: 'warning'
  }
};

function cfg() {
  const raw = loadJson('registry/mockup-workflow.json', {});
  return {
    ...DEFAULTS,
    ...raw,
    naming: { ...DEFAULTS.naming, ...(raw.naming || {}) },
    analysis: { ...DEFAULTS.analysis, ...(raw.analysis || {}) },
    promotion: { ...DEFAULTS.promotion, ...(raw.promotion || {}) },
    validation: { ...DEFAULTS.validation, ...(raw.validation || {}) }
  };
}
function runtimeFile(name) { return `${cfg().runtimeDirectory}/${name}`; }
function abs(relPath) { return path.join(ROOT, relPath); }
function posix(p) { return String(p).split(path.sep).join('/'); }
function slug(v) { return String(v || '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'screen'; }
function upperToken(v) { return slug(v).toUpperCase(); }
function titleize(v) { return String(v || '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_\-.]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase()).trim() || 'Screen'; }
function stableAssetId(assetPath) { return `MCK-${sha256(assetPath).slice(0, 12).toUpperCase()}`; }
function candidateId(key) { return `MCKC-SCR-${sha256(key).slice(0, 12).toUpperCase()}`; }
function isSupported(p) { return cfg().supportedExtensions.map(x => x.toLowerCase()).includes(path.extname(p).toLowerCase()); }

function pngDimensions(buffer) {
  if (buffer.length < 24) return null;
  if (buffer.slice(1, 4).toString('ascii') !== 'PNG') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}
function gifDimensions(buffer) {
  if (buffer.length < 10) return null;
  const sig = buffer.slice(0, 6).toString('ascii');
  if (!['GIF87a', 'GIF89a'].includes(sig)) return null;
  return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
}
function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buffer.length) {
    if (buffer[i] !== 0xff) { i += 1; continue; }
    const marker = buffer[i + 1];
    i += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (i + 2 > buffer.length) break;
    const len = buffer.readUInt16BE(i);
    if (len < 2 || i + len > buffer.length) break;
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker) && len >= 7) {
      return { height: buffer.readUInt16BE(i + 3), width: buffer.readUInt16BE(i + 5) };
    }
    i += len;
  }
  return null;
}
function svgDimensions(text) {
  const tag = String(text).match(/<svg\b[^>]*>/i)?.[0] || '';
  const width = tag.match(/\bwidth=["']?([0-9.]+)/i)?.[1];
  const height = tag.match(/\bheight=["']?([0-9.]+)/i)?.[1];
  if (width && height) return { width: Number(width), height: Number(height) };
  const vb = tag.match(/\bviewBox=["']([^"']+)["']/i)?.[1]?.trim().split(/\s+/).map(Number);
  if (vb?.length === 4 && vb.every(Number.isFinite)) return { width: vb[2], height: vb[3] };
  return null;
}
function imageDimensions(p) {
  try {
    const ext = path.extname(p).toLowerCase();
    if (ext === '.svg') return svgDimensions(fs.readFileSync(p, 'utf8'));
    const buf = fs.readFileSync(p);
    if (ext === '.png') return pngDimensions(buf);
    if (ext === '.gif') return gifDimensions(buf);
    if (ext === '.jpg' || ext === '.jpeg') return jpegDimensions(buf);
  } catch {}
  return null;
}
function namingHints(assetPath) {
  const root = cfg().assetRoot.replace(/\\/g, '/').replace(/\/$/, '');
  const relative = assetPath.startsWith(root + '/') ? assetPath.slice(root.length + 1) : assetPath;
  const ext = path.extname(relative);
  const stem = path.basename(relative, ext);
  const sep = cfg().naming.separator || '__';
  const parts = stem.split(sep).filter(Boolean);
  const dirs = path.dirname(relative).split(/[\\/]/).filter(x => x && x !== '.');
  const moduleHint = dirs.length ? dirs[dirs.length - 1] : null;
  const rawScreen = parts[0] || stem;
  const screenHint = rawScreen.replace(/^\d+[-_. ]*/, '') || rawScreen;
  const stateHint = parts[1] || 'default';
  const variantHint = parts.slice(2).join(sep) || null;
  const groupedKey = moduleHint && !slug(screenHint).startsWith(slug(moduleHint) + '-') ? `${moduleHint}-${screenHint}` : screenHint;
  return { relativePath: posix(relative), moduleHint, screenHint, groupedKey, stateHint, variantHint };
}

export function buildMockupInventory() {
  const c = cfg();
  const rootAbs = path.join(ROOT, c.assetRoot);
  fs.mkdirSync(rootAbs, { recursive: true });
  const previous = loadJson(runtimeFile('inventory.json'), { assets: [] });
  const oldByPath = new Map((previous.assets || []).map(x => [x.path, x]));
  const assets = walk(rootAbs, p => isSupported(p)).sort().map(p => {
    const assetPath = rel(p);
    const stat = fs.statSync(p);
    const hints = namingHints(assetPath);
    const hash = fileHash(p);
    const old = oldByPath.get(assetPath);
    return {
      assetId: stableAssetId(assetPath),
      path: assetPath,
      hash,
      bytes: stat.size,
      extension: path.extname(p).toLowerCase(),
      dimensions: imageDimensions(p),
      modifiedAt: stat.mtime.toISOString(),
      change: !old ? 'new' : old.hash === hash ? 'unchanged' : 'changed',
      ...hints
    };
  });
  const currentPaths = new Set(assets.map(x => x.path));
  const removed = (previous.assets || []).filter(x => !currentPaths.has(x.path)).map(x => ({ assetId: x.assetId, path: x.path, previousHash: x.hash }));
  const out = {
    schemaVersion: '1.0', generatedAt: new Date().toISOString(), assetRoot: c.assetRoot,
    namingConvention: c.naming.convention, supportedExtensions: c.supportedExtensions,
    summary: {
      total: assets.length,
      new: assets.filter(x => x.change === 'new').length,
      changed: assets.filter(x => x.change === 'changed').length,
      unchanged: assets.filter(x => x.change === 'unchanged').length,
      removed: removed.length
    },
    assets, removed
  };
  writeJson(runtimeFile('inventory.json'), out);
  return out;
}

function analysisDir() { return path.join(ROOT, cfg().runtimeDirectory, 'analysis'); }
function analysisFiles() { return walk(analysisDir(), p => p.endsWith('.json')).filter(p => path.basename(p) !== 'tasks.json'); }
function loadAnalyses() {
  const records = [];
  for (const p of analysisFiles()) {
    try {
      const a = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (a && typeof a === 'object' && a.assetPath) records.push({ ...a, _file: rel(p) });
    } catch {}
  }
  return records;
}
function analysisProblems(a) {
  const problems = [];
  const required = ['assetPath','imageHash','classification','screenKey','state','confidence','openQuestions','status'];
  for (const k of required) if (a?.[k] === undefined || a?.[k] === null || (typeof a[k] === 'string' && !a[k].trim())) problems.push(`missing ${k}`);
  const allowed = new Set(['screen','reference','component','flow','ignore','non-screen']);
  if (a?.classification && !allowed.has(String(a.classification))) problems.push(`invalid classification ${a.classification}`);
  if (a?.status && !['analyzed','needs-analysis'].includes(String(a.status))) problems.push(`invalid status ${a.status}`);
  if (a?.confidence !== undefined && (!Number.isFinite(Number(a.confidence)) || Number(a.confidence) < 0 || Number(a.confidence) > 1)) problems.push('confidence must be 0..1');
  if (a?.openQuestions !== undefined && !Array.isArray(a.openQuestions)) problems.push('openQuestions must be array');
  return problems;
}
function analysisMap() { return new Map(loadAnalyses().map(a => [String(a.assetPath), a])); }

export function buildMockupAnalysisTasks() {
  const inv = buildMockupInventory();
  const analyses = analysisMap();
  const tasks = [];
  for (const asset of inv.assets) {
    const a = analyses.get(asset.path);
    const stale = a && String(a.imageHash || '') !== asset.hash;
    const problems = a ? analysisProblems(a) : [];
    if (!a || stale || a.status === 'needs-analysis' || problems.length) {
      tasks.push({
        assetId: asset.assetId,
        assetPath: asset.path,
        imageHash: asset.hash,
        reason: !a ? 'missing-analysis' : stale ? 'image-changed' : problems.length ? 'invalid-analysis' : 'analysis-incomplete',
        problems,
        suggestedOutput: `${cfg().runtimeDirectory}/analysis/${asset.assetId.toLowerCase()}.json`,
        prompt: 'kit/prompts/46-mockup-to-documentation.md',
        hints: { module: asset.moduleHint, screen: asset.screenHint, state: asset.stateHint, variant: asset.variantHint }
      });
    }
  }
  const out = {
    schemaVersion: '1.0', generatedAt: new Date().toISOString(),
    summary: { totalAssets: inv.assets.length, needsAnalysis: tasks.length, current: inv.assets.length - tasks.length },
    tasks
  };
  writeJson(runtimeFile('analysis-tasks.json'), out);
  return out;
}

function arr(v) { return Array.isArray(v) ? v : v == null ? [] : [v]; }
function unique(values) { return [...new Set(values.filter(v => v !== null && v !== undefined && String(v).trim() !== '').map(v => typeof v === 'string' ? v.trim() : v))]; }
function existingScreens() { return scanEntities().entities.filter(e => e.type === 'screen'); }
function findScreenForAnalysis(a, code, routeHint, title) {
  const screens = existingScreens();
  if (a?.existingScreenCode) return screens.find(s => s.code === String(a.existingScreenCode)) || null;
  const byCode = screens.find(s => s.code === code); if (byCode) return byCode;
  if (routeHint) { const byRoute = screens.find(s => String(s.meta.route || '').toLowerCase() === String(routeHint).toLowerCase()); if (byRoute) return byRoute; }
  return screens.find(s => String(s.title || '').toLowerCase() === String(title || '').toLowerCase()) || null;
}
function mergeObjects(list, key) {
  const out = [];
  const seen = new Set();
  for (const a of list) for (const x of arr(a?.[key])) {
    const signature = typeof x === 'string' ? x : JSON.stringify(x);
    if (!seen.has(signature)) { seen.add(signature); out.push(x); }
  }
  return out;
}

export function buildMockupCandidates() {
  const inv = buildMockupInventory();
  const analyses = analysisMap();
  const groups = new Map();
  const nonScreenAssets = [];
  for (const asset of inv.assets) {
    const a = analyses.get(asset.path);
    const classification = String(a?.classification || 'screen-unverified');
    if (['reference', 'component', 'flow', 'ignore', 'non-screen'].includes(classification)) {
      nonScreenAssets.push({ assetId: asset.assetId, path: asset.path, classification, analysisFile: a?._file || null });
      continue;
    }
    const key = slug(a?.screenKey || asset.groupedKey || asset.screenHint);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ asset, analysis: a || null });
  }
  const previous = loadJson(runtimeFile('candidates.json'), { reviews: {}, promotions: {} });
  const candidates = [];
  for (const [key, rows] of groups.entries()) {
    const analysesForGroup = rows.map(r => r.analysis).filter(Boolean);
    const sample = analysesForGroup[0] || {};
    const title = sample.screenTitle || titleize(key);
    const routeHint = analysesForGroup.map(a => a.routeHint).find(Boolean) || null;
    const suggestedCode = sample.existingScreenCode || `SCR-${upperToken(key)}`;
    const existing = findScreenForAnalysis(sample, suggestedCode, routeHint, title);
    const confidenceValues = analysesForGroup.map(a => Number(a.confidence)).filter(Number.isFinite);
    const confidence = confidenceValues.length ? confidenceValues.reduce((x, y) => x + y, 0) / confidenceValues.length : 0.35;
    const id = candidateId(key);
    const c = {
      candidateId: id,
      screenKey: key,
      suggestedCode: existing?.code || suggestedCode,
      suggestedTitle: existing?.title || title,
      routeHint: existing?.meta?.route || routeHint,
      targetMode: existing ? 'enrich-existing' : 'create-screen',
      existingScreenPath: existing?.path || null,
      confidence: Number(confidence.toFixed(2)),
      analysisCoverage: { analyzed: analysesForGroup.length, total: rows.length },
      states: unique(rows.map(r => r.analysis?.state || r.asset.stateHint || 'default')),
      assets: rows.map(r => ({
        assetId: r.asset.assetId, path: r.asset.path, hash: r.asset.hash,
        state: r.analysis?.state || r.asset.stateHint || 'default',
        variant: r.analysis?.variant || r.asset.variantHint || null,
        analysisFile: r.analysis?._file || null
      })),
      evidence: {
        sections: mergeObjects(analysesForGroup, 'sections'),
        fields: mergeObjects(analysesForGroup, 'fields'),
        actions: mergeObjects(analysesForGroup, 'actions'),
        visibleMessages: mergeObjects(analysesForGroup, 'visibleMessages'),
        navigation: mergeObjects(analysesForGroup, 'navigation'),
        explicitRules: mergeObjects(analysesForGroup, 'explicitRules'),
        accessibilityNotes: mergeObjects(analysesForGroup, 'accessibilityNotes'),
        openQuestions: mergeObjects(analysesForGroup, 'openQuestions')
      },
      suggestedRelations: {
        features: unique(analysesForGroup.flatMap(a => arr(a.featureCodes))),
        requirements: unique(analysesForGroup.flatMap(a => arr(a.requirementCodes))),
        business_rules: unique(analysesForGroup.flatMap(a => arr(a.businessRuleCodes))),
        flows: unique(analysesForGroup.flatMap(a => arr(a.flowCodes)))
      },
      status: 'pending-review'
    };
    if (previous.reviews?.[id]) c.status = previous.reviews[id].decision === 'accepted' ? 'accepted' : 'rejected';
    if (previous.promotions?.[id]) c.status = previous.promotions[id].kind === 'proposal' ? 'proposal-created' : 'promoted';
    candidates.push(c);
  }
  candidates.sort((a, b) => a.suggestedCode.localeCompare(b.suggestedCode));
  const ids = new Set(candidates.map(c => c.candidateId));
  const reviews = Object.fromEntries(Object.entries(previous.reviews || {}).filter(([id]) => ids.has(id)));
  const promotions = Object.fromEntries(Object.entries(previous.promotions || {}).filter(([id]) => ids.has(id)));
  const out = {
    schemaVersion: '1.0', generatedAt: new Date().toISOString(),
    summary: {
      total: candidates.length,
      pending: candidates.filter(c => c.status === 'pending-review').length,
      accepted: candidates.filter(c => c.status === 'accepted').length,
      create: candidates.filter(c => c.targetMode === 'create-screen').length,
      enrich: candidates.filter(c => c.targetMode === 'enrich-existing').length,
      nonScreenAssets: nonScreenAssets.length
    },
    nonScreenAssets, candidates, reviews, promotions
  };
  writeJson(runtimeFile('candidates.json'), out);
  return out;
}

export function reviewMockupCandidate({ candidateId: id, decision, reviewer, note = '' }) {
  const data = loadJson(runtimeFile('candidates.json'), null) || buildMockupCandidates();
  const c = data.candidates.find(x => x.candidateId === id);
  if (!c) throw new Error(`Mockup candidate not found: ${id}`);
  if (!['accepted', 'rejected'].includes(String(decision))) throw new Error('Decision must be accepted or rejected.');
  if (!reviewer) throw new Error('Reviewer is required.');
  data.reviews = data.reviews || {};
  data.reviews[id] = { decision: String(decision), reviewer: String(reviewer), note: String(note), reviewedAt: new Date().toISOString() };
  c.status = decision;
  writeJson(runtimeFile('candidates.json'), data);
  return c;
}

function existingCodes() { return new Set(scanEntities().entities.map(e => e.code)); }
function filterExistingRelationCodes(relations) {
  const codes = existingCodes();
  const out = {};
  for (const [k, values] of Object.entries(relations || {})) {
    const valid = arr(values).filter(v => codes.has(v));
    if (valid.length) out[k] = unique(valid);
  }
  return out;
}
function fmtEvidenceItem(item) {
  if (typeof item === 'string') return item;
  if (!item || typeof item !== 'object') return String(item ?? '');
  if (item.label && item.type) return `${item.label} (${item.type}${item.required === true ? ', required indicator visible' : ''})`;
  if (item.label) return String(item.label);
  if (item.name) return String(item.name);
  return Object.entries(item).map(([k,v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ');
}
function bulletSection(items, emptyText = 'TBD / not evidenced by the mockup.') {
  return items?.length ? items.map(x => `- ${fmtEvidenceItem(x)}`).join('\n') : `- ${emptyText}`;
}
function screenBody(c) {
  const assets = c.assets.map(x => `| \`${x.path}\` | ${x.state || 'default'} | ${x.variant || '—'} | \`${x.hash.slice(0,12)}\` |`).join('\n');
  const fields = c.evidence.fields || [];
  const fieldRows = fields.length ? fields.map(x => {
    if (typeof x === 'string') return `| ${x.replaceAll('|','\\|')} | TBD | TBD | Visible in mockup |`;
    return `| ${String(x.label || x.name || 'Field').replaceAll('|','\\|')} | ${String(x.type || 'TBD').replaceAll('|','\\|')} | ${x.required === true ? 'Yes (visual indicator)' : x.required === false ? 'No' : 'TBD'} | ${String(x.notes || x.validation || 'Visible in mockup').replaceAll('|','\\|')} |`;
  }).join('\n') : '| TBD | TBD | TBD | No field-level evidence extracted yet |';
  const q = unique(c.evidence.openQuestions || []);
  const questions = q.length ? q.map(x => `- ${fmtEvidenceItem(x)}`).join('\n') : '- Confirm route, permissions, API/data source, hidden validation, business rules and non-visible states.';
  return `# ${c.suggestedTitle}\n\n> Generated from reviewed visual evidence. Mockups prove visible UI only; they do not prove backend contracts or hidden business behaviour.\n\n## Purpose\n\nDescribe the screen represented by the linked mockups. Refine business intent from Feature/Requirement sources before approval.\n\n## Route\n\n${c.routeHint ? `\`${c.routeHint}\`` : 'TBD — route is not confirmed by visual evidence.'}\n\n## Accessible Roles\n\n- TBD — role/permission cannot be inferred safely from a visual alone.\n\n## Entry Points\n\n${bulletSection(c.evidence.navigation, 'TBD — only record entry points that are explicit in the mockup or linked flow.')}\n\n## Mockup Coverage\n\n| Mockup | State | Variant | Image Hash |\n|---|---|---|---|\n${assets}\n\n## Layout / Sections\n\n${bulletSection(c.evidence.sections)}\n\n## Fields\n\n| Field | Type | Required | Notes |\n|---|---|---:|---|\n${fieldRows}\n\n## Actions\n\n${bulletSection(c.evidence.actions)}\n\n## Data Sources\n\n- TBD — never infer API request/response or database objects from mockup appearance.\n\n## UI States\n\n${c.states.map(x => `- ${x}`).join('\n')}\n\nAdditional states still to confirm unless provided by requirements: Loading, Empty, Error, No Permission, Offline/Retry where relevant.\n\n## Navigation Rules\n\n${bulletSection(c.evidence.navigation)}\n\n## Validation & Messages\n\n${bulletSection(c.evidence.visibleMessages, 'No visible validation/message evidence extracted. Hidden validation remains TBD.')}\n\n## Explicit Visual Rules\n\n${bulletSection(c.evidence.explicitRules, 'No business rule should be inferred from layout alone.')}\n\n## Responsive / Accessibility\n\n${bulletSection(c.evidence.accessibilityNotes, 'Confirm keyboard/focus, screen reader labels, contrast, touch targets and responsive breakpoints separately.')}\n\n## Related Features / Rules / APIs\n\n- Use frontmatter relations as canonical links.\n- API/DB relations must come from confirmed technical contracts, not from the mockup.\n\n## Open Questions\n\n${questions}\n`;
}
function proposalBody(c, existing) {
  return `# Mockup Enrichment Proposal — ${existing.code}\n\n> Derived proposal only. The existing canonical Screen document was not overwritten.\n\n## Target Screen\n\n- Code: \`${existing.code}\`\n- Source: \`${existing.path}\`\n\n## Mockup References To Add\n\n${c.assets.map(x => `- \`${x.path}\` — state: ${x.state}; hash: \`${x.hash.slice(0,12)}\``).join('\n')}\n\n## Observed Sections\n\n${bulletSection(c.evidence.sections)}\n\n## Observed Fields\n\n${bulletSection(c.evidence.fields)}\n\n## Observed Actions\n\n${bulletSection(c.evidence.actions)}\n\n## Visible Messages\n\n${bulletSection(c.evidence.visibleMessages)}\n\n## Navigation Evidence\n\n${bulletSection(c.evidence.navigation)}\n\n## Open Questions / Gaps\n\n${bulletSection(c.evidence.openQuestions, 'Compare canonical Screen/Requirement/Flow docs against these mockups and reconcile any difference.')}\n\n## Safe Apply Rule\n\nOnly the evidence references may be mechanically added. Behavioural changes to approved requirements/rules/flows must be reviewed and changed in their canonical documents first.\n`;
}
function appendManagedMockupSection(body, c) {
  const start = '<!-- MOCKUP-EVIDENCE:START -->';
  const end = '<!-- MOCKUP-EVIDENCE:END -->';
  const block = `${start}\n## Mockup Evidence\n\n${c.assets.map(x => `- \`${x.path}\` — ${x.state}; hash \`${x.hash.slice(0,12)}\``).join('\n')}\n${end}`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  return re.test(body) ? body.replace(re, block) : `${body.trim()}\n\n${block}\n`;
}

export function promoteMockupCandidate({ candidateId: id, reviewer = '', applyExisting = false } = {}) {
  const data = loadJson(runtimeFile('candidates.json'), null) || buildMockupCandidates();
  const c = data.candidates.find(x => x.candidateId === id);
  if (!c) throw new Error(`Mockup candidate not found: ${id}`);
  const review = data.reviews?.[id];
  if (cfg().promotion.requireReview !== false && review?.decision !== 'accepted') throw new Error(`Candidate ${id} must be accepted before promotion.`);
  if (cfg().analysis.requireVisionAnalysisBeforePromotion !== false && c.analysisCoverage.analyzed < c.analysisCoverage.total) throw new Error(`Candidate ${id} requires vision analysis for all ${c.analysisCoverage.total} asset(s) before promotion.`);
  data.promotions = data.promotions || {};
  const now = new Date(); const date = now.toISOString().slice(0,10);
  const actor = reviewer || review?.reviewer || 'Product/Design';
  if (c.targetMode === 'enrich-existing') {
    const existing = findEntityByCode(c.suggestedCode);
    if (!existing || existing.type !== 'screen') throw new Error(`Existing Screen not found: ${c.suggestedCode}`);
    if (!applyExisting) {
      const proposalRel = `${cfg().runtimeDirectory}/proposals/${id.toLowerCase()}.md`;
      fs.mkdirSync(path.dirname(abs(proposalRel)), { recursive: true });
      fs.writeFileSync(abs(proposalRel), proposalBody(c, existing));
      data.promotions[id] = { kind: 'proposal', targetCode: existing.code, path: proposalRel, reviewer: actor, promotedAt: now.toISOString(), assetHashes: Object.fromEntries(c.assets.map(x => [x.path, x.hash])) };
      c.status = 'proposal-created'; writeJson(runtimeFile('candidates.json'), data);
      return { candidate: c, kind: 'proposal', path: proposalRel };
    }
    const p = abs(existing.path);
    const parsed = parseFrontmatter(fs.readFileSync(p, 'utf8'));
    const meta = structuredClone(parsed.data);
    meta.mockup_refs = unique([...(meta.mockup_refs || []), ...c.assets.map(x => x.path)]);
    meta.revision = Number(meta.revision || 1) + 1;
    meta.updated_at = date;
    meta.last_reviewed_at = date;
    writeMarkdownEntity(p, meta, appendManagedMockupSection(parsed.body, c));
    data.promotions[id] = { kind: 'applied-existing', targetCode: existing.code, path: existing.path, reviewer: actor, promotedAt: now.toISOString(), assetHashes: Object.fromEntries(c.assets.map(x => [x.path, x.hash])) };
    c.status = 'promoted'; writeJson(runtimeFile('candidates.json'), data);
    return { candidate: c, kind: 'applied-existing', path: existing.path };
  }
  if (findEntityByCode(c.suggestedCode)) throw new Error(`Canonical entity already exists: ${c.suggestedCode}`);
  const relations = filterExistingRelationCodes(c.suggestedRelations);
  const meta = {
    code: c.suggestedCode,
    type: 'screen',
    title: c.suggestedTitle,
    status: 'draft',
    owner: actor,
    created_at: date,
    updated_at: date,
    last_reviewed_at: date,
    tags: ['mockup-driven', 'design-evidence'],
    route: c.routeHint || 'TBD',
    mockup_refs: c.assets.map(x => x.path),
    related: relations
  };
  const screenRel = `docs/05-screens/${slug(c.suggestedCode)}.md`;
  writeMarkdownEntity(screenRel, meta, screenBody(c));
  data.promotions[id] = { kind: 'created-screen', targetCode: c.suggestedCode, path: screenRel, reviewer: actor, promotedAt: now.toISOString(), assetHashes: Object.fromEntries(c.assets.map(x => [x.path, x.hash])) };
  c.status = 'promoted'; writeJson(runtimeFile('candidates.json'), data);
  return { candidate: c, kind: 'created-screen', path: screenRel };
}

function currentMappings(inv) {
  const assetPaths = new Set(inv.assets.map(x => x.path));
  const mappings = new Map(inv.assets.map(x => [x.path, []]));
  const missingRefs = [];
  for (const screen of existingScreens()) {
    for (const refPath of arr(screen.meta.mockup_refs)) {
      if (!assetPaths.has(refPath)) missingRefs.push({ screen: screen.code, path: refPath, source: screen.path });
      else mappings.get(refPath).push(screen.code);
    }
  }
  return { mappings, missingRefs };
}
function functionalCoverageForScreen(screenCode) {
  const entities = scanEntities().entities;
  const screen = entities.find(e => e.code === screenCode && e.type === 'screen');
  if (!screen) return { features: [], requirements: [], businessRules: [], flows: [], tests: [] };
  const refs = (meta, field) => arr(meta?.related?.[field]);
  const features = new Set(refs(screen.meta, 'features'));
  const requirements = new Set(refs(screen.meta, 'requirements'));
  const businessRules = new Set(refs(screen.meta, 'business_rules'));
  const flows = new Set(refs(screen.meta, 'flows'));
  const tests = new Set(refs(screen.meta, 'tests'));
  for (const e of entities) {
    if (e.type === 'feature' && refs(e.meta, 'screens').includes(screenCode)) features.add(e.code);
    if (e.type === 'requirement' && refs(e.meta, 'screens').includes(screenCode)) requirements.add(e.code);
    if (e.type === 'business-rule' && refs(e.meta, 'screens').includes(screenCode)) businessRules.add(e.code);
    if (e.type === 'flow' && refs(e.meta, 'screens').includes(screenCode)) flows.add(e.code);
    if ((e.type === 'test-case' || e.type === 'test-script') && refs(e.meta, 'screens').includes(screenCode)) tests.add(e.code);
  }
  return { features: [...features].sort(), requirements: [...requirements].sort(), businessRules: [...businessRules].sort(), flows: [...flows].sort(), tests: [...tests].sort() };
}
function severityRank(s) { return ({info:0,warning:1,high:2,error:3})[String(s)] ?? 1; }
function markdownReport(report) {
  const rows = report.assets.map(a => `| \`${a.path}\` | ${a.classification} | ${a.analysisStatus} | ${a.screens.length ? a.screens.join(', ') : '—'} | ${a.functionalCoverage.features.length ? a.functionalCoverage.features.join(', ') : '—'} | ${a.functionalCoverage.requirements.length ? a.functionalCoverage.requirements.join(', ') : '—'} | ${a.functionalCoverage.flows.length ? a.functionalCoverage.flows.join(', ') : '—'} | ${a.functionalCoverage.tests.length ? a.functionalCoverage.tests.join(', ') : '—'} | ${a.change} |`).join('\n') || '| — | — | — | — | — | — | — | — | — |';
  const finds = report.findings.length ? report.findings.map(f => `- **${f.severity.toUpperCase()} ${f.code}** — ${f.message}`).join('\n') : '- None';
  return `# Generated Mockup Traceability\n\n> Generated by \`npm run mockup:report\`. Do not edit manually. Mockups are design evidence; Screen/Requirement/Rule/API documents remain canonical for behaviour and contracts.\n\nGenerated: ${report.generatedAt}\n\n## Summary\n\n- Mockup assets: **${report.summary.assets}**\n- Screen candidates: **${report.summary.candidates}**\n- Mapped mockups: **${report.summary.mapped}**\n- Unmapped screen mockups: **${report.summary.unmapped}**\n- Needs/stale vision analysis: **${report.summary.needsAnalysis}**\n- Findings: **${report.summary.findings}**\n\n## Asset Coverage\n\n| Mockup | Classification | Analysis | Screen | Feature | Requirement | Flow | Test | Change |\n|---|---|---|---|---|---|---|---|---|\n${rows}\n\n## Findings\n\n${finds}\n`;
}

export function buildMockupReport() {
  const inv = buildMockupInventory();
  const tasks = buildMockupAnalysisTasks();
  const cand = buildMockupCandidates();
  const analyses = analysisMap();
  const { mappings, missingRefs } = currentMappings(inv);
  const findings = [];
  const add = (severity, code, message, ref = null) => findings.push({ severity, code, message, ref });
  const val = cfg().validation;
  const nonScreen = new Map((cand.nonScreenAssets || []).map(x => [x.path, x.classification]));
  const promotedHashes = new Map();
  for (const p of Object.values(cand.promotions || {})) for (const [assetPath, hash] of Object.entries(p.assetHashes || {})) promotedHashes.set(assetPath, hash);
  const assets = inv.assets.map(asset => {
    const a = analyses.get(asset.path);
    const classification = nonScreen.get(asset.path) || a?.classification || 'screen-unverified';
    const stale = !!a && String(a.imageHash || '') !== asset.hash;
    const problems = a ? analysisProblems(a) : [];
    const needsAnalysis = !a || stale || a.status === 'needs-analysis' || problems.length > 0;
    const screens = mappings.get(asset.path) || [];
    const coverages = screens.map(functionalCoverageForScreen);
    const functionalCoverage = {
      features: unique(coverages.flatMap(x => x.features)),
      requirements: unique(coverages.flatMap(x => x.requirements)),
      businessRules: unique(coverages.flatMap(x => x.businessRules)),
      flows: unique(coverages.flatMap(x => x.flows)),
      tests: unique(coverages.flatMap(x => x.tests))
    };
    const isScreen = !['reference','component','flow','ignore','non-screen'].includes(classification);
    if (needsAnalysis) add(val.missingAnalysisSeverity || 'high', stale ? 'STALE_VISION_ANALYSIS' : problems.length ? 'INVALID_VISION_ANALYSIS' : 'MISSING_VISION_ANALYSIS', `${asset.path}: ${stale ? 'image changed after analysis' : problems.length ? `analysis invalid (${problems.join('; ')})` : 'vision analysis is missing/incomplete'}.`, asset.path);
    if (isScreen && val.requireEveryScreenMockupMapped !== false && screens.length === 0) add(val.unmappedMockupSeverity || 'high', 'UNMAPPED_SCREEN_MOCKUP', `${asset.path} is not referenced by any canonical Screen document.`, asset.path);
    if (isScreen && screens.length > 0 && functionalCoverage.features.length === 0) add(val.screenWithoutFeatureSeverity || 'warning', 'MOCKUP_SCREEN_WITHOUT_FEATURE', `${asset.path} maps to Screen ${screens.join(', ')} but no Feature ownership is traceable yet.`, asset.path);
    const previousHash = promotedHashes.get(asset.path);
    if (previousHash && previousHash !== asset.hash) add(val.staleAnalysisSeverity || 'high', 'MOCKUP_CHANGED_AFTER_PROMOTION', `${asset.path} changed after its last promotion; reconcile the linked Screen document.`, asset.path);
    return { path: asset.path, hash: asset.hash, change: asset.change, classification, analysisStatus: needsAnalysis ? (stale ? 'stale' : 'missing') : 'current', screens, functionalCoverage };
  });
  for (const m of missingRefs) add('high', 'BROKEN_MOCKUP_REFERENCE', `${m.screen} references missing/uninventoried mockup ${m.path}.`, m.screen);
  for (const c of cand.candidates || []) {
    const review = cand.reviews?.[c.candidateId]; const promotion = cand.promotions?.[c.candidateId];
    if (review?.decision === 'accepted' && !promotion) add(val.acceptedNotPromotedSeverity || 'high', 'ACCEPTED_MOCKUP_NOT_PROMOTED', `${c.candidateId} (${c.suggestedCode}) is accepted but not promoted.`, c.candidateId);
  }
  const blockSet = new Set(val.blockSeverities || ['high']);
  const pass = !findings.some(f => blockSet.has(f.severity));
  const out = {
    schemaVersion: '1.0', generatedAt: new Date().toISOString(), pass,
    summary: {
      assets: inv.assets.length,
      candidates: cand.candidates.length,
      mapped: assets.filter(a => a.screens.length > 0).length,
      unmapped: assets.filter(a => !['reference','component','flow','ignore','non-screen'].includes(a.classification) && a.screens.length === 0).length,
      needsAnalysis: tasks.summary.needsAnalysis,
      functionalCovered: assets.filter(a => a.screens.length > 0 && a.functionalCoverage.features.length > 0).length,
      findings: findings.length,
      high: findings.filter(f => severityRank(f.severity) >= severityRank('high')).length
    },
    assets, findings
  };
  writeJson(runtimeFile('report.json'), out);
  const generated = path.join(ROOT, 'docs/_generated/MOCKUP_TRACEABILITY.md');
  fs.mkdirSync(path.dirname(generated), { recursive: true });
  fs.writeFileSync(generated, markdownReport(out));
  return out;
}

export function checkMockups() { return buildMockupReport(); }
export function mockupStatus() {
  const inv = buildMockupInventory();
  const tasks = buildMockupAnalysisTasks();
  const cand = buildMockupCandidates();
  const report = buildMockupReport();
  return { inventory: inv.summary, analysis: tasks.summary, candidates: cand.summary, report: { pass: report.pass, ...report.summary } };
}
