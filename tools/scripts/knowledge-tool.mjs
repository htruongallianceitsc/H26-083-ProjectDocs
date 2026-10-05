import { parseArgs, writeJson } from '../lib/common.mjs';
import { buildKnowledgeIndexes, searchKnowledge, queryEntities, buildContext, viewConfig } from '../lib/knowledge-engine.mjs';
const action=process.argv[2]||'help';const args=parseArgs(process.argv.slice(3));
const arr=v=>Array.isArray(v)?v:(v?[v]:[]);
function printEntity(e){console.log(`${e.code}\t${e.type}\t${e.status}\t${e.title}`);}
try{
  if(action==='reindex'){const r=buildKnowledgeIndexes();console.log(`Knowledge indexes: ${r.entities.length} entity(s), ${r.edges.length} edge(s), ${r.documents.length} searchable document(s).`);}
  else if(action==='search'){if(!args.text)throw new Error('Use --text QUERY');const rows=searchKnowledge(String(args.text),{types:arr(args.type),limit:args.limit});console.log(`Search: ${rows.length} result(s).`);rows.forEach(r=>console.log(`${r.score}\t${r.code}\t${r.type}\t${r.title}`));}
  else if(action==='query'){if(!args.expr)throw new Error('Use --expr EXPRESSION');const rows=queryEntities(String(args.expr),{relatedTo:args['related-to'],direction:args.direction,relations:arr(args.relation),maxDepth:args['max-depth'],limit:args.limit});console.log(`Query: ${rows.length} result(s).`);rows.forEach(printEntity);}
  else if(action==='context'){if(!args.entity)throw new Error('Use --entity CODE_OR_UID');const pack=buildContext(String(args.entity),{direction:args.direction,maxDepth:args['max-depth'],maxEntities:args['max-entities']});writeJson('.project-docs/reports/context-pack.json',pack);console.log(`Context: root=${pack.root.code}, related=${pack.related.length}, sourceEvidence=${pack.sourceEvidence.length}`);console.log(JSON.stringify(pack,null,2));}
  else if(action==='view-list'){for(const [id,v] of Object.entries(viewConfig().views||{}))console.log(`${id}\t${v.expression||''}`);}
  else if(action==='view-run'){const id=String(args.view||'');const v=viewConfig().views?.[id];if(!v)throw new Error(`Unknown view: ${id}`);const rows=queryEntities(v.expression||'',{limit:v.limit});console.log(`View ${id}: ${rows.length} result(s).`);rows.forEach(printEntity);}
  else console.log('knowledge-tool commands: reindex, search --text QUERY [--type TYPE], query --expr EXPR [--related-to CODE --direction both|in|out --relation FIELD --max-depth N], context --entity REF, view-list, view-run --view ID');
}catch(e){console.error(`[ERROR] ${e.message}`);process.exitCode=1;}
