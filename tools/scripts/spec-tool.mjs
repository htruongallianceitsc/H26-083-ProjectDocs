import path from 'node:path';
import { ROOT, parseArgs, scanEntities } from '../lib/common.mjs';
import { allSpecSummaries, applySpecLevel, evaluateSpec, featureByCode, promotionReport, resolveSpec, savePromotionReport, specSummary } from '../lib/specification.mjs';

const action = process.argv[2] || 'status';
const args = parseArgs(process.argv.slice(3));
function required(name) { if (!args[name]) throw new Error(`Missing --${name}`); return String(args[name]); }
function features() { return args.feature ? [featureByCode(String(args.feature))] : scanEntities().entities.filter(e => e.type === 'feature'); }

function status() {
  const rows = args.feature ? [specSummary(String(args.feature))] : allSpecSummaries();
  if (args.json) { console.log(JSON.stringify(rows, null, 2)); return; }
  if (!rows.length) { console.log('No feature entities found.'); return; }
  console.log('Feature\tRequested\tEffective\tMaturity\tRecommended\tCompleteness');
  for (const r of rows) console.log(`${r.code}\t${r.requestedLevel}\t${r.effectiveLevel}\t${r.targetMaturity}\t${r.recommendedLevel}\t${r.completeness}%${r.belowRecommended ? ' !' : ''}`);
}
function check() {
  let ok = true;
  const reports = [];
  for (const feature of features()) {
    const report = evaluateSpec(feature, { gate: String(args.gate || 'ready') });
    reports.push(report); ok = ok && report.pass;
    if (!args.json) {
      console.log(`SPEC ${feature.code}: ${report.pass ? 'PASS' : 'FAIL'} [requested=${report.requestedLevel}, effective=${report.effectiveLevel}, maturity=${report.targetMaturity}, recommended=${report.recommendedLevel}, completeness=${report.completeness}%]`);
      for (const c of report.checks) console.log(`[${c.pass ? 'PASS' : (c.severity === 'warning' ? 'WARN' : 'FAIL')}] ${c.code}: ${c.message}`);
    }
  }
  if (args.json) console.log(JSON.stringify(reports, null, 2));
  if (!ok) process.exitCode = 1;
}
function recommend() {
  for (const feature of features()) {
    const r = resolveSpec(feature);
    console.log(`${feature.code}: requested=${r.requestedLevel}, effective=${r.effectiveLevel}, maturity=${r.targetMaturity}, recommended=${r.recommendedLevel}`);
    for (const match of r.riskMatches) console.log(`- ${match.id}: ${match.minimumLevel} (${match.matchedTerms.join(', ')})`);
  }
}
function promote() {
  const feature = required('feature'); const to = required('to');
  const report = promotionReport(feature, to);
  const p = savePromotionReport(report);
  console.log(`Promotion ${feature}: ${report.fromLevel} -> ${to}`);
  console.log(`Completeness for target: ${report.completeness}%`);
  if (report.gaps.length) for (const g of report.gaps) console.log(`[GAP] ${g.code}: ${g.message}`);
  else console.log('No blocking documentation gaps for target level.');
  console.log(`Report: ${path.relative(ROOT, p).replaceAll(path.sep, '/')}`);
  if (args.apply) {
    if (report.gaps.length) throw new Error('PROMOTION_NOT_READY: resolve target-level gaps before --apply.');
    applySpecLevel(feature, to);
    console.log(`Applied spec_level=${to} to ${feature}.`);
  }
  if (report.gaps.length && args['fail-on-gap']) process.exitCode = 1;
}

try {
  if (action === 'status') status();
  else if (action === 'check') check();
  else if (action === 'recommend') recommend();
  else if (action === 'promote') promote();
  else { console.log('spec-tool commands: status [--feature CODE], check [--feature CODE] [--gate ready|done], recommend [--feature CODE], promote --feature CODE --to standard|full [--apply] [--fail-on-gap]'); process.exitCode = 1; }
} catch (error) { console.error(`[ERROR] ${error.message}`); process.exitCode = 1; }
