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
  const questions=[...quiz.matchAll(/\*\*([1-4])\. ([^\n]+)\*\*\s*\n\s*A\. ([^\n]+)\s*\n\s*B\. ([^\n]+)\s*\n\s*C\. ([^\n]+)\s*\n\s*D\. ([^\n]+)/g)];
  if(questions.length!==4)errors.push(id+': expected four complete question-and-option sets, found '+questions.length);
  const answers=[...quiz.matchAll(/\*\*([1-4])\. ([ABCD])\.\*\*\s*([^\n]+)/g)];
  if(questions.length===4&&answers.length===4){
    for(let i=0;i<4;i++){
      if(questions[i][1]!==String(i+1))errors.push(id+': question numbering out of sequence');
      const options=questions[i].slice(3,7).map(v=>v.trim().toLowerCase());
      if(new Set(options).size!==4)errors.push(id+': duplicate choices in question '+(i+1));
      if(answers[i][2]!==undefined && !'ABCD'.includes(answers[i][2]))errors.push(id+': invalid key for question '+(i+1));
    }
  }
  if(answers.length!==4){errors.push(id+': expected 4 numbered answer explanations, found '+answers.length);continue}
  if(questions.length===4&&answers.length===4){
    const letters=answers.map(a=>a[2]).join('');
    if(letters==='ABCD'||letters==='DCBA')errors.push(id+': predictable sequential answer key '+letters);
    if(new Set(letters).size<3)errors.push(id+': fewer than three answer positions used');
    const prompts=questions.map(q=>q[2].trim().toLowerCase());
    if(new Set(prompts).size!==4)errors.push(id+': duplicate question prompts');
    for(let i=0;i<4;i++){
      const letter=answers[i][2];
      const correct=questions[i]['ABCD'.indexOf(letter)+3];
      if(!correct?.trim())errors.push(id+': missing keyed option for question '+(i+1));
    }
  }

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
