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
function compare(reference,practice,method='phase'){if(!['phase','tempo-aware'].includes(method))throw Error('Unsupported comparison method');const a=parse(reference),b=parse(practice);const n=61,series=[];let total=0;const times=rows=>Array.from({length:n},(_,i)=>rows[0].t+i/(n-1)*(rows.at(-1).t-rows[0].t));const ax=times(a),bx=times(b);const refValues=ax.map(t=>Object.fromEntries(keys.map(k=>[k,interpolate(a,t,k)]))),practiceValues=bx.map(t=>Object.fromEntries(keys.map(k=>[k,interpolate(b,t,k)])));let mapping=Array.from({length:n},(_,i)=>i);
if(method==='tempo-aware'){
 // Bounded dynamic time warping is exploratory; only permits a ±25% phase shift.
 const cost=Array.from({length:n},()=>Array(n).fill(Infinity)),previous=Array.from({length:n},()=>Array(n).fill(null));
 const distance=(i,j)=>keys.reduce((sum,k)=>sum+Math.abs(refValues[i][k]-practiceValues[j][k])/(k.includes('degrees')?45:1),0);
 for(let i=0;i<n;i++)for(let j=Math.max(0,i-15);j<=Math.min(n-1,i+15);j++){const local=distance(i,j);if(i===0&&j===0){cost[i][j]=local;continue}const options=[];if(i>0&&j>0)options.push([cost[i-1][j-1],i-1,j-1]);if(i>0)options.push([cost[i-1][j]+.08,i-1,j]);if(j>0)options.push([cost[i][j-1]+.08,i,j-1]);options.sort((a,b)=>a[0]-b[0]);const best=options[0];if(best&&Number.isFinite(best[0])){cost[i][j]=best[0]+local;previous[i][j]=[best[1],best[2]]}}
 if(!Number.isFinite(cost[n-1][n-1]))throw Error('Could not align movement windows.');
 const matched=Array.from({length:n},()=>[]);let i=n-1,j=n-1;for(let count=0;count<n*n;count++){matched[i].push(j);if(i===0&&j===0)break;const prev=previous[i][j];if(!prev)throw Error('Incomplete movement alignment');[i,j]=prev}
 mapping=matched.map((items,i)=>items.length?Math.round(items.reduce((sum,j)=>sum+j,0)/items.length):i);
}
for(let i=0;i<n;i++){const phase=i/(n-1),ref=refValues[i],current=practiceValues[mapping[i]],difference={};for(const key of keys){difference[key]=current[key]-ref[key];total+=Math.abs(difference[key])}series.push({phase,practicePhase:mapping[i]/(n-1),reference:ref,practice:current,difference})}
return {series,method,meanAbsoluteDifference:total/(n*keys.length),referenceSeconds:a.at(-1).t-a[0].t,practiceSeconds:b.at(-1).t-b[0].t,keys,disclaimer:'Camera-dependent 2D comparison only. Tempo-aware alignment can hide real timing differences and is not proof of choreography accuracy. Different camera angles, distances and movement timing alter results. This is not calibrated scoring, a dance grade, or proof of technique.'}}
return {parse,compare,keys};
});
