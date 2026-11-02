// Editorial feedback-depth gate for professional capstone, research-methods, dance-criticism, composition, motor-learning, site-responsive, and repertory lessons.
// This checks the presence of explanation and distractor-specific feedback;
// it does not establish that the teaching or answer key is factually correct.
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const ids=['PRO703-01','PRO703-02','PRO703-03','PRO703-04','RES501-01','RES501-02','RES501-03','RES501-04','EST504-01','EST504-02','EST504-03','EST504-04','CMP502-01','CMP502-02','CMP502-03','CMP502-04','SCI503-01','SCI503-02','SCI503-03','SCI503-04','SIT505-01','SIT505-02','SIT505-03','SIT505-04','PRO701-01','PRO701-02','PRO701-03','PRO701-04'];
const errors=[];
let checked=0;
for(const id of ids){
 const md=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',id+'.md'),'utf8');
 const quiz=md.split('## Knowledge check')[1]?.split('## Independent assignment')[0];
 if(!quiz){errors.push(id+': knowledge check missing');continue}
 const q=[...quiz.matchAll(/\*\*([1-4])\. ([^\n]+)\*\*\s*\n\s*A\. ([^\n]+)\s*\n\s*B\. ([^\n]+)\s*\n\s*C\. ([^\n]+)\s*\n\s*D\. ([^\n]+)/g)];
 const answers=[...quiz.matchAll(/\*\*([1-4])\. ([ABCD])\.\*\*\s*([^\n]+)/g)];
 if(q.length!==4||answers.length!==4){errors.push(id+': expected four questions and four explanations');continue}
 for(let i=0;i<4;i++){
  const a=answers[i],n=String(i+1);
  if(q[i][1]!==n||a[1]!==n)errors.push(id+': question/key order mismatch at '+n);
  const correct=a[2],explanation=a[3];
  if(explanation.length<180)errors.push(id+': explanation '+n+' shorter than 180 characters');
  for(const letter of 'ABCD'){
   if(letter===correct)continue;
   if(!explanation.includes('('+letter+')'))errors.push(id+': explanation '+n+' does not address distractor '+letter);
  }
  checked++;
 }
}
assert.deepEqual(errors,[],'Research and capstone feedback-depth regression failures:\n'+errors.join('\n'));
assert.equal(checked,112,'Expected 112 complete feedback checks');
console.log('PASS: 112/112 PRO703, RES501, EST504, CMP502, SCI503, SIT505, and PRO701 explanations include substantial rationale and feedback for each incorrect option. Semantic correctness remains subject to human review.');
