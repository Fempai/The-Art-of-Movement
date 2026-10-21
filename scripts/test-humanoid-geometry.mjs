import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createHumanoidRetargeter} from '../assets/humanoid-retarget.js';
function build(){
 const root=new THREE.Group(),bones={};
 const definitions=[
 ['hips',null,[0,0,0]],['chest','hips',[0,1,0]],
 ['leftShoulder','chest',[-.35,0,0]],['leftElbow','leftShoulder',[-.4,-.4,0]],['leftWrist','leftElbow',[-.35,-.35,0]],
 ['rightShoulder','chest',[.35,0,0]],['rightElbow','rightShoulder',[.4,-.4,0]],['rightWrist','rightElbow',[.35,-.35,0]],
 ['leftHip','hips',[-.2,-.2,0]],['leftKnee','leftHip',[0,-.8,0]],['leftAnkle','leftKnee',[0,-.8,0]],
 ['rightHip','hips',[.2,-.2,0]],['rightKnee','rightHip',[0,-.8,0]],['rightAnkle','rightKnee',[0,-.8,0]]
 ];
 const aliases={leftElbow:'leftForeArm',leftWrist:'leftHand',rightElbow:'rightForeArm',rightWrist:'rightHand',leftHip:'leftUpLeg',leftKnee:'leftLeg',leftAnkle:'leftFoot',rightHip:'rightUpLeg',rightKnee:'rightLeg',rightAnkle:'rightFoot'};for(const [name,parent,xyz] of definitions){const b=new THREE.Bone();b.name=aliases[name]||name;b.position.set(...xyz);bones[name]=b;(parent?bones[parent]:root).add(b)}
 root.updateMatrixWorld(true);return {root,bones}
}
function points(bones){const map={hips:[23,24],chest:[11,12],leftShoulder:[11],leftElbow:[13],leftWrist:[15],rightShoulder:[12],rightElbow:[14],rightWrist:[16],leftHip:[23],leftKnee:[25],leftAnkle:[27],rightHip:[24],rightKnee:[26],rightAnkle:[28]};const world=Array.from({length:33},()=>({x:0,y:0,z:0,visibility:1}));for(const [name,ids] of Object.entries(map)){const p=new THREE.Vector3();bones[name].getWorldPosition(p);for(const i of ids)world[i]={x:p.x,y:-p.y,z:-p.z,visibility:1}}// averaged torso/hip anchors need nonzero separation
 return world}
const {root,bones}=build(),adapter=createHumanoidRetargeter(THREE,root);
assert.equal(adapter.coverage,1);
const original=points(bones);
assert.equal(adapter.apply(original,1),true);
for(const b of Object.values(bones))assert(Number.isFinite(b.quaternion.angleTo(new THREE.Quaternion())),'Pose rotation must be finite for '+b.name);
const moved=original.map(p=>({...p}));moved[13].z+=.4;
assert.equal(adapter.apply(moved,1),true);
assert(bones.leftShoulder.quaternion.angleTo(new THREE.Quaternion())>.01,'Left shoulder should respond to depth change');
adapter.reset();
for(const b of Object.values(bones))assert(b.quaternion.angleTo(new THREE.Quaternion())<1e-4,'Reset should restore '+b.name);
assert.equal(adapter.apply(null),false);
console.log('Numerical humanoid bind-pose, rotation and reset tests passed.');
