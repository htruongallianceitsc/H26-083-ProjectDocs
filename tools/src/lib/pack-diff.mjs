import fs from 'node:fs';
import path from 'node:path';
import {root} from './core.mjs';
import {loadPackLock,resolvePackDir,loadManifest,renderPack,hash} from './packs.mjs';
export function calculatePackDiff(packageId,source,args={}){
 const lock=loadPackLock();const old=lock.imports?.[packageId];if(!old)throw new Error(`${packageId} is not imported.`);const dir=resolvePackDir(source);const m=loadManifest(dir);if(m.packageId!==packageId)throw new Error(`Source packageId ${m.packageId} does not match ${packageId}`);
 const upstream=renderPack(dir,m,{...args,features:old.enabledFeatures,set:{...old.variables,...(args.set||{})},namespace:old.namespace,targetRoot:old.targetRoot},old);const bySource=new Map(upstream.rendered.map(f=>[f.path,f]));const oldBySource=new Map((old.fileMap||[]).map(f=>[f.sourcePath,f]));const keys=new Set([...bySource.keys(),...oldBySource.keys()]);const rows=[];
 for(const key of [...keys].sort()){
  const u=bySource.get(key),o=oldBySource.get(key);const localPath=o?.projectPath||u?.projectPath;const localAbs=localPath?path.resolve(root,localPath):null;const local=localAbs&&fs.existsSync(localAbs)?fs.readFileSync(localAbs,'utf8'):null;const snapAbs=o?.snapshotPath?path.resolve(root,o.snapshotPath):null;const base=snapAbs&&fs.existsSync(snapAbs)?fs.readFileSync(snapAbs,'utf8'):null;const up=u?.content??null;let status='unchanged';
  if(!o&&u)status=local==null?'added':'added-collision';else if(o&&!u)status=local===base?'upstream-deleted':'delete-conflict';else if(local==null)status='local-deleted';else{const lc=local!==base,uc=up!==base;if(!lc&&!uc)status='unchanged';else if(!lc&&uc)status='upstream-only';else if(lc&&!uc)status='local-only';else if(local===up)status='converged';else status='conflict';}
  rows.push({sourcePath:key,projectPath:localPath,entityCode:u?.projectCode||o?.entityCode,status,baseHash:base==null?null:hash(base),localHash:local==null?null:hash(local),upstreamHash:up==null?null:hash(up),upstream:u});
 }
 return {lock,old,dir,manifest:m,upstream,rows,conflicts:rows.filter(r=>['conflict','delete-conflict','local-deleted','added-collision'].includes(r.status)),reviewRequired:rows.filter(r=>['upstream-deleted'].includes(r.status))};
}
