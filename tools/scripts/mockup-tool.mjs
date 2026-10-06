import { parseArgs } from '../lib/common.mjs';
import {
  buildMockupInventory, buildMockupAnalysisTasks, buildMockupCandidates,
  reviewMockupCandidate, promoteMockupCandidate, buildMockupReport,
  checkMockups, mockupStatus
} from '../lib/mockups.mjs';

const cmd = process.argv[2] || 'status';
const a = parseArgs(process.argv.slice(3));
const req = name => { if (!a[name]) throw new Error(`Missing --${name}`); return String(a[name]); };
const print = x => console.log(JSON.stringify(x, null, 2));
try {
  if (cmd === 'inventory') print(buildMockupInventory());
  else if (cmd === 'tasks') print(buildMockupAnalysisTasks());
  else if (cmd === 'candidates') print(buildMockupCandidates());
  else if (cmd === 'review') print(reviewMockupCandidate({ candidateId: req('candidate'), decision: req('decision'), reviewer: req('reviewer'), note: String(a.note || '') }));
  else if (cmd === 'promote') print(promoteMockupCandidate({ candidateId: req('candidate'), reviewer: String(a.reviewer || ''), applyExisting: !!a['apply-existing'] }));
  else if (cmd === 'report') print(buildMockupReport());
  else if (cmd === 'check') { const r = checkMockups(); console.log(`Mockup check: ${r.pass ? 'PASS' : 'FAIL'}; ${r.summary.assets} asset(s), ${r.summary.unmapped} unmapped, ${r.summary.needsAnalysis} need analysis, ${r.summary.findings} finding(s).`); for (const f of r.findings) console.log(`[${f.severity.toUpperCase()}] ${f.code}: ${f.message}`); if (!r.pass) process.exitCode = 1; }
  else if (cmd === 'status') print(mockupStatus());
  else { console.log('mockup-tool commands: inventory, tasks, candidates, review --candidate ID --decision accepted|rejected --reviewer NAME [--note TEXT], promote --candidate ID [--reviewer NAME] [--apply-existing], report, check, status'); process.exitCode = 1; }
} catch (e) {
  console.error(`[ERROR] ${e.message}`);
  process.exitCode = 1;
}
