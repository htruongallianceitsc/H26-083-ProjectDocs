import fs from 'node:fs';
import path from 'node:path';
import {root, loadConfig, rel} from './lib/core.mjs';
const cfg=loadConfig(), site=path.resolve(root,cfg.siteDir); let broken=[];
function walk(p){let out=[];if(!fs.existsSync(p))return out;for(const e of fs.readdirSync(p,{withFileTypes:true})){const x=path.join(p,e.name);if(e.isDirectory())out.push(...walk(x));else if(e.name.endsWith('.html'))out.push(x)}return out}
for(const p of walk(site)){
 const html=fs.readFileSync(p,'utf8');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const u=m[1]; if(u.includes('+') || u.includes('${') || /^(https?:|#|data:|mailto:|javascript:)/.test(u))continue;
  const clean=u.split('#')[0].split('?')[0]; if(!clean)continue;
  const target=path.resolve(path.dirname(p),clean); if(!fs.existsSync(target))broken.push(`${rel(p)} -> ${u}`);
 }
}
for(const x of broken)console.log('BROKEN '+x);
console.log(`Site link check: ${broken.length} broken link(s).`);
process.exit(broken.length?1:0);
