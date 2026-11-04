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
  {id:'EST504-03', number:4, correct:'D', mustContain:['specific dancer and documenting','practitioner interview that explicitly','inspired by culture'], mustNotContain:['without showing a link to the borrowed phrase','general interview that does not discuss','unspecified traditional source without']},
  {id:'CMP502-02', number:4, correct:'D', mustContain:['Which feature is absent','Overlapping activity between the two layers'], mustNotContain:['They do not overlap in time','They follow one another without a shared period','never sound or move at the same time']},
  {id:'RES501-02', number:4, correct:'D', mustContain:['Which citation practice fails to verify the source','DOI that resolves to the exact article','generic homepage presented as a verified article link'], mustNotContain:['DOI that resolves to a different article','page number added without consulting','copied from a search snippet without checking']},
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

// Regression coverage for Q1 distractor references after the A/B option reordering.
const reorderedQ1 = ["LMA201-01","LMA201-03","PER201-03","RES501-02","CMP502-04","SCI503-01","SCI503-03","SIT505-01","PRO701-01","PRO701-03","PRO702-01","PRO702-03","PRO703-01","PRO703-03","PRO703-04"];
for (const id of reorderedQ1) {
  const md = fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',id+'.md'),'utf8');
  const feedback = md.match(/\*\*1\. B\.\*\* ([^\n]+)/);
  assert.ok(feedback, id+': missing keyed B feedback');
  assert.ok(feedback[1].includes('(A)'), id+': explanation must identify A distractor');
  assert.ok(!feedback[1].includes('(B)'), id+': stale B distractor reference');
}
console.log('PASS: '+reorderedQ1.length+' Q1 answer-feedback label regressions.');

// Cross-section instructional contracts: guard against regressions where a guided
// exercise is corrected but the submitted assessment silently omits that requirement.
// Text checks are targeted consistency guards, not proof of technique or learning.
const contracts = [
  {
    id: 'LAB101-03',
    guided: ['**Seated option:**', '9 with a small leftward seated-pressure shift', '8→9 boundary'],
    assignment: ['two-phrase (16-count) A–B retrieval log', 'one immediate and one delayed attempt']
  },
  {
    id: 'PRO701-02',
    guided: ['B→A′ at the 16→17 boundary'],
    assignment: ['B→A′ (16→17) boundary check', 'A→B (8→9)', 'A′→C (24→25)']
  },
  {
    id: 'PRO702-04',
    guided: ['four consecutive eight-count phrases', 'transition support position'],
    assignment: ['four consecutive eight-count phrases per section', 'recorded exit/entry support']
  },
  {
    id: 'PRO703-04',
    guided: ['These are six creative functions', 'in a five-section version, combine two functions'],
    assignment: ['five to eight 32-count sections', 'calculated duration']
  }
];
for (const contract of contracts) {
  const md = fs.readFileSync(path.join(__dirname, '..', 'curriculum', 'final-lessons', contract.id+'.md'), 'utf8');
  const heading = md.search(/^## (?:Independent assignment|Assignment and assessment|Repertory assignment)/m);
  assert.ok(heading >= 0, contract.id+': assessment section missing');
  const guided = md.slice(0, heading);
  const assignment = md.slice(heading);
  for (const phrase of contract.guided) assert.ok(guided.includes(phrase), contract.id+': guided instruction missing: '+phrase);
  for (const phrase of contract.assignment) assert.ok(assignment.includes(phrase), contract.id+': assessment contract missing: '+phrase);
}
console.log('PASS: '+contracts.length+' targeted guided-practice/assessment consistency contracts (not semantic validation).');
