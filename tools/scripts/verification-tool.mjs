import { scanEntities, writeJson } from '../lib/common.mjs';
import { buildVerificationReport, verificationFindings } from '../lib/verification.mjs';
import { loadJson } from '../lib/common.mjs';

const cmd=process.argv[2]||'status';
const {entities}=scanEntities();
const quality=loadJson('registry/quality-rules.json',{rules:[]});
const {report,findings}=verificationFindings(entities,quality.rules||[]);
writeJson('.project-docs/reports/verification-report.json',{...report,findings});
if(cmd==='status'){
  console.log(`Verification: ${report.summary.acceptanceCovered}/${report.summary.acceptanceCriteria} AC covered (${report.summary.acceptanceCoverage}%), ${report.summary.criticalRulesFullyCovered}/${report.summary.criticalBusinessRules} critical Business Rules fully covered.`);
  console.log(`Invalid refs: ${report.summary.invalidAcceptanceRefs} acceptance, ${report.summary.invalidBusinessRuleCases} business-rule case(s).`);
}else if(cmd==='check'){
  const errors=findings.filter(x=>x.severity==='error').length;
  const warnings=findings.filter(x=>x.severity==='warning').length;
  console.log(`Verification check: ${errors} error(s), ${warnings} warning(s)`);
  for(const f of findings) console.log(`[${f.severity.toUpperCase()}] ${f.code}: ${f.message}${f.file?` (${f.file})`:''}`);
  if(errors) process.exitCode=1;
}else{
  console.log('verification-tool commands: status, check');
}
