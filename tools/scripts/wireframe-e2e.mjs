import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const toolsDir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'project-docs-wireframe-e2e-'));
const run=(args,expect=0)=>{const r=spawnSync(process.execPath,[path.join(toolsDir,'scripts/wireframe-tool.mjs'),...args],{cwd:toolsDir,env:{...process.env,PROJECT_DOCS_ROOT:temp},encoding:'utf8'});if((r.status??1)!==expect)throw new Error(`wireframe-tool ${args.join(' ')} expected ${expect}, got ${r.status}\n${r.stdout}\n${r.stderr}`);return r.stdout;};
const writeJson=(p,x)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');};
try{
  fs.mkdirSync(path.join(temp,'docs/05-screens'),{recursive:true});
  writeJson(path.join(temp,'starter-kit.json'),{workspaceLayout:{docs:'docs',runtime:'.project-docs',kit:'kit',registry:'kit/registry',standards:'kit/standards',prompts:'kit/prompts',templates:'kit/templates',workflows:'kit/workflows',sourceBases:'kit/source-bases',reuse:{capabilities:'kit/reuse/capabilities',patterns:'kit/reuse/patterns',templates:'kit/reuse/templates'},examples:'kit/examples',site:'.project-docs/site',tools:'tools',mockups:'mockups',source:{apps:'apps',packages:'packages',tests:'tests',infra:'infra'}}});
  writeJson(path.join(temp,'kit/registry/wireframe-workflow.json'),{schemaVersion:'1.0',runtimeDirectory:'.project-docs/wireframes',generatedDirectory:'docs/_generated/wireframes',combinedHtml:'docs/_generated/SCREEN_WIREFRAMES.html',mode:{optional:true,activeByDefault:false,sourceOfTruth:'canonical-docs'},formats:{default:['text','ascii','html']},review:{proposalDirectory:'.project-docs/wireframes/proposals',allowedGapKinds:['missing-action','navigation-gap','other']},validation:{checkOnlyWhenSessionActive:true,staleProjectionSeverity:'high',acceptedGapUnresolvedSeverity:'high',openGapSeverity:'warning',missingRouteSeverity:'warning',screenWithoutActionsSeverity:'warning',screenWithoutNavigationSeverity:'warning',blockSeverities:['high','error']}});
  const screen=path.join(temp,'docs/05-screens/scr-login.md');
  fs.writeFileSync(screen,`---\nuid: 00000000-0000-4000-8000-000000000001\ncode: SCR-AUTH-LOGIN\nrevision: 1\ntype: screen\ntitle: Login\nstatus: draft\nroute: /login\nrelated:\n  features: [FEAT-AUTH-LOGIN]\n  requirements: [REQ-AUTH-LOGIN]\n---\n\n# Login\n\n## Purpose\nSign in to the application.\n\n## Layout / Sections\n| Order | Region / Section | Component / Content | Visibility / State | Notes |\n|---:|---|---|---|---|\n| 1 | Main | Login form | Default | |\n\n## Fields\n| Field | Type | Required | Validation | Notes |\n|---|---|---:|---|---|\n| Email | text | true | valid email | |\n| Password | password | true | required | |\n\n## Actions\n| Action | Control | Behaviour | Destination | Condition | Related Requirement |\n|---|---|---|---|---|---|\n| Sign in | button | Authenticate | SCR-HOME | valid form | REQ-AUTH-LOGIN |\n\n## UI States\n- Initial\n- Loading\n- Error\n\n## Navigation Rules\n| Trigger | Destination | Condition | Back Behaviour |\n|---|---|---|---|\n| Sign in success | SCR-HOME | authenticated | none |\n\n## Open Questions / Mockup Gaps\n- Confirm remember-me requirement.\n`);
  run(['start','--screens','SCR-AUTH-LOGIN']);
  run(['build']);
  const html=path.join(temp,'docs/_generated/SCREEN_WIREFRAMES.html');
  const ascii=path.join(temp,'docs/_generated/wireframes/scr-auth-login.ascii.txt');
  const spec=path.join(temp,'.project-docs/wireframes/specs/scr-auth-login.json');
  if(!fs.existsSync(html)||!fs.readFileSync(html,'utf8').includes('Sign in'))throw new Error('Combined HTML was not generated from Screen docs.');
  if(!fs.existsSync(ascii)||!fs.readFileSync(ascii,'utf8').includes('[ Sign in ]'))throw new Error('ASCII renderer missing action.');
  if(!fs.existsSync(spec))throw new Error('Semantic wireframe spec missing.');
  const gapOut=JSON.parse(run(['gap','--screen','SCR-AUTH-LOGIN','--kind','missing-action','--severity','high','--summary','Forgot Password action is not documented.']));
  run(['resolve','--proposal',gapOut.id,'--status','accepted','--reviewer','E2E']);
  run(['check'],1);
  run(['resolve','--proposal',gapOut.id,'--status','resolved','--reviewer','E2E','--note','Canonical docs updated.']);
  run(['check']);
  fs.appendFileSync(screen,'\n<!-- semantic change -->\n');
  run(['check'],1);
  run(['build']);
  run(['check']);
  run(['close','--reviewer','E2E']);
  console.log('Wireframe E2E: PASS (Screen docs -> semantic spec -> text/ASCII/combined HTML -> gap governance -> stale detection -> close).');
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
