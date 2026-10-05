import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const toolsDir = path.resolve(here, '..');
const sourceRoot = path.resolve(toolsDir, '..');
const fixture = path.join(toolsDir, 'tests/fixtures/valid-project');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'project-docs-v41-'));

function copy(src,dst){ fs.cpSync(src,dst,{recursive:true}); }
function run(action, expectOk=true){
  const result=spawnSync(process.execPath,[path.join(here,'docs-tool.mjs'),action],{
    cwd: toolsDir,
    env:{...process.env,PROJECT_DOCS_ROOT:tempRoot},
    encoding:'utf8'
  });
  const output=(result.stdout||'')+(result.stderr||'');
  if(expectOk && result.status!==0) throw new Error(`${action} failed\n${output}`);
  if(!expectOk && result.status===0) throw new Error(`${action} unexpectedly passed\n${output}`);
  return output;
}

try {
  copy(fixture,tempRoot);
  copy(path.join(sourceRoot,'registry'),path.join(tempRoot,'registry'));
  copy(path.join(sourceRoot,'starter-kit.json'),path.join(tempRoot,'starter-kit.json'));
  fs.mkdirSync(path.join(tempRoot,'.project-docs'),{recursive:true});
  fs.writeFileSync(path.join(tempRoot,'.project-docs/packs.lock.json'),'{"schemaVersion":"1.0","packs":{}}\n');

  run('validate');
  const syncOutput=run('sync');
  if(!/6 entities, 6 typed edges/.test(syncOutput)) throw new Error(`Expected 6 entities / 6 edges, got:\n${syncOutput}`);
  run('build');
  run('check-site');
  const graph=JSON.parse(fs.readFileSync(path.join(tempRoot,'docs/_generated/graph.json'),'utf8'));
  if(graph.nodes.length!==6 || graph.edges.length!==6) throw new Error(`Graph mismatch: ${graph.nodes.length} nodes / ${graph.edges.length} edges`);

  const featurePath=path.join(tempRoot,'docs/feature.md');
  fs.writeFileSync(featurePath,fs.readFileSync(featurePath,'utf8').replace('TC-DEMO-001','TC-DEMO-MISSING'));
  const negative=run('validate',false);
  if(!negative.includes('BROKEN_RELATION')) throw new Error(`Negative fixture failed for wrong reason:\n${negative}`);
  console.log('E2E regression: PASS (valid graph + broken-relation failure path).');
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
