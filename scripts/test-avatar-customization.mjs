import assert from 'node:assert/strict';
import {APPEARANCE_PRESETS,appearanceForPreset,normalizeAppearance} from '../assets/avatar-customization.js';
assert.equal(Object.keys(APPEARANCE_PRESETS).length,4);
for(const key of Object.keys(APPEARANCE_PRESETS)){const p=appearanceForPreset(key);assert(p.height>=.85&&p.height<=1.15);assert(p.hair);assert(p.palette)}
const invalid=normalizeAppearance({height:100,shoulders:-3,hips:NaN,limbs:'bad',skinTone:'javascript:bad',hair:'unsupported',palette:'wrong'});
assert.equal(invalid.height,1.15);assert.equal(invalid.shoulders,.8);assert.equal(invalid.hips,1);assert.equal(invalid.limbs,1);assert.equal(invalid.skinTone,APPEARANCE_PRESETS.studio.skinTone);
assert.equal(invalid.hair,'coils');assert.equal(invalid.palette,'oxblood');
assert.equal(appearanceForPreset('unknown').height,1);
console.log('Appearance presets, range constraints and invalid input safeguards passed.');
