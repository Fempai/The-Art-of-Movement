// Regression gate for editorial quiz feedback in all 17 BEL101 lesson files.
// Checks completeness and generic boilerplate only; does NOT validate dance technique or answer correctness.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const ids = [...Array.from({length:4},(_,i)=>'BEL101-'+String(i+1).padStart(2,'0')),...Array.from({length:13},(_,i)=>'BEL101-W'+String(i+4).padStart(2,'0'))];
const errors=[];
for(const id of ids){
  const file=path.join(__dirname,'..','curriculum','final-lessons',id+'.md');
  if(!fs.existsSync(file)){errors.push(id+': missing lesson');continue}
  const md=fs.readFileSync(file,'utf8');
  const quiz=md.split(/## (?:Four-question knowledge check|Knowledge check)/i)[1]?.split('## Independent assignment')[0];
  if(!quiz){errors.push(id+': quiz section missing');continue}
  const answers=[...quiz.matchAll(/\*\*([1-4])\. ([ABCD])\.\*\*\s*([^\n]+)/g)];
  if(answers.length!==4){errors.push(id+': expected 4 numbered answer explanations, found '+answers.length);continue}
  for(let i=0;i<answers.length;i++){
    const [,number,,explanation]=answers[i];
    if(Number(number)!==i+1)errors.push(id+': answer numbering out of sequence');
    if(explanation.trim().length<70)errors.push(id+': answer '+number+' explanation too short for substantive feedback');
    if(/(?:this is the supported choice|this choice reflects the stated objective)/i.test(explanation))errors.push(id+': answer '+number+' contains recycled feedback');
    if(/this is the supported choice for the introductory drill|this choice reflects the stated objective, safe scaling, or evidence boundary/i.test(explanation))errors.push(id+': answer '+number+' still contains generic rationale');
  }
}
assert.deepEqual(errors,[],'BEL101 feedback regression failures:\n'+errors.join('\n'));
console.log('PASS: 17 BEL101 lessons have four non-boilerplate answer explanations each (68 total). Editorial and technique validation remain pending.');
