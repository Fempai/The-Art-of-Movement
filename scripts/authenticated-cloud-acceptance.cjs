'use strict';
// Optional authenticated acceptance: requires a dedicated, non-personal Supabase test user.
// CI credentials are supplied only through GitHub Actions secrets, never committed.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const email=process.env.AOM_TEST_EMAIL;
const password=process.env.AOM_TEST_PASSWORD;
if(!email||!password){console.error('Missing AOM_TEST_EMAIL / AOM_TEST_PASSWORD: authenticated acceptance NOT RUN');process.exit(2)}
const base='https://fempai.github.io/The-Art-of-Movement/';
const url='https://alwtccdiyudsucfioahr.supabase.co';
const key='sb_publishable_v1AZYAfBP6vA0nrxcWQI6g_sWFt5PYU';
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext();
 const page=await context.newPage();
 const marker='aom-acceptance-'+Date.now()+'-'+Math.random().toString(36).slice(2);
 let id=null, userId=null, client;
 try{
   await page.goto(base+'cloud-journal.html',{waitUntil:'domcontentloaded'});
   // Authenticate through the same Supabase project using a dedicated password-enabled
   // test user; the normal user-facing email OTP flow remains unchanged.
   const result=await page.evaluate(async({url,key,email,password})=>{
     const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
     const db=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
     const {data,error}=await db.auth.signInWithPassword({email,password});
     return {id:data?.user?.id||null,error:error?.message||null};
   },{url,key,email,password});
   assert.ifError(result.error?new Error(result.error):null);
   assert(result.id,'Dedicated test account must authenticate');
   userId=result.id;
   await page.reload({waitUntil:'domcontentloaded'});
   await page.locator('#signed').waitFor({state:'visible',timeout:30000});
   assert(await page.locator('#auth').isHidden(),'Journal must hide sign-in after authentication');
   // Use the actual published form and confirm the saved row appears on refresh.
   await page.locator('#session [name=discipline]').selectOption('dance');
   await page.locator('#session [name=duration]').fill('7');
   await page.locator('#session [name=effort]').fill('2');
   await page.locator('#session [name=notes]').fill(marker);
   await page.locator('#session button[type=submit]').click();
   await page.getByText(marker,{exact:true}).waitFor({timeout:30000});
   await page.reload({waitUntil:'domcontentloaded'});
   await page.getByText(marker,{exact:true}).waitFor({timeout:30000});
   await page.goto(base+'my-academy.html',{waitUntil:'domcontentloaded'});
   await page.locator('#signed').waitFor({state:'visible',timeout:30000});
   assert(await page.locator('#auth').isHidden(),'Dashboard must recognize authenticated session');
   assert(await page.locator('#sessionCount').innerText()!=='—','Dashboard must load cloud counts');
   await page.goto(base+'baseline-studio.html',{waitUntil:'domcontentloaded'});
   await page.locator('#signed').waitFor({state:'visible',timeout:30000});
   assert(await page.locator('#auth').isHidden(),'Baseline Studio must recognize authenticated session');
   await page.locator('#logout').click();
   await page.locator('#signed').waitFor({state:'hidden',timeout:30000});
   await page.goto(base+'cloud-journal.html',{waitUntil:'domcontentloaded'});
   await page.locator('#auth').waitFor({state:'visible',timeout:30000});
   assert(await page.locator('#signed').isHidden(),'Sign-out must hide journal records');
   console.log('PASS authenticated cloud journal create/read, dashboard, baseline sign-in and sign-out');
 }finally{
   // Clean up only the uniquely marked test row; never delete personal data.
   if(userId){
     try{
       await page.goto(base+'cloud-journal.html',{waitUntil:'domcontentloaded'});
       const cleanup=await page.evaluate(async({url,key,email,password,marker,userId})=>{
         const {createClient}=await import('https://esm.sh/@supabase/supabase-js@2');
         const db=createClient(url,key);
         const auth=await db.auth.signInWithPassword({email,password});
         if(auth.error||auth.data.user?.id!==userId)throw Error('Cleanup authentication failed');
         const result=await db.from('aom_sessions').delete().eq('user_id',userId).eq('notes',marker).select('id');
         if(result.error)throw result.error;
         await db.auth.signOut();
         return result.data?.length||0;
       },{url,key,email,password,marker,userId});
       assert.equal(cleanup,1,'Exactly one test session must be cleaned up');
       console.log('PASS dedicated test row cleanup');
     }catch(e){console.error('TEST DATA CLEANUP FAILED for marker '+marker+': '+e.message);process.exitCode=1}
   }
   await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1});
