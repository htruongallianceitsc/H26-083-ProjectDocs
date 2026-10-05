import { parseArgs } from '../lib/common.mjs';
import { analyzeImpact } from '../lib/impact.mjs';
const action = process.argv[2] || 'analyze';
const args = parseArgs(process.argv.slice(3));
try {
  if (action !== 'analyze') throw new Error('impact-tool command: analyze --entity CODE [--depth N] [--json]');
  if (!args.entity) throw new Error('Missing --entity');
  const report = analyzeImpact(String(args.entity), { depth:args.depth, maxNodes:args['max-nodes'] });
  if (args.json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Impact ${report.root.code}: ${report.summary.total} potential impact(s) (high ${report.summary.high}, medium ${report.summary.medium}, low ${report.summary.low})`);
    for (const x of report.impacted) console.log(`[${x.level.toUpperCase()}] ${x.code} (${x.type}) depth=${x.depth} score=${x.score} :: ${x.reasons.join(' | ')}`);
  }
} catch (error) { console.error(`[ERROR] ${error.message}`); process.exitCode = 1; }
