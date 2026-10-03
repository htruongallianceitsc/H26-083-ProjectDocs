import fs from 'node:fs';
import path from 'node:path';
import {root, loadProfile, registry, exists} from './lib/core.mjs';
const p=loadProfile(), r=registry(); let errors=0, warnings=0;
const active=exists('project-profile.json');
if (!active) { console.log('WARN project-profile.json not found. Copy PROJECT_PROFILE.example.json and select the real project types/stacks before technical design.'); warnings++; }
if(active){ for(const k of ['projectCode','projectName','projectTypes','technologyStacks']) if(p[k]===undefined||p[k]===null||p[k]===''){console.log(`ERROR project-profile.json missing ${k}`);errors++;} if(!Array.isArray(p.projectTypes)){console.log('ERROR projectTypes must be array');errors++;} if(!Array.isArray(p.technologyStacks)){console.log('ERROR technologyStacks must be array');errors++;} }
for (const t of p.projectTypes||[]) if (!r.projectTypes.projectTypes[t]) { console.log(`ERROR Unknown project type: ${t}`); errors++; }
for (const s of p.technologyStacks||[]) {
  const st=r.stacks.technologyStacks[s];
  if (!st) { console.log(`ERROR Unknown technology stack: ${s}`); errors++; continue; }
  if (st.projectType!=='supporting' && !(p.projectTypes||[]).includes(st.projectType)) { console.log(`ERROR Stack ${s} requires project type ${st.projectType}`); errors++; }
}
const standards=[...(r.coreStandards?.standards||[])];
if(active){ for(const k of ['projectCode','projectName','projectTypes','technologyStacks']) if(p[k]===undefined||p[k]===null||p[k]===''){console.log(`ERROR project-profile.json missing ${k}`);errors++;} if(!Array.isArray(p.projectTypes)){console.log('ERROR projectTypes must be array');errors++;} if(!Array.isArray(p.technologyStacks)){console.log('ERROR technologyStacks must be array');errors++;} }
for (const t of p.projectTypes||[]) { const x=r.projectTypes.projectTypes[t]; if(x) for(const f of x.requiredStandards) standards.push(`${x.standardsRoot}/${f}`); }
for (const s of p.technologyStacks||[]) { const x=r.stacks.technologyStacks[s]; if(x) for(const f of x.requiredStandards) standards.push(`${x.standardsRoot}/${f}`); }
for (const f of standards) if(!fs.existsSync(path.resolve(root,f))) { console.log(`ERROR Missing standard: ${f}`); errors++; }
console.log('\nApplicable standards:'); for(const f of standards) console.log(` - ${f}`);
console.log(`\nProfile check: ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors?1:0);
