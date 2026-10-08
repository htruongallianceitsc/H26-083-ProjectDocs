#!/usr/bin/env node
// Pre-flight token budget for AI-authored documentation in brownfield adoption.
// Reads .project-docs/brownfield/{inventory,candidates}.json (derived by brownfield:inventory/candidates).
// Usage: node scripts/brownfield-budget.mjs [--level lightweight|standard|full] [--turns 6] [--bpt 3.8] [--ratio 1.5] [--cache 0.1]
// ALL numbers are ESTIMATES: tokens ~= bytes / bytes-per-token. Calibrate --bpt/--ratio with real usage (see README note).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const level = arg('level', 'standard');
// output-tokens / source-tokens. 'standard' = 1.54 measured on the H26-083 sample (22.6k doc tok / 14.7k source tok); others are assumptions.
const RATIO = { lightweight: 0.6, standard: 1.5, full: 2.5 };
const ratio = Number(arg('ratio', RATIO[level] ?? 1.5));
const bpt = Number(arg('bpt', 3.8)), turns = Number(arg('turns', 6)), cacheRead = Number(arg('cache', 0.1));
const tok = (bytes) => Math.round(bytes / bpt);
const size = (p) => { try { return fs.statSync(path.join(ROOT, p)).size; } catch { return 0; } };
const load = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const inv = load('.project-docs/brownfield/inventory.json'), cand = load('.project-docs/brownfield/candidates.json');

// Fixed prefix the agent must hold per unit: agent rules + the templates it fills in.
const fixedFiles = ['kit/standards/ai-agent-rules.md', ...['feature','requirement','business-rule','screen','api','test-case','database-object'].map((t) => `kit/templates/${t}-template.md`)];
const fixed = tok(fixedFiles.reduce((s, f) => s + size(f), 0));

const owned = new Set(); const units = [];
for (const c of cand.candidates.filter((x) => x.suggestedType === 'feature')) {
  const files = [...new Set(c.evidence.map((e) => e.path))];
  // include the test/screen/api candidates of the same application whose evidence lives under the same feature folder
  const dir = files.map((f) => path.dirname(f)).sort((a, b) => a.length - b.length)[0];
  for (const o of cand.candidates) for (const e of o.evidence) if (dir && e.path.startsWith(dir + '/') && !files.includes(e.path)) files.push(e.path);
  files.forEach((f) => owned.add(f));
  const src = tok(files.reduce((s, f) => s + size(f), 0));
  units.push({ unit: c.suggestedCode, app: c.application, files: files.length, sourceTok: src });
}
const shared = inv.files.filter((f) => !owned.has(f.path) && /\.(ts|tsx|js|mjs|cs|dart|kt|swift|sql)$/.test(f.path) && !/\.config\.|vite-env|\/test\/setup/.test(f.path));
const sharedTok = tok(shared.reduce((s, f) => s + size(f.path), 0));
if (shared.length) units.push({ unit: '(unassigned source: no feature candidate)', app: '-', files: shared.length, sourceTok: sharedTok });

const rows = units.map((u) => {
  const input = fixed + u.sourceTok;                       // one pass of what must be in context
  const output = Math.round(u.sourceTok * ratio);           // doc tokens to write
  // naive: every turn re-sends input + growing output. cached: re-reads at cacheRead price after turn 1.
  const naive = turns * input + output * (turns + 1) / 2;
  const cached = input + (turns - 1) * input * cacheRead + output * (turns + 1) / 2 * cacheRead + output;
  return { ...u, inputTok: input, outputTok: output, naiveBilledInputTok: Math.round(naive), cachedEquivInputTok: Math.round(cached) };
});
const sum = (k) => rows.reduce((s, r) => s + r[k], 0);
console.log(`Brownfield token budget (ESTIMATE) level=${level} ratio=${ratio} bytes/token=${bpt} turns=${turns} cacheRead=${cacheRead}`);
console.log(`Fixed prefix per unit: ${fixed} tok (${fixedFiles.length} files). Inventory: ${inv.files.length} files.\n`);
console.log('unit'.padEnd(46), 'files', 'srcTok', 'in/pass', 'outTok', 'naive*', 'cached*');
for (const r of rows) console.log(r.unit.padEnd(46), String(r.files).padStart(5), String(r.sourceTok).padStart(6), String(r.inputTok).padStart(7), String(r.outputTok).padStart(6), String(r.naiveBilledInputTok).padStart(6), String(r.cachedEquivInputTok).padStart(7));
console.log('TOTAL'.padEnd(46), String(sum('files')).padStart(5), String(sum('sourceTok')).padStart(6), String(sum('inputTok')).padStart(7), String(sum('outputTok')).padStart(6), String(sum('naiveBilledInputTok')).padStart(6), String(sum('cachedEquivInputTok')).padStart(7));
console.log('\n* naive = input billed with no caching over all turns; cached = input-equivalent tokens if the stable prefix is cached.');
fs.mkdirSync(path.join(ROOT, '.project-docs/reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, '.project-docs/reports/brownfield-budget.json'), JSON.stringify({ level, ratio, bpt, turns, cacheRead, fixed, rows }, null, 2));
