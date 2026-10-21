import assert from 'node:assert/strict';
import {mapHumanoidBones,BONE_ALIASES,inspectHumanoidAsset} from '../assets/humanoid-retarget.js';
const bones=['mixamorigHips','mixamorigSpine2','mixamorigLeftArm','mixamorigLeftForeArm','mixamorigLeftHand','mixamorigRightArm','mixamorigRightForeArm','mixamorigRightHand','mixamorigLeftUpLeg','mixamorigLeftLeg','mixamorigLeftFoot','mixamorigRightUpLeg','mixamorigRightLeg','mixamorigRightFoot'].map(name=>({name,isBone:true}));
const root={traverse(fn){bones.forEach(fn)}};
const mapped=mapHumanoidBones(root);
assert.equal(mapped.boneCount,14);assert.equal(mapped.missing.length,0);assert.equal(mapped.coverage,1);
assert.equal(mapped.mapping.leftAnkle.name,'mixamorigLeftFoot');
assert.equal(mapped.mapping.rightKnee.name,'mixamorigRightLeg');
assert.equal(Object.keys(BONE_ALIASES).length,14);
const partial=mapHumanoidBones({traverse(fn){fn({name:'Hips',isBone:true})}});
assert(partial.coverage<.1);assert(partial.missing.includes('leftAnkle'));
console.log('Humanoid rig alias mapping and missing bone coverage checks passed.');

const inspection=inspectHumanoidAsset(root,[{name:'Dance',duration:2,tracks:[{}]},{name:'Empty',duration:0,tracks:[]}]);
assert.equal(inspection.compatible,true);
assert.equal(inspection.clips[0].usable,true);
assert.equal(inspection.clips[1].usable,false);
assert.equal(inspectHumanoidAsset({traverse(fn){fn({name:'Hips',isBone:true})}},[]).compatible,false);
