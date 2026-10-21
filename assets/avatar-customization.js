/* Prototype-only appearance controls. No claims of biometric likeness. */
export const APPEARANCE_PRESETS={
 studio:{height:1,shoulders:1,hips:1,limbs:1,skinTone:'0xb98c74',hair:'coils',hairColor:'0x241b20',palette:'oxblood'},
 ballet:{height:1.06,shoulders:.92,hips:.92,limbs:1.08,skinTone:'0x885a43',hair:'bun',hairColor:'0x20191a',palette:'midnight'},
 contemporary:{height:1,shoulders:1.06,hips:1.05,limbs:1,skinTone:'0x5e392d',hair:'puff',hairColor:'0x241b20',palette:'sage'},
 rehearsal:{height:.96,shoulders:.96,hips:1.08,limbs:.97,skinTone:'0xd5a789',hair:'short',hairColor:'0x33201b',palette:'oxblood'}
};
export const APPEARANCE_LIMITS={height:[.85,1.15],shoulders:[.8,1.2],hips:[.8,1.2],limbs:[.85,1.15]};
export const SKIN_TONES=['0xb98c74','0x885a43','0x5e392d','0xd5a789'];
export const HAIR_COLORS=['0x241b20','0x33201b','0x4b3027','0x151316'];
export const HAIR_STYLES=['coils','bun','puff','short','none'];
export const OUTFITS=['oxblood','midnight','sage'];
export function normalizeAppearance(raw={}){
 const base=APPEARANCE_PRESETS.studio,out={};
 for(const [key,[min,max]] of Object.entries(APPEARANCE_LIMITS)){
  const value=Number(raw[key]);out[key]=Number.isFinite(value)?Math.min(max,Math.max(min,value)):base[key];
 }
 for(const [key,values] of Object.entries({skinTone:SKIN_TONES,hairColor:HAIR_COLORS,hair:HAIR_STYLES,palette:OUTFITS})){
  out[key]=values.includes(raw[key])?raw[key]:base[key]
 }
 return out
}
export function appearanceForPreset(name){return normalizeAppearance(APPEARANCE_PRESETS[name]||APPEARANCE_PRESETS.studio)}
