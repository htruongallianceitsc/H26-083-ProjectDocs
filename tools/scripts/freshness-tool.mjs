import { parseArgs, scanEntities } from '../lib/common.mjs';
import { checkFreshness, reconcileFreshness } from '../lib/freshness.mjs';

const action = process.argv[2] || 'check';
const args = parseArgs(process.argv.slice(3));
function required(name) { if (!args[name]) throw new Error(`Missing --${name}`); return String(args[name]); }

try {
  if (action === 'reconcile') {
    const code = required('entity'); const reviewer = required('reviewer');
    const snapshot = reconcileFreshness(code, reviewer, String(args.note || ''));
    console.log(`Reconciled ${code}: ${Object.keys(snapshot.dependencies).length} dependency snapshot(s) by ${reviewer}.`);
  } else if (action === 'check') {
    const codes = args.entity ? [String(args.entity)] : scanEntities().entities.map(e => e.code);
    if (!codes.length) { console.log('No entities found; freshness check has nothing to evaluate.'); process.exit(0); }
    const results = codes.map(checkFreshness);
    if (args.json) console.log(JSON.stringify(results, null, 2));
    else for (const r of results) {
      console.log(`${r.code}: ${r.status.toUpperCase()}`);
      for (const c of r.changes) console.log(`  - ${c.kind}: ${c.code}`);
      if (r.selfChanged && !r.changes.length) console.log('  - self document changed since last reconcile');
    }
    if (results.some(r => r.status === 'stale')) process.exitCode = 1;
  } else {
    console.log('freshness-tool commands: check [--entity CODE] [--json], reconcile --entity CODE --reviewer NAME [--note TEXT]'); process.exitCode = 1;
  }
} catch (error) { console.error(`[ERROR] ${error.message}`); process.exitCode = 1; }
