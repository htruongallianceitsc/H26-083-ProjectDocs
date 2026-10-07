import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-bundle-e2e-'));
const source = path.join(temp, 'source');
const target = path.join(temp, 'target');
const bundle = path.join(temp, 'transfer.zip');

function copyRuntimeConfig(root, version) {
  fs.mkdirSync(path.join(root, 'kit', 'registry'), { recursive: true });
  fs.copyFileSync(path.join(repo, 'kit', 'registry', 'documentation-bundle.json'), path.join(root, 'kit', 'registry', 'documentation-bundle.json'));
  fs.copyFileSync(path.join(repo, 'kit', 'registry', 'entity-types.json'), path.join(root, 'kit', 'registry', 'entity-types.json'));
  fs.writeFileSync(path.join(root, 'starter-kit.json'), JSON.stringify({ name: 'bundle-e2e', version, schemaVersion: version, workspaceLayout: { docs: 'docs', runtime: '.project-docs', kit: 'kit', registry: 'kit/registry', site: '.project-docs/site', source: { apps: 'apps', packages: 'packages', tests: 'tests', infra: 'infra' }, reuse: { capabilities: 'kit/reuse/capabilities', patterns: 'kit/reuse/patterns', templates: 'kit/reuse/templates' }, standards: 'kit/standards', prompts: 'kit/prompts', templates: 'kit/templates', workflows: 'kit/workflows', sourceBases: 'kit/source-bases', examples: 'kit/examples', tools: 'tools', mockups: 'mockups' } }, null, 2));
}

function run(root, argv, expected = 0) {
  const r = spawnSync(process.execPath, [path.join(repo, 'tools', 'scripts', 'bundle-tool.mjs'), ...argv], {
    cwd: repo,
    env: { ...process.env, PROJECT_DOCS_ROOT: root },
    encoding: 'utf8'
  });
  if (r.status !== expected) throw new Error(`Command failed (${r.status}): ${argv.join(' ')}\n${r.stdout}\n${r.stderr}`);
  return `${r.stdout}\n${r.stderr}`;
}

try {
  fs.mkdirSync(source, { recursive: true }); fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(source, 'starter-kit.json'), JSON.stringify({ name: 'legacy-bundle-e2e', version: '5.10.0', schemaVersion: '5.10.0' }, null, 2));
  copyRuntimeConfig(target, '5.15.0');
  fs.mkdirSync(path.join(source, 'docs', 'legacy'), { recursive: true });
  fs.writeFileSync(path.join(source, 'project.profile.json'), JSON.stringify({ projectCode: 'E2E', projectName: 'Bundle E2E' }, null, 2));
  fs.writeFileSync(path.join(source, 'docs', 'legacy', 'module.md'), `---\ncode: MOD-AUTH\ntype: module\ntitle: Auth\nstatus: active\nowner: Team\ncreated_at: 2026-01-01\nupdated_at: 2026-01-01\nlast_reviewed_at: 2026-01-01\nrelated:\n---\n\n# Auth\n`);
  fs.writeFileSync(path.join(source, 'docs', 'legacy', 'login.md'), `---\ncode: FEAT-AUTH-LOGIN\ntype: feature\ntitle: Login\nstatus: planned\nowner: Team\ncreated_at: 2026-01-01\nupdated_at: 2026-01-01\nlast_reviewed_at: 2026-01-01\nrelated:\n  modules: [MOD-AUTH]\n---\n\n# Login\n\nPortable feature content.\n`);

  run(repo, ['export', '--source', source, '--output', bundle]);
  if (!fs.existsSync(bundle)) throw new Error('Bundle ZIP was not created');
  const inspect = run(target, ['inspect', '--file', bundle]);
  if (!inspect.includes('Bundle integrity: PASS')) throw new Error('Bundle inspect did not pass integrity');
  run(target, ['import', '--file', bundle, '--no-rebuild']);

  const modulePath = path.join(target, 'docs', '02-modules', 'MOD-AUTH', 'module.md');
  const featurePath = path.join(target, 'docs', '02-modules', 'MOD-AUTH', 'FEAT-AUTH-LOGIN', 'feature.md');
  if (!fs.existsSync(modulePath) || !fs.existsSync(featurePath)) throw new Error('Entities were not mapped into the current documentation structure');
  if (!fs.readFileSync(featurePath, 'utf8').includes('uid:')) throw new Error('Missing UID was not normalized during transfer');

  const second = run(target, ['import', '--file', bundle, '--no-rebuild']);
  if (!second.includes('0 imported, 2 unchanged')) throw new Error(`Second import was not idempotent:\n${second}`);

  fs.appendFileSync(featurePath, '\nLocal target change.\n');
  const conflict = run(target, ['import', '--file', bundle, '--dry-run', '--on-conflict', 'error'], 2);
  if (!conflict.includes('[CONFLICT] FEAT-AUTH-LOGIN')) throw new Error('Conflict-safe import was not detected');

  console.log('Documentation bundle E2E: PASS');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
