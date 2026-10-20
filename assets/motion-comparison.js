/* Descriptive, camera-dependent comparison of 2D Pose Lab measurement series. No 3D or grade. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AOMMotion=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const keys=['hip_lateral_offset_relative_to_shoulders','hip_vertical_offset_relative_to_shoulders','shoulder_tilt_degrees','hip_tilt_degrees'];
function parse(value){if(!value||value.format!=='aom-pose-observations-v1'||!Array.isArray(value.observations))throw Error('Select a Pose Lab observation export.');
if(value.observations.length<12||value.observations.length>12000)throw Error('An export must contain 12–12,000 observations.');
const rows=value.observations.map(o=>{const t=o?.time_seconds,m=o?.metrics;if(!Number.isFinite(t)||t<0||!m||keys.some(k=>!Number.isFinite(m[k])||Math.abs(m[k])>360)||!Number.isFinite(m.shoulder_width_normalized)||m.shoulder_width_normalized<.03||m.shoulder_width_normalized>1||!Number.isFinite(o.landmarks_visible)||o.landmarks_visible<20)throw Error('Export contains invalid or insufficiently visible pose data.');return {t,m}});
rows.sort((a,b)=>a.t-b.t);for(let i=1;i<rows.length;i++)if(rows[i].t-rows[i-1].t<=0||rows[i].t-rows[i-1].t>1.2)throw Error('Export contains duplicate timestamps or tracking gaps greater than 1.2 seconds.');
if(rows.at(-1).t-rows[0].t<4.5)throw Error('At least 4.5 seconds of continuous tracking are required.');
return rows}
function interpolate(rows,at,key){let lo=0,hi=rows.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(rows[mid].t<at)lo=mid+1;else hi=mid}if(lo===0)return rows[0].m[key];const a=rows[lo-1],b=rows[lo];const f=Math.max(0,Math.min(1,(at-a.t)/(b.t-a.t)));return a.m[key]*(1-f)+b.m[key]*f}
function compare(reference,practice){const a=parse(reference),b=parse(practice);const n=61,series=[];let total=0;for(let i=0;i<n;i++){const phase=i/(n-1),x=a[0].t+phase*(a.at(-1).t-a[0].t),y=b[0].t+phase*(b.at(-1).t-b[0].t),ref={},current={},difference={};for(const key of keys){ref[key]=interpolate(a,x,key);current[key]=interpolate(b,y,key);difference[key]=current[key]-ref[key];total+=Math.abs(difference[key])}series.push({phase,reference:ref,practice:current,difference})}return {series,meanAbsoluteDifference:total/(n*keys.length),referenceSeconds:a.at(-1).t-a[0].t,practiceSeconds:b.at(-1).t-b[0].t,keys,disclaimer:'Camera-dependent 2D comparison only. Different camera angles, distances and movement timing alter results. This is not 3D tracking, calibrated scoring, a dance grade, or proof of technique.'}}
return {parse,compare,keys};
});
