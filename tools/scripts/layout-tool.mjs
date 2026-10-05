import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadJson, writeJson, parseArgs, workspaceRel, workspaceAbs, legacyWorkspaceRel } from '../lib/common.mjs';

const action = process.argv[2] || 'check';
const args = parseArgs(process.argv.slice(3));

const layoutKeys = [
  'registry', 'standards', 'prompts', 'templates', 'workflows', 'sourceBases',
  'reuse.capabilities', 'reuse.patterns', 'reuse.templates', 'examples', 'site'
];
const directoryMoves = [
  ['registry', 'registry'],
  ['standards', 'standards'],
  ['prompts', 'prompts'],
  ['templates', 'templates'],
  ['workflows', 'workflows'],
  ['sourceBases', 'sourceBases'],
  ['reuse.capabilities', 'reuse.capabilities'],
  ['reuse.patterns', 'reuse.patterns'],
  ['reuse.templates', 'reuse.templates'],
  ['site', 'site']
];
const fileMoves = [
  ['PROJECT_PROFILE.example.json', workspaceRel('examples', 'project-profile.example.json')]
];

function posix(p) { return p.split(path.sep).join('/'); }
function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }

function check() {
  const errors = [];
  const warnings = [];
  const starter = loadJson('starter-kit.json', {});
  if (starter.workspaceLayoutVersion !== '1.0') errors.push(`starter-kit.json workspaceLayoutVersion must be 1.0 (got ${starter.workspaceLayoutVersion || 'missing'})`);
  if (!starter.workspaceLayout) errors.push('starter-kit.json workspaceLayout is missing');
  for (const key of layoutKeys) {
    const rel = workspaceRel(key);
    if (!exists(rel)) errors.push(`Canonical workspace path missing: ${rel}`);
  }
  for (const [key] of directoryMoves) {
    const legacy = legacyWorkspaceRel(key);
    const canonical = workspaceRel(key);
    if (legacy && legacy !== canonical && exists(legacy)) errors.push(`Legacy root still exists: ${legacy} -> move to ${canonical}`);
  }
  if (exists('PROJECT_PROFILE.example.json')) errors.push(`Legacy root file still exists: PROJECT_PROFILE.example.json -> ${workspaceRel('examples','project-profile.example.json')}`);
  const rootMarkdown = fs.readdirSync(ROOT, { withFileTypes: true }).filter(x => x.isFile() && x.name.endsWith('.md')).map(x => x.name).sort();
  const allowedRootMarkdown = new Set(['README.md', 'START_HERE.md', 'PROJECT_BLUEPRINT.md']);
  for (const file of rootMarkdown) if (!allowedRootMarkdown.has(file)) warnings.push(`Non-entry Markdown remains at root: ${file}`);
  console.log(`Workspace layout check: ${errors.length} error(s), ${warnings.length} warning(s).`);
  console.log(`Canonical kit root: ${workspaceRel('kit')}`);
  console.log(`Generated site: ${workspaceRel('site')}`);
  for (const e of errors) console.log(`[ERROR] ${e}`);
  for (const w of warnings) console.log(`[WARN] ${w}`);
  return errors.length === 0;
}

function migrate() {
  const apply = Boolean(args.apply);
  const operations = [];
  const conflicts = [];
  for (const [key] of directoryMoves) {
    const legacy = legacyWorkspaceRel(key);
    const canonical = workspaceRel(key);
    if (!legacy || legacy === canonical || !exists(legacy)) continue;
    if (exists(canonical)) conflicts.push(`${legacy} -> ${canonical} (destination already exists)`);
    else operations.push({ type: 'dir', from: legacy, to: canonical });
  }
  for (const [from, to] of fileMoves) {
    if (!exists(from)) continue;
    if (exists(to)) conflicts.push(`${from} -> ${to} (destination already exists)`);
    else operations.push({ type: 'file', from, to });
  }
  console.log(`${apply ? 'APPLY' : 'PREVIEW'} workspace layout migration: ${operations.length} move(s), ${conflicts.length} conflict(s).`);
  for (const op of operations) console.log(`- ${op.from} -> ${op.to}`);
  for (const c of conflicts) console.log(`[CONFLICT] ${c}`);
  if (conflicts.length) { process.exitCode = 1; return; }
  if (!apply) { console.log('No files changed. Re-run with --apply after review.'); return; }
  for (const op of operations) {
    const src = path.join(ROOT, op.from), dst = path.join(ROOT, op.to);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.renameSync(src, dst);
  }
  const starter = loadJson('starter-kit.json', {});
  starter.version = '5.8.0';
  starter.schemaVersion = '5.8.0';
  starter.workspaceLayoutVersion = '1.0';
  starter.workspaceLayout = {
    docs: 'docs', runtime: '.project-docs', kit: 'kit', registry: 'kit/registry', standards: 'kit/standards',
    prompts: 'kit/prompts', templates: 'kit/templates', workflows: 'kit/workflows', sourceBases: 'kit/source-bases',
    reuse: { capabilities: 'kit/reuse/capabilities', patterns: 'kit/reuse/patterns', templates: 'kit/reuse/templates' },
    examples: 'kit/examples', site: '.project-docs/site', tools: 'tools',
    source: { apps: 'apps', packages: 'packages', tests: 'tests', infra: 'infra' }
  };
  starter.legacyLayoutAliases = starter.legacyLayoutAliases || {
    registry: 'registry', standards: 'standards', prompts: 'prompts', templates: 'templates', workflows: 'workflows',
    sourceBases: 'source-bases', 'reuse.capabilities': 'reusable-modules', 'reuse.patterns': 'reusable-patterns',
    'reuse.templates': 'reusable-templates', 'examples.profile': 'PROJECT_PROFILE.example.json', site: 'site'
  };
  writeJson('starter-kit.json', starter);
  console.log(`Migration applied at ${posix(ROOT)}. Run npm run qa from tools/.`);
}

if (action === 'check') { if (!check()) process.exitCode = 1; }
else if (action === 'migrate') migrate();
else { console.log('layout-tool commands: check, migrate [--apply]'); process.exitCode = 1; }
