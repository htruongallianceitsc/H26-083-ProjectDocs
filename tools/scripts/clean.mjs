#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, projectRoot } from './lib/core.mjs';
const config=await loadConfig();
for(const rel of [config.siteDir,config.cacheDir,config.generatedDir]){const abs=path.resolve(projectRoot,rel);await fs.rm(abs,{recursive:true,force:true});console.log(`Removed ${rel}`);}
