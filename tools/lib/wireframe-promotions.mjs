import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, loadJson, writeJson, ensureDir, scanEntities } from './common.mjs';

const TYPE_FOLDERS = {
  feature: 'docs/02-modules/_promoted',
  requirement: 'docs/03-requirements/functional',
  'business-rule': 'docs/04-business-rules',
  screen: 'docs/05-screens',
  flow: 'docs/06-flows/system',
  api: 'docs/07-api',
  'test-case': 'docs/11-quality/test-cases'
};
const SUPPORTED = new Set(Object.keys(TYPE_FOLDERS));
function cfg(){ return loadJson('registry/wireframe-workflow.json',{}); }
function now(){ return new Date().toISOString(); }
function today(){ return now().slice(0,10); }
function slug(v){ return String(v||'entity').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function proposalDir(){ return path.join(ROOT,cfg().review?.proposalDirectory||'.project-docs/wireframes/proposals'); }
function promotionDir(){ return path.join(ROOT,cfg().promotionDirectory||'.project-docs/wireframes/promotions'); }
function findProposal(id){
  ensureDir(proposalDir());
  const f=fs.readdirSync(proposalDir()).find(x=>x.endsWith('.json') && x.toLowerCase().includes(String(id||'').toLowerCase()));
  if(!f) throw new Error(`Proposal not found: ${id}`);
  return {file:path.join(proposalDir(),f),data:JSON.parse(fs.readFileSync(path.join(proposalDir(),f),'utf8'))};
}
function presetInfo(name){ return cfg().promotion?.presets?.[name] || null; }
function recommendedForGap(kind){
  const map={
    'missing-screen':['screen','feature','requirement','flow','test-case'],
    'missing-lifecycle-action':['screen','requirement','flow','test-case'],
    'missing-system-action':['screen','requirement','flow','test-case'],
    'missing-api-interaction':['screen','requirement','api','flow','test-case'],
    'startup-flow-gap':['feature','screen','requirement','flow','api','test-case'],
    'feature-gap':['feature','requirement'], 'requirement-gap':['requirement','test-case'],
    'business-rule-gap':['business-rule','requirement','test-case'], 'test-gap':['test-case']
  };
  return map[kind] || ['screen','requirement'];
}
export function createPromotionDraft({proposalId,preset=null,owner='Product & Engineering'}={}){
  const {data:p}=findProposal(proposalId);
  if(cfg().promotion?.requireAcceptedGap!==false && p.status!=='accepted') throw new Error(`Proposal ${p.id} must be accepted before promotion drafting.`);
  const pi=preset?presetInfo(preset):null;
  if(preset && !pi) throw new Error(`Unknown promotion preset: ${preset}`);
  const draft={
    schemaVersion:'1.0',proposalId:p.id,preset:preset||null,status:'draft',requiresAuthoring:true,owner,
    createdAt:now(),updatedAt:now(),sourceGap:{screenCode:p.screenCode,kind:p.kind,summary:p.summary,expected:p.expected||'',evidence:p.evidence||''},
    authoringQuestions:pi?.authoringQuestions||[
      'Which canonical entities must change or be created?',
      'What exact codes/titles/relations should be used?',
      'Which behaviours remain TBD and must become Open Questions?'
    ],
    suggestedEntityTypes:pi?.suggestedEntityTypes||recommendedForGap(p.kind),entities:[]
  };
  ensureDir(promotionDir());
  const out=path.join(promotionDir(),`${p.id.toLowerCase()}.json`); writeJson(out,draft);
  return {...draft,promotionFile:path.relative(ROOT,out).replaceAll('\\','/')};
}
function yamlValue(v){
  if(Array.isArray(v)) return `[${v.map(x=>String(x)).join(', ')}]`;
  if(typeof v==='boolean') return String(v);
  return String(v??'');
}
function frontmatter(e,plan){
  const owner=e.owner||plan.owner||'Product & Engineering'; const d=today();
  const lines=['---',`uid: ${crypto.randomUUID()}`,`code: ${e.code}`,'revision: 1',`type: ${e.type}`,`title: ${e.title}`,`status: ${e.status||'draft'}`,`owner: ${owner}`,`created_at: ${d}`,`updated_at: ${d}`,`last_reviewed_at: ${d}`,'tags: [wireframe-promotion]'];
  if(e.route) lines.push(`route: ${e.route}`);
  if(e.method) lines.push(`method: ${e.method}`);
  if(e.apiPath) lines.push(`path: ${e.apiPath}`);
  lines.push('related:');
  const rel=e.related&&typeof e.related==='object'?e.related:{};
  const keys=['applications','modules','features','requirements','business_rules','screens','flows','apis','database_objects','tests','nfrs','open_questions','decisions'];
  for(const k of keys) lines.push(`  ${k}: ${yamlValue(rel[k]||[])}`);
  lines.push('---',''); return lines.join('\n');
}
function defaultBody(e){
  const title=e.title;
  if(e.type==='feature') return `# ${title}\n\n## 1. Overview\n\nTBD — promoted from a reviewed Screen-first gap.\n\n## 5. Trigger\n\nTBD\n\n## 6. Main Flow\n\nTBD\n\n## 8. Error / Exception Flows\n\nTBD\n\n## 10. Screens / Routes\n\nTBD\n\n## 11. APIs\n\nTBD\n\n## 16. Acceptance Summary\n\nTBD\n\n## 20. Open Questions\n\n- Confirm unresolved behaviour before implementation.\n`;
  if(e.type==='requirement') return `# ${title}\n\n## Statement\n\nTBD\n\n## Type\nFunctional\n\n## Actor / Trigger\n\nTBD\n\n## Expected Behaviour\n\nTBD\n\n## Acceptance Criteria\n\n| ID | Type | Scenario | Criterion |\n|---|---|---|---|\n| AC-01 | happy-path | TBD | Given ... When ... Then ... |\n\n## Verification\n\nTBD\n`;
  if(e.type==='screen') return `# ${title}\n\n## Purpose\n\nTBD\n\n## Route\n\n${e.route||'TBD'}\n\n## Layout / Sections\n\n| Order | Region / Section | Component / Content | Visibility / State | Notes |\n|---:|---|---|---|---|\n\n## Fields\n\n| Field | Type | Required | Validation | Notes |\n|---|---|---:|---|---|\n\n## User Actions\n\n| Action | Control | Behaviour | Destination | Condition | Related Requirement |\n|---|---|---|---|---|---|\n\n## Lifecycle Actions\n\n| Event / Trigger | Action | API / Effect | Success | Failure | Related Requirement |\n|---|---|---|---|---|---|\n\n## System Actions\n\n| Action | Trigger / Owner | Effect | API / Data | Next State / Destination | Related Requirement |\n|---|---|---|---|---|---|\n\n## API Interactions\n\n| Trigger | API | Purpose | Loading State | Success | Failure | Related Requirement |\n|---|---|---|---|---|---|---|\n\n## UI States\n\n| State | Trigger | Visible Difference | Allowed Actions |\n|---|---|---|---|\n\n## Navigation Rules\n\n| Trigger | Destination | Condition | Back Behaviour |\n|---|---|---|---|\n\n## Open Questions / Mockup Gaps\n\n- Confirm unresolved behaviour before implementation.\n`;
  if(e.type==='flow') return `# ${title}\n\n## Purpose\n\nTBD\n\n## Preconditions\n\nTBD\n\n## Flow Diagram\n\n\`\`\`mermaid\nflowchart TD\n  A[Start] --> B[TBD]\n\`\`\`\n\n## Step Details\n\n| Step | Actor/System | Action | Rule/API/Screen | Result |\n|---|---|---|---|---|\n\n## Error / Retry Paths\n\nTBD\n\n## End States\n\nTBD\n`;
  if(e.type==='api') return `# ${title}\n\n## Purpose\n\nTBD\n\n## Endpoint\n- Method: \`${e.method||'TBD'}\`\n- Path: \`${e.apiPath||'TBD'}\`\n\n## Request\n\nTBD\n\n## Response\n\n### Success\nTBD\n\n### Errors\nTBD\n\n## Related Feature / Screen / Tests\n\nTBD\n`;
  if(e.type==='test-case') return `# ${title}\n\n## Objective\n\nTBD\n\n## Preconditions\n\nTBD\n\n## Steps\n\n| # | Action | Expected Result |\n|---|---|---|\n| 1 | TBD | TBD |\n\n## Priority\n\nTBD\n`;
  if(e.type==='business-rule') return `# ${title}\n\n## Rule\n\nTBD\n\n## Rationale\n\nTBD\n\n## Positive Case\n\nTBD\n\n## Negative Case\n\nTBD\n`;
  return `# ${title}\n\nTBD\n`;
}
function entityPath(e){
  if(e.path){
    const rel=String(e.path).replaceAll('\\','/').replace(/^\.\//,'');
    if(!rel.startsWith('docs/')) throw new Error(`Promotion entity path must stay under docs/: ${e.path}`);
    return rel;
  }
  return `${TYPE_FOLDERS[e.type]}/${e.code}.md`;
}
function validatePlan(plan){
  if(plan.schemaVersion!=='1.0') throw new Error('Promotion plan schemaVersion must be 1.0.');
  if(plan.requiresAuthoring || plan.status==='draft') throw new Error('Promotion plan still requires authoring. Set requiresAuthoring=false and status=authored after review.');
  if(!Array.isArray(plan.entities)||!plan.entities.length) throw new Error('Promotion plan must contain at least one authored entity.');
  const seen=new Set();
  for(const e of plan.entities){
    if(!SUPPORTED.has(e.type)) throw new Error(`Unsupported promotion entity type: ${e.type}`);
    if(!e.code||!e.title) throw new Error('Each promotion entity requires type, code, and title.');
    if(seen.has(e.code)) throw new Error(`Duplicate promotion entity code: ${e.code}`); seen.add(e.code);
    if(e.type==='api' && (!e.method||!e.apiPath)) throw new Error(`API ${e.code} requires method and apiPath.`);
  }
}
export function applyPromotionPlan({proposalId,planFile,overwrite=false,reviewer='wireframe-promotion'}={}){
  const prop=findProposal(proposalId); const p=prop.data;
  if(p.status!=='accepted') throw new Error(`Proposal ${p.id} must be accepted before apply.`);
  if(!planFile) throw new Error('--plan is required when --apply is used.');
  const pp=path.isAbsolute(planFile)?planFile:path.join(ROOT,planFile);
  if(!fs.existsSync(pp)) throw new Error(`Promotion plan not found: ${planFile}`);
  const plan=JSON.parse(fs.readFileSync(pp,'utf8')); if(plan.proposalId!==p.id) throw new Error(`Plan proposalId ${plan.proposalId} does not match ${p.id}.`); validatePlan(plan);
  const existing=new Map(scanEntities().entities.map(e=>[e.code,e])); const created=[];
  for(const e of plan.entities){
    const rel=entityPath(e); const out=path.join(ROOT,rel);
    if((existing.has(e.code)||fs.existsSync(out))&&!overwrite) throw new Error(`Entity already exists: ${e.code}. Use an explicit reviewed edit/proposal or --overwrite if replacement is truly intended.`);
    ensureDir(path.dirname(out)); fs.writeFileSync(out,frontmatter(e,plan)+(e.body?.trim()?e.body.trim()+'\n':defaultBody(e)));
    created.push({type:e.type,code:e.code,path:rel});
  }
  plan.status='applied'; plan.appliedAt=now(); plan.appliedBy=reviewer; plan.requiresAuthoring=false; plan.createdEntities=created;
  fs.writeFileSync(pp,JSON.stringify(plan,null,2)+'\n');
  p.status='resolved'; p.updatedAt=now(); p.resolution={status:'resolved',reviewer,note:`Applied authored promotion plan ${path.relative(ROOT,pp).replaceAll('\\','/')}.`,at:now(),createdEntities:created};
  fs.writeFileSync(prop.file,JSON.stringify(p,null,2)+'\n');
  return {proposalId:p.id,planFile:path.relative(ROOT,pp).replaceAll('\\','/'),created};
}
