const {test,expect}=require('@playwright/test');
const pageUrl='http://127.0.0.1:8765/conservatory-course-reader.html';
test('course catalog initializes with all 21 courses',async({page})=>{
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
 const catalog=[];
 page.on('response',response=>{if(response.url().includes('COURSE_LESSONS_AND_SOURCES.json'))catalog.push(response.status()+' '+response.url())});
 const failedRequests=[];
 page.on('requestfailed',request=>failedRequests.push({url:request.url(),failure:request.failure()?.errorText}));
 await page.goto(pageUrl);
 const catalogResponse=await page.request.get('http://127.0.0.1:8765/curriculum/COURSE_LESSONS_AND_SOURCES.json');
 expect(catalogResponse.ok(),'Course catalog HTTP status: '+catalogResponse.status()).toBeTruthy();
 const catalogData=await catalogResponse.json();
 expect(catalogData.courses?.length,'Course catalog JSON must contain all 21 courses').toBe(21);
 try{
  await expect(page.locator('#course option')).toHaveCount(21,{timeout:8000});
 }catch(error){
  throw new Error('Reader did not initialize course options. '+JSON.stringify({count:await page.locator('#course option').count(),units:await page.locator('#units').innerText(),errors,catalog,failedRequests})+'\\n'+error.message);
 }
});

const standard=`# Test lesson
## Knowledge check
**1. First?**
A. Yes
B. No
C. Maybe
D. Later

**2. Second?**
A. No
B. Yes
C. Maybe
D. Later

**3. Third?**
A. No
B. Maybe
C. Yes
D. Later

**4. Fourth?**
A. No
B. Maybe
C. Later
D. Yes

### Answers and explanations
**1. A.** First rationale.
**2. B.** Second rationale.
**3. C.** Third rationale.
**4. D.** Fourth rationale.

## Independent assignment
Write a reflection.`;
const legacy=`# Test lesson
### 5. Check your understanding — answers included

**Question 1.** First?

A. Yes  
B. No  
C. Maybe  
D. Later

**Correct: A.** First rationale.

**Question 2.** Second?

A. No  
B. Yes  
C. Maybe  
D. Later

**Correct: B.** Second rationale.

**Question 3.** Third?

A. No  
B. Maybe  
C. Yes  
D. Later

**Correct: C.** Third rationale.

**Question 4.** Fourth?

A. No  
B. Maybe  
C. Later  
D. Yes

**Correct: D.** Fourth rationale.

**Scoring:** Review missed answers.`;
for(const [name,fixture] of [['standard',standard],['alternate',legacy]]){
test(name+' format grades, blocks partial submission, and saves retakes',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:fixture}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:name==='standard'?1:0});
 const open=page.getByRole('button',{name:'Study here'}).first();
 await expect(open).toBeVisible();
 await open.click();
 const quiz=page.getByRole('heading',{name:'Interactive knowledge check'}).first();
 await expect(quiz).toBeVisible();
 await expect(page.locator('.lesson-panel fieldset')).toHaveCount(4);
 await expect(page.getByText(name==='standard'?'DNC101 — Lesson 01':'MOV101 — Lesson 01')).toBeVisible();
 const section=quiz.locator('xpath=..');
 const check=section.getByRole('button',{name:'Check my answers'});
 await check.click();
 await expect(section.getByText(/4 unanswered/)).toBeVisible();
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 await groups.nth(0).locator('input[type=radio]').first().check();
 await check.click();
 await expect(section.getByText(/3 unanswered/)).toBeVisible();
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await check.click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth((i+1)%4).check();
 await check.click();
 await expect(section.getByText(/Score: 0 \/ 4/)).toBeVisible();
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await groups.nth(0).locator('input[type=radio]').nth(1).check();
 await check.click();
 await expect(section.getByText(/Score: 3 \/ 4/)).toBeVisible();
 await expect(section.locator('[aria-live="polite"]').getByText(/First rationale\./)).toBeVisible();
 await expect(section.locator('[aria-live="polite"]').getByText(/Second rationale\./)).toBeVisible();
 await expect(section.locator('[aria-live="polite"]').getByText(/Third rationale\./)).toBeVisible();
 await expect(section.locator('[aria-live="polite"]').getByText(/Fourth rationale\./)).toBeVisible();
 const saved=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).map(k=>JSON.parse(localStorage.getItem(k))));
 expect(saved.some(x=>x.score===3&&x.total===4)).toBeTruthy();
 expect(saved.find(x=>x.score===3)?.lesson).toBe(name==='standard'?'DNC101-01':'MOV101-01');
 await page.reload();
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:name==='standard'?1:0});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('.lesson-panel').getByText(/Previous.*quiz.*3 \/ 4/i)).toBeVisible();
});
}

test('malformed quiz shows fallback without storing an attempt',async({page})=>{
 const malformed=['# Incomplete lesson','## Knowledge check','**1. Missing choices?**','A. One','B. Two','## Independent assignment','Review.'].join(String.fromCharCode(10));
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:malformed}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
});

test('failed lesson download explains failure and permits retry',async({page})=>{
 let requests=0;
 await page.route('**/curriculum/final-lessons/**',route=>{
  requests++;
  return route.fulfill({status:requests===1?503:200,contentType:'text/plain',body:standard});
 });
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 const open=page.getByRole('button',{name:'Study here'}).first();
 await open.click();
 await expect(page.getByText(/Unable to load the in-site lesson: HTTP 503/)).toBeVisible();
 await expect(open).toBeEnabled();
 await open.click();
 await expect(page.getByRole('heading',{name:'Interactive knowledge check'})).toBeVisible();
 expect(requests).toBe(2);
});

test('quiz choices remain isolated when a lesson is closed and reopened',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 const open=page.getByRole('button',{name:'Study here'}).first();
 await open.click();
 const panel=page.locator('.lesson-panel');
 await expect(panel.locator('fieldset')).toHaveCount(4);
 await panel.locator('fieldset').first().locator('input[type=radio]').first().check();
 await panel.getByRole('button',{name:'Close lesson'}).click();
 await expect(panel).toBeHidden();
 await open.click();
 await expect(panel.locator('fieldset')).toHaveCount(4);
 await expect(panel.locator('input[type=radio]:checked')).toHaveCount(0);
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/4 unanswered/)).toBeVisible();
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
});

test('submitted quiz appears in Learning Progress with its latest score',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.getByRole('button',{name:'Study here'}).first().click();
 const panel=page.locator('.lesson-panel');
 await expect(panel.locator('fieldset')).toHaveCount(4);
 for(let i=0;i<4;i++)await panel.locator('fieldset').nth(i).locator('input[type=radio]').nth(i).check();
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await page.getByRole('link',{name:'Learning Progress'}).click();
 await expect(page).toHaveURL(/conservatory-progress\.html$/);
 await expect(page.locator('#summary')).toContainText('1 of 97 currently linked lesson quizzes have a recorded attempt');
 await expect(page.locator('#records tr').filter({hasText:'MOV101-01'})).toContainText('4 / 4');
 await expect(page.locator('#records tr').filter({hasText:'MOV101-01'})).toContainText('This device');
});

test('progress dashboard ignores corrupt and out-of-range local records',async({page})=>{
 await page.goto(pageUrl);
 await page.evaluate(()=>{
  localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:3,total:4,completedAt:'2026-10-29T12:00:00Z'}));
  localStorage.setItem('aom-quiz-DNC101-01','{not-json');
  localStorage.setItem('aom-quiz-CON101-01',JSON.stringify({lesson:'CON101-01',score:5,total:4,completedAt:'2026-10-29T12:00:00Z'}));
  localStorage.setItem('aom-quiz-HIP101-01',JSON.stringify({lesson:'HIP101-01',score:-1,total:4,completedAt:'2026-10-29T12:00:00Z'}));
 });
 await page.goto('http://127.0.0.1:8765/conservatory-progress.html');
 await expect(page.locator('#summary')).toContainText('1 of 97 currently linked lesson quizzes have a recorded attempt');
 await expect(page.locator('#records tr')).toHaveCount(1);
 await expect(page.locator('#records tr').first()).toContainText('MOV101-01');
 await expect(page.locator('#records tr').first()).toContainText('3 / 4');
});

test('local quiz score is not replaced by stale cloud history',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:4,total:4,completedAt:'2026-10-29T12:00:00Z'})));
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('[data-quiz-history]')).toContainText('Previous local quiz: 4 / 4');
});

test('newest local result survives cloud-history lookup errors',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:2,total:4,completedAt:'2026-10-29T12:00:00Z'})));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('[data-quiz-history]')).toContainText('Previous local quiz: 2 / 4');
});

test('newer local quiz history remains visible without a signed-in account',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:3,total:4,completedAt:'2026-10-29T12:00:00Z'})));
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('[data-quiz-history]')).toContainText('Previous local quiz: 3 / 4');
 await page.reload();
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('[data-quiz-history]')).toContainText('Previous local quiz: 3 / 4');
});

test('corrupt local history is ignored rather than displayed as a score',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:9,total:4,completedAt:'not-a-date'})));
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('[data-quiz-history]')).not.toContainText('Previous local quiz:');
 await expect(page.getByRole('heading',{name:'Interactive knowledge check'})).toBeVisible();
});

test('late response in one core lesson panel cannot overwrite another panel',async({page})=>{
 let releaseFirst;
 const firstGate=new Promise(resolve=>{releaseFirst=resolve});
 let firstRequested;
 const firstSeen=new Promise(resolve=>{firstRequested=resolve});
 await page.route('**/curriculum/final-lessons/**',async route=>{
  const url=route.request().url();
  if(url.endsWith('/MOV101-01.md')){
   firstRequested();
   await firstGate;
   await route.fulfill({status:200,contentType:'text/plain',body:'# Stale lesson one'});
  }else await route.fulfill({status:200,contentType:'text/plain',body:standard});
 });
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 const buttons=page.getByRole('button',{name:'Study here'});
 await buttons.nth(0).click();
 await firstSeen;
 await buttons.nth(1).click();
 await expect(page.getByRole('heading',{name:'MOV101 — Lesson 02'})).toBeVisible();
 releaseFirst();
 // Core lessons share one panel. The late first response must not
 // replace the second lesson or reintroduce the stale first lesson.
 await expect(page.getByRole('heading',{name:'MOV101 — Lesson 02'})).toBeVisible();
 await expect(page.getByText('Stale lesson one')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'MOV101 — Lesson 01'})).toHaveCount(0);
});

test('progress dashboard displays valid local history when Supabase CDN is blocked',async({page})=>{
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.addInitScript(()=>{
  localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:3,total:4,completedAt:'2026-10-01T12:00:00.000Z'}));
  localStorage.setItem('aom-quiz-MOV101-02',JSON.stringify({lesson:'MOV101-02',score:99,total:4,completedAt:'2026-10-01T12:00:00.000Z'}));
  localStorage.setItem('aom-quiz-MOV101-03',JSON.stringify({lesson:'MOV101-04',score:4,total:4,completedAt:'2026-10-01T12:00:00.000Z'}));
 });
 await page.goto('http://127.0.0.1:8765/conservatory-progress.html');
 await expect(page.locator('#summary')).toContainText('1 of 97 currently linked lesson quizzes');
 await expect(page.locator('#records tr')).toHaveCount(1);
 await expect(page.locator('#records')).toContainText('MOV101-01');
 await expect(page.locator('#cloud')).toContainText('Cloud results unavailable');
 await expect(page.locator('#refresh')).toBeEnabled();
});

test('progress dashboard remains usable without local records or Supabase SDK',async({page})=>{
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto('http://127.0.0.1:8765/conservatory-progress.html');
 await expect(page.locator('#summary')).toContainText('0 of 97 currently linked lesson quizzes');
 await expect(page.locator('#cloud')).toContainText('Cloud results unavailable');
 await expect(page.locator('#refresh')).toBeEnabled();
});
test('progress dashboard updates after another tab saves a quiz attempt',async({browser})=>{
 const context=await browser.newContext();
 const dashboard=await context.newPage();
 const writer=await context.newPage();
 try{
  await dashboard.route('https://esm.sh/**',route=>route.abort());
  await dashboard.goto('http://127.0.0.1:8765/conservatory-progress.html');
  await expect(dashboard.locator('#refresh')).toBeEnabled();
  await writer.goto('http://127.0.0.1:8765/conservatory-progress.html');
  await writer.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:4,total:4,completedAt:new Date().toISOString()})));
  await expect(dashboard.locator('#summary')).toContainText('1 of 97 currently linked lesson quizzes');
  await expect(dashboard.locator('#records')).toContainText('MOV101-01');
 }finally{await context.close()}
});

test('progress dashboard removes quiz history deleted in another tab',async({browser})=>{
 const context=await browser.newContext();
 const dashboard=await context.newPage();
 const writer=await context.newPage();
 try{
  await dashboard.route('https://esm.sh/**',route=>route.abort());
  await dashboard.goto('http://127.0.0.1:8765/conservatory-progress.html');
  await expect(dashboard.locator('#refresh')).toBeEnabled();
  await writer.goto('http://127.0.0.1:8765/conservatory-progress.html');
  await writer.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:4,total:4,completedAt:new Date().toISOString()})));
  await expect(dashboard.locator('#summary')).toContainText('1 of 97 currently linked lesson quizzes');
  await writer.evaluate(()=>localStorage.removeItem('aom-quiz-MOV101-01'));
  await expect(dashboard.locator('#summary')).toContainText('0 of 97 currently linked lesson quizzes');
  await expect(dashboard.locator('#records')).not.toContainText('MOV101-01');
 }finally{await context.close()}
});

test('progress dashboard rejects invalid quiz timestamps and mismatched storage keys',async({page})=>{
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.addInitScript(()=>{
  const base={lesson:'MOV101-01',score:4,total:4,completedAt:'2026-10-01T12:00:00.000Z'};
  localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({...base,completedAt:'not-a-date'}));
  localStorage.setItem('aom-quiz-MOV101-02',JSON.stringify(base));
  localStorage.setItem('aom-quiz-MOV101-03',JSON.stringify({...base,lesson:'MOV101-03'}));
 });
 await page.goto('http://127.0.0.1:8765/conservatory-progress.html');
 await expect(page.locator('#summary')).toContainText('1 of 97 currently linked lesson quizzes');
 await expect(page.locator('#records')).toContainText('MOV101-03');
 await expect(page.locator('#records')).not.toContainText('MOV101-01');
 await expect(page.locator('#records')).not.toContainText('MOV101-02');
 await expect(page.locator('#refresh')).toBeEnabled();
});

test('quiz does not claim a local save when browser storage rejects writes',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(String(key).startsWith('aom-quiz-'))throw new DOMException('Storage blocked','QuotaExceededError');
   return original.call(this,key,value);
  };
 });
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 const quiz=page.getByRole('heading',{name:'Interactive knowledge check'}).first();
 const section=quiz.locator('xpath=..');
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await section.getByRole('button',{name:'Check my answers'}).click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await expect(section).toContainText(/Not saved|could not be saved|storage was unavailable/i);
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
});

test('quiz detects storage that silently drops a saved result',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(String(key).startsWith('aom-quiz-'))return;
   return original.call(this,key,value);
  };
 });
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 const section=page.getByRole('heading',{name:'Interactive knowledge check'}).first().locator('xpath=..');
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await section.getByRole('button',{name:'Check my answers'}).click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await expect(section).toContainText('Device storage did not retain the quiz result');
 await expect(section).not.toContainText('Saved on this device.');
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
});

test('quiz save and cloud sync updates expose accessible status regions',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 const section=page.getByRole('heading',{name:'Interactive knowledge check'}).first().locator('xpath=..');
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await section.getByRole('button',{name:'Check my answers'}).click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 const statuses=section.getByRole('status');
 await expect(statuses).toHaveCount(3);
 await expect(statuses.nth(0)).toContainText('Score: 4 / 4');
 await expect(statuses.nth(1)).toContainText('Saved on this device.');
 await expect(statuses.nth(2)).toContainText(/Saved on this device|Saved locally|Cloud|cloud/i);
});

test('quiz detects unreadable storage after an apparently successful write',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.addInitScript(()=>{
  const original=Storage.prototype.getItem;
  Storage.prototype.getItem=function(key){
   if(String(key).startsWith('aom-quiz-'))throw new DOMException('Read blocked','SecurityError');
   return original.call(this,key);
  };
 });
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 const section=page.getByRole('heading',{name:'Interactive knowledge check'}).first().locator('xpath=..');
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await section.getByRole('button',{name:'Check my answers'}).click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await expect(section).toContainText('Device storage unavailable: Read blocked');
 await expect(section).not.toContainText('Saved on this device.');
});

test('duplicate answer-key entries cannot produce a graded quiz',async({page})=>{
 const duplicate=standard.replace('**4. D.** Fourth rationale.','**4. D.** Fourth rationale.\n**4. A.** Conflicting rationale.');
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:duplicate}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
});

test('duplicate answer choices cannot produce a graded quiz',async({page})=>{
 const duplicate=standard.replace('B. No\nC. Maybe\nD. Later','B. Yes\nC. Maybe\nD. Later');
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:duplicate}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
});

test('blank answer choices cannot produce a graded quiz',async({page})=>{
 const blank=standard.replace('B. No\nC. Maybe\nD. Later','B.    \nC. Maybe\nD. Later');
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:blank}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
});

test('answer choices differing only by capitalization cannot be graded',async({page})=>{
 const duplicate=standard.replace('B. No\nC. Maybe\nD. Later','B. yes\nC. Maybe\nD. Later');
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:duplicate}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
});

test('answer choices differing only by surrounding whitespace cannot be graded',async({page})=>{
 const duplicate=standard.replace('B. No\nC. Maybe\nD. Later','B.  Yes  \nC. Maybe\nD. Later');
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:duplicate}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
});

for(const [label,fixture] of [
 ['blank question prompt',standard.replace('**1. First?**','**1.    **')],
 ['blank answer explanation',standard.replace('**1. A.** First rationale.','**1. A.**    ')]
]){
 test(label+' cannot produce an interactive graded quiz',async({page})=>{
  await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:fixture}));
  await page.goto(pageUrl);
  await expect(page.locator('#course option')).toHaveCount(21);
  await page.locator('#course').selectOption({index:1});
  await page.getByRole('button',{name:'Study here'}).first().click();
  await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
  await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
 });
}

test('out-of-order answer keys cannot produce an interactive graded quiz',async({page})=>{
 const malformed=standard.replace('**1. A.** First rationale.\n**2. B.** Second rationale.','**2. B.** Second rationale.\n**1. A.** First rationale.');
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:malformed}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
});

test('quiz answer explanations remain available after grading',async({page})=>{
 await page.route('**/curriculum/final-lessons/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.route('https://esm.sh/**',route=>route.abort());
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({index:1});
 await page.getByRole('button',{name:'Study here'}).first().click();
 const section=page.getByRole('heading',{name:'Interactive knowledge check'}).first().locator('xpath=..');
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await section.getByRole('button',{name:'Check my answers'}).click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await expect(section.getByRole('status').filter({hasText:/Score: 4 \/ 4/})).toBeVisible();
 for(const reason of ['First rationale.','Second rationale.','Third rationale.','Fourth rationale.']){
  await expect(section.getByText(new RegExp(reason.replace('.','\\.')))).toBeVisible();
 }
});

test('BEL101 Friday video links and weekly quiz render in the reader',async({page})=>{
 const fs=require('node:fs');
 const path=require('node:path');
 const week4Fixture=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons','BEL101-W04.md'),'utf8');
 await page.route('**/curriculum/final-lessons/BEL101-W04.md',route=>route.fulfill({status:200,contentType:'text/plain',body:week4Fixture}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({label:'BEL101 — Belly Dance Foundations'});
 await expect(page.getByRole('heading',{name:'Original 16-week Friday belly-dance program'})).toBeVisible();
 const links=page.locator('a[href*="drive.google.com/file/d/"]');
 await expect(links).toHaveCount(20);
 await expect(page.getByRole('link',{name:'Progressive Forward Rolls'})).toBeVisible();
 await expect(page.locator('a[href="https://drive.google.com/file/d/1hbuc15mpPFKTqDte47l0O-44ykAahvh7/view?usp=drivesdk"]')).toHaveCount(1);
 const weekly=page.getByRole('link',{name:/Week 4: Snake Arms and Chest Circles/});
 await expect(weekly).toBeVisible();
 await expect(page.getByRole('link',{name:/Week 16: Final/})).toBeVisible();
 const week4=weekly.locator('xpath=..').getByRole('button',{name:'Study here'});
 await week4.click();
 await expect(page.getByRole('heading',{name:'Interactive knowledge check'})).toBeVisible();
 const panel=page.locator('.lesson-panel').filter({has:page.getByRole('heading',{name:/BEL101 — Lesson W04/})});
 await expect(panel.locator('fieldset')).toHaveCount(4);
 const answerLetters=[...week4Fixture.matchAll(/\*\*([1-4])\. ([ABCD])\.\*\*/g)].map(m=>m[2]);
 expect(answerLetters).toHaveLength(4);
 for(let i=0;i<4;i++)await panel.locator('fieldset').nth(i).locator('input[type=radio]').nth('ABCD'.indexOf(answerLetters[i])).check();
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/Score: 4 \/ 4/)).toBeVisible();
});

// Integration smoke test: unlike the fixture-based tests, this fetches a real lesson.
test('real MOV101 lesson renders a gradeable knowledge check',async({page})=>{
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.getByRole('button',{name:'Study here'}).first().click();
 const panel=page.locator('.lesson-panel');
 await expect(panel.getByRole('heading',{name:'Interactive knowledge check'})).toBeVisible();
 await expect(panel.locator('fieldset')).toHaveCount(4);
 await expect(panel.getByRole('button',{name:'Check my answers'})).toBeEnabled();
 await expect(panel.getByText(/cannot be graded interactively yet/)).toHaveCount(0);
});


// Real-content integration: exercise the final BEL101 assessment rather than
// a synthetic fixture, including its four keyed explanations.
test('real BEL101 Week 16 final assessment grades and explains all four answers',async({page})=>{
 const fs=require('node:fs');
 const path=require('node:path');
 const lesson=fs.readFileSync(path.join(__dirname,'..','curriculum','final-lessons','BEL101-W16.md'),'utf8');
 const keys=[...lesson.matchAll(/\*\*([1-4])\. ([ABCD])\.\*\*/g)].map(match=>match[2]);
 expect(keys).toHaveLength(4);
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({label:'BEL101 — Belly Dance Foundations'});
 const finalLink=page.getByRole('link',{name:/Week 16: Final/});
 await expect(finalLink).toBeVisible();
 await finalLink.locator('xpath=..').getByRole('button',{name:'Study here'}).click();
 const panel=page.locator('.lesson-panel').filter({has:page.getByRole('heading',{name:/BEL101 — Lesson W16/})});
 await expect(panel.getByRole('heading',{name:'Interactive knowledge check'})).toBeVisible();
 const questions=panel.locator('fieldset');
 await expect(questions).toHaveCount(4);
 for(let i=0;i<4;i++)await questions.nth(i).locator('input[type=radio]').nth('ABCD'.indexOf(keys[i])).check();
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/Score: 4 \/ 4/)).toBeVisible();
 for(let i=1;i<=4;i++){
  const explanation=lesson.split('\n').find(line=>line.startsWith('**'+i+'. '+keys[i-1]+'.** '))?.split('.** ').slice(1).join('.** ');
  expect(explanation,'missing real Week 16 explanation '+i).toBeTruthy();
  await expect(panel).toContainText(explanation);
 }
 const firstWrong='ABCD'.indexOf(keys[0])===0?1:0;
 await questions.first().locator('input[type=radio]').nth(firstWrong).check();
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/Score: 3 \/ 4/)).toBeVisible();
 await questions.first().locator('input[type=radio]').nth('ABCD'.indexOf(keys[0])).check();
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/Score: 4 \/ 4/)).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('aom-quiz-BEL101-W16')));
 expect(saved).toMatchObject({lesson:'BEL101-W16',score:4,total:4});
 await page.reload();
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({label:'BEL101 — Belly Dance Foundations'});
 const reopened=page.getByRole('link',{name:/Week 16: Final/});
 await reopened.locator('xpath=..').getByRole('button',{name:'Study here'}).click();
 const restored=page.locator('.lesson-panel').filter({has:page.getByRole('heading',{name:/BEL101 — Lesson W16/})});
 await expect(restored).toContainText('Previous local quiz: 4 / 4');
 await page.getByRole('link',{name:'Learning Progress'}).click();
 await expect(page).toHaveURL(/conservatory-progress\.html$/);
 const record=page.locator('#records tr').filter({hasText:'BEL101-W16'});
 await expect(record).toContainText('4 / 4');
 await expect(record).toContainText('This device');
});


test('BEL101 final quiz remains usable at a narrow mobile viewport',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({label:'BEL101 — Belly Dance Foundations'});
 const finalLink=page.getByRole('link',{name:/Week 16: Final/});
 await finalLink.locator('xpath=..').getByRole('button',{name:'Study here'}).click();
 const panel=page.locator('.lesson-panel').filter({has:page.getByRole('heading',{name:/BEL101 — Lesson W16/})});
 const questions=panel.locator('fieldset');
 await expect(questions).toHaveCount(4);
 for(let i=0;i<4;i++){
  const options=questions.nth(i).locator('input[type=radio]');
  await expect(options).toHaveCount(4);
  await options.first().check();
 }
 const submit=panel.getByRole('button',{name:'Check my answers'});
 await expect(submit).toBeVisible();
 await submit.click();
 await expect(panel.getByRole('status').filter({hasText:/Score: [0-4] \/ 4/})).toBeVisible();
 const viewport=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}));
 expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.width+1);
});


test('BEL101 final quiz incomplete submission identifies missing answers and supports recovery',async({page})=>{
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({label:'BEL101 — Belly Dance Foundations'});
 await page.getByRole('link',{name:/Week 16: Final/}).locator('xpath=..').getByRole('button',{name:'Study here'}).click();
 const panel=page.locator('.lesson-panel').filter({has:page.getByRole('heading',{name:/BEL101 — Lesson W16/})});
 const questions=panel.locator('fieldset');
 await expect(questions).toHaveCount(4);
 await questions.first().locator('input[type=radio]').first().check();
 const submit=panel.getByRole('button',{name:'Check my answers'});
 await submit.click();
 await expect(panel.getByRole('alert')).toContainText('3 unanswered');
 await expect(questions.nth(1).locator('input[type=radio]').first()).toBeFocused();
 expect(await page.evaluate(()=>localStorage.getItem('aom-quiz-BEL101-W16'))).toBeNull();
 for(let i=1;i<4;i++)await questions.nth(i).locator('input[type=radio]').first().check();
 await submit.click();
 await expect(panel.getByRole('status').filter({hasText:/Score: [0-4] \/ 4/})).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('aom-quiz-BEL101-W16')));
 expect(saved).toMatchObject({lesson:'BEL101-W16',total:4});
});


test('BEL101 original scheduled videos map to every Friday week in the reader',async({page})=>{
 const fs=require('node:fs');
 const path=require('node:path');
 const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'..','curriculum','BEL101-VIDEO-SOURCES.json'),'utf8'));
 const scheduled=catalog.videos.filter(video=>video.weeks.length);
 const supplementary=catalog.videos.filter(video=>!video.weeks.length);
 expect(scheduled).toHaveLength(12);
 expect(supplementary).toHaveLength(1);
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(21);
 await page.locator('#course').selectOption({label:'BEL101 — Belly Dance Foundations'});
 const videoSection=page.locator('section.card').filter({has:page.getByRole('heading',{name:'Original Google Drive videos by Friday week'})});
 await expect(videoSection).toBeVisible();
 for(let week=1;week<=16;week++){
  const expected=scheduled.filter(video=>video.weeks.includes(week));
  expect(expected.length,'missing source mapping for Week '+week).toBeGreaterThan(0);
  const label=videoSection.locator('strong').filter({hasText:new RegExp('^Week '+week+': *$')});
  const group=label.locator('xpath=..');
  await expect(group,'missing reader source group for Week '+week).toHaveCount(1);
  const links=group.locator('a');
  await expect(links).toHaveCount(expected.length);
  for(const video of expected)await expect(group.locator('a[href="'+video.url+'"]')).toHaveCount(1);
 }
 const extra=videoSection.getByRole('link',{name:'Progressive Forward Rolls'});
 await expect(extra).toHaveCount(1);
 await expect(extra).toHaveAttribute('href',supplementary[0].url);
 await expect(extra.locator('xpath=..')).toContainText('Supplementary (acro, not belly-dance technique)');
 await expect(extra).toHaveAttribute('target','_blank');
 await expect(extra).toHaveAttribute('rel',/noopener noreferrer/);
 expect(supplementary[0].title).toBe('Progressive Forward Rolls');
});
