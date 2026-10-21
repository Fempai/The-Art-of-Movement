/* Same-origin, same-tab opt-in Pose Lab handoff; no automatic cloud writes. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AOMIntegration=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='aom_motion_handoff_v1',PROGRESS='aom_studio_sessions_v1',TTL=30*60*1000,MAX_BYTES=950000;
function validPayload(p){return p&&p.format==='aom-pose-observations-v1'&&Array.isArray(p.observations)&&p.observations.length>=5&&p.observations.length<=12000&&p.observations.every(o=>Number.isFinite(o.time_seconds)&&o.time_seconds>=0&&Number.isFinite(o.landmarks_visible)&&o.landmarks_visible>=0&&o.metrics&&typeof o.metrics==='object')}
function handoff(store,payload,now=Date.now()){if(!validPayload(payload))throw Error('Select a valid Pose Lab export.');const text=JSON.stringify({version:1,created:now,payload});if(text.length>MAX_BYTES)throw Error('Motion handoff exceeds the temporary browser limit. Export a JSON file instead.');store.setItem(KEY,text);return payload.observations.length}
function peek(store,now=Date.now()){let raw;try{raw=store.getItem(KEY);if(!raw)return null;const obj=JSON.parse(raw);if(obj.version!==1||!Number.isFinite(obj.created)||obj.created>now+60000||now-obj.created>TTL||!validPayload(obj.payload)){store.removeItem(KEY);return null}return obj.payload}catch{try{store.removeItem(KEY)}catch{}return null}}
function clear(store){store.removeItem(KEY)}
function summary(record){if(!record||!['avatar','comparison','practice'].includes(record.type))throw Error('Unsupported session type');const note=String(record.note||'').trim().slice(0,240);const seconds=Number(record.seconds);return {id:String(record.id||'').slice(0,80)||'session-'+Date.now(),created:new Date().toISOString(),type:record.type,seconds:Number.isFinite(seconds)?Math.max(0,Math.min(7200,seconds)):0,note,source:'Academy local session (not a technique grade)'}}
function sessions(store){try{const data=JSON.parse(store.getItem(PROGRESS)||'[]');return Array.isArray(data)?data.filter(x=>x&&typeof x.id==='string'&&['avatar','comparison','practice'].includes(x.type)).slice(-100):[]}catch{return []}}
function saveSession(store,record){const next=[...sessions(store),summary(record)].slice(-100);store.setItem(PROGRESS,JSON.stringify(next));return next}
return {KEY,PROGRESS,TTL,validPayload,handoff,peek,clear,sessions,saveSession,summary}
});
