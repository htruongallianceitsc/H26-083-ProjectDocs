function section(body, heading) {
  const lines = String(body || '').replace(/\r\n/g, '\n').split('\n');
  const wanted = String(heading || '').trim().toLowerCase();
  let start = -1;
  for (let i=0;i<lines.length;i++) {
    const m=lines[i].match(/^##\s+(.+?)\s*$/);
    if (m && m[1].trim().toLowerCase() === wanted) { start=i+1; break; }
  }
  if (start < 0) return '';
  let end = lines.length;
  for (let i=start;i<lines.length;i++) if (/^##\s+/.test(lines[i])) { end=i; break; }
  return lines.slice(start,end).join('\n').trim();
}
function splitRow(line) {
  return line.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim());
}

export function acceptanceCriteria(requirement) {
  const content = section(requirement?.body || '', 'Acceptance Criteria');
  if (!content) return [];
  const lines = content.split(/\r?\n/).filter(x => x.trim());
  const start = lines.findIndex(x => x.includes('|'));
  if (start < 0 || start + 1 >= lines.length) return [];
  const headers = splitRow(lines[start]).map(x => x.toLowerCase());
  const separator = splitRow(lines[start + 1]);
  if (!separator.length || !separator.every(x => /^:?-{3,}:?$/.test(x))) return [];
  const idx = name => headers.indexOf(name);
  const idIndex = idx('id');
  if (idIndex < 0) return [];
  const typeIndex = idx('type');
  const scenarioIndex = idx('scenario');
  const criterionIndex = headers.findIndex(x => ['criterion','acceptance criterion','expected behaviour','expected behavior'].includes(x));
  const out = [];
  for (const line of lines.slice(start + 2)) {
    if (!line.includes('|')) break;
    const cells = splitRow(line);
    const id = String(cells[idIndex] || '').trim();
    if (!/^AC-[A-Z0-9][A-Z0-9._-]*$/i.test(id)) continue;
    out.push({
      id,
      ref: `${requirement.code}#${id}`,
      type: typeIndex >= 0 ? String(cells[typeIndex] || '').trim() : '',
      scenario: scenarioIndex >= 0 ? String(cells[scenarioIndex] || '').trim() : '',
      criterion: criterionIndex >= 0 ? String(cells[criterionIndex] || '').trim() : ''
    });
  }
  return out;
}

export function acceptanceRefs(test) {
  const raw = test?.meta?.acceptance_criteria;
  return (Array.isArray(raw) ? raw : raw ? [raw] : []).map(String).map(x => x.trim()).filter(Boolean);
}

export function businessRuleCases(test) {
  const raw = test?.meta?.business_rule_cases;
  return (Array.isArray(raw) ? raw : raw ? [raw] : []).map(String).map(x => x.trim()).filter(Boolean).map(ref => {
    const m = ref.match(/^([^#]+)#(positive|negative)$/i);
    return m ? { ref, code:m[1], polarity:m[2].toLowerCase() } : { ref, code:'', polarity:'' };
  });
}

function linkedTests(entity, tests) {
  const direct = new Set(Array.isArray(entity?.meta?.related?.tests) ? entity.meta.related.tests.map(String) : []);
  const incoming = tests.filter(t => {
    const field = entity.type === 'requirement' ? 'requirements' : entity.type === 'business-rule' ? 'business_rules' : null;
    return field && Array.isArray(t.meta?.related?.[field]) && t.meta.related[field].map(String).includes(entity.code);
  }).map(t => t.code);
  return [...new Set([...direct, ...incoming])];
}

export function buildVerificationReport(entities) {
  const byCode = new Map(entities.map(e => [e.code, e]));
  const tests = entities.filter(e => e.type === 'test-case');
  const requirements = entities.filter(e => e.type === 'requirement').map(req => {
    const criteria = acceptanceCriteria(req);
    const linked = linkedTests(req, tests);
    const coverage = criteria.map(ac => {
      const testCodes = tests.filter(t => acceptanceRefs(t).includes(ac.ref)).map(t => t.code);
      return { ...ac, tests:testCodes, covered:testCodes.length > 0 };
    });
    return {
      code:req.code,
      title:req.title,
      status:req.status,
      path:req.path,
      tests:linked,
      acceptanceCriteria:coverage,
      acceptanceTotal:coverage.length,
      acceptanceCovered:coverage.filter(x => x.covered).length,
      acceptanceCoverage:coverage.length ? Math.round(coverage.filter(x => x.covered).length * 100 / coverage.length) : 0
    };
  });
  const businessRules = entities.filter(e => e.type === 'business-rule').map(rule => {
    const linked = linkedTests(rule, tests);
    const cases = tests.flatMap(t => businessRuleCases(t).filter(x => x.code === rule.code).map(x => ({...x,test:t.code})));
    const positiveTests = [...new Set(cases.filter(x => x.polarity === 'positive').map(x => x.test))];
    const negativeTests = [...new Set(cases.filter(x => x.polarity === 'negative').map(x => x.test))];
    return {
      code:rule.code,
      title:rule.title,
      status:rule.status,
      path:rule.path,
      criticality:String(rule.meta?.criticality || 'normal'),
      verificationProfile:String(rule.meta?.verification_profile || (String(rule.meta?.criticality || '') === 'critical' ? 'positive-negative' : 'positive')),
      tests:linked,
      positiveTests,
      negativeTests,
      positiveCovered:positiveTests.length > 0,
      negativeCovered:negativeTests.length > 0
    };
  });
  const invalidAcceptanceRefs=[];
  const invalidBusinessRuleCases=[];
  const duplicateAcceptanceIds=[];
  const relationAlignment=[];
  for (const req of entities.filter(e=>e.type==='requirement')) {
    const ids=acceptanceCriteria(req).map(x=>x.id);
    for(const id of [...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))]) duplicateAcceptanceIds.push({requirement:req.code,id,ref:`${req.code}#${id}`,path:req.path});
  }
  for (const test of tests) {
    for (const ref of acceptanceRefs(test)) {
      const m=ref.match(/^([^#]+)#(AC-[A-Z0-9][A-Z0-9._-]*)$/i);
      const req=m?byCode.get(m[1]):null;
      const valid=Boolean(req && req.type==='requirement' && acceptanceCriteria(req).some(x=>x.ref===ref));
      if(!valid) invalidAcceptanceRefs.push({test:test.code,ref,path:test.path});
      else if(!Array.isArray(test.meta?.related?.requirements) || !test.meta.related.requirements.map(String).includes(m[1])) relationAlignment.push({kind:'acceptance',test:test.code,target:m[1],ref,path:test.path});
    }
    for (const item of businessRuleCases(test)) {
      const target=item.code?byCode.get(item.code):null;
      if(!item.code || !item.polarity || !target || target.type!=='business-rule') invalidBusinessRuleCases.push({test:test.code,ref:item.ref,path:test.path});
      else if(!Array.isArray(test.meta?.related?.business_rules) || !test.meta.related.business_rules.map(String).includes(item.code)) relationAlignment.push({kind:'business-rule',test:test.code,target:item.code,ref:item.ref,path:test.path});
    }
  }
  const allAc=requirements.flatMap(x=>x.acceptanceCriteria);
  return {
    schemaVersion:'1.0',
    generatedAt:new Date().toISOString(),
    summary:{
      requirements:requirements.length,
      acceptanceCriteria:allAc.length,
      acceptanceCovered:allAc.filter(x=>x.covered).length,
      acceptanceCoverage:allAc.length ? Math.round(allAc.filter(x=>x.covered).length*100/allAc.length) : 100,
      businessRules:businessRules.length,
      criticalBusinessRules:businessRules.filter(x=>x.criticality==='critical').length,
      criticalRulesFullyCovered:businessRules.filter(x=>x.criticality==='critical'&&x.positiveCovered&&x.negativeCovered).length,
      invalidAcceptanceRefs:invalidAcceptanceRefs.length,
      invalidBusinessRuleCases:invalidBusinessRuleCases.length,
      duplicateAcceptanceIds:duplicateAcceptanceIds.length,
      relationAlignmentWarnings:relationAlignment.length
    },
    requirements,
    businessRules,
    invalidAcceptanceRefs,
    invalidBusinessRuleCases,
    duplicateAcceptanceIds,
    relationAlignment
  };
}

export function verificationFindings(entities, rules=[]) {
  const report=buildVerificationReport(entities);
  const findings=[];
  const add=(severity,code,message,file='')=>findings.push({severity,code,message,file});
  for(const bad of report.invalidAcceptanceRefs) add('error','invalid-acceptance-reference',`${bad.test} references unknown acceptance criterion ${bad.ref}`,bad.path);
  for(const bad of report.invalidBusinessRuleCases) add('error','invalid-business-rule-case',`${bad.test} has invalid business_rule_cases entry ${bad.ref}`,bad.path);
  for(const bad of report.duplicateAcceptanceIds) add('error','duplicate-acceptance-id',`${bad.requirement} contains duplicate Acceptance Criterion ID ${bad.id}`,bad.path);
  for(const gap of report.relationAlignment) add('warning','verification-relation-alignment',`${gap.test} references ${gap.ref} but is not linked to ${gap.target} through normal related metadata`,gap.path);
  for(const rule of rules||[]) {
    if(rule.type==='requirement-acceptance-coverage') {
      for(const req of report.requirements.filter(x=>!(rule.statusIn||[]).length||(rule.statusIn||[]).includes(x.status))) {
        if(rule.requireStableIds!==false && req.acceptanceTotal===0) add(rule.severity,rule.id,`${req.code} requires stable Acceptance Criteria IDs (AC-01, AC-02, ...)`,req.path);
        if(rule.requireTests && req.tests.length===0) add(rule.severity,`${rule.id}-test-link`,`${req.code} requires at least one linked Test Case`,req.path);
        if(rule.requireEveryCriterionCovered!==false) for(const ac of req.acceptanceCriteria.filter(x=>!x.covered)) add(rule.severity,rule.id,`${ac.ref} is not covered by any Test Case acceptance_criteria reference`,req.path);
      }
    }
    if(rule.type==='business-rule-polarity-coverage') {
      for(const br of report.businessRules.filter(x=>!(rule.statusIn||[]).length||(rule.statusIn||[]).includes(x.status)).filter(x=>!(rule.criticalityIn||[]).length||(rule.criticalityIn||[]).includes(x.criticality))) {
        const required=rule.polarities||['positive','negative'];
        if(required.includes('positive')&&!br.positiveCovered) add(rule.severity,rule.id,`${br.code} requires positive Test Case coverage via business_rule_cases`,br.path);
        if(required.includes('negative')&&!br.negativeCovered) add(rule.severity,rule.id,`${br.code} requires negative Test Case coverage via business_rule_cases`,br.path);
      }
    }
  }
  return {report,findings};
}
