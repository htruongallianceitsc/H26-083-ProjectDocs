import { parseArgs } from '../lib/common.mjs';
import { workspaceSnapshot, saveAuditState, createChangeset, listJsonRecords, changesetDir, loadChangeset, createBaseline, baselineDir, compareBaseline } from '../lib/change-history.mjs';
const action=process.argv[2]||'help'; const args=parseArgs(process.argv.slice(3));
function required(name){if(!args[name])throw new Error(`Missing --${name}`);return String(args[name]);}
function printChanges(changes){for(const c of changes)console.log(`[${c.kind.toUpperCase()}] ${c.path}${(c.after||c.before)?.code?` :: ${(c.after||c.before).code}`:''}`);}
try{
  if(action==='audit-init'){
    const files=workspaceSnapshot({includeContent:true});saveAuditState(files,String(args.actor||''));console.log(`Audit state initialized with ${Object.keys(files).length} canonical file(s).`);
  } else if(action==='changeset-scan'){
    const actor=required('actor');const reason=required('reason');const related=args.related?([].concat(args.related)):[];const cs=createChangeset({actor,reason,related,id:args.id});
    if(!cs)console.log('No semantic changes detected; ChangeSet not created.');else{console.log(`Created ${cs.id}: ${cs.summary.count} change(s).`);printChanges(cs.changes);}
  } else if(action==='changeset-list'){
    const rows=listJsonRecords(changesetDir());if(!rows.length)console.log('No ChangeSets.');else for(const x of rows)console.log(`${x.id}\t${x.createdAt}\t${x.actor}\t${x.summary?.count||0}\t${x.reason}`);
  } else if(action==='changeset-show'){
    console.log(JSON.stringify(loadChangeset(required('id')),null,2));
  } else if(action==='baseline-create'){
    const b=createBaseline({name:required('name'),actor:required('actor'),note:String(args.note||'')});console.log(`Created baseline ${b.id}: ${b.summary.files} file(s), ${b.summary.entities} entity record(s).`);
  } else if(action==='baseline-list'){
    const rows=listJsonRecords(baselineDir());if(!rows.length)console.log('No baselines.');else for(const x of rows)console.log(`${x.id}\t${x.createdAt}\t${x.actor}\t${x.note||''}`);
  } else if(action==='baseline-compare'){
    const r=compareBaseline(required('name'));console.log(`Baseline ${r.baseline.id}: ${r.summary.count} drift(s) (added ${r.summary.byKind.added||0}, modified ${r.summary.byKind.modified||0}, deleted ${r.summary.byKind.deleted||0}).`);printChanges(r.changes);if(args.json)console.log(JSON.stringify(r,null,2));
  } else {console.log('change-tool commands: audit-init, changeset-scan, changeset-list, changeset-show, baseline-create, baseline-list, baseline-compare');process.exitCode=1;}
}catch(error){console.error(`[ERROR] ${error.message}`);process.exitCode=1;}
