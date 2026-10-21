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

test('desktop avatar visual regression angles and controls',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/skinned-avatar-studio.html');
 await expect(page.locator('#stage')).toBeVisible();
 for(const [id,name,yaw] of [['frontView','front',0],['sideView','side',90],['backView','back',180],['resetView','three-quarter',25]]){
  await page.locator('#'+id).click();
  await expect(page.locator('#yaw')).toHaveValue(String(yaw));
  await page.locator('#stage').screenshot({path:testInfo.outputPath('avatar-desktop-'+name+'.png')});
 }
 await page.locator('#stage').focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('#yaw')).toHaveValue('35');
 await page.locator('#resetCharacter').click();
 await expect(page.locator('#characterLabel')).toContainText('Prototype');
 expect(errors).toEqual([]);
});
test('desktop avatar invalid input and missing joints fail closed',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await page.locator('#poseFile').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
 await expect(page.locator('#status')).toContainText('rejected');
 await expect(page.locator('#play')).toBeDisabled();
 const world=Array.from({length:33},()=>({x:0,y:0,z:0,visibility:1}));world[27]=null;
 await page.locator('#poseFile').setInputFiles({name:'missing-joint.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'aom-pose-observations-v1',observations:Array.from({length:8},()=>({world}))}))});
 await expect(page.locator('#status')).toContainText('rejected');
 await expect(page.locator('#play')).toBeDisabled();
 await page.locator('#avatarFile').setInputFiles({name:'unsupported.glb',mimeType:'model/gltf-binary',buffer:Buffer.from('not a model')});
 await expect(page.locator('#status')).toContainText('GLB load failed');
});
test('desktop avatar rendering resources and animation frame budget',async({page},testInfo)=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await page.waitForFunction(()=>{const c=document.querySelector('#stage');return c?.width>0&&c?.height>0});
 const result=await page.evaluate(async()=>{
  const frames=[];let previous=0;
  for(let i=0;i<120;i++)await new Promise(resolve=>requestAnimationFrame(t=>{if(previous)frames.push(t-previous);previous=t;resolve()}));
  frames.sort((a,b)=>a-b);
  const memory=performance.memory;
  return {medianFrameMs:frames[Math.floor(frames.length/2)],p95FrameMs:frames[Math.floor(frames.length*.95)],longFramesOver50Ms:frames.filter(v=>v>50).length,resources:performance.getEntriesByType('resource').length,transferBytes:performance.getEntriesByType('resource').reduce((n,x)=>n+(x.transferSize||0),0),heapUsedBytes:memory?.usedJSHeapSize??null,webgl2:!!document.querySelector('#stage').getContext('webgl2')};
 });
 require('node:fs').writeFileSync(testInfo.outputPath('avatar-desktop-performance.json'),JSON.stringify(result,null,2));
 expect(result.webgl2).toBe(true);
 expect(result.medianFrameMs).toBeLessThan(50);
 expect(result.p95FrameMs).toBeLessThan(120);
 expect(result.resources).toBeGreaterThan(0);
});
