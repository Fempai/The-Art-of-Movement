const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const base='http://127.0.0.1:8765';
const pages=fs.readdirSync(path.resolve(__dirname,'..')).filter(p=>p.endsWith('.html')).sort();
test.use({viewport:{width:360,height:740},isMobile:true,hasTouch:true});
test('all Academy HTML pages stay within Android viewport',async({page},testInfo)=>{
 test.setTimeout(240000);
 const results=[];
 for(const file of pages){
  try{
   await page.goto(base+'/'+file,{waitUntil:'domcontentloaded',timeout:10000});
   await page.waitForTimeout(70);
   const v=await page.evaluate(()=>{
    const width=document.documentElement.clientWidth,actual=document.documentElement.scrollWidth;
    const offenders=[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();const st=getComputedStyle(e);return st.position!=='fixed'&&r.width>0&&r.right>width+3&&r.left<width}).slice(0,6).map(e=>({tag:e.tagName,id:e.id,cls:String(e.className).slice(0,50),right:Math.round(e.getBoundingClientRect().right)}));
    return {width,actual,overflow:actual-width,offenders}
   });
   results.push({file,...v});
  }catch(e){results.push({file,error:String(e.message).slice(0,250)})}
 }
 fs.writeFileSync(testInfo.outputPath('site-layout-report.json'),JSON.stringify(results,null,2));
 const failures=results.filter(x=>x.error||x.overflow>2);
 expect(failures,JSON.stringify(failures,null,2)).toEqual([]);
});
test('desktop and tablet representative pages do not overflow',async({page})=>{
 test.setTimeout(90000);
 for(const width of [768,1366]){
  await page.setViewportSize({width,height:900});
  for(const file of ['index.html','skinned-avatar-studio.html','pose-lab.html','motion-comparison.html','week-one-academy.html','weekly-studio.html','my-academy.html','movement-bridge.html']){
   await page.goto(base+'/'+file,{waitUntil:'domcontentloaded'});
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow,file+' @ '+width).toBeLessThanOrEqual(2);
  }
 }
});
