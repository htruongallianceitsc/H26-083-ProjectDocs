import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const toolsDir = path.resolve(here, '..');
const sourceRoot = path.resolve(toolsDir, '..');
const fixture = path.join(toolsDir, 'tests/fixtures/valid-project');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'project-docs-v56-'));

function copy(src,dst){ fs.cpSync(src,dst,{recursive:true}); }
function run(script, action, extra=[], expectOk=true){
  const result=spawnSync(process.execPath,[path.join(here,script),action,...extra],{
    cwd: toolsDir,
    env:{...process.env,PROJECT_DOCS_ROOT:tempRoot},
    encoding:'utf8'
  });
  const output=(result.stdout||'')+(result.stderr||'');
  if(expectOk && result.status!==0) throw new Error(`${script} ${action} failed\n${output}`);
  if(!expectOk && result.status===0) throw new Error(`${script} ${action} unexpectedly passed\n${output}`);
  return output;
}
function replace(file,from,to){ const p=path.join(tempRoot,file); fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(from,to)); }

try {
  copy(fixture,tempRoot);
  copy(path.join(sourceRoot,'kit/registry'),path.join(tempRoot,'kit/registry'));
  copy(path.join(sourceRoot,'starter-kit.json'),path.join(tempRoot,'starter-kit.json'));
  copy(path.join(sourceRoot,'kit/source-bases'),path.join(tempRoot,'kit/source-bases'));
  fs.mkdirSync(path.join(tempRoot,'docs/history'),{recursive:true});
  fs.mkdirSync(path.join(tempRoot,'.project-docs/workplans'),{recursive:true});
  fs.mkdirSync(path.join(tempRoot,'.project-docs/freshness'),{recursive:true});
  fs.mkdirSync(path.join(tempRoot,'.project-docs/changesets'),{recursive:true});
  fs.mkdirSync(path.join(tempRoot,'.project-docs/baselines'),{recursive:true});
  fs.writeFileSync(path.join(tempRoot,'.project-docs/packs.lock.json'),'{'+'"schemaVersion":"1.0","packs":{}'+'}\n');
  fs.writeFileSync(path.join(tempRoot,'.project-docs/source.lock.json'),'{'+'"schemaVersion":"1.0","applications":{}'+'}\n');

  run('docs-tool.mjs','validate');
  fs.writeFileSync(path.join(tempRoot,'V99_UPGRADE_NOTES.md'),'# Historical file in wrong location\n');
  const rootHistoryNegative=run('docs-tool.mjs','validate',[],false);
  if(!rootHistoryNegative.includes('ROOT_HISTORY_DOC')) throw new Error(`Root history hygiene negative test failed:\n${rootHistoryNegative}`);
  fs.rmSync(path.join(tempRoot,'V99_UPGRADE_NOTES.md'));
  run('docs-tool.mjs','validate');
  const initial=run('docs-tool.mjs','sync');
  if(!/6 entities, 6 typed edges/.test(initial)) throw new Error(`Expected initial 6 entities / 6 edges, got:\n${initial}`);

  run('source-tool.mjs','validate');
  const sourceInit=run('source-tool.mjs','init',['--code','APP-WEB','--profile','react-spa','--variant','minimal','--title','Demo Web']);
  if(!sourceInit.includes('Initialized APP-WEB')) throw new Error(`Source init failed:
${sourceInit}`);
  fs.mkdirSync(path.join(tempRoot,'legacy-web/src/app'),{recursive:true});
  fs.writeFileSync(path.join(tempRoot,'legacy-web/package.json'),'{}\n');
  fs.writeFileSync(path.join(tempRoot,'legacy-web/src/main.tsx'),'export {};\n');
  fs.writeFileSync(path.join(tempRoot,'legacy-web/src/app/App.tsx'),'export {};\n');
  const sourceAdopt=run('source-tool.mjs','adopt',['--code','APP-LEGACY','--profile','react-spa','--root','legacy-web','--title','Legacy Web']);
  if(!sourceAdopt.includes('Adopted APP-LEGACY')) throw new Error(`Source adopt failed:
${sourceAdopt}`);
  const sourceCheck=run('source-tool.mjs','check');
  if(!sourceCheck.includes('2 application(s)')) throw new Error(`Source check did not cover both apps:
${sourceCheck}`);
  const requiredSource=path.join(tempRoot,'apps/web/src/main.tsx'); const requiredSourceText=fs.readFileSync(requiredSource,'utf8'); fs.rmSync(requiredSource); const sourceNegative=run('source-tool.mjs','check',['--app','APP-WEB'],false); if(!sourceNegative.includes('Missing required path')) throw new Error(`Source required-path negative test failed:
${sourceNegative}`); fs.writeFileSync(requiredSource,requiredSourceText); run('source-tool.mjs','check',['--app','APP-WEB']);
  const sourceUpgrade=run('source-tool.mjs','upgrade-check',['--app','APP-WEB']); if(!sourceUpgrade.includes('UP_TO_DATE')) throw new Error(`Source Base upgrade check mismatch:
${sourceUpgrade}`);
  const sourceRecommend=run('source-tool.mjs','recommend',['--type','web','--stack','reactjs']); if(!sourceRecommend.includes('recommendedVariant=production')) throw new Error(`Source recommendation mismatch:
${sourceRecommend}`);
  const sourceStatus=run('source-tool.mjs','status');
  if(!sourceStatus.includes('APP-WEB') || !sourceStatus.includes('APP-LEGACY')) throw new Error(`Source status missing application:
${sourceStatus}`);
  const lock=JSON.parse(fs.readFileSync(path.join(tempRoot,'.project-docs/source.lock.json'),'utf8'));
  if(lock.applications?.['APP-WEB']?.sourceBase?.id!=='react-spa' || lock.applications?.['APP-LEGACY']?.origin!=='existing') throw new Error(`Source provenance lock mismatch: ${JSON.stringify(lock)}`);
  replace('docs/feature.md','  tests: [TC-DEMO-001]','  tests: [TC-DEMO-001]\n  applications: [APP-WEB]');
  run('docs-tool.mjs','validate');

  const lightBody = (code,title) => `---\ncode: ${code}\ntype: feature\ntitle: ${title}\nstatus: planned\nspec_level: lightweight\ntarget_maturity: prototype\nrelated:\n  requirements: []\n  tests: []\n---\n# ${title}\n\n## Business Goal\nPrototype the workflow quickly.\n\n## Actors\nInternal user.\n\n## Main Flow\n1. Open the mock.\n2. Complete the basic action.\n\n## Key Rules\n- Keep behaviour intentionally minimal.\n\n## Acceptance Summary\n- The prototype demonstrates the expected happy path.\n\n## Open Questions\n- Production hardening is deferred.\n`;
  fs.writeFileSync(path.join(tempRoot,'docs/lightweight.md'), lightBody('FEAT-LITE','Lightweight Demo'));
  fs.writeFileSync(path.join(tempRoot,'docs/promote.md'), lightBody('FEAT-PROMO','Promotion Demo'));

  const identityPlan=run('entity-tool.mjs','identity-backfill');
  if(!identityPlan.includes('mode=dry-run')) throw new Error(`Identity backfill dry-run missing:
${identityPlan}`);
  run('entity-tool.mjs','identity-backfill',['--apply']);
  const identityStatus=run('entity-tool.mjs','identity-status');
  if(!identityStatus.includes('0 missing uid') || !identityStatus.includes('0 invalid uid') || !identityStatus.includes('0 duplicate uid')) throw new Error(`Identity hardening failed:
${identityStatus}`);
  const invalidTransition=run('entity-tool.mjs','transition',['--entity','FEAT-LITE','--to','implemented'],false);
  if(!invalidTransition.includes('is not allowed')) throw new Error(`Lifecycle transition guard failed:
${invalidTransition}`);
  const validTransition=run('entity-tool.mjs','transition',['--entity','FEAT-LITE','--to','in_progress']);
  if(!validTransition.includes('planned -> in_progress')) throw new Error(`Valid lifecycle transition failed:
${validTransition}`);

  const mappedSource=path.join(tempRoot,'apps/web/src/app/App.tsx');
  fs.appendFileSync(mappedSource,'\n// Project refs: FEAT-DEMO API-DEMO\n');
  const sourceScan=run('source-intelligence-tool.mjs','scan');
  if(!sourceScan.includes('indexed') || sourceScan.includes('indexed 0 file')) throw new Error(`Source intelligence scan did not index app source:
${sourceScan}`);
  const sourceMap=run('source-intelligence-tool.mjs','map',['--entity','FEAT-DEMO']);
  if(!sourceMap.includes('apps/web/src/app/App.tsx') || !sourceMap.includes('code-mention')) throw new Error(`Source-to-doc mapping failed:
${sourceMap}`);

  const reindex=run('knowledge-tool.mjs','reindex');
  if(!reindex.includes('Knowledge indexes:')) throw new Error(`Knowledge reindex failed:
${reindex}`);
  const search=run('knowledge-tool.mjs','search',['--text','Demo Feature']);
  if(!search.includes('FEAT-DEMO')) throw new Error(`Knowledge search did not find FEAT-DEMO:
${search}`);
  const query=run('knowledge-tool.mjs','query',['--expr','type=feature AND status=planned']);
  if(!query.includes('FEAT-DEMO') || !query.includes('FEAT-PROMO')) throw new Error(`Knowledge query mismatch:
${query}`);
  const context=run('knowledge-tool.mjs','context',['--entity','FEAT-DEMO','--max-depth','2']);
  if(!context.includes('sourceEvidence') || !context.includes('APP-WEB')) throw new Error(`Context pack missing graph/source evidence:
${context}`);
  const doctor=run('doctor-tool.mjs','run');
  if(!doctor.includes('Doctor: 0 error(s)')) throw new Error(`Doctor reported unexpected errors:
${doctor}`);

  const gitRun=(argv)=>{const r=spawnSync('git',['-C',tempRoot,...argv],{encoding:'utf8'});if(r.status!==0)throw new Error(`git ${argv.join(' ')} failed\n${r.stdout||''}${r.stderr||''}`);return (r.stdout||'')+(r.stderr||'');};
  gitRun(['init']); gitRun(['config','user.email','e2e@example.invalid']); gitRun(['config','user.name','E2E']); gitRun(['add','.']); gitRun(['commit','-m','baseline']);
  fs.appendFileSync(mappedSource,'// source intelligence change probe\n');
  const gitImpact=run('source-intelligence-tool.mjs','git-impact');
  if(!gitImpact.includes('FEAT-DEMO') || !gitImpact.includes('APP-WEB')) throw new Error(`Git impact did not propagate source mappings into project graph:
${gitImpact}`);
  const doctorStale=run('doctor-tool.mjs','run');
  if(!doctorStale.includes('SOURCE_INDEX_STALE')) throw new Error(`Doctor did not detect stale source index:
${doctorStale}`);
  run('doctor-tool.mjs','run',['--fix']);

  const lightCheck=run('spec-tool.mjs','check',['--feature','FEAT-LITE']);
  if(!lightCheck.includes('effective=lightweight') || !lightCheck.includes('SPEC FEAT-LITE: PASS')) throw new Error(`Lightweight spec did not pass minimal profile:\n${lightCheck}`);
  const lightReady=run('gate-tool.mjs','ready',['--feature','FEAT-LITE']);
  if(!lightReady.includes('READY FEAT-LITE: PASS')) throw new Error(`Lightweight Ready gate should not require Requirement/Test entities:\n${lightReady}`);

  const promoGap=run('spec-tool.mjs','promote',['--feature','FEAT-PROMO','--to','standard']);
  if(!promoGap.includes('SPEC_RELATION_MIN:requirements') || !promoGap.includes('SPEC_RELATION_MIN:tests')) throw new Error(`Promotion gap report did not identify Standard gaps:\n${promoGap}`);
  const promoBlocked=run('spec-tool.mjs','promote',['--feature','FEAT-PROMO','--to','standard','--apply'],false);
  if(!promoBlocked.includes('PROMOTION_NOT_READY')) throw new Error(`Promotion apply should be blocked while gaps remain:\n${promoBlocked}`);
  replace('docs/promote.md','  requirements: []','  requirements: [REQ-DEMO-001]');
  replace('docs/promote.md','  tests: []','  tests: [TC-DEMO-001]');
  const promoApply=run('spec-tool.mjs','promote',['--feature','FEAT-PROMO','--to','standard','--apply']);
  if(!promoApply.includes('Applied spec_level=standard')) throw new Error(`Promotion did not apply after gaps were resolved:\n${promoApply}`);
  run('gate-tool.mjs','ready',['--feature','FEAT-PROMO']);

  const lightPath=path.join(tempRoot,'docs/lightweight.md');
  const originalLight=fs.readFileSync(lightPath,'utf8');
  fs.writeFileSync(lightPath,originalLight.replace('spec_level: lightweight','spec_level: auto').replace('Prototype the workflow quickly.','Prototype a payment workflow quickly.'));
  const autoRisk=run('spec-tool.mjs','recommend',['--feature','FEAT-LITE']);
  if(!autoRisk.includes('recommended=full') || !autoRisk.includes('financial-or-payment')) throw new Error(`Auto/risk recommendation did not escalate payment prototype:\n${autoRisk}`);
  fs.writeFileSync(lightPath,originalLight.replace('Prototype the workflow quickly.','Prototype a payment workflow quickly.'));
  const fixtureProfilePath=path.join(tempRoot,'project.profile.json');
  const fixtureProfile=JSON.parse(fs.readFileSync(fixtureProfilePath,'utf8')); fixtureProfile.documentation.riskEscalation='block'; fs.writeFileSync(fixtureProfilePath,JSON.stringify(fixtureProfile,null,2)+'\n');
  const riskBlocked=run('gate-tool.mjs','ready',['--feature','FEAT-LITE'],false);
  if(!riskBlocked.includes('SPEC_RISK_LEVEL')) throw new Error(`Block escalation did not stop under-specified payment Feature:\n${riskBlocked}`);
  fixtureProfile.documentation.riskEscalation='warn'; fs.writeFileSync(fixtureProfilePath,JSON.stringify(fixtureProfile,null,2)+'\n');
  fs.writeFileSync(lightPath,originalLight);

  run('docs-tool.mjs','validate');

  run('freshness-tool.mjs','reconcile',['--entity','FEAT-DEMO','--reviewer','E2E Reviewer']);
  const fresh=run('freshness-tool.mjs','check',['--entity','FEAT-DEMO']);
  if(!fresh.includes('FEAT-DEMO: FRESH')) throw new Error(`Expected fresh feature:\n${fresh}`);

  const reqPath=path.join(tempRoot,'docs/requirement.md');
  const originalReq=fs.readFileSync(reqPath,'utf8');
  fs.writeFileSync(reqPath,originalReq+'\nDependency drift probe.\n');
  const staleDoc=run('freshness-tool.mjs','check',['--entity','FEAT-DEMO'],false);
  if(!staleDoc.includes('FEAT-DEMO: STALE') || !staleDoc.includes('REQ-DEMO-001')) throw new Error(`Expected dependency-aware stale result:\n${staleDoc}`);
  const staleGate=run('gate-tool.mjs','ready',['--feature','FEAT-DEMO'],false);
  if(!staleGate.includes('DOCUMENT_FRESHNESS:stale')) throw new Error(`Ready gate did not block stale documentation:\n${staleGate}`);
  fs.writeFileSync(reqPath,originalReq);
  run('freshness-tool.mjs','check',['--entity','FEAT-DEMO']);

  const impact=run('impact-tool.mjs','analyze',['--entity','REQ-DEMO-001','--depth','3']);
  if(!impact.includes('[HIGH] FEAT-DEMO')) throw new Error(`Impact engine did not surface FEAT-DEMO as high impact:\n${impact}`);

  run('change-tool.mjs','audit-init',['--actor','E2E']);
  const ready=run('gate-tool.mjs','ready',['--feature','FEAT-DEMO']);
  if(!ready.includes('READY FEAT-DEMO: PASS')) throw new Error(`Ready gate did not pass:\n${ready}`);

  run('request-tool.mjs','create',['--code','REQST-E2E-001','--title','Demo change request','--kind','change','--summary','Trace the source request for the demo feature.']);
  run('request-tool.mjs','promote',['--request','REQST-E2E-001','--target','FEAT-DEMO']);
  const requestStale=run('freshness-tool.mjs','check',['--entity','FEAT-DEMO'],false);
  if(!requestStale.includes('REQST-E2E-001')) throw new Error(`Incoming request did not invalidate freshness:\n${requestStale}`);
  run('freshness-tool.mjs','reconcile',['--entity','FEAT-DEMO','--reviewer','E2E Reviewer','--note','Request reviewed and absorbed']);
  run('gate-tool.mjs','ready',['--feature','FEAT-DEMO']);

  const planId='WP-FEAT-DEMO-E2E';
  const scaffoldOut=run('plan-tool.mjs','scaffold',['--feature','FEAT-DEMO','--id',planId]);
  if(!scaffoldOut.includes('Spec level: standard')) throw new Error(`WorkPlan did not snapshot Standard spec level:\n${scaffoldOut}`);
  const planScaffold=JSON.parse(fs.readFileSync(path.join(tempRoot,'.project-docs/workplans',planId+'.json'),'utf8')); if(planScaffold.schemaVersion!=='1.2'||!planScaffold.applicationScope?.includes('APP-WEB')) throw new Error(`WorkPlan application scope mismatch: ${JSON.stringify(planScaffold.applicationScope)}`);
  run('plan-tool.mjs','validate',['--id',planId]);
  run('plan-tool.mjs','author-complete',['--id',planId,'--actor','E2E Author']);
  run('plan-tool.mjs','submit',['--id',planId]);

  fs.writeFileSync(reqPath,originalReq.replace('status: approved','status: draft'));
  const stalePlan=run('plan-tool.mjs','approve',['--id',planId,'--reviewer','E2E Reviewer'],false);
  if(!stalePlan.includes('STALE_CONTEXT')) throw new Error(`Expected STALE_CONTEXT, got:\n${stalePlan}`);
  fs.writeFileSync(reqPath,originalReq);

  run('plan-tool.mjs','approve',['--id',planId,'--reviewer','E2E Reviewer']);
  run('plan-tool.mjs','materialize',['--id',planId,'--owner','Engineering']);
  run('docs-tool.mjs','validate');
  const after=run('docs-tool.mjs','sync');
  if(!/13 entities, 20 typed edges/.test(after)) throw new Error(`Expected 13 entities / 20 edges after source workspace + progressive-spec + governance flow, got:\n${after}`);

  const cs1=run('change-tool.mjs','changeset-scan',['--actor','E2E','--reason','Request to approved WorkPlan and tasks','--related','FEAT-DEMO']);
  if(!/Created CHG-/.test(cs1)) throw new Error(`Expected first ChangeSet:\n${cs1}`);
  const csList=run('change-tool.mjs','changeset-list');
  if(!/CHG-/.test(csList)) throw new Error(`ChangeSet list is empty:\n${csList}`);

  run('change-tool.mjs','baseline-create',['--name','PRE-COMPLETE','--actor','E2E','--note','Before implementation completion']);
  const doneFail=run('gate-tool.mjs','done',['--feature','FEAT-DEMO'],false);
  if(!doneFail.includes('DONE FEAT-DEMO: FAIL')) throw new Error(`Expected Done gate failure before completion:\n${doneFail}`);

  replace('docs/feature.md','status: planned','status: implemented');
  replace('docs/test.md','status: ready','status: passed');
  for(const file of fs.readdirSync(path.join(tempRoot,'docs/22-tasks')).filter(x=>x.endsWith('.md'))) replace(`docs/22-tasks/${file}`,'status: ready','status: done');

  const implementationStale=run('freshness-tool.mjs','check',['--entity','FEAT-DEMO'],false);
  if(!implementationStale.includes('TC-DEMO-001')) throw new Error(`Test status change did not stale feature docs:\n${implementationStale}`);
  const doneStale=run('gate-tool.mjs','done',['--feature','FEAT-DEMO'],false);
  if(!doneStale.includes('DOCUMENT_FRESHNESS:stale')) throw new Error(`Done gate did not require documentation reconciliation:\n${doneStale}`);

  const baselineDiff=run('change-tool.mjs','baseline-compare',['--name','PRE-COMPLETE']);
  if(!/modified [1-9]/.test(baselineDiff)) throw new Error(`Expected baseline drift after completion:\n${baselineDiff}`);

  run('freshness-tool.mjs','reconcile',['--entity','FEAT-DEMO','--reviewer','E2E Reviewer','--note','Implementation and tests reconciled']);
  const donePass=run('gate-tool.mjs','done',['--feature','FEAT-DEMO']);
  if(!donePass.includes('DONE FEAT-DEMO: PASS')) throw new Error(`Expected Done gate pass after reconciliation:\n${donePass}`);

  const cs2=run('change-tool.mjs','changeset-scan',['--actor','E2E','--reason','Implementation completion and documentation reconciliation','--related','FEAT-DEMO']);
  if(!/Created CHG-/.test(cs2)) throw new Error(`Expected second ChangeSet:\n${cs2}`);
  run('docs-tool.mjs','validate');

  run('docs-tool.mjs','build');
  run('docs-tool.mjs','check-site');
  const specification=JSON.parse(fs.readFileSync(path.join(tempRoot,'docs/_generated/specification.json'),'utf8'));
  if((specification.summary?.lightweight||0)!==1 || (specification.summary?.standard||0)<2) throw new Error(`Specification summary mismatch: ${JSON.stringify(specification.summary)}`);
  const governance=JSON.parse(fs.readFileSync(path.join(tempRoot,'docs/_generated/governance.json'),'utf8'));
  if((governance.applications||[]).length!==2 || governance.requests.length!==1 || governance.tasks.length!==2 || governance.workplans.length!==1 || governance.changesets.length!==2 || governance.baselines.length!==1) throw new Error(`Governance summary mismatch: ${JSON.stringify(governance)}`);
  const featFresh=governance.freshness.find(x=>x.code==='FEAT-DEMO');
  if(!featFresh || featFresh.status!=='fresh') throw new Error(`Feature freshness summary mismatch: ${JSON.stringify(featFresh)}`);

  replace('docs/feature.md','TC-DEMO-001','TC-DEMO-MISSING');
  const negative=run('docs-tool.mjs','validate',[],false);
  if(!negative.includes('BROKEN_RELATION')) throw new Error(`Negative fixture failed for wrong reason:\n${negative}`);

  console.log('E2E regression: PASS (v5.6 workspace layout + v5.5 entity identity/lifecycle + semantic relations + Source Base + source intelligence/Git impact + search/query/context/doctor + Progressive Specs + governance + freshness + ChangeSets/Baselines + broken relation path).');
} finally {
  fs.rmSync(tempRoot,{recursive:true,force:true});
}
