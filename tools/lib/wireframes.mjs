import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, loadJson, writeJson, ensureDir, scanEntities, fileHash, sha256, escapeHtml
} from './common.mjs';

const DEFAULTS = {
  runtimeDirectory: '.project-docs/wireframes',
  generatedDirectory: 'docs/_generated/wireframes',
  combinedHtml: 'docs/_generated/SCREEN_WIREFRAMES.html',
  formats: { default: ['text','ascii','html'] },
  review: {
    proposalDirectory: '.project-docs/wireframes/proposals',
    allowedGapKinds: ['missing-section','missing-field','missing-action','missing-state','navigation-gap','feature-gap','requirement-gap','business-rule-gap','validation-gap','content-gap','accessibility-gap','other']
  },
  validation: {
    checkOnlyWhenSessionActive: true,
    staleProjectionSeverity: 'high',
    acceptedGapUnresolvedSeverity: 'high',
    openGapSeverity: 'warning',
    missingRouteSeverity: 'warning',
    screenWithoutActionsSeverity: 'warning',
    screenWithoutNavigationSeverity: 'warning',
    blockSeverities: ['high','error']
  }
};

function cfg() {
  const raw = loadJson('registry/wireframe-workflow.json', {});
  return {
    ...DEFAULTS,
    ...raw,
    formats: { ...DEFAULTS.formats, ...(raw.formats || {}) },
    review: { ...DEFAULTS.review, ...(raw.review || {}) },
    validation: { ...DEFAULTS.validation, ...(raw.validation || {}) }
  };
}
function abs(rel) { return path.join(ROOT, rel); }
function runtimeFile(name) { return `${cfg().runtimeDirectory}/${name}`; }
function specDir() { return abs(`${cfg().runtimeDirectory}/specs`); }
function proposalDir() { return abs(cfg().review.proposalDirectory); }
function generatedDir() { return abs(cfg().generatedDirectory); }
function slug(v) { return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'screen'; }
function now() { return new Date().toISOString(); }
function unique(xs) { return [...new Set((xs || []).filter(Boolean).map(x => String(x).trim()).filter(Boolean))]; }
function arr(v) { return Array.isArray(v) ? v : v == null ? [] : [v]; }
function cleanCell(v) { return String(v ?? '').replace(/<br\s*\/?\s*>/gi,'; ').replace(/\s+/g,' ').trim(); }

function section(body, names) {
  const candidates = arr(names).map(x => String(x).toLowerCase());
  const lines = String(body || '').replace(/\r\n/g,'\n').split('\n');
  let start = -1;
  for (let i=0;i<lines.length;i++) {
    const m = lines[i].match(/^##\s+(.+?)\s*$/);
    if (m && candidates.includes(m[1].trim().toLowerCase())) { start = i + 1; break; }
  }
  if (start < 0) return '';
  let end = lines.length;
  for (let i=start;i<lines.length;i++) if (/^##\s+/.test(lines[i])) { end = i; break; }
  return lines.slice(start,end).join('\n').trim();
}
function plainText(markdown) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g,'')
    .replace(/^[-*+]\s+/gm,'')
    .replace(/^\d+\.\s+/gm,'')
    .replace(/\*\*([^*]+)\*\*/g,'$1')
    .replace(/`([^`]+)`/g,'$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g,'$1')
    .replace(/\s+/g,' ')
    .trim();
}
function parseTable(markdown) {
  const lines = String(markdown || '').split('\n').filter(x => x.trim().startsWith('|'));
  if (lines.length < 2) return [];
  const cells = lines.map(line => line.trim().replace(/^\||\|$/g,'').split('|').map(cleanCell));
  const sepIndex = cells.findIndex(row => row.length && row.every(c => /^:?-{3,}:?$/.test(c)));
  if (sepIndex < 1) return [];
  const headers = cells[sepIndex-1];
  return cells.slice(sepIndex+1).filter(r => r.some(Boolean)).map(row => {
    const out = {};
    headers.forEach((h,i) => out[h || `Column ${i+1}`] = row[i] || '');
    return out;
  });
}
function bullets(markdown) {
  return String(markdown || '').split('\n').map(x => x.trim()).filter(x => /^[-*+]\s+/.test(x)).map(x => x.replace(/^[-*+]\s+/, '').trim()).filter(Boolean);
}
function normalizedRows(markdown) {
  const table = parseTable(markdown);
  if (table.length) return table;
  return bullets(markdown).map(x => ({ Item: x }));
}
function firstValue(row, keys, fallback='') {
  for (const [k,v] of Object.entries(row || {})) {
    const nk = k.toLowerCase().replace(/[^a-z0-9]+/g,' ');
    if (keys.some(key => nk.includes(key))) return cleanCell(v);
  }
  return fallback;
}
function normalizeFields(rows) {
  return rows.map(r => ({
    name: firstValue(r,['field','name','item'], Object.values(r)[0] || ''),
    type: firstValue(r,['type','control']),
    required: firstValue(r,['required','mandatory']),
    validation: firstValue(r,['validation','rule']),
    notes: firstValue(r,['notes','note','description'])
  })).filter(x => x.name);
}
function normalizeActions(rows) {
  return rows.map(r => ({
    action: firstValue(r,['action','button','item'], Object.values(r)[0] || ''),
    control: firstValue(r,['control','type']),
    behaviour: firstValue(r,['behaviour','behavior','result','description']),
    destination: firstValue(r,['destination','target','navigate','route']),
    condition: firstValue(r,['condition','when','visibility','enabled']),
    requirement: firstValue(r,['requirement','related'])
  })).filter(x => x.action);
}
function normalizeNavigation(rows) {
  return rows.map(r => ({
    trigger: firstValue(r,['trigger','action','item'], Object.values(r)[0] || ''),
    destination: firstValue(r,['destination','target','route','screen']),
    condition: firstValue(r,['condition','when']),
    backBehaviour: firstValue(r,['back','return'])
  })).filter(x => x.trigger || x.destination);
}
function normalizeStates(rows, raw) {
  if (rows.length) return rows.map(r => ({
    state: firstValue(r,['state','item'], Object.values(r)[0] || ''),
    trigger: firstValue(r,['trigger','when']),
    difference: firstValue(r,['visible','difference','description','notes']),
    actions: firstValue(r,['allowed','action'])
  })).filter(x => x.state);
  return bullets(raw).map(x => ({ state: x, trigger:'', difference:'', actions:'' }));
}
function normalizeSections(rows, raw) {
  if (rows.length) return rows.map((r,i) => ({
    order: firstValue(r,['order','#'], String(i+1)),
    region: firstValue(r,['region','section','area','item'], Object.values(r)[0] || ''),
    component: firstValue(r,['component','content']),
    visibility: firstValue(r,['visibility','state','condition']),
    notes: firstValue(r,['notes','description'])
  })).filter(x => x.region);
  const bs = bullets(raw);
  if (bs.length) return bs.map((x,i)=>({order:String(i+1),region:x,component:'',visibility:'',notes:''}));
  const p = plainText(raw);
  return p ? [{order:'1',region:p,component:'',visibility:'',notes:''}] : [];
}
function related(meta) {
  const r = meta.related && typeof meta.related === 'object' ? meta.related : {};
  return {
    modules: unique(arr(r.modules)), features: unique(arr(r.features)), requirements: unique(arr(r.requirements)),
    businessRules: unique(arr(r.business_rules || r.businessRules)), flows: unique(arr(r.flows)), screens: unique(arr(r.screens))
  };
}
function screenSpec(entity) {
  const layoutRaw = section(entity.body, ['Layout / Sections','Screen Composition / Wireframe Regions','Sections']);
  const fieldsRaw = section(entity.body, 'Fields');
  const actionsRaw = section(entity.body, 'Actions');
  const statesRaw = section(entity.body, ['UI States','States']);
  const navRaw = section(entity.body, ['Navigation Rules','Navigation']);
  const unknowns = unique([
    ...bullets(section(entity.body, ['Open Questions / Mockup Gaps','Open Questions','Gaps / TBD'])),
    ...[layoutRaw,fieldsRaw,actionsRaw,statesRaw,navRaw].flatMap(x => /\bTBD\b/i.test(x) ? ['TBD remains in source Screen documentation'] : [])
  ]);
  const routeBody = plainText(section(entity.body, 'Route'));
  const route = String(entity.meta.route || routeBody || '').trim() || null;
  const purpose = plainText(section(entity.body, 'Purpose')) || 'TBD';
  const sections = normalizeSections(parseTable(layoutRaw), layoutRaw);
  const fields = normalizeFields(normalizedRows(fieldsRaw));
  const actions = normalizeActions(normalizedRows(actionsRaw));
  const states = normalizeStates(parseTable(statesRaw), statesRaw);
  const navigation = normalizeNavigation(normalizedRows(navRaw));
  return {
    schemaVersion: '1.0',
    generatedAt: now(),
    screenCode: entity.code,
    title: entity.title,
    route,
    purpose,
    sourceDocument: entity.path,
    sourceHash: fileHash(abs(entity.path)),
    sourceRevision: Number(entity.revision || 0),
    related: related(entity.meta),
    sections, fields, actions, states, navigation,
    validations: normalizedRows(section(entity.body, ['Validation & Messages','Validation'])),
    openQuestions: bullets(section(entity.body, ['Open Questions / Mockup Gaps','Open Questions'])),
    unknowns
  };
}
function currentSession() {
  return loadJson(runtimeFile('session.json'), { schemaVersion:'1.0', active:false, scope:{type:'all',refs:[]}, formats:cfg().formats.default || ['text','ascii','html'] });
}
function inScope(entity, session) {
  const scope = session?.scope || {type:'all',refs:[]};
  const refs = unique(scope.refs || []);
  if (scope.type === 'all' || !scope.type) return true;
  if (scope.type === 'screens') return refs.includes(entity.code);
  const r = related(entity.meta);
  if (scope.type === 'feature') return refs.some(x => r.features.includes(x));
  if (scope.type === 'module') return refs.some(x => r.modules.includes(x));
  return true;
}
export function startWireframeSession({ feature=null, module=null, screens=[], formats=null, reviewer=null }={}) {
  let scope = {type:'all',refs:[]};
  if (feature) scope = {type:'feature',refs:[feature]};
  else if (module) scope = {type:'module',refs:[module]};
  else if (screens?.length) scope = {type:'screens',refs:unique(screens)};
  const session = {
    schemaVersion:'1.0', active:true, startedAt:now(), closedAt:null, reviewer:reviewer || null,
    scope, formats: formats?.length ? unique(formats) : (cfg().formats.default || ['text','ascii','html'])
  };
  writeJson(runtimeFile('session.json'), session);
  return session;
}
function pad(text, width) { const s=String(text??''); return s.length>=width?s.slice(0,width):s+' '.repeat(width-s.length); }
function wrap(text, width) {
  const words=String(text||'').split(/\s+/).filter(Boolean); const out=[]; let line='';
  for(const w of words){ if(!line) line=w; else if((line+' '+w).length<=width) line+=' '+w; else {out.push(line);line=w;} }
  if(line) out.push(line); return out.length?out:[''];
}
function asciiBoxLine(content, width=74){ return `| ${pad(content,width-4)} |`; }
function renderAscii(spec) {
  const width=78; const bar='+'+'-'.repeat(width-2)+'+'; const lines=[bar, asciiBoxLine(`${spec.screenCode} - ${spec.title}`,width), asciiBoxLine(`Route: ${spec.route || 'TBD'}`,width), bar];
  lines.push(asciiBoxLine(`PURPOSE: ${spec.purpose || 'TBD'}`,width),bar);
  lines.push(asciiBoxLine('SECTIONS',width));
  if(spec.sections.length) for(const s of spec.sections) for(const [i,l] of wrap(`- ${s.region}${s.component?`: ${s.component}`:''}`,width-4).entries()) lines.push(asciiBoxLine(i?`  ${l}`:l,width)); else lines.push(asciiBoxLine('- TBD',width));
  lines.push(bar,asciiBoxLine('FIELDS',width));
  if(spec.fields.length) for(const f of spec.fields) lines.push(asciiBoxLine(`[${f.type||'field'}] ${f.name}${String(f.required).toLowerCase()==='true'||/yes|required/i.test(f.required)?' *':''}${f.validation?` | ${f.validation}`:''}`,width)); else lines.push(asciiBoxLine('- TBD',width));
  lines.push(bar,asciiBoxLine('ACTIONS',width));
  if(spec.actions.length) for(const a of spec.actions) lines.push(asciiBoxLine(`[ ${a.action} ]${a.destination?` -> ${a.destination}`:''}${a.condition?` (${a.condition})`:''}`,width)); else lines.push(asciiBoxLine('- TBD',width));
  lines.push(bar,asciiBoxLine('STATES',width));
  lines.push(asciiBoxLine(spec.states.length?spec.states.map(s=>s.state).join(' | '):'TBD',width));
  lines.push(bar,asciiBoxLine('NAVIGATION',width));
  if(spec.navigation.length) for(const n of spec.navigation) lines.push(asciiBoxLine(`${n.trigger||'Action'} -> ${n.destination||'TBD'}${n.condition?` (${n.condition})`:''}`,width)); else lines.push(asciiBoxLine('- TBD',width));
  lines.push(bar);
  return lines.join('\n')+'\n';
}
function renderText(spec) {
  const rows=(items, cols)=>items.length?items.map(x=>'| '+cols.map(([label,key])=>cleanCell(x[key]||'')).join(' | ')+' |').join('\n'):'| TBD |'+(cols.length>1?' '+Array(cols.length-1).fill('|').join(' '):'');
  return `# ${spec.screenCode} — ${spec.title}\n\nSource: ${spec.sourceDocument}\nSource hash: ${spec.sourceHash}\nRoute: ${spec.route || 'TBD'}\nPurpose: ${spec.purpose || 'TBD'}\nFeatures: ${spec.related.features.join(', ') || 'TBD'}\nRequirements: ${spec.related.requirements.join(', ') || 'TBD'}\n\n## Sections\n\n| Region | Component | Visibility | Notes |\n|---|---|---|---|\n${rows(spec.sections,[['Region','region'],['Component','component'],['Visibility','visibility'],['Notes','notes']])}\n\n## Fields\n\n| Field | Type | Required | Validation | Notes |\n|---|---|---|---|---|\n${rows(spec.fields,[['Field','name'],['Type','type'],['Required','required'],['Validation','validation'],['Notes','notes']])}\n\n## Actions\n\n| Action | Control | Behaviour | Destination | Condition | Requirement |\n|---|---|---|---|---|---|\n${rows(spec.actions,[['Action','action'],['Control','control'],['Behaviour','behaviour'],['Destination','destination'],['Condition','condition'],['Requirement','requirement']])}\n\n## States\n\n| State | Trigger | Difference | Allowed Actions |\n|---|---|---|---|\n${rows(spec.states,[['State','state'],['Trigger','trigger'],['Difference','difference'],['Allowed Actions','actions']])}\n\n## Navigation\n\n| Trigger | Destination | Condition | Back Behaviour |\n|---|---|---|---|\n${rows(spec.navigation,[['Trigger','trigger'],['Destination','destination'],['Condition','condition'],['Back','backBehaviour']])}\n\n## Open Questions / TBD\n\n${unique([...(spec.openQuestions||[]),...(spec.unknowns||[])]).map(x=>`- ${x}`).join('\n') || '- None recorded'}\n`;
}
function linkedDestination(value, codeMap) {
  const v=String(value||'').trim(); if(!v) return '<span class="tbd">TBD</span>';
  const exact=codeMap.get(v.toUpperCase()); if(exact) return `<a href="#${escapeHtml(exact.anchor)}">${escapeHtml(v)}</a>`;
  const hit=[...codeMap.entries()].find(([code])=>v.toUpperCase().includes(code));
  return hit ? `<a href="#${escapeHtml(hit[1].anchor)}">${escapeHtml(v)}</a>` : escapeHtml(v);
}
function tableHtml(headers, rows) {
  if(!rows.length) return '<div class="empty tbd">TBD — not documented</div>';
  return `<table><thead><tr>${headers.map(h=>`<th>${escapeHtml(h[0])}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${headers.map(h=>`<td>${escapeHtml(r[h[1]]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function renderCombinedHtml(specs, session, proposals) {
  const codeMap=new Map(specs.map(s=>[s.screenCode.toUpperCase(),{anchor:`screen-${slug(s.screenCode)}`}])) ;
  const nav=specs.map(s=>`<a href="#screen-${slug(s.screenCode)}" data-nav-item data-text="${escapeHtml((s.screenCode+' '+s.title+' '+(s.route||'')).toLowerCase())}"><b>${escapeHtml(s.screenCode)}</b><span>${escapeHtml(s.title)}</span><small>${escapeHtml(s.route||'TBD route')}</small></a>`).join('');
  const screens=specs.map(s=>{
    const gaps=proposals.filter(p=>p.screenCode===s.screenCode && !['rejected','resolved'].includes(p.status));
    const actions=s.actions.length?`<div class="action-grid">${s.actions.map(a=>`<div class="action"><b>${escapeHtml(a.action)}</b><span>${escapeHtml(a.behaviour||'')}</span><small>${a.destination?`→ ${linkedDestination(a.destination,codeMap)}`:'<span class="tbd">destination TBD</span>'}${a.condition?` · ${escapeHtml(a.condition)}`:''}</small></div>`).join('')}</div>`:'<div class="empty tbd">TBD — no actions documented</div>';
    const navigation=s.navigation.length?`<ul>${s.navigation.map(n=>`<li><b>${escapeHtml(n.trigger||'Action')}</b> → ${linkedDestination(n.destination,codeMap)}${n.condition?` <em>${escapeHtml(n.condition)}</em>`:''}</li>`).join('')}</ul>`:'<div class="empty tbd">TBD — no navigation documented</div>';
    return `<section class="screen" id="screen-${slug(s.screenCode)}" data-screen data-text="${escapeHtml((s.screenCode+' '+s.title+' '+(s.route||'')+' '+s.related.features.join(' ')).toLowerCase())}">
      <div class="screen-head"><div><span class="code">${escapeHtml(s.screenCode)}</span><h2>${escapeHtml(s.title)}</h2><div class="route">${escapeHtml(s.route||'TBD route')}</div></div><div class="meta"><b>Feature</b> ${escapeHtml(s.related.features.join(', ')||'TBD')}<br><b>Requirement</b> ${escapeHtml(s.related.requirements.join(', ')||'TBD')}</div></div>
      <div class="phone"><div class="browserbar">${escapeHtml(s.route||'route TBD')}</div><div class="canvas"><div class="purpose">${escapeHtml(s.purpose||'TBD')}</div>${s.sections.length?s.sections.map(x=>`<div class="region"><strong>${escapeHtml(x.region)}</strong>${x.component?`<span>${escapeHtml(x.component)}</span>`:''}${x.visibility?`<small>${escapeHtml(x.visibility)}</small>`:''}</div>`).join(''):'<div class="region tbd">TBD — sections not documented</div>'}${s.fields.length?`<div class="field-stack">${s.fields.map(f=>`<label>${escapeHtml(f.name)}${/true|yes|required/i.test(String(f.required))?' *':''}<span class="input">${escapeHtml(f.type||'input')}</span><small>${escapeHtml(f.validation||'')}</small></label>`).join('')}</div>`:''}${actions}</div></div>
      <details open><summary>Screen contract</summary><h3>Fields</h3>${tableHtml([['Field','name'],['Type','type'],['Required','required'],['Validation','validation']],s.fields)}<h3>Actions</h3>${tableHtml([['Action','action'],['Behaviour','behaviour'],['Destination','destination'],['Condition','condition']],s.actions)}<h3>States</h3>${tableHtml([['State','state'],['Trigger','trigger'],['Difference','difference']],s.states)}<h3>Navigation</h3>${navigation}</details>
      <details ${gaps.length?'open':''}><summary>Review gaps (${gaps.length})</summary>${gaps.length?gaps.map(g=>`<div class="gap ${escapeHtml(g.severity||'warning')}"><b>${escapeHtml(g.kind)} · ${escapeHtml(g.status)}</b><p>${escapeHtml(g.summary)}</p></div>`).join(''):'<p>No active review gaps.</p>'}</details>
      <footer>Source: ${escapeHtml(s.sourceDocument)} · hash ${escapeHtml(s.sourceHash.slice(0,12))}</footer>
    </section>`;
  }).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Screen Wireframes</title><style>
  *{box-sizing:border-box}body{margin:0;font:14px system-ui,-apple-system,Segoe UI,sans-serif;background:#f3f4f6;color:#16181d}aside{position:fixed;inset:0 auto 0 0;width:290px;background:#111827;color:#fff;padding:18px;overflow:auto}aside h1{font-size:18px;margin:0 0 6px}aside p{color:#aab2c0;margin:0 0 12px}aside input{width:100%;padding:10px;border:1px solid #374151;border-radius:8px;background:#1f2937;color:#fff;margin-bottom:12px}aside a{display:flex;flex-direction:column;color:#fff;text-decoration:none;padding:10px;border-radius:8px;margin:4px 0}aside a:hover{background:#1f2937}aside span,aside small{color:#cbd5e1}main{margin-left:290px;padding:24px;max-width:1500px}.intro,.screen{background:#fff;border:1px solid #d7dbe2;border-radius:14px;padding:18px;margin:0 0 22px}.screen-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.screen h2{margin:4px 0}.code{font:12px ui-monospace,monospace;background:#eef2ff;padding:4px 7px;border-radius:6px}.route{font:13px ui-monospace,monospace;color:#4b5563}.meta{min-width:260px;color:#4b5563}.phone{border:1px solid #9ca3af;border-radius:14px;overflow:hidden;margin:18px 0;background:#eef0f3;max-width:860px}.browserbar{padding:8px 12px;background:#e5e7eb;font:12px ui-monospace,monospace}.canvas{padding:18px;background:#fff;min-height:230px}.purpose{padding:10px 12px;background:#f9fafb;border-radius:8px;margin-bottom:12px}.region{border:1px dashed #aab1bb;border-radius:9px;padding:12px;margin:8px 0;display:flex;flex-direction:column;gap:4px}.region span,.region small{color:#667085}.field-stack{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:12px 0}.field-stack label{font-weight:600}.input{display:block;height:36px;border:1px solid #c8cdd5;border-radius:7px;margin-top:5px;padding:8px;font-weight:400;color:#858c98}.field-stack small{display:block;color:#7a8290;font-weight:400}.action-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.action{border:1px solid #9ca3af;border-radius:8px;padding:8px 11px;display:flex;flex-direction:column;min-width:130px}.action span,.action small{font-size:12px;color:#606875}.tbd{color:#b45309!important;background:#fffbeb!important}.empty{border:1px dashed #f59e0b;border-radius:8px;padding:10px}table{border-collapse:collapse;width:100%;margin:8px 0 16px}th,td{border:1px solid #d9dde3;padding:7px;text-align:left;vertical-align:top}summary{cursor:pointer;font-weight:700;padding:8px 0}.gap{border-left:4px solid #d97706;background:#fffbeb;padding:9px 12px;margin:8px 0}.gap.high,.gap.error{border-color:#dc2626;background:#fef2f2}footer{font:11px ui-monospace,monospace;color:#737b87;margin-top:12px}@media(max-width:850px){aside{position:static;width:auto}main{margin:0}.screen-head{flex-direction:column}.meta{min-width:0}}
  </style></head><body><aside><h1>Screen Wireframes</h1><p>${session.active?'Active review session':'Generated projection'} · ${specs.length} screen(s)</p><input id="q" placeholder="Search screen / route / feature">${nav||'<p>No Screens in scope.</p>'}</aside><main><div class="intro"><b>Generated review artifact.</b> Canonical truth remains in project documentation. <code>TBD</code> means the docs are incomplete; do not edit this HTML as the source.</div>${screens||'<section class="screen"><p>No Screen entities matched the current scope.</p></section>'}</main><script>const q=document.getElementById('q');q&&q.addEventListener('input',()=>{const v=q.value.toLowerCase();document.querySelectorAll('[data-screen]').forEach(x=>x.style.display=x.dataset.text.includes(v)?'':'none');document.querySelectorAll('[data-nav-item]').forEach(x=>x.style.display=x.dataset.text.includes(v)?'':'none')});</script></body></html>`;
}
function proposals() {
  ensureDir(proposalDir());
  return fs.readdirSync(proposalDir()).filter(x=>x.endsWith('.json')).map(x=>{
    try{return JSON.parse(fs.readFileSync(path.join(proposalDir(),x),'utf8'));}catch{return null;}
  }).filter(Boolean);
}
export function buildWireframeArtifacts() {
  const session=currentSession();
  const screens=scanEntities().entities.filter(e=>e.type==='screen' && inScope(e,session));
  ensureDir(specDir()); ensureDir(generatedDir());
  fs.rmSync(specDir(),{recursive:true,force:true}); ensureDir(specDir());
  fs.rmSync(generatedDir(),{recursive:true,force:true}); ensureDir(generatedDir());
  const specs=screens.map(screenSpec);
  for(const spec of specs){
    writeJson(path.join(specDir(),`${slug(spec.screenCode)}.json`),spec);
    fs.writeFileSync(path.join(generatedDir(),`${slug(spec.screenCode)}.txt`),renderText(spec));
    fs.writeFileSync(path.join(generatedDir(),`${slug(spec.screenCode)}.ascii.txt`),renderAscii(spec));
  }
  const html=renderCombinedHtml(specs,session,proposals());
  fs.mkdirSync(path.dirname(abs(cfg().combinedHtml)),{recursive:true}); fs.writeFileSync(abs(cfg().combinedHtml),html);
  const report=buildWireframeReport({specs,session});
  writeJson(runtimeFile('report.json'),report);
  return report;
}
function loadSpecs(){
  ensureDir(specDir());
  return fs.readdirSync(specDir()).filter(x=>x.endsWith('.json')).map(x=>{
    try{return JSON.parse(fs.readFileSync(path.join(specDir(),x),'utf8'));}catch{return null;}
  }).filter(Boolean);
}
function finding(severity,code,message,screenCode=null,proposalId=null){return{severity,code,message,screenCode,proposalId};}
function buildWireframeReport({specs=loadSpecs(),session=currentSession()}={}){
  const findings=[]; const screenEntities=scanEntities().entities.filter(e=>e.type==='screen'&&inScope(e,session)); const byCode=new Map(specs.map(s=>[s.screenCode,s]));
  for(const e of screenEntities){
    const spec=byCode.get(e.code);
    if(!spec){findings.push(finding(cfg().validation.staleProjectionSeverity,'MISSING_WIREFRAME_PROJECTION',`No generated wireframe projection for ${e.code}.`,e.code));continue;}
    const current=fileHash(abs(e.path));
    if(current!==spec.sourceHash) findings.push(finding(cfg().validation.staleProjectionSeverity,'STALE_WIREFRAME_PROJECTION',`${e.code} changed after the wireframe was generated. Rebuild required.`,e.code));
    if(!spec.route) findings.push(finding(cfg().validation.missingRouteSeverity,'SCREEN_ROUTE_TBD',`${e.code} has no documented route.`,e.code));
    if(!spec.actions.length) findings.push(finding(cfg().validation.screenWithoutActionsSeverity,'SCREEN_ACTIONS_TBD',`${e.code} has no documented actions.`,e.code));
    if(!spec.navigation.length) findings.push(finding(cfg().validation.screenWithoutNavigationSeverity,'SCREEN_NAVIGATION_TBD',`${e.code} has no documented navigation rules.`,e.code));
  }
  const scopeCodes=new Set(screenEntities.map(e=>e.code));
  const ps=proposals().filter(p=>scopeCodes.has(p.screenCode));
  for(const p of ps){
    if(p.status==='accepted') findings.push(finding(cfg().validation.acceptedGapUnresolvedSeverity,'ACCEPTED_GAP_UNRESOLVED',`${p.id} accepted for ${p.screenCode} but not resolved in canonical docs.`,p.screenCode,p.id));
    else if(p.status==='open') findings.push(finding(cfg().validation.openGapSeverity,'OPEN_WIREFRAME_GAP',`${p.id}: ${p.summary}`,p.screenCode,p.id));
  }
  const blocks=new Set(cfg().validation.blockSeverities||['high','error']);
  return {schemaVersion:'1.0',generatedAt:now(),active:!!session.active,scope:session.scope||{type:'all',refs:[]},summary:{screens:screenEntities.length,projected:specs.length,proposals:ps.length,open:ps.filter(x=>x.status==='open').length,accepted:ps.filter(x=>x.status==='accepted').length,resolved:ps.filter(x=>x.status==='resolved').length,findings:findings.length,blocking:findings.filter(x=>blocks.has(x.severity)).length},findings,screens:specs.map(s=>({screenCode:s.screenCode,title:s.title,route:s.route,sourceDocument:s.sourceDocument,sourceHash:s.sourceHash,fields:s.fields.length,actions:s.actions.length,states:s.states.length,navigation:s.navigation.length})),proposals:ps,pass:findings.every(x=>!blocks.has(x.severity))};
}
export function createWireframeGap({screenCode,kind='other',severity='warning',summary,expected='',evidence='Reviewer observation from generated wireframe.',targets=[]}){
  if(!currentSession().active) throw new Error('Wireframe review session is not active. Run wireframe:start first.');
  if(!screenCode||!summary) throw new Error('screenCode and summary are required.');
  if(!cfg().review.allowedGapKinds.includes(kind)) throw new Error(`Unsupported gap kind: ${kind}`);
  const screen=scanEntities().entities.find(e=>e.type==='screen'&&e.code===screenCode); if(!screen) throw new Error(`Screen not found: ${screenCode}`);
  const id=`WFG-${sha256(`${now()}|${screenCode}|${kind}|${summary}`).slice(0,12).toUpperCase()}`;
  const rec={schemaVersion:'1.0',id,createdAt:now(),updatedAt:now(),screenCode,sourceDocument:screen.path,sourceHash:fileHash(abs(screen.path)),kind,severity,summary,expected,evidence,suggestedCanonicalTargets:unique(targets),status:'open',review:null,resolution:null};
  ensureDir(proposalDir()); writeJson(path.join(proposalDir(),`${id.toLowerCase()}.json`),rec); return rec;
}
export function updateWireframeGap({proposalId,status,reviewer,note=''}){
  if(!['open','accepted','rejected','resolved','waived'].includes(status)) throw new Error(`Invalid proposal status: ${status}`);
  ensureDir(proposalDir()); const file=fs.readdirSync(proposalDir()).find(x=>x.toLowerCase()===`${proposalId}.json`.toLowerCase()||x.toLowerCase().includes(String(proposalId).toLowerCase()));
  if(!file) throw new Error(`Proposal not found: ${proposalId}`);
  const p=JSON.parse(fs.readFileSync(path.join(proposalDir(),file),'utf8')); p.status=status;p.updatedAt=now();
  if(['accepted','rejected'].includes(status)) p.review={decision:status,reviewer:reviewer||null,note,at:now()};
  if(['resolved','waived'].includes(status)) p.resolution={status,reviewer:reviewer||null,note,at:now()};
  writeJson(path.join(proposalDir(),file),p); return p;
}
export function checkWireframes({force=false}={}){
  const session=currentSession();
  if(!session.active && cfg().validation.checkOnlyWhenSessionActive && !force){
    const report={...buildWireframeReport({session}),skipped:true,pass:true}; report.summary={...report.summary,blocking:0}; writeJson(runtimeFile('report.json'),report); return report;
  }
  const report=buildWireframeReport({session}); writeJson(runtimeFile('report.json'),report); return report;
}
export function wireframeStatus(){
  const session=currentSession(); const report=buildWireframeReport({session}); writeJson(runtimeFile('report.json'),report); return {session,report,combinedHtml:cfg().combinedHtml};
}
export function closeWireframeSession({reviewer=null,note=''}={}){
  const session=currentSession(); const report=checkWireframes({force:true});
  if(!report.pass) throw new Error(`Cannot close wireframe session: ${report.summary.blocking} blocking finding(s).`);
  const closed={...session,active:false,closedAt:now(),closedBy:reviewer||null,closeNote:note}; writeJson(runtimeFile('session.json'),closed); return closed;
}
