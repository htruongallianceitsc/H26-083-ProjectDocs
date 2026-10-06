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
  writeJson(path.join(temp,'kit/registry/wireframe-workflow.json'),{
    schemaVersion:'1.2',runtimeDirectory:'.project-docs/wireframes',generatedDirectory:'docs/_generated/wireframes',combinedHtml:'docs/_generated/SCREEN_WIREFRAMES.html',promotionDirectory:'.project-docs/wireframes/promotions',
    mode:{optional:true,activeByDefault:false,sourceOfTruth:'canonical-docs'},formats:{default:['text','ascii','html']},
    projection:{safePlaceholderDerivation:true,primaryVisibleStateDefault:'Success / Data Ready'},visual:{defaultPlatformWhenUnknown:'web-desktop',platformProfiles:{'web-desktop':{width:1440,height:900,frame:'browser',maxRenderWidth:1180},mobile:{width:390,height:844,frame:'device',maxRenderWidth:390}}},
    review:{proposalDirectory:'.project-docs/wireframes/proposals',allowedGapKinds:['missing-action','startup-flow-gap','missing-lifecycle-action','missing-api-interaction','missing-display-profile','missing-layout-region','missing-component','screen-layout-too-vague','other']},
    promotion:{requireAcceptedGap:true,presets:{'startup-bootstrap':{suggestedEntityTypes:['feature','screen','requirement','flow','api','test-case'],authoringQuestions:['Confirm failure strategy.']}}},
    validation:{checkOnlyWhenSessionActive:true,staleProjectionSeverity:'high',acceptedGapUnresolvedSeverity:'high',openGapSeverity:'warning',missingRouteSeverity:'warning',screenWithoutActionsSeverity:'warning',screenWithoutNavigationSeverity:'warning',missingDisplayProfileSeverity:'warning',missingViewportSeverity:'warning',missingPrimaryStateSeverity:'warning',missingVisualRegionsSeverity:'warning',missingVisibleComponentsSeverity:'warning',vagueLayoutSeverity:'warning',blockSeverities:['high','error']}
  });
  const login=path.join(temp,'docs/05-screens/scr-login.md');
  fs.writeFileSync(login,`---\nuid: 00000000-0000-4000-8000-000000000001\ncode: SCR-AUTH-LOGIN\nrevision: 1\ntype: screen\ntitle: Login\nstatus: draft\nroute: /login\nrelated:\n  features: [FEAT-AUTH-LOGIN]\n  requirements: [REQ-AUTH-LOGIN]\n---\n\n# Login\n\n## Purpose\nSign in to the application.\n\n## Layout / Sections\n| Order | Region / Section | Component / Content | Visibility / State | Notes |\n|---:|---|---|---|---|\n| 1 | Main | Login form | Default | |\n\n## Fields\n| Field | Type | Required | Validation | Notes |\n|---|---|---:|---|---|\n| Email | text | true | valid email | |\n| Password | password | true | required | |\n\n## User Actions\n| Action | Control | Behaviour | Destination | Condition | Related Requirement |\n|---|---|---|---|---|---|\n| Sign in | button | Authenticate | SCR-HOME | valid form | REQ-AUTH-LOGIN |\n\n## UI States\n- Initial\n- Loading\n- Error\n\n## Navigation Rules\n| Trigger | Destination | Condition | Back Behaviour |\n|---|---|---|---|\n| Sign in success | SCR-HOME | authenticated | none |\n\n## Open Questions / Mockup Gaps\n- Confirm remember-me requirement.\n`);
  const splash=path.join(temp,'docs/05-screens/scr-splash.md');
  fs.writeFileSync(splash,`---\nuid: 00000000-0000-4000-8000-000000000002\ncode: SCR-APP-SPLASH\nrevision: 1\ntype: screen\ntitle: Splash\nstatus: draft\nroute: startup\nrelated:\n  features: [FEAT-APP-STARTUP]\n  requirements: [REQ-APP-STARTUP-001]\n  apis: [API-APP-GET-CONFIG]\n---\n\n# Splash\n\n## Purpose\nShow logo while loading mandatory app configuration.\n\n## Visual Display Profile\n| Property | Value | Notes |\n|---|---|---|\n| Platform | mobile | |\n| Viewport | 390x844 | |\n| Primary Visible State | Loading | |\n| Canvas Mode | centered-form | |\n| Density | low | |\n\n## Visual Layout Regions\n| Region ID | Parent | Position | Layout | Size | Purpose / Content | Notes |\n|---|---|---|---|---|---|---|\n| main | root | main | column | fluid | Centered startup content | |\n\n## Visible Components\n| Region | Component ID | Type | Placeholder / Label | Size / Span | Count | Content / Role | Visibility / State | Notes |\n|---|---|---|---|---|---:|---|---|---|\n| main | brand-logo | logo | Todo App | auto | 1 | Product logo | Loading | |\n| main | startup-loading | loading | Loading configuration | full | 1 | Startup progress | Loading | |\n\n## Hidden / Secondary UI\n| UI | Trigger | Type | Description | Related Action / Requirement |\n|---|---|---|---|---|\n| config-error | API failure | state | Error detail/retry UI is reviewed outside the primary Loading canvas | REQ-APP-STARTUP-001 |\n\n## Layout / Sections\n| Order | Region / Section | Component / Content | Visibility / State | Notes |\n|---:|---|---|---|---|\n| 1 | Center | Logo + loading indicator | Loading | |\n\n## User Actions\n\n## Lifecycle Actions\n| Event / Trigger | Action | API / Effect | Success | Failure | Related Requirement |\n|---|---|---|---|---|---|\n| onEnter | Load app config | GET /config | Navigate SCR-TODO-LIST | Show config error state | REQ-APP-STARTUP-001 |\n\n## System Actions\n| Action | Trigger / Owner | Effect | API / Data | Next State / Destination | Related Requirement |\n|---|---|---|---|---|---|\n| Save config | Config API success | Cache runtime config | API-APP-GET-CONFIG | SCR-TODO-LIST | REQ-APP-STARTUP-001 |\n\n## API Interactions\n| Trigger | API | Purpose | Loading State | Success | Failure | Related Requirement |\n|---|---|---|---|---|---|---|\n| onEnter | API-APP-GET-CONFIG | Load mandatory config | Loading | Save config | Error | REQ-APP-STARTUP-001 |\n\n## UI States\n- Loading\n- Config Error\n\n## Navigation Rules\n| Trigger | Destination | Condition | Back Behaviour |\n|---|---|---|---|\n| Config loaded | SCR-TODO-LIST | required config available | none |\n`);
  run(['start','--screens','SCR-AUTH-LOGIN,SCR-APP-SPLASH']);
  run(['build']);
  const html=path.join(temp,'docs/_generated/SCREEN_WIREFRAMES.html');
  const ascii=path.join(temp,'docs/_generated/wireframes/scr-app-splash.ascii.txt');
  const spec=path.join(temp,'.project-docs/wireframes/specs/scr-app-splash.json');
  const htmlText=fs.readFileSync(html,'utf8');
  if(!fs.existsSync(html)||!htmlText.includes('Functional screen contract'))throw new Error('Combined HTML missing functional contract.');
  if(!htmlText.includes('Primary visible state')||!htmlText.includes('wf-logo')||!htmlText.includes('390 × 844'))throw new Error('Visual HTML missing mobile viewport/component placeholders.');
  if(!fs.existsSync(ascii)||!fs.readFileSync(ascii,'utf8').includes('GET /config'))throw new Error('ASCII renderer missing lifecycle/API detail.');
  const splashSpec=JSON.parse(fs.readFileSync(spec,'utf8'));
  if(splashSpec.lifecycleActions.length!==1||splashSpec.apiInteractions.length!==1)throw new Error('Semantic spec missing lifecycle/API arrays.');
  if(splashSpec.schemaVersion!=='1.2'||splashSpec.displayProfile.platform!=='mobile'||splashSpec.visibleComponents.length!==2)throw new Error('Visual semantic spec missing v5.13 profile/components.');
  const clean=JSON.parse(run(['check']));
  if(clean.findings.some(x=>x.screenCode==='SCR-APP-SPLASH'&&x.code==='SCREEN_ACTIONS_TBD'))throw new Error('Lifecycle-only Splash must count as having actions.');

  const gapOut=JSON.parse(run(['gap','--screen','SCR-APP-SPLASH','--kind','startup-flow-gap','--severity','high','--summary','Startup flow needs canonical Feature/Requirement/Flow/API/Test coverage.']));
  run(['resolve','--proposal',gapOut.id,'--status','accepted','--reviewer','E2E']);
  run(['check'],1);
  const draft=JSON.parse(run(['promote','--proposal',gapOut.id,'--preset','startup-bootstrap']));
  if(!draft.requiresAuthoring||!draft.suggestedEntityTypes.includes('api'))throw new Error('Promotion draft did not preserve authoring gate/preset.');
  const planPath=path.join(temp,'.project-docs/wireframes/promotions/authored-startup.json');
  writeJson(planPath,{schemaVersion:'1.0',proposalId:gapOut.id,preset:'startup-bootstrap',status:'authored',requiresAuthoring:false,owner:'E2E',authoringQuestions:[],suggestedEntityTypes:['requirement','flow'],entities:[
    {type:'requirement',code:'REQ-APP-STARTUP-002',title:'Load startup configuration',related:{screens:['SCR-APP-SPLASH']}},
    {type:'flow',code:'FLOW-APP-STARTUP',title:'App startup flow',related:{screens:['SCR-APP-SPLASH'],requirements:['REQ-APP-STARTUP-002']}}
  ]});
  run(['promote','--proposal',gapOut.id,'--plan',path.relative(temp,planPath).replaceAll('\\','/'),'--apply','--reviewer','E2E']);
  if(!fs.existsSync(path.join(temp,'docs/03-requirements/functional/REQ-APP-STARTUP-002.md')))throw new Error('Promotion apply did not create requirement.');
  run(['check']);
  fs.appendFileSync(splash,'\n<!-- semantic change -->\n');
  run(['check'],1);
  run(['build']);
  run(['check']);
  run(['close','--reviewer','E2E']);
  console.log('Wireframe E2E: PASS (platform-aware visual placeholders + lifecycle/system/API contract -> governed gap/promotion -> stale detection -> close).');
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
