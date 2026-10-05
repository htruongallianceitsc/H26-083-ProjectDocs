import { parseArgs, scanEntities, updateMarkdownEntityMeta } from '../lib/common.mjs';
import { allowedTransition, isUuid, newUid } from '../lib/model-governance.mjs';

const action = process.argv[2] || 'help';
const args = parseArgs(process.argv.slice(3));

function identityStatus() {
  const { entities } = scanEntities();
  const missing = entities.filter(e => !e.uid);
  const invalid = entities.filter(e => e.uid && !isUuid(e.uid));
  const seen = new Map(); const duplicate = [];
  for (const e of entities.filter(e => e.uid)) {
    if (seen.has(e.uid)) duplicate.push([e, seen.get(e.uid)]); else seen.set(e.uid, e);
  }
  console.log(`Entity identity: ${entities.length} entity(s), ${missing.length} missing uid, ${invalid.length} invalid uid, ${duplicate.length} duplicate uid.`);
  missing.forEach(e => console.log(`[MISSING_UID] ${e.code} (${e.path})`));
  invalid.forEach(e => console.log(`[INVALID_UID] ${e.code}: ${e.uid}`));
  duplicate.forEach(([a,b]) => console.log(`[DUPLICATE_UID] ${a.code} and ${b.code}: ${a.uid}`));
  if (invalid.length || duplicate.length) process.exitCode = 1;
}

function identityBackfill() {
  const apply = Boolean(args.apply);
  const { entities } = scanEntities();
  const missing = entities.filter(e => !e.uid);
  console.log(`UID backfill: ${missing.length} entity(s) need uid. mode=${apply ? 'apply' : 'dry-run'}`);
  for (const e of missing) {
    const uid = newUid();
    console.log(`${apply ? '[APPLY]' : '[PLAN]'} ${e.code} -> ${uid}`);
    if (apply) updateMarkdownEntityMeta(e, meta => { meta.uid = uid; meta.revision = Number(meta.revision || 0) || 1; });
  }
  if (!apply && missing.length) console.log('Re-run with --apply to persist generated UIDs.');
}

function transition() {
  const code = String(args.entity || ''); const to = String(args.to || '');
  if (!code || !to) throw new Error('Usage: entity:transition -- --entity CODE --to STATUS');
  const entity = scanEntities().entities.find(e => e.code === code);
  if (!entity) throw new Error(`Entity not found: ${code}`);
  const result = allowedTransition(entity.type, entity.status, to);
  if (!result.ok) throw new Error(result.reason);
  if (result.noop) { console.log(`${code}: already ${to}`); return; }
  updateMarkdownEntityMeta(entity, meta => {
    meta.status = to;
    meta.revision = Math.max(1, Number(meta.revision || 0)) + 1;
    meta.updated_at = new Date().toISOString().slice(0,10);
  });
  console.log(`${code}: ${entity.status} -> ${to}`);
}

try {
  if (action === 'identity-status') identityStatus();
  else if (action === 'identity-backfill') identityBackfill();
  else if (action === 'transition') transition();
  else console.log('entity-tool commands: identity-status, identity-backfill [--apply], transition --entity CODE --to STATUS');
} catch (e) {
  console.error(`[ERROR] ${e.message}`); process.exitCode = 1;
}
