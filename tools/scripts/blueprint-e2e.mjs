import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'project-docs-blueprint-'));
function run(args){return execFileSync(process.execPath,[path.join(root,'tools/scripts/blueprint-tool.mjs'),...args],{cwd:path.join(root,'tools'),env:{...process.env,PROJECT_DOCS_ROOT:tmp},encoding:'utf8'});}
function assert(cond,msg){if(!cond)throw new Error(msg);}
try{
  fs.cpSync(root,tmp,{recursive:true,filter:(src)=>!src.includes(`${path.sep}.git${path.sep}`)});
  fs.rmSync(path.join(tmp,'.project-docs','blueprint'),{recursive:true,force:true});
  const bp=path.join(tmp,'PROJECT_BLUEPRINT.md');let s=fs.readFileSync(bp,'utf8');
  s=s.replace('|---|---|---|---|\n\n## Features','|---|---|---|---|\n| MOD-DEMO | Demo | Demo module | |\n\n## Features');
  s=s.replace('|---|---|---|---|---|---|---|---|---|---|\n\n\n## Requirements','|---|---|---|---|---|---|---|---|---|---|\n| FEAT-DEMO | MOD-DEMO | Demo Feature | | standard | production | REQ-DEMO-001 | | | TC-DEMO-001 |\n\n\n## Requirements');
  s=s.replace('|---|---|---|---|---|\n\n## Business Rules','|---|---|---|---|---|\n| REQ-DEMO-001 | FEAT-DEMO | Demo requirement | Demo behaviour | Given demo, when action, then success |\n\n## Business Rules');
  s=s.replace('|---|---|---|---|---|---|\n\n## Screens / Routes','|---|---|---|---|---|---|\n| TC-DEMO-001 | FEAT-DEMO | Demo test | REQ-DEMO-001 | REQ-DEMO-001#AC-01 | |\n\n## Screens / Routes');
  fs.writeFileSync(bp,s);
  run(['init']);run(['expand','--profile','standard']);
  let data=JSON.parse(fs.readFileSync(path.join(tmp,'.project-docs/blueprint/candidates.json'),'utf8'));
  assert(data.candidates.length>=4,'expected Blueprint candidates');
  for(const c of data.candidates)run(['review','--candidate',c.candidateId,'--decision','accepted','--reviewer','E2E']);
  run(['promote','--all','--reviewer','E2E']);
  run(['compile','--profile','standard','--audience','general']);
  run(['render','--profile','overview','--audience','business']);
  const feature=path.join(tmp,'docs/02-modules/mod-demo/feat-demo/feature.md');assert(fs.existsSync(feature),'promoted Feature missing');
  const ftext=fs.readFileSync(feature,'utf8');assert(ftext.includes('requirements: [REQ-DEMO-001]'),'Feature did not receive derived Requirement relation');
  let status=JSON.parse(run(['status']));assert(status.summary.linked>=4,'expected linked Blueprint items');assert(status.summary.conflicts===0,'unexpected initial Blueprint conflict');
  fs.appendFileSync(feature,'\n## E2E Canonical Change\nChanged.\n');
  let diff=JSON.parse(run(['diff']));assert(diff.some(x=>x.code==='FEAT-DEMO'&&x.status==='stale'),'canonical edit should make Blueprint stale');
  s=fs.readFileSync(bp,'utf8').replace('| FEAT-DEMO | MOD-DEMO | Demo Feature |','| FEAT-DEMO | MOD-DEMO | Demo Feature Inline Changed |');fs.writeFileSync(bp,s);
  diff=JSON.parse(run(['diff']));assert(diff.some(x=>x.code==='FEAT-DEMO'&&x.status==='conflict'),'dual edit should create Blueprint conflict');
  status=JSON.parse(run(['reconcile','--prefer','linked']));assert(status.summary.conflicts===0,'linked reconciliation should clear conflict');
  console.log('Blueprint E2E: PASS');
} finally { fs.rmSync(tmp,{recursive:true,force:true}); }
