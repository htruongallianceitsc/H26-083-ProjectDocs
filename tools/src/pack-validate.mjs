import fs from 'node:fs';
import path from 'node:path';
import {parseFrontmatter} from './lib/core.mjs';
import {parseArgs,resolvePackDir,loadManifest,validateManifestShape,checkCompatibility,renderPack,packRegistry} from './lib/packs.mjs';
process.on('uncaughtException',e=>{console.error(`ERROR ${e.message}`);process.exit(1);});
process.on('unhandledRejection',e=>{console.error(`ERROR ${e?.message||e}`);process.exit(1);});
const args=parseArgs(process.argv.slice(2));let dirs=args._;if(!dirs.length){const base=path.resolve(process.cwd(),'../kit/reuse/capabilities');dirs=fs.existsSync(base)?fs.readdirSync(base,{withFileTypes:true}).filter(x=>x.isDirectory()&&fs.existsSync(path.join(base,x.name,'manifest.json'))).map(x=>path.join(base,x.name)):[];}let totalErr=0;
for(const arg of dirs){
 try{
  const dir=resolvePackDir(arg),m=loadManifest(dir),errors=validateManifestShape(m),warnings=[];checkCompatibility(m);
  const seen=new Set();for(const f of m.files||[]){if(!f.path||!f.destination||!f.entityCode||!f.feature)errors.push(`invalid file record ${JSON.stringify(f)}`);if(seen.has(f.entityCode))errors.push(`duplicate entityCode ${f.entityCode}`);seen.add(f.entityCode);if(!fs.existsSync(new URL(`file://${dir}/${f.path}`).pathname))errors.push(`missing file ${f.path}`);}
  const allOptional=Object.keys(m.features?.optional||{});const r=renderPack(dir,m,{features:allOptional,set:{}});const reg=packRegistry();const idx=new Map();
  for(const f of r.rendered){const fm=parseFrontmatter(f.content).data;if(!fm){errors.push(`${f.path}: missing frontmatter`);continue;}if(fm.code!==f.projectCode)errors.push(`${f.path}: manifest code ${f.projectCode} != frontmatter ${fm.code}`);if(!reg.entities.entityTypes?.[fm.type])errors.push(`${f.path}: unknown entity type ${fm.type}`);if(idx.has(fm.code))errors.push(`duplicate rendered code ${fm.code}`);idx.set(fm.code,fm);}
  for(const [code,e] of idx)for(const [key,targets] of Object.entries(e.related||{})){const expected=reg.relations.relationKeys?.[key];if(!expected){errors.push(`${code}: unknown relation ${key}`);continue;}for(const targetCode of targets||[]){const t=idx.get(String(targetCode));if(!t)warnings.push(`${code}: external/unresolved relation ${key} -> ${targetCode}`);else if(t.type!==expected)errors.push(`${code}: ${key} expects ${expected}, got ${t.type} (${targetCode})`);}}
  const rawAll=(m.files||[]).map(f=>fs.existsSync(`${dir}/${f.path}`)?fs.readFileSync(`${dir}/${f.path}`,'utf8'):'').join('\n');for(const token of new Set([...rawAll.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map(x=>x[1])))if(token!=='IMPORT_DATE'&&!m.variables?.[token])errors.push(`unknown variable token {{${token}}}`);
  console.log(`PACK ${m.packageId}@${m.version}: ${errors.length} error(s), ${warnings.length} warning(s)`);for(const x of errors)console.log('ERROR',x);for(const x of warnings)console.log('WARN ',x);totalErr+=errors.length;
 }catch(e){console.log(`ERROR ${arg}: ${e.message}`);totalErr++;}
}
process.exit(totalErr?1:0);
