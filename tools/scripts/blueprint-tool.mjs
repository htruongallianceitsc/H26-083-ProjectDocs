import { parseArgs } from '../lib/common.mjs';
import { initBlueprint, expandBlueprint, reviewBlueprintCandidate, promoteBlueprint, compileBlueprint, renderBlueprintFile, blueprintStatus, diffBlueprint, reconcileBlueprint, checkBlueprint } from '../lib/blueprint-projection.mjs';
const cmd=process.argv[2]||'help';const a=parseArgs(process.argv.slice(3));
function print(x){console.log(JSON.stringify(x,null,2));}
try{
  if(cmd==='init') print(initBlueprint());
  else if(cmd==='expand') print(expandBlueprint({profile:a.profile||'standard'}));
  else if(cmd==='review') print(reviewBlueprintCandidate({candidateId:a.candidate,decision:a.decision,reviewer:a.reviewer,note:a.note||''}));
  else if(cmd==='promote') print(promoteBlueprint({candidateId:a.candidate||null,all:!!a.all,reviewer:a.reviewer||''}));
  else if(cmd==='compile') print(compileBlueprint({profile:a.profile||null,audience:a.audience||null}));
  else if(cmd==='render') print({output:renderBlueprintFile({profile:a.profile||'standard',audience:a.audience||'general',output:a.output||null})});
  else if(cmd==='status') print(blueprintStatus());
  else if(cmd==='diff') print(diffBlueprint());
  else if(cmd==='reconcile') print(reconcileBlueprint({prefer:a.prefer||'linked',profile:a.profile||null,audience:a.audience||null}));
  else if(cmd==='check'){const r=checkBlueprint();print(r.status);if(!r.pass)process.exitCode=1;}
  else {console.log('blueprint-tool commands: init, expand --profile LEVEL, review --candidate ID --decision accepted|rejected --reviewer NAME, promote --candidate ID|--all, compile [--profile LEVEL --audience NAME], render --profile LEVEL --audience NAME [--output PATH], status, diff, reconcile [--prefer linked], check');process.exitCode=1;}
}catch(e){console.error('[ERROR] '+e.message);process.exitCode=1;}
