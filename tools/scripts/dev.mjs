#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { projectRoot, loadConfig, discoverMarkdown } from './lib/core.mjs';

function runNode(script){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,[path.join(projectRoot,'tools','scripts',script)],{stdio:'inherit'});p.on('exit',c=>c===0?resolve():reject(new Error(`${script} failed (${c})`)));});}
async function fingerprint(){const config=await loadConfig();const files=(await discoverMarkdown(config)).filter(f=>!f.includes(`${path.sep}docs${path.sep}_generated${path.sep}`));const h=crypto.createHash('sha1');for(const f of files){try{const s=await fs.stat(f);h.update(f);h.update(String(s.mtimeMs));h.update(String(s.size));}catch{}}return h.digest('hex');}
let busy=false,pending=false;async function rebuild(){if(busy){pending=true;return;}busy=true;try{await runNode('sync-docs.mjs');await runNode('build-site.mjs');console.log('Site rebuilt.');}catch(e){console.error(e.message);}finally{busy=false;if(pending){pending=false;rebuild();}}}
await rebuild();
const server=spawn(process.execPath,[path.join(projectRoot,'tools','scripts','serve-site.mjs')],{stdio:'inherit'});
let last=await fingerprint();const timer=setInterval(async()=>{const next=await fingerprint();if(next!==last){last=next;rebuild();}},1000);
process.on('SIGINT',()=>{clearInterval(timer);server.kill('SIGINT');process.exit(0);});
