import assert from 'node:assert/strict';
import {solveTwoBone,stabilizeLegs} from '../assets/leg-ik.js';
const hip={x:0,y:0,z:0},knee={x:.2,y:1,z:0},foot={x:0,y:2,z:0};
for(const target of [{x:0,y:2,z:0},{x:.3,y:1.8,z:0},{x:0,y:3,z:0},{x:-.4,y:1.5,z:.3}]){
 const result=solveTwoBone(hip,knee,foot,target);
 assert(result);
 assert(Math.abs(Math.hypot(result.knee.x,result.knee.y,result.knee.z)-Math.hypot(knee.x,knee.y,knee.z))<1e-5);
 assert(Math.abs(Math.hypot(result.knee.x-result.foot.x,result.knee.y-result.foot.y,result.knee.z-result.foot.z)-Math.hypot(knee.x-foot.x,knee.y-foot.y,knee.z-foot.z))<1e-5);
}
assert.equal(solveTwoBone(null,knee,foot,foot),null);
const world=Array.from({length:33},()=>({x:0,y:0,z:0,visibility:1}));
world[23]=hip;world[25]=knee;world[27]=foot;world[29]={...foot};world[31]={...foot};
const moved=stabilizeLegs(world,{left:true},{left:{x:.2,y:1.9,z:0}});
assert.notEqual(moved[27].x,world[27].x);
assert.equal(world[27].x,0);
const unchanged=stabilizeLegs(world,{left:false},{left:{x:.2,y:1.9,z:0}});
assert.equal(unchanged[27].x,0);
console.log('Leg IK tests: reach, bend, overextension, stationary contact and input immutability passed.');
