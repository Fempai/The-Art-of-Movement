'use strict';
// Published-site browser acceptance: public routes and quiz interactions only.
// Private account access requires an explicitly provisioned test account.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:390,height:844}});
  const base = 'https://fempai.github.io/The-Art-of-Movement/';
  try {
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    let response=await page.goto(base,{waitUntil:'domcontentloaded',timeout:45000});
    assert.equal(response.status(),200,'Home must load');
    const hub=await page.goto(base+'conservatory-learning-hub.html',{waitUntil:'domcontentloaded'});
    assert.equal(hub.status(),200,'Learning hub must load');
    assert(await page.locator('a[href="conservatory-course-reader.html"]').count()>0,'Hub must link to course reader');
    await page.locator('a[href="conservatory-course-reader.html"]').click();
    await page.waitForURL('**/conservatory-course-reader.html');
    assert.match(await page.title(),/Conservatory Course Reader/,'Hub navigation must reach reader');
    await page.waitForFunction(() => document.querySelectorAll('#course option').length === 21,{timeout:25000});
    assert.equal(await page.locator('#course option').count(),21,'All courses should load');
    const lessonButtons=page.getByRole('button',{name:'Study here'});
    console.log('Course reader buttons:',await lessonButtons.count());
    const buttons=await page.locator('button').allTextContents();
    console.log('Available reader controls:',buttons.slice(0,8));
    assert(await page.locator('#units button').count()>0,'Course units must expose lesson controls');
    await page.locator('#units button').first().click();
    await page.getByText('Interactive knowledge check',{exact:true}).waitFor({timeout:25000});
    const quiz=page.locator('section.card').filter({hasText:'Interactive knowledge check'}).last();
    assert.equal(await quiz.locator('fieldset').count(),4,'Lesson must render four questions');
    await quiz.getByRole('button',{name:'Check my answers'}).click();
    assert.match(await quiz.textContent(),/Answer all four questions/,'Incomplete answers must be rejected');
    for(const field of await quiz.locator('fieldset').all())await field.locator('input[type=radio]').first().check();
    await quiz.getByRole('button',{name:'Check my answers'}).click();
    assert.match(await quiz.textContent(),/Score: [0-4] \/ 4/,'Completed quiz must grade');
    assert.equal(errors.length,0,'Unexpected browser errors: '+errors.join('; '));
    console.log('PASS: published navigation, course catalog, lesson loading, quiz validation and grading');
  } finally {await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
