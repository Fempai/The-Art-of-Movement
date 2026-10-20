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
const live=read('live-coach.html');
check(live.includes('navigator.mediaDevices.getUserMedia'),'Live Coach camera path missing');
check(live.includes('audio:false'),'Live Coach must not request microphone for camera');
check(live.includes('pose_landmarker_full'),'Full pose model missing');
check(live.includes('pose_landmarker_lite'),'Lite fallback missing');
if(failures.length){console.error('Academy smoke checks FAILED:');for(const f of failures)console.error(' - '+f);process.exitCode=1}
else console.log('Academy static smoke checks passed for '+Object.keys(pages).length+' pages. Camera, cloud permissions, AI reliability, and mobile behavior remain untested.');
