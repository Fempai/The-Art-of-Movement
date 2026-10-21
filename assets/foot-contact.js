/* Conservative floor-contact stabilization for estimated 3D ankle trajectories.
   Only anchors during stable, low-motion observations; never asserts real contact. */
export function createContactSolver(options={}){
 const threshold=Number.isFinite(options.velocityThreshold)?options.velocityThreshold:.035;
 const minFrames=Number.isInteger(options.minFrames)?Math.max(2,options.minFrames):5;
 const state={left:{stable:0,anchor:null,previous:null},right:{stable:0,anchor:null,previous:null}};
 function reset(){for(const foot of Object.values(state)){foot.stable=0;foot.anchor=null;foot.previous=null}}
 function update(world){if(!Array.isArray(world)||world.length<33)return {world,contacts:{left:false,right:false}};
 const next=world.map(p=>p?{...p}:p),contacts={left:false,right:false};
 for(const [side,id] of [['left',27],['right',28]]){const foot=state[side],p=next[id];if(!p||!['x','y','z'].every(k=>Number.isFinite(p[k]))||(p.visibility??1)<.5){foot.stable=0;foot.anchor=null;foot.previous=null;continue}
 const speed=foot.previous?Math.hypot(p.x-foot.previous.x,p.y-foot.previous.y,p.z-foot.previous.z):Infinity;
 foot.stable=speed<threshold?foot.stable+1:0;
 if(speed>threshold*2){foot.anchor=null;foot.stable=0}
 if(!foot.anchor&&foot.stable>=minFrames)foot.anchor={x:p.x,y:p.y,z:p.z};
 foot.previous={x:p.x,y:p.y,z:p.z};
 if(foot.anchor){const displacement=Math.hypot(p.x-foot.anchor.x,p.y-foot.anchor.y,p.z-foot.anchor.z);if(displacement>threshold*2){foot.anchor=null;foot.stable=0}else{contacts[side]=true;for(const joint of [id,id+2,id+4]){if(!next[joint])continue;const weight=joint===id?1:.7;next[joint].x+=(foot.anchor.x-p.x)*weight;next[joint].y+=(foot.anchor.y-p.y)*weight;next[joint].z+=(foot.anchor.z-p.z)*weight}}}
 }
 return {world:next,contacts}}
 return {update,reset}}
