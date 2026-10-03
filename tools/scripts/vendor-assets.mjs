#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { toolsDir, ensureDir } from './lib/core.mjs';

const targets=[
  {name:'mermaid.min.js',url:'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'}
];
const vendor=path.join(toolsDir,'vendor');await ensureDir(vendor);
for(const item of targets){
  console.log(`Downloading ${item.url}`);
  const response=await fetch(item.url);
  if(!response.ok)throw new Error(`HTTP ${response.status} for ${item.url}`);
  const data=Buffer.from(await response.arrayBuffer());
  await fs.writeFile(path.join(vendor,item.name),data);
  console.log(`Saved vendor/${item.name} (${data.length} bytes)`);
}
