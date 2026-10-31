// Editorial triage, not a substitute for factual or movement-technique review.
// Run: node tests/audit-instructional-coverage.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', 'curriculum', 'final-lessons');
const courses = ['MOV101','DNC101','BEL101','CON101','HIP101','MUS101','CMP101','HIS101','LAB101','STG101','FLE101','LMA201','PER201','RES501','CMP502','SCI503','EST504','SIT505','PRO701','PRO702','PRO703'];
const ids = [...courses.flatMap(c => Array.from({length:4},(_,i)=>c+'-'+String(i+1).padStart(2,'0'))),...Array.from({length:13},(_,i)=>'BEL101-W'+String(i+4).padStart(2,'0'))];
const criteria = {
 outcomes: /(?:learning outcomes|learning objectives)/i,
 guidedPractice: /(?:guided|follow.along|practice|exercise|movement study|movement exploration)/i,
 modifications: /(?:modification|adaptation|seated|reduce (?:the )?range|alternative)/i,
 correction: /(?:self.correction|troubleshooting|adjustment|if you|correction)/i,
 knowledgeCheck: /(?:knowledge check|question 1)/i,
 explanations: /(?:answer key|answers and explanations|correct:)/i,
 assignment: /(?:assignment|submit:|reflection)/i,
 evidence: /(?:source|reference|evidence|further study)/i
};
const rows = ids.map(id => {
 const file = path.join(root,id+'.md');
 if(!fs.existsSync(file)) return {id,missing:true,checks:{},flags:['MISSING FILE']};
 const markdown = fs.readFileSync(file,'utf8');
 const checks = Object.fromEntries(Object.entries(criteria).map(([key,pattern])=>[key,pattern.test(markdown)]));
 const flags = Object.entries(checks).filter(([,ok])=>!ok).map(([key])=>'REVIEW '+key);
 const prompts = [...markdown.matchAll(/\*\*([1-4])\.\s+[^\n]+\?\*\*/g)].length;
 const answers = [...markdown.matchAll(/\*\*([1-4])\.\s+[ABCD]\.\*\*/g)].length;
 if(prompts !== 4 && !/\*\*Question 1\.\*\*/.test(markdown)) flags.push('REVIEW question formatting/count');
 if(answers !== 4 && !/\*\*Correct: [ABCD]\.\*\*/.test(markdown)) flags.push('REVIEW answer formatting/count');
 if(/(?:not independently verified|remain pending|review.*pending)/i.test(markdown)) flags.push('REVIEW explicitly pending evidence');
 return {id,missing:false,checks,flags};
});
const summary = {total:rows.length,missing:rows.filter(r=>r.missing).length,flagged:rows.filter(r=>r.flags.length).length,unflagged:rows.filter(r=>!r.flags.length).length};
console.log('Instructional coverage triage (NOT instructional validation): '+JSON.stringify(summary));
for(const row of rows.filter(r=>r.flags.length)) console.log(row.id+': '+row.flags.join('; '));
if(process.env.AOM_AUDIT_JSON==='1') console.log(JSON.stringify({summary,rows},null,2));
if(summary.missing) process.exitCode=1;
// A clean report only means expected text signals exist. Manual correctness review is mandatory.
