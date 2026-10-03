import {escapeHtml, slug} from './core.mjs';
function inline(s){
 let x=escapeHtml(s);
 x=x.replace(/`([^`]+)`/g,'<code>$1</code>');
 x=x.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
 x=x.replace(/\*([^*]+)\*/g,'<em>$1</em>');
 x=x.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
 return x;
}
export function markdownToHtml(md){
 const lines=md.replace(/\r/g,'').split('\n'); let html='', inCode=false, codeLang='', code=[], inUl=false, inOl=false, table=[];
 function closeLists(){if(inUl){html+='</ul>';inUl=false;}if(inOl){html+='</ol>';inOl=false;}}
 function flushTable(){ if(!table.length)return; const rows=table.filter(x=>!/^\s*\|?\s*:?-+/.test(x.replace(/\|/g,' | '))); if(rows.length){html+='<div class="table-wrap"><table>'; rows.forEach((r,i)=>{const cells=r.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());html+=i===0?'<thead><tr>':'<tr>'; for(const c of cells)html+=(i===0?'<th>':'<td>')+inline(c)+(i===0?'</th>':'</td>');html+=i===0?'</tr></thead><tbody>':'</tr>';});html+='</tbody></table></div>';} table=[]; }
 for(const line of lines){
  if(line.startsWith('```')){ flushTable(); closeLists(); if(!inCode){inCode=true;codeLang=line.slice(3).trim();code=[];}else{const c=code.join('\n'); if(codeLang==='mermaid')html+=`<div class="diagram-card"><pre class="mermaid">${escapeHtml(c)}</pre><details><summary>Source</summary><pre><code>${escapeHtml(c)}</code></pre></details></div>`; else html+=`<pre><code class="language-${escapeHtml(codeLang)}">${escapeHtml(c)}</code></pre>`; inCode=false;} continue; }
  if(inCode){code.push(line);continue;}
  if(/^\s*\|.*\|\s*$/.test(line)){closeLists();table.push(line);continue;} else flushTable();
  if(!line.trim()){closeLists();html+='';continue;}
  let m=line.match(/^(#{1,6})\s+(.+)$/); if(m){closeLists();const n=m[1].length,t=m[2];html+=`<h${n} id="${slug(t)}">${inline(t)}</h${n}>`;continue;}
  if(/^>\s?/.test(line)){closeLists();html+=`<blockquote>${inline(line.replace(/^>\s?/,''))}</blockquote>`;continue;}
  m=line.match(/^\s*[-*]\s+(.+)$/); if(m){if(!inUl){closeLists();html+='<ul>';inUl=true;}html+=`<li>${inline(m[1])}</li>`;continue;}
  m=line.match(/^\s*\d+\.\s+(.+)$/); if(m){if(!inOl){closeLists();html+='<ol>';inOl=true;}html+=`<li>${inline(m[1])}</li>`;continue;}
  closeLists(); html+=`<p>${inline(line)}</p>`;
 }
 flushTable(); closeLists(); if(inCode) html+=`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`; return html;
}
