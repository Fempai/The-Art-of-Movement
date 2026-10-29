const {test,expect}=require('@playwright/test');
const pageUrl='http://127.0.0.1:8765/conservatory-course-reader.html';
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
 await page.route('https://raw.githubusercontent.com/**',route=>route.fulfill({status:200,contentType:'text/plain',body:fixture}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(20);
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
 await expect(page.locator('#course option')).toHaveCount(20);
 await page.locator('#course').selectOption({index:name==='standard'?1:0});
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('.lesson-panel').getByText(/Previous.*quiz.*3 \/ 4/i)).toBeVisible();
});
}

test('malformed quiz shows fallback without storing an attempt',async({page})=>{
 const malformed=['# Incomplete lesson','## Knowledge check','**1. Missing choices?**','A. One','B. Two','## Independent assignment','Review.'].join(String.fromCharCode(10));
 await page.route('https://raw.githubusercontent.com/**',route=>route.fulfill({status:200,contentType:'text/plain',body:malformed}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(20);
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.getByText(/cannot be graded interactively yet/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Check my answers'})).toHaveCount(0);
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
});

test('failed lesson download explains failure and permits retry',async({page})=>{
 let requests=0;
 await page.route('https://raw.githubusercontent.com/**',route=>{
  requests++;
  return route.fulfill({status:requests===1?503:200,contentType:'text/plain',body:standard});
 });
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(20);
 const open=page.getByRole('button',{name:'Study here'}).first();
 await open.click();
 await expect(page.getByText(/Unable to load the in-site lesson: HTTP 503/)).toBeVisible();
 await expect(open).toBeEnabled();
 await open.click();
 await expect(page.getByRole('heading',{name:'Interactive knowledge check'})).toBeVisible();
 expect(requests).toBe(2);
});

test('quiz choices remain isolated when a lesson is closed and reopened',async({page})=>{
 await page.route('https://raw.githubusercontent.com/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(20);
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
 await page.route('https://raw.githubusercontent.com/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(20);
 await page.getByRole('button',{name:'Study here'}).first().click();
 const panel=page.locator('.lesson-panel');
 await expect(panel.locator('fieldset')).toHaveCount(4);
 for(let i=0;i<4;i++)await panel.locator('fieldset').nth(i).locator('input[type=radio]').nth(i).check();
 await panel.getByRole('button',{name:'Check my answers'}).click();
 await expect(panel.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await page.getByRole('link',{name:'Learning Progress'}).click();
 await expect(page).toHaveURL(/conservatory-progress\.html$/);
 await expect(page.locator('#summary')).toContainText('1 of 80 lessons have a recorded quiz attempt');
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
 await expect(page.locator('#summary')).toContainText('1 of 80 lessons have a recorded quiz attempt');
 await expect(page.locator('#records tr')).toHaveCount(1);
 await expect(page.locator('#records tr').first()).toContainText('MOV101-01');
 await expect(page.locator('#records tr').first()).toContainText('3 / 4');
});

test('local quiz score is not replaced by stale cloud history',async({page})=>{
 await page.route('https://raw.githubusercontent.com/**',route=>route.fulfill({status:200,contentType:'text/plain',body:standard}));
 await page.goto(pageUrl);
 await expect(page.locator('#course option')).toHaveCount(20);
 await page.evaluate(()=>localStorage.setItem('aom-quiz-MOV101-01',JSON.stringify({lesson:'MOV101-01',score:4,total:4,completedAt:'2026-10-29T12:00:00Z'})));
 await page.getByRole('button',{name:'Study here'}).first().click();
 await expect(page.locator('[data-quiz-history]')).toContainText('Previous local quiz: 4 / 4');
});
