import fs from 'node:fs';
import path from 'node:path';
import { ROOT, parseArgs, findEntityByCode, writeMarkdownEntity } from '../lib/common.mjs';
import { evaluateGate, featureContext, featureContextHash, listWorkplans, loadWorkplan, saveWorkplan, validateWorkplan, workplanPath } from '../lib/governance.mjs';
import { resolveSpec } from '../lib/specification.mjs';

const action = process.argv[2] || 'help';
const args = parseArgs(process.argv.slice(3));
const now = () => new Date().toISOString();
const today = () => now().slice(0,10);
function required(name) { if (!args[name]) throw new Error(`Missing --${name}`); return String(args[name]); }
function nextPlanId(featureCode) {
  const base = `WP-${featureCode}-${today().replaceAll('-','')}`.toUpperCase().replace(/[^A-Z0-9-]/g,'-');
  const existing = new Set(listWorkplans().map(x => x.id));
  if (!existing.has(base)) return base;
  let i=2; while(existing.has(`${base}-${i}`)) i++; return `${base}-${i}`;
}
function taskCode(featureCode, suffix) { return `TASK-${featureCode}-${suffix}`.toUpperCase().replace(/[^A-Z0-9-]/g,'-'); }
function scaffold() {
  const featureCode = required('feature');
  const context = featureContext(featureCode);
  const id = String(args.id || nextPlanId(featureCode));
  if (fs.existsSync(workplanPath(id))) throw new Error(`WorkPlan already exists: ${id}`);
  const related = context.feature.related || {};
  const spec = resolveSpec(featureCode);
  const created = now();
  const plan = {
    id, schemaVersion:'1.2', featureCode, title:String(args.title || `Implementation plan for ${context.feature.title}`),
    specLevel:spec.effectiveLevel, requestedSpecLevel:spec.requestedLevel, targetMaturity:spec.targetMaturity, recommendedSpecLevel:spec.recommendedLevel,
    specAssessment:{belowRecommended:spec.belowRecommended,enforcement:spec.enforcement,riskMatches:spec.riskMatches},
    applicationScope:related.applications||[],
    status:'draft', createdAt:created, updatedAt:created, requiresAuthoring:true,
    assumptions:[], risks:[], acceptanceCriteria:[`Implement ${context.feature.title} according to approved documentation.`,`Pass all linked test cases and satisfy the Done gate.`],
    context, submittedContextHash:null, review:{},
    tasks:[
      {code:taskCode(featureCode,'IMPL-001'),title:`Implement ${context.feature.title}`,kind:'implementation',description:'Implement the approved feature scope. Split this task further when multiple independently reviewable technical changes are required.',related:{features:[featureCode],requirements:related.requirements||[],screens:related.screens||[],apis:related.apis||[],database_objects:related.database_objects||[],applications:related.applications||[],requests:context.requests.map(x=>x.code)}},
      {code:taskCode(featureCode,'VERIFY-001'),title:`Verify ${context.feature.title}`,kind:'verification',description:'Run and reconcile the linked acceptance/test coverage, then update documentation before closing the feature.',related:{features:[featureCode],tests:related.tests||[],applications:related.applications||[],requests:context.requests.map(x=>x.code)}}
    ], materializedTaskCodes:[]
  };
  saveWorkplan(plan);
  console.log(`Scaffolded ${id} at ${path.relative(ROOT,workplanPath(id)).replaceAll(path.sep,'/')}`);
  console.log(`Spec level: ${spec.effectiveLevel} (requested=${spec.requestedLevel}, maturity=${spec.targetMaturity}, recommended=${spec.recommendedLevel})`);
  if(spec.belowRecommended) console.log(`WARNING: selected spec level is below recommendation; enforcement=${spec.enforcement}.`);
  console.log('requiresAuthoring=true: review assumptions, risks, acceptance criteria and task breakdown before author-complete/submit.');
}
function validate() {
  const id=required('id'); const plan=loadWorkplan(id); const errors=validateWorkplan(plan);
  console.log(`WorkPlan ${id}: ${errors.length} validation error(s)`); errors.forEach(e=>console.log(`[ERROR] ${e}`));
  if(errors.length) process.exitCode=1;
}
function authorComplete() {
  const id=required('id'); const actor=required('actor'); const plan=loadWorkplan(id); const errors=validateWorkplan(plan);
  if(errors.length) throw new Error(`WorkPlan invalid: ${errors.join('; ')}`);
  if(plan.status!=='draft') throw new Error(`author-complete requires draft status; got ${plan.status}`);
  plan.requiresAuthoring=false; plan.authoringCompletedBy=actor; plan.authoringCompletedAt=now(); saveWorkplan(plan);
  console.log(`Authoring complete for ${id} by ${actor}`);
}
function submit() {
  const id=required('id'); const plan=loadWorkplan(id); const errors=validateWorkplan(plan);
  if(errors.length) throw new Error(`WorkPlan invalid: ${errors.join('; ')}`);
  if(plan.status!=='draft') throw new Error(`submit requires draft status; got ${plan.status}`);
  if(plan.requiresAuthoring) throw new Error('WorkPlan still requires authoring; review it and run author-complete first.');
  const gate=evaluateGate('ready',plan.featureCode);
  if(!gate.pass) throw new Error(`READY_GATE_FAILED: ${gate.checks.filter(x=>!x.pass).map(x=>x.code).join(', ')}`);
  const spec=resolveSpec(plan.featureCode); plan.specLevel=spec.effectiveLevel; plan.requestedSpecLevel=spec.requestedLevel; plan.targetMaturity=spec.targetMaturity; plan.recommendedSpecLevel=spec.recommendedLevel; plan.specAssessment={belowRecommended:spec.belowRecommended,enforcement:spec.enforcement,riskMatches:spec.riskMatches};
  plan.applicationScope=(featureContext(plan.featureCode).feature.related?.applications)||[]; plan.status='submitted'; plan.submittedAt=now(); plan.submittedContextHash=featureContextHash(plan.featureCode); plan.context=featureContext(plan.featureCode); saveWorkplan(plan);
  console.log(`Submitted ${id}; context hash ${plan.submittedContextHash}`);
}
function approve() {
  const id=required('id'); const reviewer=required('reviewer'); const plan=loadWorkplan(id);
  if(plan.status!=='submitted') throw new Error(`approve requires submitted status; got ${plan.status}`);
  const current=featureContextHash(plan.featureCode);
  if(current!==plan.submittedContextHash) throw new Error(`STALE_CONTEXT: ${plan.featureCode} documentation changed after submission. Refresh/re-author the WorkPlan before approval.`);
  plan.status='approved'; plan.review={status:'approved',reviewer,reviewedAt:now(),note:String(args.note||'')}; saveWorkplan(plan);
  console.log(`Approved ${id} by ${reviewer}`);
}
function reject() {
  const id=required('id'); const reviewer=required('reviewer'); const plan=loadWorkplan(id);
  if(plan.status!=='submitted') throw new Error(`reject requires submitted status; got ${plan.status}`);
  plan.status='rejected'; plan.review={status:'rejected',reviewer,reviewedAt:now(),note:String(args.note||'')}; saveWorkplan(plan);
  console.log(`Rejected ${id} by ${reviewer}`);
}
function materialize() {
  const id=required('id'); const plan=loadWorkplan(id);
  if(plan.status!=='approved') throw new Error(`materialize requires approved status; got ${plan.status}`);
  const current=featureContextHash(plan.featureCode);
  if(current!==plan.submittedContextHash) throw new Error(`STALE_CONTEXT: ${plan.featureCode} documentation changed after approval; do not materialize stale tasks.`);
  const created=[];
  for(const task of plan.tasks){
    if(findEntityByCode(task.code)) throw new Error(`Task entity already exists: ${task.code}`);
    const meta={code:task.code,type:'task',title:task.title,status:'ready',owner:String(args.owner||'Engineering'),created_at:today(),updated_at:today(),last_reviewed_at:today(),task_kind:task.kind,workplan_id:plan.id,related:task.related||{}};
    const body=`# ${task.title}\n\n## Objective\n\n${task.description}\n\n## Source WorkPlan\n\n- WorkPlan: \`${plan.id}\`\n- Feature: \`${plan.featureCode}\`\n\n## Acceptance Criteria\n\n${(plan.acceptanceCriteria||[]).map(x=>`- ${x}`).join('\n')}\n\n## Implementation Notes\n\nRecord implementation-specific notes without redefining canonical requirements or business rules.\n\n## Completion Evidence\n\n- Tests / verification:\n- Documentation reconciliation:\n- Reviewer:\n`;
    const rel=`docs/22-tasks/${task.code.toLowerCase()}.md`; writeMarkdownEntity(rel,meta,body); created.push(task.code);
  }
  plan.status='materialized'; plan.materializedAt=now(); plan.materializedTaskCodes=created; saveWorkplan(plan);
  console.log(`Materialized ${created.length} task(s) from ${id}: ${created.join(', ')}`);
}
function list() { const plans=listWorkplans(); if(!plans.length){console.log('No WorkPlans.');return;} for(const p of plans)console.log(`${p.id}\t${p.status}\t${p.featureCode}\t${p.title}`); }
function show(){const p=loadWorkplan(required('id'));console.log(JSON.stringify(p,null,2));}

try{
  if(action==='scaffold')scaffold(); else if(action==='validate')validate(); else if(action==='author-complete')authorComplete(); else if(action==='submit')submit(); else if(action==='approve')approve(); else if(action==='reject')reject(); else if(action==='materialize')materialize(); else if(action==='list')list(); else if(action==='show')show(); else console.log('plan-tool commands: scaffold --feature CODE, validate --id ID, author-complete --id ID --actor NAME, submit --id ID, approve/reject --id ID --reviewer NAME, materialize --id ID, list, show --id ID');
}catch(error){console.error(`[ERROR] ${error.message}`);process.exitCode=1;}
