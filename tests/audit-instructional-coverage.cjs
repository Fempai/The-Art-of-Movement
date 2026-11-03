// Editorial triage, not a substitute for factual or movement-technique review.
// Run: node tests/audit-instructional-coverage.cjs
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', 'curriculum', 'final-lessons');
const courses = ['MOV101','DNC101','BEL101','CON101','HIP101','MUS101','CMP101','HIS101','LAB101','STG101','FLE101','LMA201','PER201','RES501','CMP502','SCI503','EST504','SIT505','PRO701','PRO702','PRO703'];
const ids = [...courses.flatMap(c => Array.from({length:4},(_,i)=>c+'-'+String(i+1).padStart(2,'0'))),...Array.from({length:13},(_,i)=>'BEL101-W'+String(i+4).padStart(2,'0'))];
const criteria = {
 outcomes: /(?:learning outcomes?|learning objectives?|objective and explanation|^##\s*objectives?\b)/im,
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


// Cross-lesson editorial triage: a repeated assignment may indicate a generic
// template that does not assess the lesson's stated learning outcomes.
// Report only; repetition is not automatically evidence of poor instruction.
const courseAssignmentReview=[];
const assignmentExtractionReview=[];
let extractedAssignments=0;
for(const course of courses){
 const signatures=new Map();
 for(let i=1;i<=4;i++){
  const id=course+'-'+String(i).padStart(2,'0');
  const file=path.join(root,id+'.md');
  if(!fs.existsSync(file))continue;
  const md=fs.readFileSync(file,'utf8');
  const heading=/^#{2,3}\s+(?:\d+\.\s*)?(?=[^\n]*(?:assignment|assessment))[^\n]+$/gim;
  const match=heading.exec(md);
  if(!match){assignmentExtractionReview.push(id+': no recognized assessment heading');continue;}
  const after=md.slice(match.index+match[0].length);
  const next=after.search(/\n#{2,3} /);
  const section=(next>=0?after.slice(0,next):after).split('**Worked example:**')[0];
  const normalized=section.replace(/\s+/g,' ').trim().toLowerCase();
  if(!normalized){assignmentExtractionReview.push(id+': empty extracted assessment');continue;}
  extractedAssignments++;
  if(!signatures.has(normalized))signatures.set(normalized,[]);
  signatures.get(normalized).push(id);
 }
 const duplicates=[...signatures.values()].filter(group=>group.length>1);
 if(duplicates.length)courseAssignmentReview.push({course,duplicates});
}
console.log('Assignment extraction coverage: '+extractedAssignments+'/84 core course lessons.');
console.log('Assignment duplication triage: '+courseAssignmentReview.length+' courses with identical lesson-assignment text.');
for(const item of courseAssignmentReview)console.log('REVIEW '+item.course+' repeated assignments: '+item.duplicates.map(group=>group.join(', ')).join('; '));

console.log('Assignment extraction triage: '+assignmentExtractionReview.length+' lessons require heading/content inspection.');
for(const issue of assignmentExtractionReview)console.log('REVIEW '+issue);
if(process.env.AOM_AUDIT_JSON==='1') console.log(JSON.stringify({extractedAssignments,expectedCoreAssignments:84,assignmentDuplication:courseAssignmentReview,assignmentExtraction:assignmentExtractionReview},null,2));
