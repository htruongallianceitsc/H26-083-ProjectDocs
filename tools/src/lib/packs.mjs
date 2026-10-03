import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {root, parseFrontmatter, registry, readJson} from './core.mjs';

export const packLockPath = path.resolve(root,'.project-docs/packs.lock.json');
export const snapshotRoot = path.resolve(root,'.project-docs/pack-snapshots');
export const proposalRoot = path.resolve(root,'.project-docs/pack-proposals');

export function hash(v){return crypto.createHash('sha256').update(v).digest('hex');}
export function posix(p){return p.replaceAll(path.sep,'/');}
export function projectRel(p){return posix(path.relative(root,p));}
export function safeJoin(base,rel){const p=path.resolve(base,rel);if(p!==base&&!p.startsWith(base+path.sep))throw new Error(`Path escapes base: ${rel}`);return p;}
export function loadStarter(){return readJson('starter-kit.json',{version:'0.0.0',schemaVersion:'0.0.0'});}
export function loadPackLock(){if(!fs.existsSync(packLockPath))return {schemaVersion:'1.0',imports:{}};return JSON.parse(fs.readFileSync(packLockPath,'utf8'));}
export function savePackLock(lock){fs.mkdirSync(path.dirname(packLockPath),{recursive:true});fs.writeFileSync(packLockPath,JSON.stringify(lock,null,2)+'\n');}
export function resolvePackDir(arg){if(!arg)throw new Error('Capability pack path is required.');const p=path.resolve(process.cwd(),arg);return fs.statSync(p).isDirectory()?p:path.dirname(p);}
export function loadManifest(packDir){const p=path.join(packDir,'manifest.json');if(!fs.existsSync(p))throw new Error(`manifest.json not found: ${p}`);return JSON.parse(fs.readFileSync(p,'utf8'));}
export function parseArgs(argv){
 const out={_:[],set:{},features:null,excludeFeatures:[]};
 for(let i=0;i<argv.length;i++){
  const a=argv[i];
  if(!a.startsWith('--')){out._.push(a);continue;}
  const k=a.slice(2);
  if(k==='set'){const v=argv[++i]||'';const x=v.indexOf('=');if(x<1)throw new Error('--set expects KEY=value');out.set[v.slice(0,x)]=v.slice(x+1);continue;}
  if(k==='features'){out.features=(argv[++i]||'').split(',').map(x=>x.trim()).filter(Boolean);continue;}
  if(k==='exclude-features'){out.excludeFeatures=(argv[++i]||'').split(',').map(x=>x.trim()).filter(Boolean);continue;}
  if(['source','namespace','target-root','note'].includes(k)){out[toCamel(k)]=argv[++i];continue;}
  out[toCamel(k)]=true;
 }
 return out;
}
function toCamel(s){return s.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());}
export function semverMajor(v){const m=String(v||'').match(/^(\d+)\./);return m?Number(m[1]):null;}
export function checkCompatibility(manifest){const starter=loadStarter();const major=semverMajor(starter.schemaVersion);const nums=String(manifest.starterSchemaRange||'').match(/\d+\.\d+\.\d+/g)||[];if(nums.length){const min=semverMajor(nums[0]);if(min!==major)throw new Error(`Pack expects starter schema ${manifest.starterSchemaRange}; current ${starter.schemaVersion}`);}return true;}
export function selectFeatures(manifest,args={}){
 const required=[...(manifest.features?.required||[])];const optional=manifest.features?.optional||{};
 let selected=[];
 if(args.features) selected=[...args.features]; else selected=Object.entries(optional).filter(([,v])=>v.defaultEnabled===true).map(([k])=>k);
 for(const x of selected)if(!required.includes(x)&&!optional[x])throw new Error(`Unknown feature: ${x}`);
 selected=selected.filter(x=>!args.excludeFeatures?.includes(x));
 return [...new Set([...required,...selected])];
}
export function coerceVariable(def,raw,key){
 let v=raw;
 if(def.type==='boolean'){if(typeof v==='string'){if(v==='true')v=true;else if(v==='false')v=false;else throw new Error(`${key} must be true/false`);}}
 if(def.type==='enum'&&!def.allowed?.includes(v))throw new Error(`${key} must be one of: ${def.allowed.join(', ')}`);
 if(def.type==='string'&&typeof v!=='string')v=String(v);
 if(def.pattern&&!(new RegExp(def.pattern).test(String(v))))throw new Error(`${key} does not match ${def.pattern}`);
 return v;
}
export function resolveVariables(manifest,args={},prior={}){
 const vars={};const explicit=new Set(Object.keys(args.set||{}));const defs=manifest.variables||{};
 for(const [k,d] of Object.entries(defs)){
  let raw=Object.prototype.hasOwnProperty.call(args.set||{},k)?args.set[k]:(Object.prototype.hasOwnProperty.call(prior,k)?prior[k]:d.default);
  if(raw===undefined)throw new Error(`Missing required pack variable: ${k}`);
  if(d.sensitive===true)throw new Error(`Pack variable ${k} is marked sensitive. Secrets are not allowed in capability pack import variables.`);
  vars[k]=coerceVariable(d,raw,k);
 }
 vars.IMPORT_DATE=new Date().toISOString().slice(0,10);
 return {vars,explicit,reviewRequired:Object.entries(defs).filter(([,d])=>d.reviewRequired).map(([k])=>k)};
}
export function namespaceCode(code,namespace){if(!namespace)return code;const parts=String(code).split('-');return [parts[0],namespace.toUpperCase().replace(/[^A-Z0-9]+/g,'-'),...parts.slice(1)].join('-');}
export function selectedFiles(manifest,features){const set=new Set(features);return (manifest.files||[]).filter(f=>f.feature==='core'||set.has(f.feature));}
export function allPackCodes(manifest){return new Set((manifest.files||[]).map(f=>String(f.entityCode)));}
export function buildCodeMap(manifest,files,namespace,prior={}){const map={...prior};for(const f of files)if(!map[f.entityCode])map[f.entityCode]=namespaceCode(f.entityCode,namespace);return map;}
export function replaceTokens(text,vars){return text.replace(/\{\{([A-Z0-9_]+)\}\}/g,(m,k)=>Object.prototype.hasOwnProperty.call(vars,k)?String(vars[k]):m);}
export function replaceCodes(text,codeMap){const pairs=Object.entries(codeMap).sort((a,b)=>b[0].length-a[0].length);for(const [a,b] of pairs)text=text.replace(new RegExp(`\\b${escapeRe(a)}\\b`,'g'),b);return text;}
function escapeRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function yamlScalar(v){if(v===null)return 'null';if(typeof v==='boolean'||typeof v==='number')return String(v);if(Array.isArray(v))return `[${v.map(yamlScalar).join(', ')}]`;const s=String(v);return /^[A-Za-z0-9_./:@+-]+$/.test(s)?s:JSON.stringify(s);}
function yamlObject(obj,indent=0){let out='';const pad=' '.repeat(indent);for(const [k,v] of Object.entries(obj||{})){if(v&&typeof v==='object'&&!Array.isArray(v)){out+=`${pad}${k}:\n${yamlObject(v,indent+2)}`;}else out+=`${pad}${k}: ${yamlScalar(v)}\n`;}return out;}
export function renderEntity(raw,{vars,codeMap,selectedOriginalCodes,allOriginalCodes}){
 let text=replaceCodes(replaceTokens(raw,vars),codeMap);const fm=parseFrontmatter(text);if(!fm.data)return text;
 const selectedMapped=new Set([...selectedOriginalCodes].map(c=>codeMap[c]||c));const allMapped=new Set([...allOriginalCodes].map(c=>codeMap[c]||c));
 for(const [k,arr] of Object.entries(fm.data.related||{}))if(Array.isArray(arr))fm.data.related[k]=arr.filter(c=>!allMapped.has(String(c))||selectedMapped.has(String(c)));
 return `---\n${yamlObject(fm.data)}---\n\n${fm.body.replace(/^\s+/,'')}`;
}

export function evaluateConstraints(manifest,features,variables){
 const errors=[]; const set=new Set(features||[]);
 for(const c of manifest.constraints||[]){
  const cond=c.if||{}; if(!cond.variable)continue; const match=variables?.[cond.variable]===cond.equals; if(!match)continue;
  if(c.requireFeature&&!set.has(c.requireFeature))errors.push(c.message||`Feature ${c.requireFeature} is required when ${cond.variable}=${cond.equals}`);
  if(c.forbidFeature&&set.has(c.forbidFeature))errors.push(c.message||`Feature ${c.forbidFeature} is forbidden when ${cond.variable}=${cond.equals}`);
 }
 return errors;
}

export function renderPack(packDir,manifest,args={},priorLock=null){
 checkCompatibility(manifest);const features=selectFeatures(manifest,args);const varRes=resolveVariables(manifest,args,priorLock?.variables||{});const constraintErrors=evaluateConstraints(manifest,features,varRes.vars);if(constraintErrors.length)throw new Error(constraintErrors.join(' | '));const files=selectedFiles(manifest,features);const codeMap=buildCodeMap(manifest,files,args.namespace??priorLock?.namespace,priorLock?.codeMap||{});const selectedOriginalCodes=new Set(files.map(f=>f.entityCode));const allOriginalCodes=allPackCodes(manifest);const targetRoot=args.targetRoot||priorLock?.targetRoot||manifest.defaultTargetRoot||`docs/02-modules/${manifest.moduleCode.replace(/^MOD-/,'')}`;
 const rendered=files.map(f=>{const src=safeJoin(packDir,f.path);if(!fs.existsSync(src))throw new Error(`Pack file missing: ${f.path}`);const raw=fs.readFileSync(src,'utf8');const content=renderEntity(raw,{vars:varRes.vars,codeMap,selectedOriginalCodes,allOriginalCodes});return {...f,sourceAbs:src,content,projectPath:posix(path.join(targetRoot,f.destination)),projectCode:codeMap[f.entityCode]||f.entityCode,baseHash:hash(content)};});
 return {features,variables:Object.fromEntries(Object.entries(varRes.vars).filter(([k])=>k!=='IMPORT_DATE')),explicit:[...varRes.explicit],reviewRequired:varRes.reviewRequired,codeMap,targetRoot,namespace:args.namespace??priorLock?.namespace??null,rendered};
}
export function validateManifestShape(m){const errs=[];for(const k of ['schemaVersion','packageId','version','starterSchemaRange','moduleCode','features','variables','files','upgradePolicy'])if(m[k]===undefined)errs.push(`missing ${k}`);if(m.schemaVersion!=='1.0')errs.push(`unsupported schemaVersion ${m.schemaVersion}`);if(!/^[a-z0-9][a-z0-9-]*$/.test(String(m.packageId||'')))errs.push('invalid packageId');if(!/^\d+\.\d+\.\d+$/.test(String(m.version||'')))errs.push('version must be semver x.y.z');if(!Array.isArray(m.files))errs.push('files must be array');return errs;}
export function snapshotDir(packageId,version){return path.join(snapshotRoot,packageId,version);}
export function writeSnapshot(packageId,version,rendered){const base=snapshotDir(packageId,version);fs.rmSync(base,{recursive:true,force:true});for(const f of rendered){const p=safeJoin(base,f.sourcePath||f.path);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,f.content);}return base;}
export function readSnapshot(lockEntry,fileMap){const p=path.resolve(root,fileMap.snapshotPath);return fs.existsSync(p)?fs.readFileSync(p,'utf8'):null;}
export function timestamp(){return new Date().toISOString().replace(/[:.]/g,'-');}
export function packRegistry(){return registry();}
