#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, projectRoot, posix } from './lib/core.mjs';

const config=await loadConfig();const site=path.resolve(projectRoot,config.siteDir);const html=[];
async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(e.isFile()&&e.name.endsWith('.html'))html.push(p);}}
await walk(site);const errors=[];
for(const file of html){const body=await fs.readFile(file,'utf8');const re=/(?:href|src)="([^"]+)"/g;let m;while((m=re.exec(body))){const ref=m[1];if(/^(https?:|mailto:|tel:|data:|#)/i.test(ref))continue;const clean=decodeURIComponent(ref.split('#')[0].split('?')[0]);if(!clean)continue;const target=path.resolve(path.dirname(file),clean);try{await fs.access(target);}catch{errors.push(`${posix(path.relative(site,file))} -> ${ref}`);}}}
console.log(`Static site link check: ${html.length} HTML files, ${errors.length} broken local reference(s).`);
if(errors.length){for(const e of errors.slice(0,100))console.error(`- ${e}`);process.exit(1);}
