// Targeted regression checks for previously identified multiple-defensible-answer defects.
// This is a curated guard against reintroducing specific mistakes, NOT semantic validation
// of all 388 questions or verification of physical movement technique.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const cases = [
  {id:'CON101-04', number:3, correct:'A', mustContain:['cannot exit it comfortably and independently','can enter and exit the kneeling position with stable, comfortable support'], mustNotContain:['has no controlled way to rise','cannot manage the support transfer','knee contact remains uncomfortable']},
  {id:'STG101-01', number:2, correct:'B', mustContain:['stability and load rating may be unknown','closed door automatically provides a verified'], mustNotContain:['attachment may appear secure but can shift under a pulling load']},
  {id:'BEL101-04', number:3, correct:'A', mustContain:['original coordination study','not an authenticated raqs sharqi or baladi choreography'], mustNotContain:['does not establish the specific lineage of the source video']},
  {id:'CMP502-01', number:2, correct:'C', mustContain:['Support and momentum must remain physically manageable','automatically guarantees a stable support foot'], mustNotContain:['may begin with a weight transfer that lacks stable support','ending pose may not provide the support needed']},
  {id:'PRO702-03', number:2, correct:'B', mustContain:['loose hem catching underfoot','fitted sleeve tested'], mustNotContain:['long sleeve that catches','loose accessory that shifts','trailing sash that contacts']},
  {id:'EST504-03', number:4, correct:'D', mustContain:['specific dancer and documenting','practitioner interview that explicitly','inspired by culture'], mustNotContain:['without showing a link to the borrowed phrase','general interview that does not discuss','unspecified traditional source without']},
  {id:'CMP502-02', number:4, correct:'D', mustContain:['Which feature is absent','Overlapping activity between the two layers'], mustNotContain:['They do not overlap in time','They follow one another without a shared period','never sound or move at the same time']},
  {id:'RES501-02', number:4, correct:'D', mustContain:['Which citation practice fails to verify the source','DOI that resolves to the exact article','generic homepage presented as a verified article link'], mustNotContain:['DOI that resolves to a different article','page number added without consulting','copied from a search snippet without checking']},
  {id:'RES501-03', number:4, correct:'D', mustContain:['visible onset count was documented','These six trials establish how all dancers move'], mustNotContain:['Six trials provide a precise estimate of the average onset']},
  {id:'PRO703-02', number:4, correct:'D', mustContain:['Movement evidence and media permissions','Which requirement remains even after an artist statement'], mustNotContain:['A. A precise count sheet showing','B. The license or permission required','C. Evidence that the gesture actually']},
  {id:'BEL101-W15', number:4, correct:'B', mustContain:['hand-traced substitute','same torso-isolation technique as a performed wave','describe and repeat this adapted original sequence'], mustNotContain:['has not attempted the optional torso wave']},
  {id:'BEL101-W07', number:1, correct:'D', mustContain:['optional step that can change floor position','Counts 1–4 trace a grounded pathway'], mustNotContain:['step changing position']},
  {id:'BEL101-W09', number:1, correct:'B', mustContain:['actual travel is confirmed only if their floor position changes'], mustNotContain:['Their position on the floor changes through a step']},
  {id:'BEL101-03', number:1, correct:'D', mustContain:['Alternating which knee gently softens, one knee per count'], mustNotContain:['Alternating gentle knee softening and release']},
  {id:'BEL101-W15', number:3, correct:'D', mustContain:['optional torso sequence begins on count 5','connect them in the planned order without an extra pause'], mustNotContain:['Why rehearse the arms and torso sequence separately?','before combining them']},
  {id:'BEL101-W13', number:4, correct:'D', mustContain:['pauses there on count 5','did not demonstrate the prescribed reversal beginning on count 5'], mustNotContain:['What is the best way to check whether the return path is distinct?']},
  {id:'BEL101-W14', number:4, correct:'D', mustContain:['global count 9','repeated this original 8-to-9 boundary'], mustNotContain:['What does a clear original transition demonstrate?']},
  {id:'BEL101-W16', number:2, correct:'B', mustContain:['seated hand-traced Week 16 recording','compare observable count timing and sequence only'], mustNotContain:['How should they compare?']},
  {id:'BEL101-W10', number:4, correct:'D', mustContain:['two observable attempts','repeated this original beginner transition'], mustNotContain:['What establishes a successful beginner transition?']}
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

// Guard keyed explanations, not only the question stem and choices.
const explanationContracts = [
  {id:'BEL101-W10', number:4, key:'D', phrases:['Two observable attempts support the narrow claim','untested tempos']},
  {id:'BEL101-W13', number:4, key:'D', phrases:['reverses upward from the pelvis on count 5','symbolic tracing']},
  {id:'BEL101-W14', number:4, key:'D', phrases:['repeatable boundary timing','separate rehearsal']},
  {id:'BEL101-W15', number:3, key:'D', phrases:['count-4-to-5 connection','sequential coordination']},
  {id:'BEL101-W16', number:2, key:'B', phrases:['symbolic hand tracing','standing pelvic mechanics']}
];
for (const test of explanationContracts) {
  const md=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons',test.id+'.md'),'utf8');
  const prefix='**'+test.number+'. '+test.key+'.** ';
  const line=md.split('\n').find(line=>line.startsWith(prefix));
  assert.ok(line,test.id+': keyed explanation missing');
  for (const phrase of test.phrases) assert.ok(line.includes(phrase),test.id+': explanation missing evidence boundary: '+phrase);
}
console.log('PASS: '+explanationContracts.length+' BEL101 keyed-explanation consistency guards.');


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
    id: 'BEL101-W16',
    guided: ["sharing the label 'circle' is not enough", 'compare counts 1–4 only'],
    assignment: ['slide-and-return timing on counts 1–4', 'only when the recorded direction, start/end position', 'out of observable, attempted actions', 'if no attempted action can be observed, report **not assessable**', 'Report each attempt\'s numerator and denominator separately', 'Separately assess the 6→7 circle-to-pulse transition', 'not assessable** if either component is unobservable or omitted', 'not be added as a ninth movement count', 'it is **not** the assignment grade or a completion percentage', 'A high fraction with most actions omitted does **not** demonstrate completion of the full phrase', 'standing-technique outcome **not demonstrated**']
  },
  {
    id: 'BEL101-W13',
    guided: ['**The 4→5 boundary changes travel direction at the pelvis', 'without another downward arrival or hold'],
    assignment: ['direction reversed on 4→5', 'boundary unobservable']
  },
  {
    id: 'BEL101-W04',
    guided: ['**compresses the separately rehearsed eight-count torso study into four counts**', 'right on 5, gently forward on 6, left on 7', '4→5'],
    assignment: ['connected eight-count combination', 'not yet attempted']
  },
  {
    id: 'BEL101-W06',
    guided: ['**One alternating knee softening is assigned to each beat.**', 'not a second counted action'],
    assignment: ['R–L–R–L–R–L–R–L', 'second attempt']
  },
  {
    id: 'BEL101-W10',
    guided: ['**Modification:** Sit in a stable nonrolling chair', '**4→5 boundary**', 'sequence and timing only'],
    assignment: ['connection between the left slide and half-circle', 'counts 3–6']
  },
  {
    id: 'BEL101-02',
    guided: ['**two attempts of each separate eight-count study**', 'return to center on 8', 'not evidence of standing pelvic-circle mechanics'],
    assignment: ['separate eight-count small oval pathway', 'mirrored left-first variation']
  },
  {
    id: 'BEL101-04',
    guided: ['**two separate eight-count attempts**', '**6→7 transition**', 'without reversing the accent order', 'Week 2 holds the right slide on 1–2', 'Week 3 assigns one alternating knee action per beat', 'not** the full eight-count scores as if they were equivalent'],
    assignment: ['mirror the slide order and half-oval direction', 'right-then-left knee accents on 7–8', '6→7 half-oval-to-accent transition', 'historical baseline not available', 'Week 2\'s slide holds right on 1–2', 'Week 3 uses eight alternating knee actions', 'not** an eight-beat performance score']
  },
  {
    id: 'BEL101-W08',
    guided: ['**Modification:** Sit in a stable nonrolling chair', '**5–6** trace a small comfortable loop', 'neither substitutes for demonstrated standing hip-slide', 'Week 1 uses two counts per direction and Week 8 uses one', 'timing and mechanics are **not** matched', 'The right–center–left–center order is shared, but Week 1 uses two counts per direction', 'not automatically out of eight', 'if none is observable, write **not assessable**', 'exclude both unobservable and intentionally omitted actions from the denominator', 'on-count actions out of observable, attempted actions'],
    assignment: ['Week 8 eight-count phrase twice', 'two counts per direction', 'one count per direction', 'original Week 1 pressure-shift drill', 'no matched baseline']
  },
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
  const heading = md.search(/^#{2,3}\s+(?:\d+\.\s*)?[^\n]*(?:assignment|assessment)[^\n]*$/im);
  assert.ok(heading >= 0, contract.id+': assessment section missing');
  const guided = md.slice(0, heading);
  const assignment = md.slice(heading);
  for (const phrase of contract.guided) assert.ok(guided.includes(phrase), contract.id+': guided instruction missing: '+phrase);
  for (const phrase of contract.assignment) assert.ok(assignment.includes(phrase), contract.id+': assessment contract missing: '+phrase);
}
console.log('PASS: '+contracts.length+' targeted guided-practice/assessment consistency contracts (not semantic validation).');
