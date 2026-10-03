#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, projectRoot } from './lib/core.mjs';

const config = await loadConfig();
const siteDir = path.resolve(projectRoot, config.siteDir);
const portArg = process.argv.find((x) => x.startsWith('--port='));
const port = Number(portArg?.split('=')[1] || process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'};

const server = http.createServer(async (req,res)=>{
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    let rel = pathname.replace(/^\/+/, '') || 'index.html';
    if (rel.endsWith('/')) rel += 'index.html';
    const abs = path.resolve(siteDir, rel);
    if (!abs.startsWith(siteDir + path.sep) && abs !== siteDir) throw new Error('Forbidden');
    const st = await fsp.stat(abs);
    if (!st.isFile()) throw new Error('Not found');
    res.writeHead(200, {'Content-Type': mime[path.extname(abs).toLowerCase()] || 'application/octet-stream','Cache-Control':'no-cache'});
    fs.createReadStream(abs).pipe(res);
  } catch {
    res.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'}); res.end('404 - Not found');
  }
});
server.listen(port,'127.0.0.1',()=>console.log(`Documentation site: http://127.0.0.1:${port}`));
