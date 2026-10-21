import {normalizeAppearance} from './avatar-customization.js';
/* Browser-only GPU skinning prototype. Three.js is imported by the host page.
   MediaPipe world landmarks are estimates, not calibrated motion capture. */
export const JOINTS={hips:[23,24],chest:[11,12],leftShoulder:[11],leftElbow:[13],leftWrist:[15],rightShoulder:[12],rightElbow:[14],rightWrist:[16],leftHip:[23],leftKnee:[25],leftAnkle:[27],rightHip:[24],rightKnee:[26],rightAnkle:[28]};
export const CHAINS=[['hips','chest'],['chest','leftShoulder'],['leftShoulder','leftElbow'],['leftElbow','leftWrist'],['chest','rightShoulder'],['rightShoulder','rightElbow'],['rightElbow','rightWrist'],['hips','leftHip'],['leftHip','leftKnee'],['leftKnee','leftAnkle'],['hips','rightHip'],['rightHip','rightKnee'],['rightKnee','rightAnkle']];
export const validPoint=p=>!!p&&['x','y','z'].every(k=>Number.isFinite(p[k])&&Math.abs(p[k])<20);
export function extract(world){if(!Array.isArray(world)||world.length<33)return null;const out={};for(const [name,ids] of Object.entries(JOINTS)){if(!ids.every(i=>validPoint(world[i])))return null;const n=ids.length;out[name]={x:ids.reduce((s,i)=>s+world[i].x,0)/n,y:ids.reduce((s,i)=>s+world[i].y,0)/n,z:ids.reduce((s,i)=>s+world[i].z,0)/n,confidence:Math.min(...ids.map(i=>world[i].visibility??1))}}const a=out.hips,b=out.chest;if(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.08)return null;return out}
export function makeRig(THREE,options={}){const appearance=normalizeAppearance(options);const root=new THREE.Group(),bones={},bind={},lengths={};const positions={hips:[0,0,0],chest:[0,1.0,0],leftShoulder:[-.35,1.05,0],leftElbow:[-.72,.64,0],leftWrist:[-.85,.2,0],rightShoulder:[.35,1.05,0],rightElbow:[.72,.64,0],rightWrist:[.85,.2,0],leftHip:[-.17,-.15,0],leftKnee:[-.18,-.9,0],leftAnkle:[-.18,-1.75,0],rightHip:[.17,-.15,0],rightKnee:[.18,-.9,0],rightAnkle:[.18,-1.75,0]};
for(const [name,p] of Object.entries(positions)){if(name==='hips')continue;const side=name.startsWith('left')?-1:name.startsWith('right')?1:0;const factor=name.includes('Shoulder')||name.includes('Elbow')||name.includes('Wrist')?appearance.shoulders:name.includes('Hip')||name.includes('Knee')||name.includes('Ankle')?appearance.hips:1;p[0]*=factor;if(name.includes('Elbow')||name.includes('Wrist'))p[0]*=appearance.limbs;if(name.includes('Knee')||name.includes('Ankle'))p[1]*=appearance.limbs;p[1]*=appearance.height;}
const parent={chest:'hips',leftShoulder:'chest',rightShoulder:'chest',leftElbow:'leftShoulder',leftWrist:'leftElbow',rightElbow:'rightShoulder',rightWrist:'rightElbow',leftHip:'hips',rightHip:'hips',leftKnee:'leftHip',rightKnee:'rightHip',leftAnkle:'leftKnee',rightAnkle:'rightKnee'};
for(const [name,p] of Object.entries(positions)){const b=new THREE.Bone();b.name=name;b.position.set(...p);bones[name]=b;bind[name]=new THREE.Vector3(...p);if(parent[name]){const par=bones[parent[name]];b.position.sub(bind[parent[name]]);par.add(b)}else root.add(b)}
root.updateMatrixWorld(true);
const boneList=Object.keys(bones).map(n=>bones[n]),boneIndex=Object.fromEntries(Object.keys(bones).map((n,i)=>[n,i]));
const palette=appearance.palette,colors={oxblood:0x673449,midnight:0x273a57,sage:0x425b50},material=new THREE.MeshStandardMaterial({color:colors[palette]||colors.oxblood,roughness:.72,metalness:.015,side:THREE.DoubleSide,skinning:true});
const meshes=[];
for(const [a,b] of CHAINS){const start=bind[a],end=bind[b],direction=new THREE.Vector3().subVectors(end,start),length=direction.length();lengths[a+'-'+b]=length;const radius=a==='hips'&&b==='chest'?.25:a==='chest'?.13:a.includes('Hip')?.14:a.includes('Knee')?.095:.09;
const geometry=new THREE.CylinderGeometry(radius*.84,radius,length,12,12,false);const vertices=geometry.attributes.position,skinIndices=[],skinWeights=[];for(let i=0;i<vertices.count;i++){const y=vertices.getY(i),w=Math.max(0,Math.min(1,(y/length+.5)));skinIndices.push(boneIndex[a],boneIndex[b],0,0);skinWeights.push(1-w,w,0,0)}geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(skinIndices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(skinWeights,4));const mesh=new THREE.SkinnedMesh(geometry,material);mesh.name=a+'-'+b;mesh.position.copy(start).addScaledVector(direction,.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.clone().normalize());root.add(mesh);mesh.bind(new THREE.Skeleton(boneList));meshes.push(mesh)}
// A separate smooth head geometry bound to the chest bone; body segments use
// true GPU skin weights at both ends, unlike the previous flat canvas avatar.
const headGeometry=new THREE.SphereGeometry(.18,20,16),headIndices=[],headWeights=[];for(let i=0;i<headGeometry.attributes.position.count;i++){headIndices.push(boneIndex.chest,0,0,0);headWeights.push(1,0,0,0)}headGeometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(headIndices,4));headGeometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(headWeights,4));const head=new THREE.SkinnedMesh(headGeometry,new THREE.MeshStandardMaterial({color:Number(appearance.skinTone),roughness:.81,metalness:0,skinning:true}));head.position.set(0,1.43*appearance.height,0);head.bind(new THREE.Skeleton(boneList));root.add(head);meshes.push(head);
// Lightweight stylized-realistic anatomy: fitted hands, shoes, neck and hair.
// All accessories use bone-weighted meshes and follow the same skeleton.
function accessory(name,geometry,position,boneName,color){const indices=[],weights=[];for(let i=0;i<geometry.attributes.position.count;i++){indices.push(boneIndex[boneName],0,0,0);weights.push(1,0,0,0)}geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(indices,4));geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(weights,4));const isHair=/hair|curl|puff|bun/i.test(name),isShoe=/shoe/i.test(name);const mat=new THREE.MeshStandardMaterial({color,roughness:isHair?.98:isShoe?.56:.82,metalness:isShoe?.025:0,skinning:true});const mesh=new THREE.SkinnedMesh(geometry,mat);mesh.name=name;mesh.position.set(...position);root.add(mesh);mesh.bind(new THREE.Skeleton(boneList));meshes.push(mesh)}
const skin=Number(appearance.skinTone);
accessory('neck',new THREE.CylinderGeometry(.085,.1,.22,16),[0,1.16*appearance.height,0],'chest',skin);
for(const side of ['left','right']){const sign=side==='left'?-1:1;
accessory(side+'Hand',new THREE.SphereGeometry(.095,14,12),[sign*.86*appearance.shoulders*appearance.limbs,.12*appearance.height,0],side+'Wrist',skin);
accessory(side+'Shoe',new THREE.SphereGeometry(.15,18,12),[sign*.18*appearance.hips,-1.83*appearance.height*appearance.limbs,.1],side+'Ankle',0x30252e)}
const hairColor=Number(appearance.hairColor),h=appearance.height;
if(appearance.hair==='coils'){
 accessory('hair',new THREE.SphereGeometry(.215,22,16),[0,1.52*h,-.025],'chest',hairColor);
 for(const [i,[x,y,z]] of [[-.14,1.6,-.03],[.14,1.6,-.03],[-.12,1.46,-.08],[.12,1.46,-.08],[0,1.68,-.03]].entries())accessory('curl'+i,new THREE.SphereGeometry(.095,10,8),[x,y*h,z],'chest',hairColor);
}else if(appearance.hair==='bun'){
 accessory('hairCap',new THREE.SphereGeometry(.195,20,14),[0,1.52*h,-.03],'chest',hairColor);
 accessory('bun',new THREE.SphereGeometry(.16,18,14),[0,1.72*h,-.11],'chest',hairColor);
}else if(appearance.hair==='puff'){
 accessory('hairCap',new THREE.SphereGeometry(.18,18,14),[0,1.52*h,-.04],'chest',hairColor);
 accessory('puff',new THREE.SphereGeometry(.27,22,18),[0,1.76*h,-.08],'chest',hairColor);
}else if(appearance.hair==='short'){
 accessory('shortHair',new THREE.SphereGeometry(.188,20,14),[0,1.55*h,-.035],'chest',hairColor);
}
return {root,bones,bind,meshes,material,dispose(){for(const mesh of meshes){mesh.geometry.dispose();if(mesh.material!==material)mesh.material.dispose()}fabricTexture.dispose();material.dispose()}}}
export function applyPose(THREE,rig,world,alpha=.35){
 const points=extract(world);if(!points)return false;
 const factor=Math.max(0,Math.min(1,alpha));if(!factor)return true;
 const hips=points.hips,positions={};
 for(const name of Object.keys(rig.bones)){
  const p=points[name];positions[name]=new THREE.Vector3((p.x-hips.x)*2,(hips.y-p.y)*2,(hips.z-p.z)*2);
 }
 const rotated=new Set();
 for(const [a,b] of CHAINS){
  if(rotated.has(a)||points[a].confidence<.35||points[b].confidence<.35)continue;
  const bone=rig.bones[a],base=new THREE.Vector3().subVectors(rig.bind[b],rig.bind[a]);
  const target=new THREE.Vector3().subVectors(positions[b],positions[a]);
  if(target.lengthSq()<1e-6||base.lengthSq()<1e-6)continue;
  rig.root.updateMatrixWorld(true);
  const parentQ=new THREE.Quaternion();if(bone.parent)bone.parent.getWorldQuaternion(parentQ);
  // Rest geometry is stored in model/world axes. Convert both rest and target
  // to the current parent-local frame before deriving the bone rotation.
  const restLocal=base.normalize(); // bind parents start unrotated
  const targetLocal=target.applyQuaternion(parentQ.invert()).normalize();
  const rotation=new THREE.Quaternion().setFromUnitVectors(restLocal,targetLocal);
  bone.quaternion.slerp(rotation,factor);rotated.add(a);
 }
 rig.root.updateMatrixWorld(true);return true;
}
