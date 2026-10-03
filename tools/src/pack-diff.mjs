import {parseArgs} from './lib/packs.mjs';
import {calculatePackDiff} from './lib/pack-diff.mjs';
process.on('uncaughtException',e=>{console.error(`ERROR ${e.message}`);process.exit(1);});
process.on('unhandledRejection',e=>{console.error(`ERROR ${e?.message||e}`);process.exit(1);});
const a=parseArgs(process.argv.slice(2));const id=a._[0];if(!id)throw new Error('Usage: pack:diff -- <packageId> --source <packDir>');const d=calculatePackDiff(id,a.source||`../reusable-modules/${id}`,a);console.log(`# ${id}: ${d.old.version} -> ${d.manifest.version}`);for(const r of d.rows)console.log(`${r.status.padEnd(17)} ${r.entityCode||''} ${r.projectPath||r.sourcePath}`);console.log(`Conflicts: ${d.conflicts.length}; manual-review deletions: ${d.reviewRequired.length}`);process.exit(d.conflicts.length?2:0);
