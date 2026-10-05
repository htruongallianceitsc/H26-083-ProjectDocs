import { parseArgs } from '../lib/common.mjs';
import { scanSource, sourceMap, gitChangedPaths, gitImpact, loadSourceIndex } from '../lib/source-intelligence.mjs';

const action=process.argv[2]||'help'; const args=parseArgs(process.argv.slice(3));
function printRefs(refs){return (refs||[]).map(r=>`${r.code}:${r.kind}:${r.confidence}`).join(', ')||'-';}
try {
  if(action==='scan') { const idx=scanSource(); console.log(`Source intelligence: indexed ${idx.files.length} file(s) from ${idx.roots.length} root(s).`); }
  else if(action==='map') { const rows=sourceMap({path:args.path?String(args.path):null,ref:args.entity?String(args.entity):null}); if(!args.path&&!args.entity)throw new Error('Use --path FILE or --entity CODE_OR_UID'); console.log(`Source map: ${rows.length} file(s).`); for(const f of rows)console.log(`${f.path}\t${printRefs(f.entityRefs)}`); }
  else if(action==='status') { const idx=loadSourceIndex(); console.log(`Source index: ${idx.files?.length||0} file(s), generatedAt=${idx.generatedAt||'(unknown)'}`); }
  else if(action==='git-status') { const paths=gitChangedPaths({}); const idx=loadSourceIndex(); console.log(`Git changed files: ${paths.length}`); for(const p of paths){const f=(idx.files||[]).find(x=>x.path===p);console.log(`${p}\t${printRefs(f?.entityRefs)}`);} }
  else if(action==='git-impact') { const report=gitImpact({commit:args.commit?String(args.commit):null,from:args.from?String(args.from):null,to:args.to?String(args.to):null,depth:args.depth}); console.log(`Git impact: ${report.changedFiles.length} changed file(s), ${report.directEntities.length} direct entity match(es), ${report.impacted.length} potentially impacted entity(s).`); for(const x of report.impacted)console.log(`${x.level}\tdepth=${x.depth}\t${x.code}\troots=${(x.roots||[]).join(',')}`); }
  else console.log('source-intelligence commands: scan, status, map --path FILE|--entity REF, git-status, git-impact [--commit REF|--from REF --to REF] [--depth N]');
} catch(e){console.error(`[ERROR] ${e.message}`);process.exitCode=1;}
