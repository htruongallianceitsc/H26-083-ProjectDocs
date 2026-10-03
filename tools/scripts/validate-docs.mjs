#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, projectRoot, scanDocuments, codeIndex, buildRelations, isPlaceholder, daysSince, posix } from './lib/core.mjs';

const config = await loadConfig();
const docs = await scanDocuments(config);
const errors = [];
const warnings = [];
const infos = [];
const add = (arr, code, file, message) => arr.push({ code, file, message });

const strictRoots = (config.strictRoots || []).map((x) => x.replace(/\/$/, ''));
const isStrictDoc = (doc) => strictRoots.some((r) => doc.relPath === r || doc.relPath.startsWith(`${r}/`))
  && !doc.isGenerated
  && !/(^|\/)README\.md$/i.test(doc.relPath);

for (const doc of docs) {
  if (isStrictDoc(doc)) {
    const required = config.requiredFrontmatter?.[doc.type] || config.requiredFrontmatter?.default || [];
    for (const field of required) {
      if (isPlaceholder(doc.frontmatter[field])) {
        add(errors, 'FRONTMATTER_REQUIRED', doc.relPath, `Missing or placeholder frontmatter field: ${field}`);
      }
    }
    if (doc.code && !/^[A-Z0-9][A-Z0-9._-]*$/.test(doc.code)) {
      add(errors, 'CODE_FORMAT', doc.relPath, `Code must be stable uppercase token: ${doc.code}`);
    }
    if (doc.status && config.allowedStatuses && !config.allowedStatuses.includes(doc.status)) {
      add(errors, 'STATUS_INVALID', doc.relPath, `Unsupported status '${doc.status}'.`);
    }
    if (/\<[^>]+\>/.test(doc.content)) {
      add(warnings, 'PLACEHOLDER_CONTENT', doc.relPath, 'Document still contains <placeholder> content.');
    }
  }

  for (const target of doc.links) {
    if (!target || /^(https?:|mailto:|tel:|#|data:)/i.test(target)) continue;
    const clean = decodeURIComponent(target.split('#')[0].split('?')[0]);
    if (!clean || /<[^>]+>/.test(clean)) continue;
    const abs = path.resolve(path.dirname(doc.absPath), clean);
    try {
      await fs.access(abs);
    } catch {
      add(errors, 'BROKEN_LINK', doc.relPath, `Local link does not exist: ${target}`);
    }
  }

  if (doc.isEntity && doc.lastReviewedAt) {
    const age = daysSince(doc.lastReviewedAt);
    if (age !== null && age > (config.maxReviewAgeDays || 180)) {
      add(warnings, 'STALE_REVIEW', doc.relPath, `Last review was ${age} days ago.`);
    }
  }

  for (const block of doc.mermaid) {
    const first = block.split(/\r?\n/, 1)[0].trim();
    if (!/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|xychart-beta|block-beta|architecture-beta|C4Context|C4Container|C4Component|requirementDiagram|packet-beta|kanban)/.test(first)) {
      add(warnings, 'MERMAID_UNKNOWN_TYPE', doc.relPath, `Mermaid block starts with unrecognized diagram declaration: '${first}'.`);
    }
  }
}

const byCode = codeIndex(docs.filter((d) => d.isEntity));
for (const [code, list] of byCode.entries()) {
  if (list.length > 1) add(errors, 'DUPLICATE_CODE', list.map((x) => x.relPath).join(', '), `Code '${code}' is used ${list.length} times.`);
}

const { broken, inbound, outbound } = buildRelations(docs, config);
for (const item of broken) {
  add(errors, 'BROKEN_RELATION', byCode.get(item.source)?.[0]?.relPath || item.source, `${item.relation} -> ${item.target}: ${item.reason}`);
}

const screensByRoute = new Map();
const apisByKey = new Map();
for (const doc of docs.filter((d) => d.isEntity)) {
  if (doc.type === 'screen' && doc.route && !isPlaceholder(doc.route)) {
    const list = screensByRoute.get(doc.route) || [];
    list.push(doc);
    screensByRoute.set(doc.route, list);
  }
  if (doc.type === 'api' && doc.method && doc.apiPath && !isPlaceholder(doc.apiPath)) {
    const k = `${doc.method} ${doc.apiPath}`;
    const list = apisByKey.get(k) || [];
    list.push(doc);
    apisByKey.set(k, list);
  }
}
for (const [route, list] of screensByRoute) {
  if (list.length > 1) add(warnings, 'DUPLICATE_ROUTE', list.map((x) => x.relPath).join(', '), `Multiple screens declare route '${route}'.`);
}
for (const [api, list] of apisByKey) {
  if (list.length > 1) add(errors, 'DUPLICATE_API', list.map((x) => x.relPath).join(', '), `Duplicate API contract '${api}'.`);
}

const entities = docs.filter((d) => d.isEntity);
const hasRelatedType = (doc, types) => doc.related.some((r) => {
  const targets = byCode.get(r.code) || [];
  return targets.some((t) => types.includes(t.type));
});
const hasIncomingType = (doc, types) => (inbound.get(doc.code) || []).some((e) => {
  const sources = byCode.get(e.from) || [];
  return sources.some((s) => types.includes(s.type));
});

for (const doc of entities) {
  if (config.qualityRules?.featureRequiresRequirement && doc.type === 'feature' && ['planned', 'in_progress', 'implemented', 'approved'].includes(doc.status)) {
    if (!hasRelatedType(doc, ['requirement']) && !hasIncomingType(doc, ['requirement'])) {
      add(warnings, 'TRACE_FEATURE_REQUIREMENT', doc.relPath, `${doc.code} has no requirement relationship.`);
    }
  }
  if (config.qualityRules?.requirementRequiresTest && doc.type === 'requirement' && ['approved', 'in_progress', 'implemented'].includes(doc.status)) {
    if (!hasRelatedType(doc, ['test-case', 'test-script']) && !hasIncomingType(doc, ['test-case', 'test-script'])) {
      add(warnings, 'TRACE_REQUIREMENT_TEST', doc.relPath, `${doc.code} has no test coverage relationship.`);
    }
  }
  if (config.qualityRules?.screenRequiresFeature && doc.type === 'screen' && !hasRelatedType(doc, ['feature']) && !hasIncomingType(doc, ['feature'])) {
    add(warnings, 'TRACE_SCREEN_FEATURE', doc.relPath, `${doc.code} is not linked to a feature.`);
  }
  if (config.qualityRules?.apiRequiresFeature && doc.type === 'api' && !hasRelatedType(doc, ['feature']) && !hasIncomingType(doc, ['feature'])) {
    add(warnings, 'TRACE_API_FEATURE', doc.relPath, `${doc.code} is not linked to a feature.`);
  }
  const degree = (inbound.get(doc.code) || []).length + (outbound.get(doc.code) || []).length;
  if (!['module', 'decision'].includes(doc.type) && degree === 0) {
    add(infos, 'ORPHAN_ENTITY', doc.relPath, `${doc.code} has no graph relationships.`);
  }
}

const printGroup = (name, list) => {
  if (!list.length) return;
  console.log(`\n${name} (${list.length})`);
  for (const item of list) console.log(`- [${item.code}] ${item.file}: ${item.message}`);
};

console.log(`Documentation validation: ${docs.length} markdown files, ${entities.length} entity documents.`);
printGroup('ERRORS', errors);
printGroup('WARNINGS', warnings);
printGroup('INFO', infos);
console.log(`\nSummary: ${errors.length} error(s), ${warnings.length} warning(s), ${infos.length} info finding(s).`);
if (errors.length) process.exitCode = 1;
