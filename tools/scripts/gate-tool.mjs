import { parseArgs, scanEntities } from '../lib/common.mjs';
import { evaluateGate } from '../lib/governance.mjs';

const gate = process.argv[2] || 'ready';
const args = parseArgs(process.argv.slice(3));

try {
  const codes = args.feature ? [String(args.feature)] : scanEntities().entities.filter(e => e.type === 'feature').map(e => e.code);
  if (!codes.length) { console.log(`No feature entities found; ${gate} gate has nothing to evaluate.`); process.exit(0); }
  let pass = true;
  const reports = [];
  for (const code of codes) {
    const result = evaluateGate(gate, code); reports.push(result); pass = pass && result.pass;
    if (!args.json) {
      console.log(`${gate.toUpperCase()} ${code}: ${result.pass ? 'PASS' : 'FAIL'}`);
      for (const c of result.checks) console.log(`[${c.pass ? (c.severity === 'warning' ? 'WARN' : 'PASS') : 'FAIL'}] ${c.code}: ${c.message}`);
    }
  }
  if (args.json) console.log(JSON.stringify(reports, null, 2));
  if (!pass) process.exitCode = 1;
} catch (error) { console.error(`[ERROR] ${error.message}`); process.exitCode = 1; }
