/* Stateless pose sampling: bounded cubic Hermite interpolation with confidence
   gates, linear fallback at endpoints, and no extrapolation outside the clip. */
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>t*t*(3-2*t);
export function interpolateWorld(frames,position){
 if(!Array.isArray(frames)||!frames.length)return null;
 const pos=clamp(Number.isFinite(position)?position:0,0,frames.length-1),i=Math.floor(pos),j=Math.min(i+1,frames.length-1),t=pos-i;
 const a=frames[i]?.world,b=frames[j]?.world;
 if(!Array.isArray(a)||!Array.isArray(b)||a.length<33||b.length<33)return null;
 if(i===j)return a.map(p=>({...p}));
 const prev=frames[Math.max(0,i-1)]?.world,next=frames[Math.min(frames.length-1,j+1)]?.world;
 return a.map((p,k)=>{
  const q=b[k];if(!p||!q)return p||q;
  const out={...p};
  const confident=Math.min(p.visibility??1,q.visibility??1)>=.45;
  for(const axis of ['x','y','z']){
   const v=p[axis],w=q[axis];if(!Number.isFinite(v)||!Number.isFinite(w)){out[axis]=Number.isFinite(v)?v:w;continue}
   const before=prev?.[k]?.[axis],after=next?.[k]?.[axis];
   if(!confident||!Number.isFinite(before)||!Number.isFinite(after)){out[axis]=v+(w-v)*t;continue}
   const m0=(w-before)*.5,m1=(after-v)*.5;
   const t2=t*t,t3=t2*t;
   const hermite=(2*t3-3*t2+1)*v+(t3-2*t2+t)*m0+(-2*t3+3*t2)*w+(t3-t2)*m1;
   const margin=Math.abs(w-v)*.15+.003;
   out[axis]=clamp(hermite,Math.min(v,w)-margin,Math.max(v,w)+margin);
  }
  out.visibility=Math.min(p.visibility??1,q.visibility??1);
  return out
 })
}
export function createPoseFilter(options={}){
 const gain=clamp(options.gain??.5,.05,1),maxStep=options.maxStep??.2;
 let previous=null;
 function reset(){previous=null}
 function update(world){
  if(!Array.isArray(world))return world;
  const out=world.map((p,i)=>{
   if(!p)return p;
   const old=previous?.[i];if(!old||(p.visibility??1)<.45)return {...p};
   const result={...p};
   for(const axis of ['x','y','z']){
    if(!Number.isFinite(p[axis])||!Number.isFinite(old[axis]))continue;
    const diff=p[axis]-old[axis];
    // Large jumps are treated as a new motion segment, not a smoothing tail.
    result[axis]=Math.abs(diff)>maxStep?p[axis]:old[axis]+diff*gain;
   }
   return result
  });
  previous=out;return out
 }
 return {update,reset}
}
