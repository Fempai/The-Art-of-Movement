/* Retarget estimated MediaPipe joints to a licensed GLB humanoid's existing
   skeleton. Bone aliases support common Mixamo / VRM / Blender naming.
   This does not modify the original model's licensed asset. */
import {extract} from './skinned-avatar.js';
export const BONE_ALIASES={
 hips:['hips','pelvis','mixamorigHips','J_Bip_C_Hips'],
 chest:['spine2','chest','upperchest','mixamorigSpine2','J_Bip_C_Chest'],
 leftShoulder:['leftshoulder','leftupperarm','mixamorigLeftArm','J_Bip_L_UpperArm'],
 leftElbow:['leftforearm','leftlowerarm','mixamorigLeftForeArm','J_Bip_L_LowerArm'],
 leftWrist:['lefthand','mixamorigLeftHand','J_Bip_L_Hand'],
 rightShoulder:['rightshoulder','rightupperarm','mixamorigRightArm','J_Bip_R_UpperArm'],
 rightElbow:['rightforearm','rightlowerarm','mixamorigRightForeArm','J_Bip_R_LowerArm'],
 rightWrist:['righthand','mixamorigRightHand','J_Bip_R_Hand'],
 leftHip:['leftupleg','leftthigh','mixamorigLeftUpLeg','J_Bip_L_UpperLeg'],
 leftKnee:['leftleg','leftlowerleg','mixamorigLeftLeg','J_Bip_L_LowerLeg'],
 leftAnkle:['leftfoot','mixamorigLeftFoot','J_Bip_L_Foot'],
 rightHip:['rightupleg','rightthigh','mixamorigRightUpLeg','J_Bip_R_UpperLeg'],
 rightKnee:['rightleg','rightlowerleg','mixamorigRightLeg','J_Bip_R_LowerLeg'],
 rightAnkle:['rightfoot','mixamorigRightFoot','J_Bip_R_Foot']
};
const norm=x=>String(x||'').replace(/[^a-z0-9]/gi,'').toLowerCase();
export function mapHumanoidBones(root){const found=[];root.traverse(o=>{if(o.isBone)found.push(o)});const mapping={},missing=[];for(const [key,aliases] of Object.entries(BONE_ALIASES)){const bone=found.find(b=>aliases.some(a=>norm(b.name)===norm(a)||norm(b.name).endsWith(norm(a))));if(bone)mapping[key]=bone;else missing.push(key)}return {mapping,missing,boneCount:found.length,coverage:Object.keys(mapping).length/Object.keys(BONE_ALIASES).length}}
const edges=[['hips','chest'],['chest','leftShoulder'],['leftShoulder','leftElbow'],['leftElbow','leftWrist'],['chest','rightShoulder'],['rightShoulder','rightElbow'],['rightElbow','rightWrist'],['hips','leftHip'],['leftHip','leftKnee'],['leftKnee','leftAnkle'],['hips','rightHip'],['rightKnee'],['rightKnee','rightAnkle']];
export function createHumanoidRetargeter(THREE,root){const info=mapHumanoidBones(root);const rest={};for(const [key,bone] of Object.entries(info.mapping)){rest[key]=bone.quaternion.clone()}root.updateMatrixWorld(true);
 const directions={};for(const [a,b] of edges){const ba=info.mapping[a],bb=info.mapping[b];if(!ba||!bb)continue;const start=new THREE.Vector3(),end=new THREE.Vector3();ba.getWorldPosition(start);bb.getWorldPosition(end);const v=end.sub(start);if(v.lengthSq()>1e-8)directions[a+'-'+b]=v.normalize()}
 function apply(world,smoothing=.3){const p=extract(world);if(!p)return false;const f=Math.max(0,Math.min(1,smoothing));const rotated=new Set();for(const [a,b] of edges){const bone=info.mapping[a],from=directions[a+'-'+b];if(!bone||!from||rotated.has(a)||p[a].confidence<.45||p[b].confidence<.45)continue;const target=new THREE.Vector3(p[b].x-p[a].x,-p[b].y+p[a].y,-p[b].z+p[a].z);if(target.lengthSq()<1e-7)continue;root.updateMatrixWorld(true);const parentQ=new THREE.Quaternion();if(bone.parent)bone.parent.getWorldQuaternion(parentQ);const currentWorld=new THREE.Quaternion();bone.getWorldQuaternion(currentWorld);const worldCorrection=new THREE.Quaternion().setFromUnitVectors(from,target.normalize());const localCorrection=parentQ.clone().invert().multiply(worldCorrection).multiply(parentQ);const desired=localCorrection.multiply(rest[a]);bone.quaternion.slerp(desired,f);rotated.add(a)}root.updateMatrixWorld(true);return true}
 function reset(){for(const [key,bone] of Object.entries(info.mapping))bone.quaternion.copy(rest[key]);root.updateMatrixWorld(true)}
 return {...info,apply,reset}}
