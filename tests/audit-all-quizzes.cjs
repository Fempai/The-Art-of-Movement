// Structural regression audit of all 97 lesson quizzes; no external dependencies.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const courses=['MOV101','DNC101','BEL101','CON101','HIP101','MUS101','CMP101','HIS101','LAB101','STG101','FLE101','LMA201','PER201','RES501','CMP502','SCI503','EST504','SIT505','PRO701','PRO702','PRO703'];
const errors=[],keys={};
const lessonIds=[...courses.flatMap(course=>Array.from({length:4},(_,i)=>course+'-'+String(i+1).padStart(2,'0'))),...Array.from({length:13},(_,i)=>'BEL101-W'+String(i+4).padStart(2,'0'))];
for(const id of lessonIds){
 const filename=path.join(__dirname,'..','curriculum','final-lessons',id+'.md');
 if(!fs.existsSync(filename)){errors.push(id+': file missing');continue}
 const markdown=fs.readFileSync(filename,'utf8');
 const alternate=id==='MOV101-01';
 let questions,answers;
 if(alternate){
  const block=markdown.split('**Question 1.**')[1];
  if(!block){errors.push(id+': alternate quiz missing');continue}
  const body='**Question 1.**'+block.split('**Scoring:**')[0];
  questions=[...body.matchAll(/\*\*Question ([1-4])\.\*\*\s*([^\n]+)\s*\n\s*A\. ([^\n]+)\s*\n\s*B\. ([^\n]+)\s*\n\s*C\. ([^\n]+)\s*\n\s*D\. ([^\n]+)/g)];
  answers=[...body.matchAll(/\*\*Correct: ([ABCD])\.\*\*\s*([^\n]+)/g)];
 }else{
  const block=(markdown.split('## Knowledge check')[1]||markdown.split('## Four-question knowledge check')[1])?.split('## Independent assignment')[0];
  if(!block){errors.push(id+': standard quiz heading missing');continue}
  questions=[...block.matchAll(/\*\*([1-4])\. ([^\n]+)\*\*\s*\n\s*A\. ([^\n]+)\s*\n\s*B\. ([^\n]+)\s*\n\s*C\. ([^\n]+)\s*\n\s*D\. ([^\n]+)/g)];
  answers=[...block.matchAll(/\*\*([1-4])\. ([ABCD])\.\*\*\s*([^\n]+)/g)];
 }
 if(questions.length!==4||answers.length!==4){errors.push(id+': '+questions.length+' questions / '+answers.length+' answers');continue}
 if(questions.some((q,i)=>q[1]!==String(i+1)))errors.push(id+': question numbering mismatch');
 if(!alternate&&answers.some((a,i)=>a[1]!==String(i+1)))errors.push(id+': answer numbering mismatch');
 const letters=answers.map(a=>alternate?a[1]:a[2]).join('');
 keys[id]=letters;
 if(questions.some(q=>!q[2]?.trim()))errors.push(id+': empty question prompt');
 if(questions.some(q=>q.slice(3,7).some(x=>!x?.trim())))errors.push(id+': empty option');
 if(questions.some(q=>new Set(q.slice(3,7).map(x=>x.trim().toLowerCase())).size!==4))errors.push(id+': duplicate answer choices');
 if(new Set(questions.map(q=>q[2].trim().toLowerCase())).size!==4)errors.push(id+': duplicate question prompts');
 if(answers.some(a=>(alternate?a[2]:a[3]).trim().length<25))errors.push(id+': answer explanation too short for meaningful feedback');
 if(answers.some(a=>!(alternate?a[2]:a[3])?.trim()))errors.push(id+': empty explanation');
 if(answers.some(a=>!('ABCD'.includes(alternate?a[1]:a[2]))))errors.push(id+': invalid correct-answer letter');
 if(!alternate&&answers.some((a,i)=>a[1]!==questions[i][1]))errors.push(id+': answer key does not align with question order');
 if(questions.some((q,i)=>!q['ABCD'.indexOf(alternate?answers[i][1]:answers[i][2])+3]?.trim()))errors.push(id+': keyed option missing');
}
assert.equal(Object.keys(keys).length,97,'Expected 97 parseable lesson quizzes; errors: '+errors.join('; '));
assert.deepEqual(errors,[],'Quiz compatibility errors');
// Detect conspicuously patterned answer keys for human assessment review.
// This is an editorial warning, not proof that an answer is incorrect.
const patterned=Object.entries(keys).filter(([,key])=>key==='ABCD'||key==='DCBA');
console.log('EDITORIAL REVIEW: '+patterned.length+' lessons use sequential ABCD/DCBA answer keys.');
if(patterned.length)console.warn('PATTERNED KEYS: '+patterned.map(([id,key])=>id+' ['+key+']').join(', '));
const repeated=Object.entries(keys).filter(([,key])=>new Set(key).size===1);
console.log('PASS: 97/97 quiz structures compatible; '+repeated.length+' all-same-letter keys flagged for editorial review.');
if(repeated.length)console.warn('EDITORIAL REVIEW (not a structural failure): '+repeated.map(([id,key])=>id+' ['+key+']').join(', '));
const distribution=Object.fromEntries('ABCD'.split('').map(letter=>[letter,Object.values(keys).reduce((count,key)=>count+[...key].filter(answer=>answer===letter).length,0)]));
console.log('Answer-key distribution across 388 questions: '+Object.entries(distribution).map(([letter,count])=>letter+'='+count).join(', '));

// Regression guard for course-specific assessment content after editorial passes.
// This tests that lesson tasks remain distinct; it does NOT validate factual correctness.
const assessmentSignals={
 MUS101:['quarter-note pulse','intervening straight eighth-note','expected strong-beat reference','A–B–A′–C'],
 LMA201:['fingertips on count 5','bound-versus-freer-flow','enclose the hands','four-row comparison score'],
 PER201:['three gaze versions','three ways: invitation','balanced stillness','two complete, annotated 32-count'],
 RES501:['three-row question matrix','two-source evidence matrix','six-trial reach-onset','600–800-word research proposal']
};
for(const [course,signals] of Object.entries(assessmentSignals)){
 const assignments=[];
 for(let i=1;i<=4;i++){
  const id=course+'-'+String(i).padStart(2,'0');
  const md=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',id+'.md'),'utf8');
  const section=md.split('## Independent assignment')[1]?.split('## ')[0]||'';
  assert.ok(section.includes(signals[i-1]),id+': missing lesson-specific assessment signal '+signals[i-1]);
  assignments.push(section.split('**Worked example:**')[0].trim());
 }
 assert.equal(new Set(assignments).size,4,course+': duplicate independent assignments');
}
console.log('PASS: 16 course-specific assignments retain distinct lesson signals (editorial regression only).');


// Regression guard for the seven recently individualized advanced-course assessments.
// This is a text-integrity check, not an expert evaluation of the taught technique.
const advancedAssessmentHeadings={
 CMP502:'Independent assignment',
 SCI503:'Independent assignment',
 EST504:'Independent critical assignment',
 SIT505:'Independent assignment',
 PRO701:'Assignment and assessment',
 PRO702:'Independent assignment',
 PRO703:'Independent assignment'
};
for(const [course,heading] of Object.entries(advancedAssessmentHeadings)){
 const assignmentBodies=[];
 for(let i=1;i<=4;i++){
  const id=course+'-'+String(i).padStart(2,'0');
  const md=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',id+'.md'),'utf8');
  const marker='## '+heading;
  const start=md.indexOf(marker+'\n');
  assert.ok(start>=0,id+': missing expected assessment heading');
  const after=md.slice(start+marker.length);
  const next=after.search(/\n## /);
  const section=(next>=0?after.slice(0,next):after).trim();
  assert.ok(section.length>=350,id+': assessment unexpectedly short');
  assert.ok(section.includes('**Worked example:**'),id+': missing worked example');
  assert.ok(section.includes('**Rubric:**'),id+': missing assessment rubric');
  const rubric=section.split('**Rubric:**')[1]||'';
  const weights=[...rubric.matchAll(/(\d+)%/g)].map(m=>Number(m[1]));
  assert.equal(weights.reduce((sum,n)=>sum+n,0),100,id+': rubric weights must total 100%');
  assignmentBodies.push(section.split('**Worked example:**')[0].trim().replace(/\s+/g,' ').toLowerCase());
 }
 assert.equal(new Set(assignmentBodies).size,4,course+': duplicate lesson assignments');
}
console.log('PASS: 28 advanced-course assessments have distinct tasks, worked examples and 100% rubrics (text regression only).');


// Guard the three professional-practice courses against reintroducing generic
// Lesson-04 capstone instructions into the earlier lessons.
const professionalAssessmentSignals={
 PRO701:[
  'four-item polish checklist',
  'one-word entry cues',
  'comparison matrix for three interpretations',
  'private repertory showcase'
 ],
 PRO702:[
  'two-state lighting cue sheet',
  'labeled stage map',
  'movement-safety comparison',
  '**production book**'
 ],
 PRO703:[
  'dated revision dossier',
  '200–300-word artist statement',
  'criterion / target / observation / revision',
  'final 2–4 minute original capstone portfolio'
 ]
};
for(const [course,signals] of Object.entries(professionalAssessmentSignals)){
 for(let i=1;i<=4;i++){
  const id=course+'-'+String(i).padStart(2,'0');
  const md=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',id+'.md'),'utf8');
  const heading=course==='PRO701'?'## Assignment and assessment':'## Independent assignment';
  const section=(md.split(heading)[1]||'').split('\n## ')[0];
  assert.ok(section.includes(signals[i-1]),id+': missing taught lesson-specific artifact '+signals[i-1]);
  if(i<4) assert.ok(!section.includes('**Lesson 04 capstone:**')&&!section.includes('**Lesson 04 final capstone:**'),id+': unrelated final capstone instructions leaked into this assignment');
 }
}
console.log('PASS: 12 professional-course assessments retain taught artifacts and earlier lessons omit final-capstone boilerplate.');
