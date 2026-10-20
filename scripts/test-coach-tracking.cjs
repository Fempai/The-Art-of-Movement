'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('live-coach.html','utf8'),start=s.indexOf('function feedback(points){'),end=s.indexOf('async function load(){',start);
assert(start>=0&&end>start,'Coach feedback function must be available');
const source=s.slice(start,end);
const pose=Array.from({length:33},(_,i)=>({x:.2+(i%6)*.1,y:.15+(i%5)*.12,visibility:.95,presence:.95}));
Object.assign(pose[11],{x:.35,y:.2});Object.assign(pose[12],{x:.65,y:.2});Object.assign(pose[23],{x:.4,y:.48});Object.assign(pose[24],{x:.6,y:.48});Object.assign(pose[27],{x:.4,y:.88});Object.assign(pose[28],{x:.6,y:.88});
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function feedback(mode,points){const ctx={$:()=>({value:mode}),dist};vm.runInNewContext(source+';this.out=feedback(this.points)',{...ctx,points},{timeout:1000});return ctx.out}
function call(mode,points){const context={$:()=>({value:mode}),dist,points};vm.runInNewContext(source+';this.out=feedback(points)',context,{timeout:1000});return context.out}
assert.equal(call('alignment',pose)[2],true);
const anklesHidden=pose.map((p,i)=>i===27||i===28?{...p,visibility:.01,presence:.01}:p);
assert.equal(call('alignment',anklesHidden)[2],true,'Alignment must not require ankle tracking');
assert.equal(call('stance',anklesHidden)[2],false,'Stance still requires ankle tracking');
assert.equal(call('balance',anklesHidden)[2],false,'Balance still requires ankle tracking');
assert(!call('alignment',anklesHidden)[1].includes('NaN'));
assert.equal(call('alignment',null)[2],false);
console.log('Coach mode-specific tracking: 6 assertions passed.');
