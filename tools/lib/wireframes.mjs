import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT, loadJson, writeJson, ensureDir, scanEntities, fileHash, sha256, escapeHtml
} from './common.mjs';

const DEFAULTS = {
  runtimeDirectory: '.project-docs/wireframes',
  generatedDirectory: 'docs/_generated/wireframes',
  combinedHtml: 'docs/_generated/SCREEN_WIREFRAMES.html',
  promotionDirectory: '.project-docs/wireframes/promotions',
  formats: { default: ['text','ascii','html'] },
  projection: { safePlaceholderDerivation:true, primaryVisibleStateDefault:'Success / Data Ready' },
  visual: {
    renderMode:'low-fidelity-placeholder', renderOnlyPrimaryVisibleStateOnCanvas:true, secondaryUiOutsideCanvas:true, defaultPlatformWhenUnknown:'web-desktop',
    platformProfiles:{
      'web-desktop':{width:1440,height:900,frame:'browser',maxRenderWidth:1180},
      'web-tablet':{width:1024,height:768,frame:'browser',maxRenderWidth:960},
      mobile:{width:390,height:844,frame:'device',maxRenderWidth:390},
      'mobile-large':{width:430,height:932,frame:'device',maxRenderWidth:430}
    }
  },
  review: {
    proposalDirectory: '.project-docs/wireframes/proposals',
    allowedGapKinds: ['missing-screen','missing-section','missing-field','missing-action','missing-lifecycle-action','missing-system-action','missing-api-interaction','missing-state','navigation-gap','startup-flow-gap','feature-gap','requirement-gap','business-rule-gap','validation-gap','test-gap','content-gap','accessibility-gap','missing-display-profile','viewport-not-defined','platform-profile-missing','missing-layout-region','screen-layout-too-vague','missing-component','missing-component-detail','missing-primary-visible-state','missing-hidden-interaction-note','other']
  },
  validation: {
    checkOnlyWhenSessionActive: true,
    staleProjectionSeverity: 'high',
    acceptedGapUnresolvedSeverity: 'high',
    openGapSeverity: 'warning',
    missingRouteSeverity: 'warning',
    screenWithoutActionsSeverity: 'warning',
    screenWithoutNavigationSeverity: 'warning',
    missingDisplayProfileSeverity: 'warning',
    missingViewportSeverity: 'warning',
    missingPrimaryStateSeverity: 'warning',
    missingVisualRegionsSeverity: 'warning',
    missingVisibleComponentsSeverity: 'warning',
    vagueLayoutSeverity: 'warning',
    blockSeverities: ['high','error']
  }
};

function cfg() {
  const raw = loadJson('registry/wireframe-workflow.json', {});
  return {
    ...DEFAULTS,
    ...raw,
    formats: { ...DEFAULTS.formats, ...(raw.formats || {}) },
    projection: { ...DEFAULTS.projection, ...(raw.projection || {}) },
    visual: { ...DEFAULTS.visual, ...(raw.visual || {}), platformProfiles:{...DEFAULTS.visual.platformProfiles,...(raw.visual?.platformProfiles||{})} },
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
function normalizeLifecycleActions(rows) {
  return rows.map(r => ({
    trigger: firstValue(r,['event','trigger','lifecycle','item'], Object.values(r)[0] || ''),
    action: firstValue(r,['action','work','operation']),
    effect: firstValue(r,['api','effect','side effect']),
    success: firstValue(r,['success','on success']),
    failure: firstValue(r,['failure','error','on failure']),
    requirement: firstValue(r,['requirement','related'])
  })).filter(x => x.trigger || x.action);
}
function normalizeSystemActions(rows) {
  return rows.map(r => ({
    action: firstValue(r,['action','system action','item'], Object.values(r)[0] || ''),
    trigger: firstValue(r,['trigger','owner','when']),
    effect: firstValue(r,['effect','behaviour','behavior','result']),
    data: firstValue(r,['api','data','source']),
    destination: firstValue(r,['next state','destination','target','route']),
    requirement: firstValue(r,['requirement','related'])
  })).filter(x => x.action);
}
function normalizeApiInteractions(rows) {
  return rows.map(r => ({
    trigger: firstValue(r,['trigger','event','action','item'], Object.values(r)[0] || ''),
    api: firstValue(r,['api','endpoint']),
    purpose: firstValue(r,['purpose','reason','description']),
    loadingState: firstValue(r,['loading state','loading']),
    success: firstValue(r,['success','on success']),
    failure: firstValue(r,['failure','error','on failure']),
    requirement: firstValue(r,['requirement','related'])
  })).filter(x => x.trigger || x.api);
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

function propertyMap(markdown) {
  const out={};
  const rows=parseTable(markdown);
  for(const r of rows){
    const key=firstValue(r,['property','key','name'],Object.values(r)[0]||'').toLowerCase().replace(/[^a-z0-9]+/g,' ' ).trim();
    const value=firstValue(r,['value'],Object.values(r)[1]||'');
    if(key) out[key]=value;
  }
  for(const line of String(markdown||'').split('\n')){
    const m=line.trim().replace(/^[-*+]\s+/,'').match(/^([^:|]+):\s*(.+)$/);
    if(m){ const key=m[1].toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); if(!out[key]) out[key]=cleanCell(m[2]); }
  }
  return out;
}
function parseViewport(value){
  const m=String(value||'').match(/(\d{2,5})\s*[x×]\s*(\d{2,5})/i);
  return m ? {width:Number(m[1]),height:Number(m[2])} : null;
}
function inferProjectPlatform(){
  const profile=loadJson('project.profile.json',{});
  const types=unique(arr(profile.projectTypes).map(x=>String(x).toLowerCase()));
  const stacks=unique(arr(profile.technologyStacks).map(x=>String(x).toLowerCase()));
  if(types.includes('mobile') || stacks.some(x=>['flutter','react-native','ios-swiftui','android-compose'].includes(x))) return {platform:'mobile',source:'project-profile'};
  if(types.includes('web') || stacks.some(x=>['reactjs','nextjs'].includes(x))) return {platform:'web-desktop',source:'project-profile'};
  return {platform:cfg().visual.defaultPlatformWhenUnknown||'web-desktop',source:'fallback'};
}
function buildDisplayProfile(body){
  const raw=section(body,['Visual Display Profile','Display Profile','Wireframe Display Profile']);
  const props=propertyMap(raw);
  const inferred=inferProjectPlatform();
  const explicitPlatform=props.platform || props.device || props.profile || '';
  const platform=explicitPlatform || inferred.platform;
  const platformCfg=cfg().visual.platformProfiles?.[platform] || cfg().visual.platformProfiles?.[cfg().visual.defaultPlatformWhenUnknown] || {width:1440,height:900,frame:'browser',maxRenderWidth:1180};
  const explicitViewport=parseViewport(props.viewport || props['viewport size'] || props['screen size']);
  const viewport=explicitViewport || {width:Number(platformCfg.width||1440),height:Number(platformCfg.height||900)};
  const primary=props['primary visible state'] || props['primary state'] || props.state || cfg().projection.primaryVisibleStateDefault || 'Success / Data Ready';
  return {
    platform, viewport, primaryVisibleState:primary,
    canvasMode:props['canvas mode'] || props.canvas || 'application',
    density:props.density || 'medium',
    frame:platformCfg.frame || (platform.startsWith('mobile')?'device':'browser'),
    maxRenderWidth:Number(platformCfg.maxRenderWidth || viewport.width),
    source: explicitPlatform || explicitViewport || props['primary visible state'] ? 'explicit' : inferred.source,
    explicit: !!raw.trim(), explicitViewport:!!explicitViewport, explicitPrimaryState:!!(props['primary visible state']||props['primary state']||props.state)
  };
}
function normalizeVisualRegions(rows){
  return rows.map((r,i)=>({
    id:firstValue(r,['region id','region','area','item'],Object.values(r)[0]||`region-${i+1}`),
    parent:firstValue(r,['parent'],'root')||'root',
    position:firstValue(r,['position','placement'],'main')||'main',
    layout:firstValue(r,['layout','direction'],'column')||'column',
    size:firstValue(r,['size','width','span'],'fluid')||'fluid',
    purpose:firstValue(r,['purpose','content','role','description']),
    notes:firstValue(r,['notes','note'])
  })).filter(x=>x.id);
}
function normalizeVisibleComponents(rows){
  return rows.map((r,i)=>({
    region:firstValue(r,['region','area'],'main')||'main',
    id:firstValue(r,['component id','id','component','name'],`component-${i+1}`),
    type:(firstValue(r,['type','component type'],'custom')||'custom').toLowerCase().replace(/\s+/g,'-'),
    placeholder:firstValue(r,['placeholder','label','title']),
    size:firstValue(r,['size','span','width'],'auto')||'auto',
    count:Math.max(1,Math.min(12,Number(firstValue(r,['count','repeat'],'1'))||1)),
    role:firstValue(r,['content','role','purpose','description']),
    visibility:firstValue(r,['visibility','state','condition']),
    notes:firstValue(r,['notes','note'])
  })).filter(x=>x.id||x.placeholder||x.type);
}
function normalizeHiddenSecondaryUi(rows){
  return rows.map(r=>({
    ui:firstValue(r,['ui','name','item'],Object.values(r)[0]||''),
    trigger:firstValue(r,['trigger','when']),
    type:firstValue(r,['type'],'secondary'),
    description:firstValue(r,['description','content','purpose']),
    related:firstValue(r,['related','action','requirement'])
  })).filter(x=>x.ui);
}
function visualCompleteness(displayProfile,visualRegions,visibleComponents,sections){
  const vagueSection=sections.some(x=>!x.component && !x.notes);
  return {
    explicitDisplayProfile:!!displayProfile.explicit,
    explicitViewport:!!displayProfile.explicitViewport,
    explicitPrimaryState:!!displayProfile.explicitPrimaryState,
    visualRegions:visualRegions.length,
    visibleComponents:visibleComponents.length,
    vagueLayout:visualRegions.length===0 && (sections.length===0 || vagueSection)
  };
}

function related(meta) {
  const r = meta.related && typeof meta.related === 'object' ? meta.related : {};
  return {
    modules: unique(arr(r.modules)), features: unique(arr(r.features)), requirements: unique(arr(r.requirements)),
    businessRules: unique(arr(r.business_rules || r.businessRules)), flows: unique(arr(r.flows)), screens: unique(arr(r.screens))
  };
}
function screenSpec(entity) {
  const displayProfile=buildDisplayProfile(entity.body);
  const visualRegionsRaw=section(entity.body,['Visual Layout Regions','Wireframe Layout Regions']);
  const visibleComponentsRaw=section(entity.body,['Visible Components','Primary Visible Components']);
  const hiddenSecondaryRaw=section(entity.body,['Hidden / Secondary UI','Secondary UI','Hidden UI']);
  const layoutRaw = section(entity.body, ['Layout / Sections','Screen Composition / Wireframe Regions','Sections']);
  const fieldsRaw = section(entity.body, 'Fields');
  const actionsRaw = section(entity.body, ['User Actions','Actions']);
  const lifecycleRaw = section(entity.body, 'Lifecycle Actions');
  const systemRaw = section(entity.body, 'System Actions');
  const apiRaw = section(entity.body, 'API Interactions');
  const statesRaw = section(entity.body, ['UI States','States']);
  const navRaw = section(entity.body, ['Navigation Rules','Navigation']);
  const unknowns = unique([
    ...bullets(section(entity.body, ['Open Questions / Mockup Gaps','Open Questions','Gaps / TBD'])),
    ...[visualRegionsRaw,visibleComponentsRaw,hiddenSecondaryRaw,layoutRaw,fieldsRaw,actionsRaw,lifecycleRaw,systemRaw,apiRaw,statesRaw,navRaw].flatMap(x => /\bTBD\b/i.test(x) ? ['TBD remains in source Screen documentation'] : [])
  ]);
  const routeBody = plainText(section(entity.body, 'Route'));
  const route = String(entity.meta.route || routeBody || '').trim() || null;
  const purpose = plainText(section(entity.body, 'Purpose')) || 'TBD';
  const sections = normalizeSections(parseTable(layoutRaw), layoutRaw);
  const visualRegions=normalizeVisualRegions(parseTable(visualRegionsRaw));
  const visibleComponents=normalizeVisibleComponents(parseTable(visibleComponentsRaw));
  const hiddenSecondaryUi=normalizeHiddenSecondaryUi(parseTable(hiddenSecondaryRaw));
  const fields = normalizeFields(normalizedRows(fieldsRaw));
  const userActions = normalizeActions(normalizedRows(actionsRaw));
  const lifecycleActions = normalizeLifecycleActions(normalizedRows(lifecycleRaw));
  const systemActions = normalizeSystemActions(normalizedRows(systemRaw));
  const apiInteractions = normalizeApiInteractions(normalizedRows(apiRaw));
  const states = normalizeStates(parseTable(statesRaw), statesRaw);
  const navigation = normalizeNavigation(normalizedRows(navRaw));
  return {
    schemaVersion: '1.2', generatedAt: now(), screenCode: entity.code, title: entity.title, route, purpose,
    sourceDocument: entity.path, sourceHash: fileHash(abs(entity.path)), sourceRevision: Number(entity.revision || 0),
    related: related(entity.meta), displayProfile, visualRegions, visibleComponents, hiddenSecondaryUi,
    visualCompleteness:visualCompleteness(displayProfile,visualRegions,visibleComponents,sections),
    sections, fields, actions:userActions, userActions, lifecycleActions, systemActions, apiInteractions, states, navigation,
    validations: normalizedRows(section(entity.body, ['Validation & Messages','Validation'])),
    openQuestions: bullets(section(entity.body, ['Open Questions / Mockup Gaps','Open Questions'])), unknowns
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
  const width=88; const bar='+'+'-'.repeat(width-2)+'+'; const lines=[bar, asciiBoxLine(`${spec.screenCode} - ${spec.title}`,width), asciiBoxLine(`Route: ${spec.route || 'TBD'}`,width), bar];
  const userActions=spec.userActions||spec.actions||[];
  lines.push(asciiBoxLine(`PURPOSE: ${spec.purpose || 'TBD'}`,width));
  lines.push(asciiBoxLine(`DISPLAY: ${spec.displayProfile?.platform||'TBD'} ${spec.displayProfile?.viewport?.width||'?'}x${spec.displayProfile?.viewport?.height||'?'} | state: ${spec.displayProfile?.primaryVisibleState||'TBD'}`,width),bar);
  lines.push(asciiBoxLine('SECTIONS',width));
  if(spec.sections.length) for(const s of spec.sections) for(const [i,l] of wrap(`- ${s.region}${s.component?`: ${s.component}`:''}`,width-4).entries()) lines.push(asciiBoxLine(i?`  ${l}`:l,width)); else lines.push(asciiBoxLine('- TBD',width));
  lines.push(bar,asciiBoxLine('VISIBLE COMPONENTS',width));
  if(spec.visibleComponents?.length) for(const c of spec.visibleComponents) lines.push(asciiBoxLine(`[${c.type||'custom'}] ${c.region||'main'} :: ${c.placeholder||c.id}${c.count>1?` x${c.count}`:''}`,width)); else lines.push(asciiBoxLine('- visual component inventory not documented',width));
  lines.push(bar,asciiBoxLine('FIELDS',width));
  if(spec.fields.length) for(const f of spec.fields) lines.push(asciiBoxLine(`[${f.type||'field'}] ${f.name}${String(f.required).toLowerCase()==='true'||/yes|required/i.test(f.required)?' *':''}${f.validation?` | ${f.validation}`:''}`,width)); else lines.push(asciiBoxLine('- none / TBD',width));
  lines.push(bar,asciiBoxLine('USER ACTIONS',width));
  if(userActions.length) for(const a of userActions) lines.push(asciiBoxLine(`[ ${a.action} ]${a.destination?` -> ${a.destination}`:''}${a.condition?` (${a.condition})`:''}`,width)); else lines.push(asciiBoxLine('- none documented',width));
  lines.push(bar,asciiBoxLine('LIFECYCLE ACTIONS',width));
  if(spec.lifecycleActions?.length) for(const a of spec.lifecycleActions) lines.push(asciiBoxLine(`${a.trigger||'event'} => ${a.action||a.effect||'TBD'}${a.effect&&a.action?` | ${a.effect}`:''}${a.success?` | success: ${a.success}`:''}${a.failure?` | failure: ${a.failure}`:''}`,width)); else lines.push(asciiBoxLine('- none documented',width));
  lines.push(bar,asciiBoxLine('SYSTEM ACTIONS',width));
  if(spec.systemActions?.length) for(const a of spec.systemActions) lines.push(asciiBoxLine(`${a.action}${a.trigger?` <= ${a.trigger}`:''}${a.data?` | ${a.data}`:''}${a.destination?` -> ${a.destination}`:''}`,width)); else lines.push(asciiBoxLine('- none documented',width));
  lines.push(bar,asciiBoxLine('API INTERACTIONS',width));
  if(spec.apiInteractions?.length) for(const a of spec.apiInteractions) lines.push(asciiBoxLine(`${a.trigger||'trigger'} => ${a.api||'API TBD'}${a.purpose?` | ${a.purpose}`:''}${a.success?` | success: ${a.success}`:''}${a.failure?` | failure: ${a.failure}`:''}`,width)); else lines.push(asciiBoxLine('- none documented',width));
  lines.push(bar,asciiBoxLine('STATES',width));
  lines.push(asciiBoxLine(spec.states.length?spec.states.map(s=>s.state).join(' | '):'TBD',width));
  lines.push(bar,asciiBoxLine('NAVIGATION',width));
  if(spec.navigation.length) for(const n of spec.navigation) lines.push(asciiBoxLine(`${n.trigger||'Action'} -> ${n.destination||'TBD'}${n.condition?` (${n.condition})`:''}`,width)); else lines.push(asciiBoxLine('- TBD',width));
  lines.push(bar);
  return lines.join('\n')+'\n';
}
function renderText(spec) {
  const rows=(items, cols)=>items.length?items.map(x=>'| '+cols.map(([label,key])=>cleanCell(x[key]||'')).join(' | ')+' |').join('\n'):'| TBD |'+(cols.length>1?' '+Array(cols.length-1).fill('|').join(' '):'');
  const userActions=spec.userActions||spec.actions||[];
  return `# ${spec.screenCode} — ${spec.title}

Source: ${spec.sourceDocument}
Source hash: ${spec.sourceHash}
Route: ${spec.route || 'TBD'}
Purpose: ${spec.purpose || 'TBD'}
Features: ${spec.related.features.join(', ') || 'TBD'}
Requirements: ${spec.related.requirements.join(', ') || 'TBD'}

## Visual Display Profile

| Property | Value |
|---|---|
| Platform | ${cleanCell(spec.displayProfile?.platform||'TBD')} |
| Viewport | ${spec.displayProfile?.viewport?`${spec.displayProfile.viewport.width}x${spec.displayProfile.viewport.height}`:'TBD'} |
| Primary Visible State | ${cleanCell(spec.displayProfile?.primaryVisibleState||'TBD')} |
| Canvas Mode | ${cleanCell(spec.displayProfile?.canvasMode||'TBD')} |
| Density | ${cleanCell(spec.displayProfile?.density||'TBD')} |
| Profile Source | ${cleanCell(spec.displayProfile?.source||'TBD')} |

## Visual Layout Regions

| Region | Parent | Position | Layout | Size | Purpose |
|---|---|---|---|---|---|
${rows(spec.visualRegions||[],[['Region','id'],['Parent','parent'],['Position','position'],['Layout','layout'],['Size','size'],['Purpose','purpose']])}

## Visible Components

| Region | Component | Type | Placeholder | Size | Count | Role | State |
|---|---|---|---|---|---|---|---|
${rows(spec.visibleComponents||[],[['Region','region'],['Component','id'],['Type','type'],['Placeholder','placeholder'],['Size','size'],['Count','count'],['Role','role'],['State','visibility']])}

## Hidden / Secondary UI

| UI | Trigger | Type | Description | Related |
|---|---|---|---|---|
${rows(spec.hiddenSecondaryUi||[],[['UI','ui'],['Trigger','trigger'],['Type','type'],['Description','description'],['Related','related']])}

## Sections

| Region | Component | Visibility | Notes |
|---|---|---|---|
${rows(spec.sections,[['Region','region'],['Component','component'],['Visibility','visibility'],['Notes','notes']])}

## Fields

| Field | Type | Required | Validation | Notes |
|---|---|---|---|---|
${rows(spec.fields,[['Field','name'],['Type','type'],['Required','required'],['Validation','validation'],['Notes','notes']])}

## User Actions

| Action | Control | Behaviour | Destination | Condition | Requirement |
|---|---|---|---|---|---|
${rows(userActions,[['Action','action'],['Control','control'],['Behaviour','behaviour'],['Destination','destination'],['Condition','condition'],['Requirement','requirement']])}

## Lifecycle Actions

| Event / Trigger | Action | API / Effect | Success | Failure | Requirement |
|---|---|---|---|---|---|
${rows(spec.lifecycleActions||[],[['Trigger','trigger'],['Action','action'],['Effect','effect'],['Success','success'],['Failure','failure'],['Requirement','requirement']])}

## System Actions

| Action | Trigger / Owner | Effect | API / Data | Next State / Destination | Requirement |
|---|---|---|---|---|---|
${rows(spec.systemActions||[],[['Action','action'],['Trigger','trigger'],['Effect','effect'],['Data','data'],['Destination','destination'],['Requirement','requirement']])}

## API Interactions

| Trigger | API | Purpose | Loading State | Success | Failure | Requirement |
|---|---|---|---|---|---|---|
${rows(spec.apiInteractions||[],[['Trigger','trigger'],['API','api'],['Purpose','purpose'],['Loading','loadingState'],['Success','success'],['Failure','failure'],['Requirement','requirement']])}

## States

| State | Trigger | Difference | Allowed Actions |
|---|---|---|---|
${rows(spec.states,[['State','state'],['Trigger','trigger'],['Difference','difference'],['Allowed Actions','actions']])}

## Navigation

| Trigger | Destination | Condition | Back Behaviour |
|---|---|---|---|
${rows(spec.navigation,[['Trigger','trigger'],['Destination','destination'],['Condition','condition'],['Back','backBehaviour']])}

## Open Questions / TBD

${unique([...(spec.openQuestions||[]),...(spec.unknowns||[])]).map(x=>`- ${x}`).join('\n') || '- None recorded'}
`;
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
function inferPlaceholderType(text){
  const v=String(text||'').toLowerCase();
  if(/\blogo\b/.test(v)) return 'logo';
  if(/hero|banner/.test(v)) return 'hero';
  if(/image|photo|thumbnail|picture/.test(v)) return 'image';
  if(/avatar|profile image/.test(v)) return 'avatar';
  if(/tab/.test(v)) return 'tabs';
  if(/table|grid rows/.test(v)) return 'table';
  if(/card/.test(v)) return 'card-grid';
  if(/list|feed/.test(v)) return 'list';
  if(/chart|graph/.test(v)) return 'chart';
  if(/stat|metric|kpi/.test(v)) return 'stat';
  if(/nav|sidebar|menu/.test(v)) return 'navigation';
  if(/loading|spinner/.test(v)) return 'loading';
  if(/heading|title/.test(v)) return 'heading';
  if(/text|description|paragraph|copy/.test(v)) return 'text';
  return 'custom';
}
function fieldPlaceholderType(type){
  const v=String(type||'').toLowerCase();
  if(v.includes('password'))return'password'; if(v.includes('select')||v.includes('dropdown'))return'select'; if(v.includes('textarea'))return'textarea';
  if(v.includes('checkbox'))return'checkbox'; if(v.includes('radio'))return'radio'; if(v.includes('search'))return'search'; return'input';
}
function componentVisibleForPrimary(c,primary){
  const v=String(c.visibility||'').toLowerCase().trim(); if(!v)return true;
  if(/hidden|modal|popover|hover|focus|expanded|drawer/.test(v))return false;
  if(/always|all states|default/.test(v))return true;
  const p=String(primary||'').toLowerCase(); const pWords=p.split(/[^a-z0-9]+/).filter(x=>x.length>2);
  if(v===p || p.includes(v) || v.includes(p))return true;
  return pWords.some(x=>v.includes(x));
}
function alternateStateComponents(spec){
  if(!spec.visibleComponents?.length)return [];
  return spec.visibleComponents.filter(c=>!componentVisibleForPrimary(c,spec.displayProfile?.primaryVisibleState));
}
function derivedVisualComponents(spec){
  if(spec.visibleComponents?.length) return spec.visibleComponents.filter(c=>componentVisibleForPrimary(c,spec.displayProfile?.primaryVisibleState)).map(x=>({...x,derived:false}));
  if(!cfg().projection.safePlaceholderDerivation) return [];
  const out=[]; let n=0;
  for(const sec of spec.sections||[]) if(sec.component){ n++; out.push({region:slug(sec.region||'main'),id:`derived-section-${n}`,type:inferPlaceholderType(sec.component),placeholder:sec.component,size:'full',count:1,role:sec.notes||sec.component,visibility:sec.visibility||'',notes:'Derived from Layout / Sections',derived:true}); }
  for(const f of spec.fields||[]){ n++; out.push({region:'main',id:`derived-field-${n}`,type:fieldPlaceholderType(f.type),placeholder:f.name,size:'auto',count:1,role:f.validation||'',visibility:'',notes:'Derived from Fields',derived:true}); }
  for(const a of spec.userActions||spec.actions||[]){ n++; const c=String(a.control||'').toLowerCase(); out.push({region:'main',id:`derived-action-${n}`,type:c.includes('link')?'link':c.includes('tab')?'tabs':'button',placeholder:a.action,size:'auto',count:1,role:a.behaviour||'',visibility:a.condition||'',notes:'Derived from User Actions',derived:true}); }
  return out;
}
function derivedVisualRegions(spec,components){
  if(spec.visualRegions?.length) return spec.visualRegions.map(x=>({...x,derived:false}));
  if(spec.sections?.length) return spec.sections.map((x,i)=>({id:slug(x.region||`region-${i+1}`),parent:'root',position:'main',layout:'column',size:'fluid',purpose:x.component||x.region,notes:'Derived from Layout / Sections',derived:true}));
  return [{id:'main',parent:'root',position:'main',layout:'column',size:'fluid',purpose:spec.purpose||'Main content',notes:'Fallback review region',derived:true}];
}
function componentPlaceholderHtml(c){
  const type=String(c.type||'custom').toLowerCase(); const label=escapeHtml(c.placeholder||c.id||type); const role=c.role?`<small>${escapeHtml(c.role)}</small>`:'';
  const one=()=>{
    if(['image','hero'].includes(type)) return `<div class="wf-component wf-image ${type==='hero'?'wf-hero':''}"><span>▧</span><b>${label}</b>${role}</div>`;
    if(type==='logo') return `<div class="wf-component wf-logo"><span>LOGO</span>${role}</div>`;
    if(type==='avatar') return `<div class="wf-component wf-avatar"><span></span><b>${label}</b></div>`;
    if(type==='heading') return `<div class="wf-component wf-heading"><b>${label}</b><i></i></div>`;
    if(['text','label'].includes(type)) return `<div class="wf-component wf-text"><b>${label}</b><i></i><i></i><i class="short"></i></div>`;
    if(['button','link'].includes(type)) return `<div class="wf-component wf-${type}">${label}</div>`;
    if(type==='tabs') return `<div class="wf-component wf-tabs">${Array.from({length:Math.max(2,Math.min(5,c.count||3))},(_,i)=>`<span class="${i===0?'active':''}">${i===0?label:`Tab ${i+1}`}</span>`).join('')}</div>`;
    if(['input','password','search','select','textarea'].includes(type)) return `<label class="wf-component wf-field"><b>${label}</b><span class="wf-input ${type==='textarea'?'textarea':''}">${type==='select'?'Select ▾':type==='search'?'Search…':''}</span>${role}</label>`;
    if(['checkbox','radio'].includes(type)) return `<div class="wf-component wf-choice"><span class="${type}"></span>${label}</div>`;
    if(['badge','chip'].includes(type)) return `<span class="wf-component wf-chip">${label}</span>`;
    if(type==='card'||type==='card-grid') return `<div class="wf-component wf-card"><div class="thumb"></div><b>${label}</b><i></i><i class="short"></i></div>`;
    if(type==='list') return `<div class="wf-component wf-list"><b>${label}</b>${Array.from({length:3},()=>'<div><span></span><i></i></div>').join('')}</div>`;
    if(type==='table') return `<div class="wf-component wf-table"><b>${label}</b><div class="tr head"><i></i><i></i><i></i></div>${Array.from({length:3},()=>'<div class="tr"><i></i><i></i><i></i></div>').join('')}</div>`;
    if(type==='chart') return `<div class="wf-component wf-chart"><b>${label}</b><div>${[35,68,48,78,56,85].map(h=>`<i style="height:${h}%"></i>`).join('')}</div></div>`;
    if(type==='stat') return `<div class="wf-component wf-stat"><small>${label}</small><b>00,000</b><i></i></div>`;
    if(type==='navigation') return `<div class="wf-component wf-nav"><b>${label}</b>${Array.from({length:4},(_,i)=>`<span>${i===0?'●':'○'} Item ${i+1}</span>`).join('')}</div>`;
    if(type==='divider') return '<div class="wf-component wf-divider"></div>';
    if(['loading','skeleton'].includes(type)) return `<div class="wf-component wf-skeleton"><b>${label}</b><i></i><i></i><i class="short"></i></div>`;
    if(type==='spacer') return '<div class="wf-component wf-spacer"></div>';
    return `<div class="wf-component wf-custom"><b>${label}</b><span>${escapeHtml(c.type||'custom')}</span>${role}</div>`;
  };
  if(type==='card-grid') return `<div class="wf-card-grid">${Array.from({length:Math.max(2,Math.min(8,c.count||4))},one).join('')}</div>`;
  if(c.count>1 && !['tabs'].includes(type)) return `<div class="wf-repeat">${Array.from({length:Math.min(8,c.count)},one).join('')}</div>`;
  return one();
}
function percentSize(value,viewportWidth,fallback){
  const v=String(value||'').trim(); const pct=v.match(/(\d+(?:\.\d+)?)\s*%/); if(pct)return `${Math.max(8,Math.min(45,Number(pct[1])))}%`;
  const px=v.match(/(\d{2,4})\s*(?:px)?/i); if(px&&viewportWidth)return `${Math.max(8,Math.min(45,Number(px[1])/viewportWidth*100)).toFixed(1)}%`;
  return fallback;
}
function visualCanvasHtml(spec){
  const profile=spec.displayProfile||{}; const vp=profile.viewport||{width:1440,height:900}; const comps=derivedVisualComponents(spec); const regions=derivedVisualRegions(spec,comps);
  const byRegion=new Map(); for(const c of comps){const key=slug(c.region||'main');if(!byRegion.has(key))byRegion.set(key,[]);byRegion.get(key).push(c);}
  const buckets={top:[],left:[],main:[],right:[],bottom:[]};
  for(const r of regions){const pos=String(r.position||'main').toLowerCase(); const bucket=pos.includes('top')||pos.includes('header')?'top':pos.includes('left')||pos.includes('side')?'left':pos.includes('right')||pos.includes('aside')?'right':pos.includes('bottom')||pos.includes('footer')?'bottom':'main'; buckets[bucket].push(r);}
  const claimed=new Set(regions.map(r=>slug(r.id))); const orphan=[...byRegion.keys()].filter(k=>!claimed.has(k)); if(orphan.length){buckets.main.push({id:'main',position:'main',layout:'column',size:'fluid',purpose:'Unmapped visible components',derived:true});}
  const regionHtml=r=>{const key=slug(r.id);const items=[...(byRegion.get(key)||[])]; if(key==='main'&&orphan.length)for(const k of orphan)items.push(...(byRegion.get(k)||[])); return `<div class="wf-region layout-${escapeHtml(r.layout||'column')} ${r.derived?'derived':''}"><div class="wf-region-label"><b>${escapeHtml(r.id)}</b>${r.purpose?`<span>${escapeHtml(r.purpose)}</span>`:''}</div><div class="wf-region-content">${items.length?items.map(componentPlaceholderHtml).join(''):'<div class="wf-empty-region">No visible components documented</div>'}</div></div>`;};
  const zone=(name,rs)=>rs.length?`<div class="wf-zone wf-zone-${name}">${rs.map(regionHtml).join('')}</div>`:'';
  const leftSize=percentSize(buckets.left[0]?.size,vp.width,'20%'); const rightSize=percentSize(buckets.right[0]?.size,vp.width,'23%');
  const gridStyle=`--left:${buckets.left.length?leftSize:'0px'};--right:${buckets.right.length?rightSize:'0px'};`;
  const canvas=`<div class="wf-visual-grid" style="${gridStyle}">${zone('top',buckets.top)}${zone('left',buckets.left)}${zone('main',buckets.main)}${zone('right',buckets.right)}${zone('bottom',buckets.bottom)}</div>`;
  const frameClass=profile.frame==='device'||String(profile.platform||'').startsWith('mobile')?'device':'browser'; const maxW=Math.min(Number(profile.maxRenderWidth||vp.width),1180);
  const chrome=frameClass==='browser'?`<div class="wf-browser-chrome"><span></span><span></span><span></span><i>${escapeHtml(spec.route||'route')}</i></div>`:`<div class="wf-device-notch"></div>`;
  return `<div class="visual-summary"><span>${escapeHtml(profile.platform||'unknown')}</span><b>${vp.width} × ${vp.height}</b><span>Primary state: ${escapeHtml(profile.primaryVisibleState||'TBD')}</span>${profile.source!=='explicit'?`<em>profile ${escapeHtml(profile.source||'fallback')}</em>`:''}</div><div class="wf-frame ${frameClass}" style="width:min(100%,${maxW}px);aspect-ratio:${vp.width}/${vp.height}">${chrome}<div class="wf-viewport">${canvas}</div></div>`;
}
function renderCombinedHtml(specs, session, proposals) {
  const codeMap=new Map(specs.map(s=>[s.screenCode.toUpperCase(),{anchor:`screen-${slug(s.screenCode)}`}])) ;
  const nav=specs.map(s=>`<a href="#screen-${slug(s.screenCode)}" data-nav-item data-text="${escapeHtml((s.screenCode+' '+s.title+' '+(s.route||'')).toLowerCase())}"><b>${escapeHtml(s.screenCode)}</b><span>${escapeHtml(s.title)}</span><small>${escapeHtml(s.displayProfile?.platform||'')} · ${escapeHtml(s.route||'TBD route')}</small></a>`).join('');
  const screens=specs.map(s=>{
    const gaps=proposals.filter(p=>p.screenCode===s.screenCode && !['rejected','resolved'].includes(p.status)); const userActions=s.userActions||s.actions||[];
    const navigation=s.navigation.length?`<ul>${s.navigation.map(n=>`<li><b>${escapeHtml(n.trigger||'Action')}</b> → ${linkedDestination(n.destination,codeMap)}${n.condition?` <em>${escapeHtml(n.condition)}</em>`:''}</li>`).join('')}</ul>`:'<div class="empty tbd">TBD — no navigation documented</div>';
    const profileRows=[{property:'Platform',value:s.displayProfile?.platform},{property:'Viewport',value:s.displayProfile?.viewport?`${s.displayProfile.viewport.width}x${s.displayProfile.viewport.height}`:''},{property:'Primary state',value:s.displayProfile?.primaryVisibleState},{property:'Canvas mode',value:s.displayProfile?.canvasMode},{property:'Source',value:s.displayProfile?.source}];
    return `<section class="screen" id="screen-${slug(s.screenCode)}" data-screen data-text="${escapeHtml((s.screenCode+' '+s.title+' '+(s.route||'')+' '+s.related.features.join(' ')).toLowerCase())}">
      <div class="screen-head"><div><span class="code">${escapeHtml(s.screenCode)}</span><h2>${escapeHtml(s.title)}</h2><div class="route">${escapeHtml(s.route||'TBD route')}</div></div><div class="meta"><b>Feature</b> ${escapeHtml(s.related.features.join(', ')||'TBD')}<br><b>Requirement</b> ${escapeHtml(s.related.requirements.join(', ')||'TBD')}</div></div>
      <div class="wireframe-layout"><div class="visual-column"><h3>Primary visible state</h3>${visualCanvasHtml(s)}</div><aside class="secondary-panel"><h3>Secondary / hidden UI</h3>${s.hiddenSecondaryUi?.length?tableHtml([['UI','ui'],['Trigger','trigger'],['Type','type'],['Description','description']],s.hiddenSecondaryUi):'<div class="empty">No modal/popover/hover-only UI documented.</div>'}${alternateStateComponents(s).length?`<h3>Other-state components</h3>${tableHtml([['Component','id'],['Type','type'],['State','visibility']],alternateStateComponents(s))}`:''}<h3>Visual completeness</h3><ul class="checklist"><li>${s.visualCompleteness?.explicitDisplayProfile?'✓':'△'} Display profile</li><li>${s.visualCompleteness?.visualRegions?'✓':'△'} Layout regions</li><li>${s.visualCompleteness?.visibleComponents?'✓':'△'} Visible component inventory</li><li>${s.visualCompleteness?.explicitPrimaryState?'✓':'△'} Primary state explicit</li></ul></aside></div>
      <details><summary>Visual wireframe specification</summary><h3>Display profile</h3>${tableHtml([['Property','property'],['Value','value']],profileRows)}<h3>Layout regions</h3>${tableHtml([['Region','id'],['Position','position'],['Layout','layout'],['Size','size'],['Purpose','purpose']],s.visualRegions||[])}<h3>Visible components</h3>${tableHtml([['Region','region'],['Component','id'],['Type','type'],['Placeholder','placeholder'],['Size','size'],['Count','count'],['State','visibility']],s.visibleComponents||[])}</details>
      <details><summary>Functional screen contract</summary><h3>Fields</h3>${tableHtml([['Field','name'],['Type','type'],['Required','required'],['Validation','validation']],s.fields)}<h3>User Actions</h3>${tableHtml([['Action','action'],['Behaviour','behaviour'],['Destination','destination'],['Condition','condition']],userActions)}<h3>Lifecycle Actions</h3>${tableHtml([['Event / Trigger','trigger'],['Action','action'],['API / Effect','effect'],['Success','success'],['Failure','failure']],s.lifecycleActions||[])}<h3>System Actions</h3>${tableHtml([['Action','action'],['Trigger','trigger'],['Effect','effect'],['API / Data','data'],['Next','destination']],s.systemActions||[])}<h3>API Interactions</h3>${tableHtml([['Trigger','trigger'],['API','api'],['Purpose','purpose'],['Loading','loadingState'],['Success','success'],['Failure','failure']],s.apiInteractions||[])}<h3>States</h3>${tableHtml([['State','state'],['Trigger','trigger'],['Difference','difference']],s.states)}<h3>Navigation</h3>${navigation}</details>
      <details ${gaps.length?'open':''}><summary>Review gaps (${gaps.length})</summary>${gaps.length?gaps.map(g=>`<div class="gap ${escapeHtml(g.severity||'warning')}"><b>${escapeHtml(g.kind)} · ${escapeHtml(g.status)}</b><p>${escapeHtml(g.summary)}</p></div>`).join(''):'<p>No active review gaps.</p>'}</details>
      <footer>Source: ${escapeHtml(s.sourceDocument)} · hash ${escapeHtml(s.sourceHash.slice(0,12))}</footer>
    </section>`;
  }).join('\n');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Screen Visual Wireframes</title><style>
  *{box-sizing:border-box}body{margin:0;font:14px system-ui,-apple-system,Segoe UI,sans-serif;background:#eef0f3;color:#16181d}body>aside{position:fixed;inset:0 auto 0 0;width:290px;background:#111827;color:#fff;padding:18px;overflow:auto}body>aside h1{font-size:18px;margin:0 0 6px}body>aside p{color:#aab2c0;margin:0 0 12px}body>aside input{width:100%;padding:10px;border:1px solid #374151;border-radius:8px;background:#1f2937;color:#fff;margin-bottom:12px}body>aside a{display:flex;flex-direction:column;color:#fff;text-decoration:none;padding:10px;border-radius:8px;margin:4px 0}body>aside a:hover{background:#1f2937}body>aside span,body>aside small{color:#cbd5e1}main{margin-left:290px;padding:24px;max-width:1780px}.intro,.screen{background:#fff;border:1px solid #d7dbe2;border-radius:14px;padding:18px;margin:0 0 22px}.screen-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.screen h2{margin:4px 0}.code{font:12px ui-monospace,monospace;background:#eef2ff;padding:4px 7px;border-radius:6px}.route{font:13px ui-monospace,monospace;color:#4b5563}.meta{min-width:260px;color:#4b5563}.wireframe-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,340px);gap:18px;align-items:start;margin:18px 0}.visual-column h3,.secondary-panel h3{margin:0 0 10px}.secondary-panel{background:#f8fafc;border:1px solid #d8dde6;border-radius:10px;padding:12px}.visual-summary{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font:12px ui-monospace,monospace;margin-bottom:8px;color:#59616e}.visual-summary span,.visual-summary b,.visual-summary em{border:1px solid #d4d8df;background:#fff;padding:4px 7px;border-radius:5px}.wf-frame{position:relative;background:#d2d4d8;border:1px solid #888f98;overflow:hidden;margin:0 auto 4px;box-shadow:0 8px 28px #0001}.wf-frame.browser{border-radius:5px}.wf-frame.device{border-radius:28px;border-width:8px;background:#1e2126;padding:0}.wf-browser-chrome{height:3.8%;min-height:26px;background:#d6d8dc;border-bottom:1px solid #aeb3ba;display:flex;align-items:center;gap:5px;padding:0 10px}.wf-browser-chrome span{width:8px;height:8px;border-radius:50%;background:#9da3ab}.wf-browser-chrome i{height:55%;margin-left:7px;flex:1;background:#f4f5f6;border:1px solid #bcc1c8;border-radius:3px;font:9px ui-monospace,monospace;color:#9399a2;padding:2px 6px}.wf-device-notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:32%;height:2.2%;min-height:10px;border-radius:0 0 10px 10px;background:#1e2126;z-index:4}.wf-viewport{height:96.2%;background:#f7f7f7;overflow:hidden}.device .wf-viewport{height:100%;border-radius:20px;background:#fafafa}.wf-visual-grid{height:100%;display:grid;grid-template-areas:"top top top" "left main right" "bottom bottom bottom";grid-template-columns:var(--left) minmax(0,1fr) var(--right);grid-template-rows:auto minmax(0,1fr) auto;gap:1px;background:#c7c9cd}.wf-zone{background:#f1f1f1;min-width:0;min-height:0;display:flex;flex-direction:column;gap:1px}.wf-zone-top{grid-area:top}.wf-zone-left{grid-area:left}.wf-zone-main{grid-area:main}.wf-zone-right{grid-area:right}.wf-zone-bottom{grid-area:bottom}.wf-region{background:#f8f8f8;padding:clamp(5px,1vw,14px);min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:6px;flex:1}.wf-region.derived{outline:1px dashed #b7bbc1;outline-offset:-3px}.wf-region-label{display:flex;justify-content:space-between;gap:6px;color:#777;font-size:10px;text-transform:uppercase;letter-spacing:.04em}.wf-region-label span{text-transform:none;letter-spacing:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.wf-region-content{display:flex;flex-direction:column;gap:clamp(4px,.7vw,9px);min-height:0}.layout-row .wf-region-content{flex-direction:row;align-items:center;flex-wrap:wrap}.layout-grid .wf-region-content{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.wf-component{border-color:#9b9b9b!important;color:#636363;background:#e1e1e1}.wf-component small{display:block;font-size:9px;color:#888}.wf-image{min-height:clamp(48px,10vw,150px);border:1px solid #999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;background:#bdbdbd}.wf-image>span{font-size:22px}.wf-hero{min-height:clamp(70px,14vw,220px)}.wf-logo{align-self:center;padding:8px 14px;border:2px solid #999;background:#d5d5d5;font-weight:800}.wf-avatar{display:flex;align-items:center;gap:6px}.wf-avatar span{width:32px;height:32px;border-radius:50%;background:#bbb}.wf-heading{background:transparent;display:flex;flex-direction:column;gap:4px;max-width:70%}.wf-heading b{font-size:clamp(10px,1.5vw,18px);color:#555}.wf-heading i,.wf-text i,.wf-card i,.wf-stat i{display:block;height:5px;background:#c1c1c1;border-radius:4px;width:100%}.wf-text{background:transparent;display:flex;flex-direction:column;gap:4px;max-width:78%}.wf-text b{font-size:10px}.wf-text i.short,.wf-card i.short{width:58%}.wf-button{align-self:flex-start;padding:7px 16px;border:1px solid #858585;border-radius:4px;background:#a5a5a5;color:#fff;font-weight:700}.wf-link{align-self:flex-start;background:transparent;text-decoration:underline;padding:3px}.wf-tabs{display:flex;background:transparent;border-bottom:1px solid #aaa}.wf-tabs span{padding:6px 10px;border:1px solid #aaa;border-bottom:0;background:#d8d8d8}.wf-tabs span.active{background:#aaa;color:#fff}.wf-field{background:transparent;display:flex;flex-direction:column;gap:3px;min-width:120px;flex:1}.wf-field b{font-size:10px}.wf-input{height:28px;border:1px solid #9b9b9b;background:#eee;border-radius:3px;padding:5px;font-size:9px}.wf-input.textarea{height:54px}.wf-choice{background:transparent;display:flex;align-items:center;gap:5px}.wf-choice span{width:12px;height:12px;border:1px solid #888;background:#eee}.wf-choice span.radio{border-radius:50%}.wf-chip{align-self:flex-start;border:1px solid #999;border-radius:12px;padding:3px 8px}.wf-card-grid,.wf-repeat{display:grid;grid-template-columns:repeat(auto-fit,minmax(70px,1fr));gap:6px}.wf-card{border:1px solid #a6a6a6;padding:6px;background:#d5d5d5;display:flex;flex-direction:column;gap:4px;min-width:0}.wf-card .thumb{height:38px;background:#b2b2b2}.wf-list,.wf-table,.wf-chart,.wf-nav{border:1px solid #aaa;padding:6px;background:#ddd}.wf-list>div{display:flex;gap:5px;align-items:center;padding:4px 0;border-top:1px solid #bbb}.wf-list>div span{width:18px;height:18px;background:#b5b5b5}.wf-list>div i{height:5px;background:#b8b8b8;flex:1}.wf-table .tr{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px 0;border-top:1px solid #bbb}.wf-table .tr i{height:5px;background:#b4b4b4}.wf-table .head i{height:8px;background:#999}.wf-chart>div{height:68px;display:flex;gap:4px;align-items:end;border-left:1px solid #aaa;border-bottom:1px solid #aaa;padding:4px}.wf-chart i{flex:1;background:#aaa}.wf-stat{padding:8px;border:1px solid #aaa;background:#ddd}.wf-stat b{display:block;font-size:18px}.wf-nav{display:flex;flex-direction:column;gap:5px}.wf-nav span{padding:4px;border-bottom:1px solid #bbb}.wf-divider{height:1px!important;background:#aaa!important}.wf-skeleton{display:flex;flex-direction:column;gap:4px;background:transparent}.wf-skeleton i{height:8px;background:#c2c2c2}.wf-skeleton i.short{width:60%}.wf-spacer{min-height:14px;background:transparent}.wf-custom{border:1px dashed #888;padding:8px;display:flex;justify-content:space-between;gap:6px}.wf-empty-region{border:1px dashed #aaa;padding:8px;color:#999;font-size:10px}.checklist{padding-left:18px}table{border-collapse:collapse;width:100%;margin:8px 0 16px}th,td{border:1px solid #d9dde3;padding:7px;text-align:left;vertical-align:top}.tbd{color:#b45309!important;background:#fffbeb!important}.empty{border:1px dashed #bbb;border-radius:8px;padding:10px;color:#666}summary{cursor:pointer;font-weight:700;padding:8px 0}.gap{border-left:4px solid #d97706;background:#fffbeb;padding:9px 12px;margin:8px 0}.gap.high,.gap.error{border-color:#dc2626;background:#fef2f2}footer{font:11px ui-monospace,monospace;color:#737b87;margin-top:12px}@media(max-width:1100px){.wireframe-layout{grid-template-columns:1fr}.secondary-panel{order:2}}@media(max-width:850px){body>aside{position:static;width:auto}main{margin:0}.screen-head{flex-direction:column}.meta{min-width:0}.wf-region-label span{display:none}}
  </style></head><body><aside><h1>Screen Visual Wireframes</h1><p>${session.active?'Active review session':'Generated projection'} · ${specs.length} screen(s)</p><input id="q" placeholder="Search screen / route / feature">${nav||'<p>No Screens in scope.</p>'}</aside><main><div class="intro"><b>Low-fidelity visual review artifact.</b> The canvas renders the primary visible state using typed placeholders and platform-aware proportions. Modal/popover/hover-only UI is listed outside the canvas. Canonical truth remains in Screen/Feature/Requirement/Flow documentation.</div>${screens||'<section class="screen"><p>No Screen entities matched the current scope.</p></section>'}</main><script>const q=document.getElementById('q');q&&q.addEventListener('input',()=>{const v=q.value.toLowerCase();document.querySelectorAll('[data-screen]').forEach(x=>x.style.display=x.dataset.text.includes(v)?'':'none');document.querySelectorAll('[data-nav-item]').forEach(x=>x.style.display=x.dataset.text.includes(v)?'':'none')});</script></body></html>`;
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
    if(!(spec.userActions?.length || spec.actions?.length || spec.lifecycleActions?.length || spec.systemActions?.length)) findings.push(finding(cfg().validation.screenWithoutActionsSeverity,'SCREEN_ACTIONS_TBD',`${e.code} has no documented user, lifecycle, or system actions.`,e.code));
    if(!spec.navigation.length) findings.push(finding(cfg().validation.screenWithoutNavigationSeverity,'SCREEN_NAVIGATION_TBD',`${e.code} has no documented navigation rules.`,e.code));
    if(!spec.visualCompleteness?.explicitDisplayProfile) findings.push(finding(cfg().validation.missingDisplayProfileSeverity,'SCREEN_DISPLAY_PROFILE_INFERRED',`${e.code} has no explicit Visual Display Profile; renderer is using ${spec.displayProfile?.source||'fallback'} defaults.`,e.code));
    if(!spec.visualCompleteness?.explicitViewport) findings.push(finding(cfg().validation.missingViewportSeverity,'SCREEN_VIEWPORT_INFERRED',`${e.code} has no explicit review viewport; ${spec.displayProfile?.viewport?.width||'?'}x${spec.displayProfile?.viewport?.height||'?'} is inferred.`,e.code));
    if(!spec.visualCompleteness?.explicitPrimaryState) findings.push(finding(cfg().validation.missingPrimaryStateSeverity,'SCREEN_PRIMARY_STATE_INFERRED',`${e.code} does not explicitly define the primary visible state.`,e.code));
    if(!spec.visualCompleteness?.visualRegions) findings.push(finding(cfg().validation.missingVisualRegionsSeverity,'SCREEN_VISUAL_REGIONS_TBD',`${e.code} has no Visual Layout Regions; renderer is deriving a review layout from functional sections.`,e.code));
    if(!spec.visualCompleteness?.visibleComponents) findings.push(finding(cfg().validation.missingVisibleComponentsSeverity,'SCREEN_VISIBLE_COMPONENTS_TBD',`${e.code} has no typed Visible Components inventory; renderer only uses safe placeholders from documented sections/fields/actions.`,e.code));
    if(spec.visualCompleteness?.vagueLayout) findings.push(finding(cfg().validation.vagueLayoutSeverity,'SCREEN_LAYOUT_TOO_VAGUE',`${e.code} does not contain enough visual layout detail to review hierarchy/placement confidently.`,e.code));
  }
  const scopeCodes=new Set(screenEntities.map(e=>e.code));
  const ps=proposals().filter(p=>scopeCodes.has(p.screenCode));
  for(const p of ps){
    if(p.status==='accepted') findings.push(finding(cfg().validation.acceptedGapUnresolvedSeverity,'ACCEPTED_GAP_UNRESOLVED',`${p.id} accepted for ${p.screenCode} but not resolved in canonical docs.`,p.screenCode,p.id));
    else if(p.status==='open') findings.push(finding(cfg().validation.openGapSeverity,'OPEN_WIREFRAME_GAP',`${p.id}: ${p.summary}`,p.screenCode,p.id));
  }
  const blocks=new Set(cfg().validation.blockSeverities||['high','error']);
  return {schemaVersion:'1.0',generatedAt:now(),active:!!session.active,scope:session.scope||{type:'all',refs:[]},summary:{screens:screenEntities.length,projected:specs.length,proposals:ps.length,open:ps.filter(x=>x.status==='open').length,accepted:ps.filter(x=>x.status==='accepted').length,resolved:ps.filter(x=>x.status==='resolved').length,findings:findings.length,blocking:findings.filter(x=>blocks.has(x.severity)).length},findings,screens:specs.map(s=>({screenCode:s.screenCode,title:s.title,route:s.route,sourceDocument:s.sourceDocument,sourceHash:s.sourceHash,platform:s.displayProfile?.platform,viewport:s.displayProfile?.viewport,primaryVisibleState:s.displayProfile?.primaryVisibleState,visualRegions:(s.visualRegions||[]).length,visibleComponents:(s.visibleComponents||[]).length,hiddenSecondaryUi:(s.hiddenSecondaryUi||[]).length,fields:s.fields.length,userActions:(s.userActions||s.actions||[]).length,lifecycleActions:(s.lifecycleActions||[]).length,systemActions:(s.systemActions||[]).length,apiInteractions:(s.apiInteractions||[]).length,actions:(s.userActions||s.actions||[]).length,states:s.states.length,navigation:s.navigation.length})),proposals:ps,pass:findings.every(x=>!blocks.has(x.severity))};
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
