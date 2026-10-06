import {
  startWireframeSession, buildWireframeArtifacts, createWireframeGap, updateWireframeGap,
  checkWireframes, wireframeStatus, closeWireframeSession
} from '../lib/wireframes.mjs';
import { createPromotionDraft, applyPromotionPlan } from '../lib/wireframe-promotions.mjs';

const [cmd,...rest]=process.argv.slice(2);
function args(xs){const o={};for(let i=0;i<xs.length;i++){const x=xs[i];if(!x.startsWith('--'))continue;const k=x.slice(2);const n=xs[i+1];if(!n||n.startsWith('--'))o[k]=true;else{o[k]=n;i++;}}return o;}
function list(v){return String(v||'').split(',').map(x=>x.trim()).filter(Boolean);}
function print(x){console.log(JSON.stringify(x,null,2));}
try{
  const a=args(rest);
  if(cmd==='start') print(startWireframeSession({feature:a.feature||null,module:a.module||null,screens:list(a.screens),formats:list(a.formats),reviewer:a.reviewer||null}));
  else if(cmd==='build') print(buildWireframeArtifacts());
  else if(cmd==='gap') print(createWireframeGap({screenCode:a.screen,kind:a.kind||'other',severity:a.severity||'warning',summary:a.summary,expected:a.expected||'',evidence:a.evidence||undefined,targets:list(a.targets)}));
  else if(cmd==='resolve') print(updateWireframeGap({proposalId:a.proposal,status:a.status,reviewer:a.reviewer||null,note:a.note||''}));
  else if(cmd==='promote'){
    if(a.apply) print(applyPromotionPlan({proposalId:a.proposal,planFile:a.plan,overwrite:!!a.overwrite,reviewer:a.reviewer||'wireframe-promotion'}));
    else print(createPromotionDraft({proposalId:a.proposal,preset:a.preset||null,owner:a.owner||'Product & Engineering'}));
  }
  else if(cmd==='check'){const r=checkWireframes({force:!!a.force});print(r);if(!r.pass)process.exitCode=1;}
  else if(cmd==='status') print(wireframeStatus());
  else if(cmd==='close') print(closeWireframeSession({reviewer:a.reviewer||null,note:a.note||''}));
  else {console.log('wireframe-tool commands: start [--feature CODE|--module CODE|--screens A,B] [--formats text,ascii,html], build, gap --screen CODE --kind KIND --severity warning|high --summary TEXT [--expected TEXT] [--targets screen,requirement,flow], resolve --proposal ID --status open|accepted|rejected|resolved|waived [--reviewer NAME] [--note TEXT], promote --proposal ID [--preset startup-bootstrap] OR promote --proposal ID --plan path.json --apply [--reviewer NAME] [--overwrite], check [--force], status, close [--reviewer NAME] [--note TEXT]');process.exitCode=1;}
}catch(e){console.error(`[wireframe-tool] ${e.message}`);process.exitCode=1;}
