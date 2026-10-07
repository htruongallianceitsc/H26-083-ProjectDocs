import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  ROOT, loadJson, writeJson, ensureDir, scanEntities, parseArgs, parseFrontmatter,
  serializeFrontmatter, sha256, rel, walk, writeMarkdownEntity
} from '../lib/common.mjs';
import { createZip, readZip } from '../lib/zip.mjs';

const action = process.argv[2] || 'help';
const args = parseArgs(process.argv.slice(3));
const config = loadJson('registry/documentation-bundle.json', {});
const starter = loadJson('starter-kit.json', {});
const entityTypes = loadJson('registry/entity-types.json', { types: {} });

function json(value) { return JSON.stringify(value, null, 2) + '\n'; }
function nowIso() { return new Date().toISOString(); }
function stamp() { return nowIso().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z'); }
function safeName(value) { return String(value || 'entity').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'entity'; }
function posix(p) { return String(p).replace(/\\/g, '/'); }
function isExcludedProjectPath(p) { return (config.excludedProjectDocPrefixes || []).some(prefix => posix(p).startsWith(prefix)); }

function deterministicUid(type, code) {
  const hex = crypto.createHash('sha256').update(`project-documentation-bundle:${type}:${code}`).digest('hex').slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0,8).join('')}-${hex.slice(8,12).join('')}-${hex.slice(12,16).join('')}-${hex.slice(16,20).join('')}-${hex.slice(20,32).join('')}`;
}

function normalizeMeta(meta, entry = null) {
  const next = structuredClone(meta || {});
  if (entry?.code) next.code = entry.code;
  if (entry?.type) next.type = entry.type;
  if (next.code && next.type && !next.uid) next.uid = entry?.uid || deterministicUid(next.type, next.code);
  if (next.code && next.type && (!Number.isFinite(Number(next.revision)) || Number(next.revision) < 1)) next.revision = Math.max(1, Number(entry?.revision || 1));
  if (!next.related || typeof next.related !== 'object' || Array.isArray(next.related)) next.related = {};
  return next;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonicalize(value[k])]));
  return value;
}
function semanticHash(meta, body) { return sha256(JSON.stringify(canonicalize(meta)) + '\n' + String(body || '').trim()); }

function relationsFor(entities) {
  const rows = [];
  for (const e of entities) {
    const related = e.meta?.related;
    if (!related || typeof related !== 'object' || Array.isArray(related)) continue;
    for (const [field, value] of Object.entries(related)) {
      const values = Array.isArray(value) ? value : (value === null || value === '' ? [] : [value]);
      for (const targetCode of values) rows.push({ sourceCode: e.code, sourceType: e.type, field, targetCode: String(targetCode) });
    }
  }
  return rows;
}

function checkConfig() {
  const errors = [];
  if (config.bundleFormat !== 'project-documentation-bundle') errors.push('bundleFormat must be project-documentation-bundle');
  if (Number(config.bundleSchemaVersion) !== 1) errors.push('bundleSchemaVersion must be 1');
  for (const type of Object.keys(entityTypes.types || {})) if (!config.entityTargets?.[type]) errors.push(`Missing entity target mapping: ${type}`);
  for (const [type, target] of Object.entries(config.entityTargets || {})) {
    if (!entityTypes.types?.[type]) errors.push(`Target mapping references unknown entity type: ${type}`);
    if (!target.directory || !target.strategy) errors.push(`Invalid target mapping for ${type}`);
  }
  console.log(`Documentation bundle config: ${errors.length ? 'FAIL' : 'PASS'} (${Object.keys(config.entityTargets || {}).length} type mappings)`);
  errors.forEach(x => console.log(`[ERROR] ${x}`));
  return errors.length === 0;
}

function readJsonAt(root, relativePath, fallback = {}) {
  const p = path.join(root, ...relativePath.split('/'));
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function sourceRel(root, p) { return path.relative(root, p).split(path.sep).join('/'); }

function scanSourceEntities(sourceRoot) {
  const docsRoot = path.join(sourceRoot, 'docs');
  if (!fs.existsSync(docsRoot)) throw new Error(`Source project has no docs/ directory: ${sourceRoot}`);
  const entities = [];
  for (const p of walk(docsRoot, x => x.endsWith('.md'))) {
    const relative = sourceRel(sourceRoot, p);
    if (isExcludedProjectPath(relative)) continue;
    const text = fs.readFileSync(p, 'utf8');
    const parsed = parseFrontmatter(text);
    if (!parsed.data.code || !parsed.data.type) continue;
    entities.push({
      path: relative, code: String(parsed.data.code), type: String(parsed.data.type), uid: parsed.data.uid ? String(parsed.data.uid) : '',
      revision: Number(parsed.data.revision || 0), status: String(parsed.data.status || ''), title: parsed.data.title || path.basename(p),
      meta: parsed.data, body: parsed.body
    });
  }
  return entities;
}

function projectIdentity(sourceRoot, sourceStarter) {
  const profile = readJsonAt(sourceRoot, 'project.profile.json', {});
  return {
    code: profile.code || profile.projectCode || null,
    name: profile.name || profile.projectName || sourceStarter.name || path.basename(sourceRoot),
    projectTypes: profile.projectTypes || [],
    technologyStacks: profile.technologyStacks || []
  };
}

function exportBundle() {
  if (!checkConfig()) throw new Error('Documentation bundle registry is invalid.');
  const sourceRoot = args.source ? path.resolve(process.cwd(), String(args.source)) : ROOT;
  const sourceStarter = readJsonAt(sourceRoot, 'starter-kit.json', {});
  const portable = scanSourceEntities(sourceRoot);
  const entries = [];
  const index = [];
  const seenNames = new Set();

  for (const e of portable.sort((a,b) => a.code.localeCompare(b.code))) {
    const sourceText = fs.readFileSync(path.join(sourceRoot, e.path), 'utf8');
    const parsed = parseFrontmatter(sourceText);
    const normalized = normalizeMeta(parsed.data, { code: e.code, type: e.type, uid: e.uid || deterministicUid(e.type, e.code), revision: e.revision || 1 });
    const normalizedText = `${serializeFrontmatter(normalized)}\n\n${String(parsed.body || '').trim()}\n`;
    let file = `entities/${safeName(e.code)}.md`;
    if (seenNames.has(file)) file = `entities/${safeName(e.code)}-${sha256(e.path).slice(0,8)}.md`;
    seenNames.add(file);
    entries.push({ name: file, data: normalizedText });
    index.push({
      code: e.code,
      uid: normalized.uid,
      revision: normalized.revision,
      type: e.type,
      title: normalized.title || e.title,
      status: normalized.status || e.status || null,
      sourcePath: e.path,
      contentFile: file,
      contentHash: sha256(normalizedText),
      semanticHash: semanticHash(normalized, parsed.body)
    });
  }

  const relations = relationsFor(portable);
  entries.push({ name: 'entities.json', data: json({ schemaVersion: 1, entities: index }) });
  entries.push({ name: 'relations.json', data: json({ schemaVersion: 1, relations }) });

  const context = [];
  for (const [source, target] of [['project.profile.json','context/project.profile.json'], ['PROJECT_BLUEPRINT.md','context/PROJECT_BLUEPRINT.md']]) {
    const abs = path.join(sourceRoot, source);
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) {
      const data = fs.readFileSync(abs);
      entries.push({ name: target, data });
      context.push({ sourcePath: source, contentFile: target, contentHash: sha256(data) });
    }
  }

  const createdAt = nowIso();
  const payloadHash = sha256(JSON.stringify(canonicalize({ entities: index, relations, context })));
  const manifest = {
    format: config.bundleFormat,
    schemaVersion: Number(config.bundleSchemaVersion),
    createdAt,
    sourceStarter: { name: sourceStarter.name || null, version: sourceStarter.version || null, schemaVersion: sourceStarter.schemaVersion || null },
    project: projectIdentity(sourceRoot, sourceStarter),
    counts: { entities: index.length, relations: relations.length, contextFiles: context.length },
    context,
    payloadHash
  };
  entries.unshift({ name: 'manifest.json', data: json(manifest) });
  entries.push({ name: 'export-report.json', data: json({ ...manifest, entityTypes: Object.fromEntries(Object.entries(index.reduce((m,e)=>{m[e.type]=(m[e.type]||0)+1;return m;},{})).sort()) }) });

  const explicitOut = args.output || args.file || null;
  const out = explicitOut
    ? (path.isAbsolute(explicitOut) ? explicitOut : path.resolve(process.cwd(), explicitOut))
    : path.join(sourceRoot, config.exportDirectory || '.project-docs/exports', 'ProjectDocsExport.zip');
  ensureDir(path.dirname(out));
  fs.writeFileSync(out, createZip(entries));
  const displayOut = out.startsWith(sourceRoot + path.sep) ? sourceRel(sourceRoot, out) : out;
  console.log(`Documentation bundle exported: ${displayOut}`);
  console.log(`Source project: ${sourceRoot}`);
  console.log(`Entities: ${index.length} | Relations: ${relations.length} | Source starter: ${sourceStarter.version || 'unknown'}`);
  return out;
}

function readBundle(fileArg) {
  if (!fileArg) throw new Error('Usage: docs:import -- --file <ProjectDocsExport.zip>');
  const file = path.isAbsolute(fileArg) ? fileArg : path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(file)) throw new Error(`Bundle file not found: ${file}`);
  const entries = readZip(fs.readFileSync(file));
  const getJson = name => {
    const buf = entries.get(name); if (!buf) throw new Error(`Bundle missing ${name}`);
    return JSON.parse(buf.toString('utf8'));
  };
  const manifest = getJson('manifest.json');
  const entityIndex = getJson('entities.json');
  const relations = getJson('relations.json');
  if (manifest.format !== config.bundleFormat) throw new Error(`Unsupported bundle format: ${manifest.format}`);
  if (Number(manifest.schemaVersion) !== Number(config.bundleSchemaVersion)) throw new Error(`Unsupported bundle schemaVersion ${manifest.schemaVersion}; target supports ${config.bundleSchemaVersion}`);
  const payloadHash = sha256(JSON.stringify(canonicalize({ entities: entityIndex.entities || [], relations: relations.relations || [], context: manifest.context || [] })));
  if (payloadHash !== manifest.payloadHash) throw new Error('Bundle payload hash mismatch.');
  for (const e of entityIndex.entities || []) {
    const content = entries.get(e.contentFile);
    if (!content) throw new Error(`Bundle missing entity content: ${e.contentFile}`);
    if (sha256(content) !== e.contentHash) throw new Error(`Entity content hash mismatch: ${e.code}`);
  }
  for (const c of manifest.context || []) {
    const content = entries.get(c.contentFile);
    if (!content || sha256(content) !== c.contentHash) throw new Error(`Context content hash mismatch: ${c.sourcePath}`);
  }
  return { file, entries, manifest, entityIndex, relations };
}

function codeValue(value) { return Array.isArray(value) ? value[0] : value; }
function sourceSubdir(sourcePath, directory, allowed) {
  const prefix = `${directory}/`;
  if (!sourcePath?.startsWith(prefix)) return null;
  const rest = sourcePath.slice(prefix.length);
  const first = rest.split('/')[0];
  return allowed.includes(first) ? first : null;
}
function targetFor(entry, meta) {
  const target = config.entityTargets?.[entry.type];
  if (!target) return null;
  const code = safeName(entry.code);
  if (target.strategy === 'flat') return `${target.directory}/${code}.md`;
  if (target.strategy === 'module') return `${target.directory}/${code}/module.md`;
  if (target.strategy === 'feature') {
    const moduleField = target.moduleRelationField || 'modules';
    const moduleCode = codeValue(meta.related?.[moduleField]) || '_UNASSIGNED';
    return `${target.directory}/${safeName(moduleCode)}/${code}/feature.md`;
  }
  if (target.strategy === 'preserve-subdir') {
    const sub = sourceSubdir(entry.sourcePath, target.directory, target.subdirs || []) || target.fallbackSubdir || '';
    return `${target.directory}${sub ? '/' + sub : ''}/${code}.md`;
  }
  if (target.strategy === 'preserve-or-flat') {
    if (entry.sourcePath?.startsWith('docs/') && !isExcludedProjectPath(entry.sourcePath)) return entry.sourcePath;
    return `${target.directory}/${code}.md`;
  }
  return `${target.directory}/${code}.md`;
}

function runReconcile() {
  const steps = [
    ['validate', 'scripts/docs-tool.mjs', 'validate'],
    ['reindex', 'scripts/knowledge-tool.mjs', 'reindex'],
    ['sync', 'scripts/docs-tool.mjs', 'sync'],
    ['build', 'scripts/docs-tool.mjs', 'build'],
    ['check-site', 'scripts/docs-tool.mjs', 'check-site']
  ];
  const results = [];
  for (const [name, script, command] of steps) {
    const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', script), command], {
      cwd: path.join(ROOT, 'tools'),
      env: { ...process.env, PROJECT_DOCS_ROOT: ROOT },
      encoding: 'utf8'
    });
    results.push({ name, status: r.status ?? 1, stdout: String(r.stdout || '').trim(), stderr: String(r.stderr || '').trim() });
    console.log(`[${r.status === 0 ? 'PASS' : 'FAIL'}] post-import ${name}`);
  }
  return results;
}

function importBundle() {
  if (!checkConfig()) throw new Error('Documentation bundle registry is invalid.');
  const bundle = readBundle(args.file || args._[0]);
  const dryRun = Boolean(args['dry-run']);
  const noRebuild = Boolean(args['no-rebuild']);
  const onConflict = String(args['on-conflict'] || 'skip');
  if (!['skip','replace','error'].includes(onConflict)) throw new Error('--on-conflict must be skip, replace, or error');

  const existing = scanEntities().entities;
  const existingByCode = new Map(existing.map(e => [e.code, e]));
  const existingByUid = new Map(existing.filter(e => e.uid).map(e => [e.uid, e]));
  const result = { imported: [], skipped: [], conflicts: [], warnings: [], unmapped: [] };

  for (const entry of bundle.entityIndex.entities || []) {
    const content = bundle.entries.get(entry.contentFile).toString('utf8');
    const parsed = parseFrontmatter(content);
    const meta = normalizeMeta(parsed.data, entry);
    const targetRel = targetFor(entry, meta);
    if (!targetRel) { result.unmapped.push({ code: entry.code, type: entry.type, reason: 'No target mapping' }); continue; }
    const targetAbs = path.join(ROOT, ...targetRel.split('/'));
    const byCode = existingByCode.get(entry.code);
    const byUid = meta.uid ? existingByUid.get(meta.uid) : null;
    const current = byCode || byUid || null;
    const incomingHash = semanticHash(meta, parsed.body);

    if (current) {
      const currentParsed = parseFrontmatter(fs.readFileSync(path.join(ROOT, current.path), 'utf8'));
      const currentMeta = normalizeMeta(currentParsed.data, current);
      const currentHash = semanticHash(currentMeta, currentParsed.body);
      if (currentHash === incomingHash) {
        result.skipped.push({ code: entry.code, reason: 'identical', existingPath: current.path });
        continue;
      }
      const conflict = { code: entry.code, uid: meta.uid, type: entry.type, sourcePath: entry.sourcePath, targetPath: targetRel, existingPath: current.path, reason: 'Entity code/uid already exists with different content' };
      result.conflicts.push(conflict);
      if (onConflict !== 'replace') continue;
      if (!dryRun && current.path !== targetRel && current.path.startsWith('docs/')) fs.rmSync(path.join(ROOT, current.path), { force: true });
    } else if (fs.existsSync(targetAbs)) {
      const raw = fs.readFileSync(targetAbs, 'utf8');
      const targetParsed = parseFrontmatter(raw);
      if (targetParsed.data?.code && targetParsed.data.code !== entry.code) {
        result.conflicts.push({ code: entry.code, type: entry.type, sourcePath: entry.sourcePath, targetPath: targetRel, reason: `Target path occupied by ${targetParsed.data.code}` });
        if (onConflict !== 'replace') continue;
      } else if (!targetParsed.data?.code) {
        result.conflicts.push({ code: entry.code, type: entry.type, sourcePath: entry.sourcePath, targetPath: targetRel, reason: 'Target path occupied by a non-entity document' });
        if (onConflict !== 'replace') continue;
      }
    }

    if (!entityTypes.types?.[entry.type]) result.warnings.push({ code: entry.code, warning: `Target starter does not register type ${entry.type}` });
    if (!dryRun) writeMarkdownEntity(targetRel, meta, parsed.body);
    result.imported.push({ code: entry.code, uid: meta.uid, type: entry.type, from: entry.sourcePath, to: targetRel, replaced: Boolean(current) });
    existingByCode.set(entry.code, { ...entry, path: targetRel, meta });
    if (meta.uid) existingByUid.set(meta.uid, { ...entry, path: targetRel, meta });
  }

  const importId = `IMP-${stamp()}`;
  let reportDir = null;
  let reconcile = [];
  if (!dryRun) {
    reportDir = path.join(ROOT, config.importDirectory || '.project-docs/imports', importId);
    ensureDir(reportDir);
    for (const c of bundle.manifest.context || []) {
      const data = bundle.entries.get(c.contentFile);
      if (!data) continue;
      const target = path.join(reportDir, 'source-context', ...c.sourcePath.split('/'));
      ensureDir(path.dirname(target)); fs.writeFileSync(target, data);
    }
    if (!noRebuild) reconcile = runReconcile();
    writeJson(path.join(reportDir, 'import-report.json'), {
      importId, importedAt: nowIso(), bundle: { file: path.basename(bundle.file), manifest: bundle.manifest },
      targetStarter: { version: starter.version || null, schemaVersion: starter.schemaVersion || null },
      options: { onConflict, noRebuild }, summary: {
        imported: result.imported.length, skipped: result.skipped.length, conflicts: result.conflicts.length,
        unmapped: result.unmapped.length, warnings: result.warnings.length,
        reconcilePassed: noRebuild ? null : reconcile.every(x => x.status === 0)
      }, ...result, reconcile
    });
  }

  console.log(`Documentation bundle import${dryRun ? ' dry-run' : ''}: ${result.imported.length} imported, ${result.skipped.length} unchanged, ${result.conflicts.length} conflict(s), ${result.unmapped.length} unmapped.`);
  console.log(`Source starter: ${bundle.manifest.sourceStarter?.version || 'unknown'} -> Target starter: ${starter.version || 'unknown'}`);
  if (reportDir) console.log(`Import report: ${rel(path.join(reportDir, 'import-report.json'))}`);
  result.conflicts.forEach(x => console.log(`[CONFLICT] ${x.code}: ${x.reason}`));
  result.unmapped.forEach(x => console.log(`[UNMAPPED] ${x.code} (${x.type})`));

  if (result.conflicts.length && onConflict === 'error') process.exitCode = 2;
  if (result.unmapped.length) process.exitCode = 2;
  if (!dryRun && !noRebuild && reconcile.some(x => x.status !== 0)) process.exitCode = 1;
  return result;
}

function inspectBundle() {
  const bundle = readBundle(args.file || args._[0]);
  console.log(`Format: ${bundle.manifest.format} schema v${bundle.manifest.schemaVersion}`);
  console.log(`Source starter: ${bundle.manifest.sourceStarter?.version || 'unknown'}`);
  console.log(`Project: ${bundle.manifest.project?.name || '(unnamed)'}`);
  console.log(`Entities: ${bundle.manifest.counts?.entities || 0} | Relations: ${bundle.manifest.counts?.relations || 0}`);
  console.log('Bundle integrity: PASS');
}

try {
  if (action === 'check') { if (!checkConfig()) process.exitCode = 1; }
  else if (action === 'export') exportBundle();
  else if (action === 'import') importBundle();
  else if (action === 'inspect') inspectBundle();
  else console.log('bundle-tool commands: check | export [--source projectDir] [--output file.zip] | inspect --file file.zip | import --file file.zip [--dry-run] [--no-rebuild] [--on-conflict skip|error|replace]');
} catch (e) {
  console.error(`[ERROR] ${e.message}`);
  process.exitCode = 1;
}
