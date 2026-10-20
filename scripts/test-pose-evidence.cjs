'use strict';
/* Runs the real Pose Lab evidence-window selector in a controlled Node VM. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('pose-lab.html','utf8');
const marker='function selectEvidenceWindow(){';
const begin=html.indexOf(marker);
assert(begin>=0,'Pose Lab evidence selector is missing');
let depth=0,end=-1;
for(let i=begin+marker.length-1;i<html.length;i++){
 if(html[i]==='{')depth++;
 if(html[i]==='}'&&--depth===0){end=i+1;break}
}
assert(end>begin,'Evidence selector has unbalanced braces');
const source=html.slice(begin,end);
const metric=(width=.22)=>({shoulder_width_normalized:width,hip_lateral_offset_relative_to_shoulders:.15,hip_vertical_offset_relative_to_shoulders:1.3,shoulder_tilt_degrees:0});
const point=(t,width=.22)=>({time_seconds:t,landmarks_visible:27,metrics:metric(width)});
function select(samples){const ctx={samples};vm.runInNewContext(source+';this.result=selectEvidenceWindow()',ctx,{timeout:1000});return ctx.result}
const stable=Array.from({length:25},(_,i)=>point(i*.25));
assert(select(stable).windowCount>0,'A continuous six-second window should qualify');
assert(select(stable).good.length>=12,'Stable window must retain sufficient observations');
assert.equal(select(stable.slice(0,10)).windowCount,0,'Short evidence must not qualify');
const gap=[...Array.from({length:12},(_,i)=>point(i*.25)),...Array.from({length:12},(_,i)=>point(8+i*.25))];
assert.equal(select(gap).windowCount,0,'Disjoint segments must not be stitched together');
const duplicated=Array.from({length:25},(_,i)=>point(Math.floor(i/2)*.25));
assert.equal(select(duplicated).windowCount,0,'Repeated timestamps must not be treated as continuous evidence');
const hidden=stable.map(x=>({...x,landmarks_visible:10}));
assert.equal(select(hidden).windowCount,0,'Unreliable landmark coverage must be excluded');
const tiny=stable.map(x=>({...x,metrics:metric(.02)}));
assert.equal(select(tiny).windowCount,0,'Insufficient shoulder scale must be excluded');
const scrambled=stable.slice().reverse();
assert(select(scrambled).windowCount>0,'Out-of-order capture samples must be ordered');
console.log('Pose Lab evidence selection: 7 behavioral contracts passed.');
