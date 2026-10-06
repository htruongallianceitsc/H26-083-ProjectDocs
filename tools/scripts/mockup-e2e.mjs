import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const toolsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.resolve(toolsDir, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'project-docs-mockup-e2e-'));
const run = (args, expect = 0) => {
  const r = spawnSync(process.execPath, [path.join(toolsDir, 'scripts/mockup-tool.mjs'), ...args], {
    cwd: toolsDir,
    env: { ...process.env, PROJECT_DOCS_ROOT: temp },
    encoding: 'utf8'
  });
  if ((r.status ?? 1) !== expect) throw new Error(`mockup-tool ${args.join(' ')} expected ${expect}, got ${r.status}\n${r.stdout}\n${r.stderr}`);
  return r.stdout;
};
const writeJson = (p, x) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, JSON.stringify(x, null, 2) + '\n'); };
try {
  fs.mkdirSync(path.join(temp, 'mockups/auth'), { recursive: true });
  fs.mkdirSync(path.join(temp, 'docs/05-screens'), { recursive: true });
  writeJson(path.join(temp, 'starter-kit.json'), {
    workspaceLayout: {
      docs: 'docs', runtime: '.project-docs', kit: 'kit', registry: 'kit/registry', standards: 'kit/standards', prompts: 'kit/prompts', templates: 'kit/templates', workflows: 'kit/workflows', sourceBases: 'kit/source-bases',
      reuse: { capabilities: 'kit/reuse/capabilities', patterns: 'kit/reuse/patterns', templates: 'kit/reuse/templates' }, examples: 'kit/examples', site: '.project-docs/site', tools: 'tools', mockups: 'mockups', source: { apps: 'apps', packages: 'packages', tests: 'tests', infra: 'infra' }
    }
  });
  writeJson(path.join(temp, 'kit/registry/mockup-workflow.json'), {
    schemaVersion: '1.0', assetRoot: 'mockups', runtimeDirectory: '.project-docs/mockups', supportedExtensions: ['.svg'], naming: { separator: '__' },
    analysis: { requireVisionAnalysisBeforePromotion: true }, promotion: { requireReview: true, autoUpdateExistingScreens: false }, validation: { requireEveryScreenMockupMapped: true, blockSeverities: ['high','error'] }
  });
  const image = path.join(temp, 'mockups/auth/login__default.svg');
  fs.writeFileSync(image, '<svg width="100" height="200" xmlns="http://www.w3.org/2000/svg"><text x="5" y="20">Login</text></svg>');
  run(['inventory']);
  const inv = JSON.parse(fs.readFileSync(path.join(temp, '.project-docs/mockups/inventory.json'), 'utf8'));
  if (inv.summary.total !== 1 || inv.assets[0].screenHint !== 'login') throw new Error('Inventory did not classify the synthetic mockup.');
  const asset = inv.assets[0];
  writeJson(path.join(temp, '.project-docs/mockups/analysis/login.json'), {
    assetPath: asset.path, imageHash: asset.hash, classification: 'screen', screenKey: 'auth-login', screenTitle: 'Login', existingScreenCode: null,
    featureCodes: [], requirementCodes: [], businessRuleCodes: [], flowCodes: [], routeHint: '/login', platform: 'web', viewport: 'desktop', state: 'default', variant: null,
    sections: ['Login form'], fields: [{ label: 'Email', type: 'text', required: true }], actions: ['Sign in'], visibleMessages: [], navigation: [], explicitRules: [], accessibilityNotes: [], openQuestions: ['Confirm backend contract.'], confidence: 0.95, status: 'analyzed'
  });
  run(['candidates']);
  const cand = JSON.parse(fs.readFileSync(path.join(temp, '.project-docs/mockups/candidates.json'), 'utf8')).candidates[0];
  if (!cand || cand.targetMode !== 'create-screen') throw new Error('Expected create-screen candidate.');
  run(['review', '--candidate', cand.candidateId, '--decision', 'accepted', '--reviewer', 'E2E']);
  run(['promote', '--candidate', cand.candidateId, '--reviewer', 'E2E']);
  const screenPath = path.join(temp, 'docs/05-screens/scr-auth-login.md');
  if (!fs.existsSync(screenPath) || !fs.readFileSync(screenPath, 'utf8').includes('mockup_refs')) throw new Error('Mockup promotion did not create a traceable Screen doc.');
  run(['check']);
  fs.writeFileSync(image, '<svg width="101" height="200" xmlns="http://www.w3.org/2000/svg"><text x="5" y="20">Login changed</text></svg>');
  run(['check'], 1);
  const report = JSON.parse(fs.readFileSync(path.join(temp, '.project-docs/mockups/report.json'), 'utf8'));
  if (!report.findings.some(x => ['STALE_VISION_ANALYSIS','MOCKUP_CHANGED_AFTER_PROMOTION'].includes(x.code))) throw new Error('Mockup drift was not detected after image change.');
  console.log('Mockup E2E: PASS (inventory -> vision evidence -> review -> Screen promotion -> traceability -> drift detection).');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
