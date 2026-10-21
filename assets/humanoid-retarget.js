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
const edges=[['hips','chest'],['chest','leftShoulder'],['leftShoulder','leftElbow'],['leftElbow','leftWrist'],['chest','rightShoulder'],['rightShoulder','rightElbow'],['rightElbow','rightWrist'],['hips','leftHip'],['leftHip','leftKnee'],['leftKnee','leftAnkle'],['hips','rightHip'],['rightHip','rightKnee'],['rightKnee','rightAnkle']];
/* Bind-space local bone directions are essential: comparing a world-space
   rest direction to a local-space target double-applies parent rotation. */
export function createHumanoidRetargeter(THREE,root){
 const info=mapHumanoidBones(root),rest={},directions={};
 root.updateMatrixWorld(true);
 for(const [key,bone] of Object.entries(info.mapping))rest[key]=bone.quaternion.clone();
 for(const [a,b] of edges){
  const ba=info.mapping[a],bb=info.mapping[b];if(!ba||!bb)continue;
  const start=new THREE.Vector3(),end=new THREE.Vector3(),parentWorld=new THREE.Quaternion();
  ba.getWorldPosition(start);bb.getWorldPosition(end);
  if(ba.parent)ba.parent.getWorldQuaternion(parentWorld);
  const direction=end.sub(start).applyQuaternion(parentWorld.invert());
  if(direction.lengthSq()>1e-8)directions[a+'-'+b]=direction.normalize();
 }
 function apply(world,smoothing=.3){
  const points=extract(world);if(!points)return false;
  const factor=Math.max(0,Math.min(1,smoothing));if(!factor)return true;
  // A parent is updated before its descendants; child targets are expressed in
  // its current parent-local frame, avoiding double rotation and flipped limbs.
  for(const [a,b] of edges){
   const bone=info.mapping[a],base=directions[a+'-'+b];
   if(!bone||!base||points[a].confidence<.45||points[b].confidence<.45)continue;
   const target=new THREE.Vector3(points[b].x-points[a].x,points[a].y-points[b].y,points[a].z-points[b].z);
   if(target.lengthSq()<1e-7)continue;
   root.updateMatrixWorld(true);
   const parentQ=new THREE.Quaternion();
   if(bone.parent)bone.parent.getWorldQuaternion(parentQ);
   target.applyQuaternion(parentQ.invert()).normalize();
   const delta=new THREE.Quaternion().setFromUnitVectors(base,target);
   const desired=delta.multiply(rest[a]);
   bone.quaternion.slerp(desired,factor);
  }
  root.updateMatrixWorld(true);return true;
 }
 function reset(){for(const [key,bone] of Object.entries(info.mapping))bone.quaternion.copy(rest[key]);root.updateMatrixWorld(true)}
 return {...info,apply,reset}
}

export function inspectHumanoidAsset(root,animations=[]){
 const info=mapHumanoidBones(root),issues=[];
 root.traverse(o=>{if(o.isSkinnedMesh)skinned++;if(o.isSkinnedMesh&&(!o.skeleton?.bones?.length||!o.geometry?.attributes?.skinIndex||!o.geometry?.attributes?.skinWeight))issues.push('Incomplete skinned mesh')});
 if(!skinned)issues.push('No skinned mesh');if(!info.mapping.hips)issues.push('Missing pelvis mapping');
 if(!info.mapping.leftHip||!info.mapping.rightHip)issues.push('Missing leg mapping');
 if(!info.mapping.leftShoulder||!info.mapping.rightShoulder)issues.push('Missing arm mapping');
 if(info.coverage<.7)issues.push('Insufficient mapping');
 const clips=animations.map(c=>({name:c.name||'Unnamed',duration:Number(c.duration)||0,tracks:c.tracks?.length||0,usable:Number(c.duration)>0&&!!c.tracks?.length}));
 return {boneCount:info.boneCount,coverage:info.coverage,missing:info.missing,issues,clips,compatible:!issues.length};
}
