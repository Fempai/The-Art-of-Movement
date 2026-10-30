// Structural regression audit of all 80 lesson quizzes; no external dependencies.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const courses=['MOV101','DNC101','CON101','HIP101','MUS101','CMP101','HIS101','LAB101','STG101','FLE101','LMA201','PER201','RES501','CMP502','SCI503','EST504','SIT505','PRO701','PRO702','PRO703'];
const errors=[],keys={};
for(const course of courses)for(let n=1;n<=4;n++){
 const id=course+'-'+String(n).padStart(2,'0');
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
  const block=markdown.split('## Knowledge check')[1]?.split('## Independent assignment')[0];
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
 if(answers.some(a=>!(alternate?a[2]:a[3])?.trim()))errors.push(id+': empty explanation');
 if(answers.some(a=>!('ABCD'.includes(alternate?a[1]:a[2]))))errors.push(id+': invalid correct-answer letter');
 if(!alternate&&answers.some((a,i)=>a[1]!==questions[i][1]))errors.push(id+': answer key does not align with question order');
}
assert.equal(Object.keys(keys).length,80,'Expected 80 parseable lesson quizzes; errors: '+errors.join('; '));
assert.deepEqual(errors,[],'Quiz compatibility errors');
const repeated=Object.entries(keys).filter(([,key])=>new Set(key).size===1);
console.log('PASS: 80/80 quiz structures compatible; '+repeated.length+' all-same-letter keys flagged for editorial review.');
if(repeated.length)console.warn('EDITORIAL REVIEW (not a structural failure): '+repeated.map(([id,key])=>id+' ['+key+']').join(', '));
const distribution=Object.fromEntries('ABCD'.split('').map(letter=>[letter,Object.values(keys).reduce((count,key)=>count+[...key].filter(answer=>answer===letter).length,0)]));
console.log('Answer-key distribution across 320 questions: '+Object.entries(distribution).map(([letter,count])=>letter+'='+count).join(', '));
