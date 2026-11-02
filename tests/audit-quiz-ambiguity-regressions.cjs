// Targeted regression checks for previously identified multiple-defensible-answer defects.
// This is a curated guard against reintroducing specific mistakes, NOT semantic validation
// of all 388 questions or verification of physical movement technique.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const cases = [
  {id:'CON101-04', number:3, correct:'A', mustContain:['cannot exit it comfortably and independently','can enter and exit the kneeling position with stable, comfortable support'], mustNotContain:['has no controlled way to rise','cannot manage the support transfer','knee contact remains uncomfortable']},
  {id:'STG101-01', number:2, correct:'B', mustContain:['stability and load rating may be unknown','closed door automatically provides a verified'], mustNotContain:['attachment may appear secure but can shift under a pulling load']},
  {id:'BEL101-04', number:3, correct:'A', mustContain:['original coordination study','authenticated example of every regional'], mustNotContain:['does not establish the specific lineage of the source video']},
  {id:'CMP502-01', number:2, correct:'C', mustContain:['Support and momentum must remain physically manageable','automatically guarantees a stable support foot'], mustNotContain:['may begin with a weight transfer that lacks stable support','ending pose may not provide the support needed']},
  {id:'PRO702-03', number:2, correct:'B', mustContain:['loose hem catching underfoot','fitted sleeve tested'], mustNotContain:['long sleeve that catches','loose accessory that shifts','trailing sash that contacts']},
  {id:'RES501-03', number:4, correct:'D', mustContain:['visible onset count was documented','These six trials establish how all dancers move'], mustNotContain:['Six trials provide a precise estimate of the average onset']},
  {id:'PRO703-02', number:4, correct:'D', mustContain:['Movement evidence and media permissions','Which requirement remains even after an artist statement'], mustNotContain:['A. A precise count sheet showing','B. The license or permission required','C. Evidence that the gesture actually']}
];
for (const test of cases) {
  const md=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',test.id+'.md'),'utf8');
  const quiz=md.split(/## (?:Knowledge check|Four-question knowledge check)/i)[1];
  assert.ok(quiz, test.id+': quiz missing');
  const match=quiz.match(new RegExp('\\*\\*'+test.number+'\\. ([^\\n]+)\\*\\*\\s*\\n\\s*A\\. ([^\\n]+)\\s*\\n\\s*B\\. ([^\\n]+)\\s*\\n\\s*C\\. ([^\\n]+)\\s*\\n\\s*D\\. ([^\\n]+)'));
  assert.ok(match,test.id+': question '+test.number+' cannot be parsed');
  const block=match[0];
  const key=quiz.match(new RegExp('\\*\\*'+test.number+'\\. ([ABCD])\\.\\*\\*'));
  assert.ok(key,test.id+': answer key missing');
  assert.equal(key[1],test.correct,test.id+': key changed without reviewing the known defect');
  for (const phrase of test.mustContain) assert.ok(block.includes(phrase),test.id+': expected corrected text missing: '+phrase);
  for (const phrase of test.mustNotContain) assert.ok(!block.includes(phrase),test.id+': known ambiguity returned: '+phrase);
}
console.log('PASS: '+cases.length+' targeted quiz-ambiguity regression cases. These assertions do not establish unique-best-answer validity for other questions.');
