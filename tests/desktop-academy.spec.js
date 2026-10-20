const {test,expect}=require('@playwright/test');
const base='http://127.0.0.1:8765';
test.use({viewport:{width:1366,height:768},isMobile:false,hasTouch:false});
test('desktop home renders curriculum and navigation',async({page})=>{
 await page.goto(base+'/index.html');
 await expect(page.locator('#aom-week-rail a')).toHaveCount(16);
 await expect(page.locator('#aom-global-nav')).toBeVisible();
 await expect(page.locator('#aom-global-nav summary').first()).toBeVisible();
});
test('desktop week navigation and daily lessons load',async({page})=>{
 for(const week of [1,3,8,16]){
  await page.goto(base+'/weekly-studio.html?week='+week);
  await expect(page.locator('body')).toContainText('Week');
  await expect(page.locator('main')).toBeVisible();
 }
});
test('desktop Academy local backup is accessible without signing in',async({page})=>{
 await page.goto(base+'/my-academy.html');
 await expect(page.locator('main a.pill[href="academy-backup.html"]')).toBeVisible();
 await page.locator('main a.pill[href="academy-backup.html"]').click();
 await expect(page.locator('h1')).toContainText('Local Academy backup');
 await expect(page.locator('#export')).toBeEnabled();
});
test('desktop assessment history comparison works across reload',async({page})=>{
 await page.goto(base+'/assessment-history.html');
 await page.locator('[name=skill]').fill('Releve');
 await page.locator('[name=notes]').fill('Stable for 4 counts');
 await page.locator('#form button').click();
 await page.reload();
 await expect(page.locator('.entry')).toHaveCount(1);
 await expect(page.locator('#rightView')).toContainText('Releve');
});
test('desktop camera and cloud review remain opt-in',async({page})=>{
 await page.goto(base+'/live-coach.html');
 await expect(page.locator('#start')).toBeEnabled();
 await expect(page.locator('#stop')).toBeDisabled();
 await expect(page.locator('#record')).toBeDisabled();
 await page.goto(base+'/pose-lab.html');
 await expect(page.locator('#cloud')).toBeDisabled();
 await expect(page.locator('#analyze')).toBeDisabled();
});
