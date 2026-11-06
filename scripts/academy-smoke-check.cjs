'use strict';
/* Static smoke tests: does not claim camera, AI, or cloud correctness. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const pages={
 'live-coach.html':['start','stop','camera','overlay','exerciseStatus','feedback','metrics','voice','mode'],
 'pose-lab.html':['file','video','overlay','analyze','saveEvidence','evidenceWeek'],
 'movement-assessment-studio.html':['skill','notes','rubric','week','saveHistory','status'],
 'assessment-history.html':['form','entries','left','right','import','export'],
 'movement-bridge.html':['upload','download','assessmentStatus']
};
const failures=[];
function check(ok,message){if(!ok)failures.push(message)}
function read(name){const f=path.join(root,name);if(!fs.existsSync(f)){failures.push('Missing '+name);return ''}return fs.readFileSync(f,'utf8')}
for(const [name,ids] of Object.entries(pages)){
 const html=read(name);if(!html)continue;
 for(const id of ids)check(html.includes('id="'+id+'"')||html.includes("id='"+id+"'"),name+': missing #'+id);
 const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
 for(let i=0;i<scripts.length;i++){
  const [,attrs,source]=scripts[i];
  if(!source.trim()||/application\/(?:ld\+)?json/i.test(attrs))continue;
  const result=cp.spawnSync(process.execPath,['--check','--input-type=module'],{input:source,encoding:'utf8'});
  check(result.status===0,name+': inline script '+(i+1)+' parse error: '+String(result.stderr||result.error||'unknown').slice(0,350));
 }
}
const studio=read('movement-assessment-studio.html'),history=read('assessment-history.html'),lab=read('pose-lab.html'),bridge=read('movement-bridge.html');
for(const [name,content] of [['movement-assessment-studio.html',studio],['assessment-history.html',history],['pose-lab.html',lab],['movement-bridge.html',bridge]])
 check(content.includes('aom_assessment_history_v1'),name+': missing shared assessment-history key');
check(studio.includes('Human rubric checklist'),'Rubric source label missing');
check(lab.includes('Experimental pose measurement'),'Pose Lab source label missing');
check(history.includes('Unrecognized backup format'),'Assessment history import guard missing');
check(bridge.includes("onConflict:'id'"),'Cloud upsert deduplication guard missing');
const baseline=read('baseline-studio.html');
check(baseline.includes("if(!email||!token){status('Enter your email and one-time code.');return}"),'Baseline must reject missing OTP credentials before verification');
check(baseline.includes("if(authError||!user||user.id!==userId){conceal();status('Session changed. Sign in again before deleting.')"), 'Baseline deletion must revalidate the active account');
check(/function conceal\(\)\{[^}]*baselineGeneration\+\+/.test(baseline)&&baseline.includes("$('#history').replaceChildren()")&&baseline.includes("$('#comparison').replaceChildren()"),'Baseline must clear private media on session transitions');
check(baseline.includes(".eq('user_id',userId)")&&baseline.includes("generation!==baselineGeneration||userId!==activeBaselineUser"),'Baseline must scope records and reject stale media responses');
check(baseline.includes("$('#logout').onclick=async()=>{conceal();"),'Baseline must conceal media before sign-out request');
check(baseline.includes("renderGeneration!==baselineRenderGeneration"),'Baseline must reject superseded media renders');
check(baseline.includes(".delete().eq('id',x.id).eq('user_id',userId)"),'Baseline deletion must be account scoped');
check(baseline.includes('if(authError||!user||user.id!==userId)')&&baseline.includes("if(generation!==baselineGeneration||userId!==activeBaselineUser){await db.storage.from('aom-private-videos').remove([path]);return}"),'Baseline upload must reject changed accounts before and after storage writes');
check(baseline.includes("if(error){await sync();status('Sign-out failed:")&&baseline.includes("sessionStorage.removeItem('aom_baseline_email')"),'Baseline must recover on failed sign-out and clear saved OTP email after success');
const journal=read('cloud-journal.html');
check(journal.includes('if(authError||!user||user.id!==userId)')&&journal.includes('if(generation!==journalGeneration||userId!==activeUserId)return;if(error)'), 'Cloud journal saves must validate active account and suppress stale write results');
check(journal.includes("function conceal(){journalGeneration++")&&journal.includes("$('#sessions').replaceChildren()"),'Cloud journal must clear private records before session revalidation');
check(journal.includes(".eq('user_id',userId)")&&journal.includes("generation!==journalGeneration||userId!==activeUserId"),'Cloud journal must scope queries and reject stale account responses');
check(journal.includes("$('#logout').onclick=async()=>{conceal();"),'Cloud journal must conceal private data immediately on sign-out');
const academy=read('my-academy.html');
for(const [page,html,key] of [['Academy',academy,'aom_dashboard_email'],['Baseline',baseline,'aom_baseline_email'],['Journal',journal,'aom_login_email']]){
 const clear=html.indexOf("sessionStorage.removeItem('"+key+"');const requestId=++otpRequestGeneration;const {error}=await");
 const request=html.indexOf('.auth.signInWithOtp(',clear);
 check(clear>=0&&request>clear,page+' must discard stale pending OTP email before a new sign-in request');
 check(html.includes('let otpRequestGeneration=0;')&&html.includes('if(requestId!==otpRequestGeneration)return;if(error)'),page+' must ignore superseded OTP responses');
}

check(academy.includes("sessionStorage.removeItem('aom_dashboard_email');e.target.reset();await sync()"),'Academy OTP cleanup missing');
check(baseline.includes("sessionStorage.removeItem('aom_baseline_email');e.target.reset();await sync()"),'Baseline OTP cleanup missing');
check(journal.includes("sessionStorage.removeItem('aom_login_email');e.target.reset();await sync()"),'Journal OTP cleanup missing');

const academyScript=academy.match(/<script type="module">([\s\S]*?)<\/script>/);
check(!!academyScript,'My Conservatory module script missing');
check(academy.includes("if(!email||!token){status('Enter your email and one-time code.');return}"),'Academy must reject missing OTP credentials before verification');
if(academyScript){
 const syntax=cp.spawnSync(process.execPath,['--check','--input-type=module'],{input:academyScript[1],encoding:'utf8'});
 check(syntax.status===0,'My Conservatory module syntax invalid: '+String(syntax.stderr||'').slice(0,250));
 const src=academyScript[1];
 const syncStart=src.indexOf('async function sync(){');
 const syncAuth=src.indexOf('await db.auth.getUser()',syncStart);
 const syncClear=src.indexOf("$('#signed').hidden=true;",syncStart);
 const syncRows=src.indexOf("$('#sessions').replaceChildren();",syncStart);
 check(syncStart>=0&&syncClear>syncStart&&syncClear<syncAuth&&syncRows<syncAuth,'Academy must conceal and clear private records before initial/repeated authentication checks');
 const identity=src.indexOf('activeUser.id!==expectedUserId');
 const reveal=src.indexOf("$('#signed').hidden=false;$('#auth').hidden=true;");
 check(identity>=0&&reveal>identity,'Academy must validate account identity before revealing private records');
 check(src.includes('if(generation!==dashboardGeneration)return;'),'Academy async responses need generation invalidation');
 for(const table of ['aom_sessions','aom_baselines','aom_ai_reviews']){
  const query=src.match(new RegExp("db\\.from\\('"+table+"'\\)([\\s\\S]*?)(?=,db\\.from\\(|\\]\\);)"));
  check(!!query&&query[1].includes(".eq('user_id',expectedUserId)"),'Academy '+table+' query must filter to authenticated account');
 }
 const queryError=src.indexOf('const err=sessions.error||baselines.error||reviews.error;');
 const queryErrorBranch=src.indexOf('if(err){',queryError);
 const revealAfterQueries=src.indexOf("$('#signed').hidden=false;$('#auth').hidden=true;",queryError);
 const querySuccess=src.indexOf('const s=sessions.data||[],r=reviews.data||[];',queryError);
 check(queryError>=0&&queryErrorBranch>queryError&&revealAfterQueries>queryErrorBranch&&revealAfterQueries<querySuccess,'Academy must not reveal private dashboard when cloud queries fail');
}
const live=read('live-coach.html');
check(live.includes('navigator.mediaDevices.getUserMedia'),'Live Coach camera path missing');
check(live.includes('audio:false'),'Live Coach must not request microphone for camera');
check(live.includes('pose_landmarker_full'),'Full pose model missing');
check(live.includes('pose_landmarker_lite'),'Lite fallback missing');
if(failures.length){console.error('Academy smoke checks FAILED:');for(const f of failures)console.error(' - '+f);process.exitCode=1}
else console.log('Academy static smoke checks passed for '+Object.keys(pages).length+' pages. Camera, cloud permissions, AI reliability, and mobile behavior remain untested.');
