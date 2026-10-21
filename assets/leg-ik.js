/* Bounded two-bone IK in pose-observation coordinates.
   Contact anchors are model estimates, not physically measured floor contact. */
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
export function solveTwoBone(root,knee,foot,target){
 if(![root,knee,foot,target].every(p=>p&&['x','y','z'].every(k=>Number.isFinite(p[k]))))return null;
 const a=dist(root,knee),b=dist(knee,foot),d=dist(root,target);
 if(a<1e-5||b<1e-5||d<1e-5)return null;
 const reach=Math.min(a+b-1e-5,Math.max(Math.abs(a-b)+1e-5,d));
 const dir={x:(target.x-root.x)/d,y:(target.y-root.y)/d,z:(target.z-root.z)/d};
 const projection=(a*a+reach*reach-b*b)/(2*reach);
 const height=Math.sqrt(Math.max(0,a*a-projection*projection));
 const old={x:knee.x-root.x,y:knee.y-root.y,z:knee.z-root.z};
 const dot=old.x*dir.x+old.y*dir.y+old.z*dir.z;
 let perp={x:old.x-dot*dir.x,y:old.y-dot*dir.y,z:old.z-dot*dir.z};
 let norm=Math.hypot(perp.x,perp.y,perp.z);
 if(norm<1e-6){perp=Math.abs(dir.y)<.9?{x:-dir.y,y:dir.x,z:0}:{x:0,y:-dir.z,z:dir.y};norm=Math.hypot(perp.x,perp.y,perp.z)}
 const correctedKnee={...knee,x:root.x+projection*dir.x+height*perp.x/norm,y:root.y+projection*dir.y+height*perp.y/norm,z:root.z+projection*dir.z+height*perp.z/norm};
 const correctedFoot={...foot,x:root.x+reach*dir.x,y:root.y+reach*dir.y,z:root.z+reach*dir.z};
 return {knee:correctedKnee,foot:correctedFoot,reachable:d<=a+b&&d>=Math.abs(a-b)}
}
export function stabilizeLegs(world,contacts,anchors){
 if(!Array.isArray(world)||world.length<33)return world;
 const out=world.map(p=>p?{...p}:p);
 for(const [side,hip,knee,ankle] of [['left',23,25,27],['right',24,26,28]]){
  if(!contacts?.[side]||!anchors?.[side])continue;
  const result=solveTwoBone(out[hip],out[knee],out[ankle],anchors[side]);if(!result)continue;
  const delta={x:result.foot.x-out[ankle].x,y:result.foot.y-out[ankle].y,z:result.foot.z-out[ankle].z};
  out[knee]=result.knee;out[ankle]=result.foot;
  for(const id of [ankle+2,ankle+4])if(out[id])for(const axis of ['x','y','z'])out[id][axis]+=delta[axis];
 }
 return out
}
