import path from 'node:path';
import { ROOT, parseArgs, scanEntities, writeMarkdownEntity, updateMarkdownEntityMeta, findEntityByCode } from '../lib/common.mjs';

const action = process.argv[2] || 'help';
const args = parseArgs(process.argv.slice(3));
const today = new Date().toISOString().slice(0,10);

function nextCode() {
  const prefix = `REQST-${today.replaceAll('-','')}-`;
  const existing = scanEntities().entities.map(e => e.code).filter(c => c.startsWith(prefix));
  const max = existing.reduce((m,c) => Math.max(m, Number(c.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3,'0')}`;
}
function requireArg(name) { if (!args[name]) throw new Error(`Missing --${name}`); return String(args[name]); }
function create() {
  const title = requireArg('title');
  const code = String(args.code || nextCode());
  if (findEntityByCode(code)) throw new Error(`Entity already exists: ${code}`);
  const kind = String(args.kind || 'change');
  const owner = String(args.owner || 'Product & Engineering');
  const summary = String(args.summary || 'Describe the request, expected outcome, and important constraints.');
  const meta = {
    code, type: 'request', title, status: 'captured', owner,
    created_at: today, updated_at: today, last_reviewed_at: today,
    request_kind: kind, priority: String(args.priority || 'medium'),
    related: {}
  };
  const body = `# ${title}\n\n## Summary\n\n${summary}\n\n## Context\n\n- Source / reason: ${String(args.source || 'Not specified')}\n- Requested by: ${String(args['requested-by'] || 'Not specified')}\n\n## Desired Outcome\n\nDescribe the observable outcome this request should create.\n\n## Analysis Notes\n\n- Assumptions must be marked explicitly.\n- Link or promote this request only after the target documentation entity exists.\n\n## Acceptance Notes\n\nDefine the conditions that make the request satisfactorily addressed.\n`;
  const rel = `docs/21-requests/${code.toLowerCase()}.md`;
  writeMarkdownEntity(rel, meta, body);
  console.log(`Created ${code} -> ${rel}`);
}
function promote() {
  const requestCode = requireArg('request');
  const targetCode = requireArg('target');
  const request = findEntityByCode(requestCode);
  const target = findEntityByCode(targetCode);
  if (!request || request.type !== 'request') throw new Error(`Request not found: ${requestCode}`);
  if (!target) throw new Error(`Promotion target not found: ${targetCode}`);
  updateMarkdownEntityMeta(request, meta => {
    meta.status = 'promoted'; meta.updated_at = today; meta.last_reviewed_at = today;
    meta.related = meta.related || {};
    const values = Array.isArray(meta.related.promoted_to) ? meta.related.promoted_to.map(String) : [];
    if (!values.includes(targetCode)) values.push(targetCode);
    meta.related.promoted_to = values;
  });
  console.log(`Promoted ${requestCode} -> ${targetCode}`);
}
function close() {
  const code = requireArg('request');
  const request = findEntityByCode(code);
  if (!request || request.type !== 'request') throw new Error(`Request not found: ${code}`);
  updateMarkdownEntityMeta(request, meta => { meta.status = 'closed'; meta.updated_at = today; meta.last_reviewed_at = today; });
  console.log(`Closed ${code}`);
}
function list() {
  const rows = scanEntities().entities.filter(e => e.type === 'request').sort((a,b) => a.code.localeCompare(b.code));
  if (!rows.length) { console.log('No requests.'); return; }
  for (const r of rows) console.log(`${r.code}\t${r.status}\t${r.title}\t${r.path}`);
}

try {
  if (action === 'create') create();
  else if (action === 'promote') promote();
  else if (action === 'close') close();
  else if (action === 'list') list();
  else console.log('request-tool commands: create --title ... [--kind change] [--summary ...], list, promote --request CODE --target CODE, close --request CODE');
} catch (error) { console.error(`[ERROR] ${error.message}`); process.exitCode = 1; }
