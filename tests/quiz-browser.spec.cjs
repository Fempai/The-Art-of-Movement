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
 if(name==='standard')await page.locator('#course').selectOption({label:/^DNC101/});
 else await page.locator('#course').selectOption({label:/^MOV101/});
 const open=page.getByRole('button',{name:'Study here'}).first();
 await expect(open).toBeVisible();
 await open.click();
 const quiz=page.getByRole('heading',{name:'Interactive knowledge check'}).first();
 await expect(quiz).toBeVisible();
 await expect(page.getByText(name==='standard'?'DNC101 — Lesson 01':'MOV101 — Lesson 01')).toBeVisible();
 const section=quiz.locator('xpath=..');
 const check=section.getByRole('button',{name:'Check my answers'});
 await check.click();
 await expect(section.getByText(/4 unanswered/)).toBeVisible();
 expect(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).length)).toBe(0);
 const groups=section.locator('fieldset');
 await expect(groups).toHaveCount(4);
 for(let i=0;i<4;i++)await groups.nth(i).locator('input[type=radio]').nth(i).check();
 await check.click();
 await expect(section.getByText(/Score: 4 \/ 4/)).toBeVisible();
 await groups.nth(0).locator('input[type=radio]').nth(1).check();
 await check.click();
 await expect(section.getByText(/Score: 3 \/ 4/)).toBeVisible();
 const saved=await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('aom-quiz-')).map(k=>JSON.parse(localStorage.getItem(k))));
 expect(saved.some(x=>x.score===3&&x.total===4)).toBeTruthy();
 expect(saved.find(x=>x.score===3)?.lesson).toBe(name==='standard'?'DNC101-01':'MOV101-01');
});
}
