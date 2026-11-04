const { test, expect } = require('@playwright/test');
const base='http://127.0.0.1:8765';
test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
test('homepage shows all sixteen week links',async({page})=>{await page.goto(base+'/index.html');await expect(page.locator('#aom-week-rail a')).toHaveCount(16);await expect(page.locator('#aom-week-rail a').nth(15)).toHaveAttribute('href','weekly-studio.html?week=16')});
test('global navigation dropdowns open on touch',async({page})=>{await page.goto(base+'/index.html');await page.locator('#aom-global-nav summary').first().click();await expect(page.locator('#aom-global-nav details').first()).toHaveAttribute('open','');await expect(page.locator('#aom-global-nav details a').first()).toBeVisible()});
test('week two day tabs switch',async({page})=>{await page.goto(base+'/week-two-academy.html');await expect(page.locator('.aom-w2-days button')).toHaveCount(7);await page.locator('.aom-w2-days button').nth(2).click();await expect(page.locator('.aom-w2-days button').nth(2)).toHaveAttribute('aria-selected','true')});
test('research assignments persist across reload',async({page})=>{await page.goto(base+'/research-studio.html?week=1');await page.locator('#notes').fill('The floor cue was helpful.');await page.reload();await expect(page.locator('#notes')).toHaveValue('The floor cue was helpful.')});
test('assessment history saves and compares two entries',async({page})=>{await page.goto(base+'/assessment-history.html');await page.locator('[name=skill]').fill('Releve');await page.locator('[name=notes]').fill('Balanced with support');await page.locator('#form button').click();await page.reload();await expect(page.locator('.entry')).toHaveCount(1);await expect(page.locator('#rightView')).toContainText('Releve')});
test('camera controls are opt in',async({page})=>{await page.goto(base+'/live-coach.html');await expect(page.locator('#start')).toBeEnabled();await expect(page.locator('#stop')).toBeDisabled()});
test('rehearsal player requires user selected local file',async({page})=>{await page.goto(base+'/practice-player.html');await expect(page.locator('#file')).toHaveAttribute('type','file');await expect(page.locator('#video')).not.toHaveAttribute('src',/https?:/)});

test('Drive-first player loads private Google Drive embed URL without downloading',async({page})=>{await page.goto(base+'/drive-rehearsal.html');await expect(page.locator('#player')).toHaveAttribute('src',/drive.google.com\/file\/d\//);await page.locator('#mirror').click();await expect(page.locator('#mirror')).toHaveAttribute('aria-pressed','true');await page.locator('#notes').fill('Practice note');await page.waitForTimeout(400);await page.reload();await expect(page.locator('#notes')).toHaveValue('Practice note')});
test('voice coaching defaults on and recording is opt in',async({page})=>{await page.goto(base+'/live-coach.html');await expect(page.locator('#voice')).toHaveAttribute('aria-pressed','true');await expect(page.locator('#record')).toBeDisabled();await expect(page.locator('#recordStatus')).toContainText('Not recording')});

test('shared movement bridge shows sign-in before private records',async({page})=>{await page.goto(base+'/movement-bridge.html');await expect(page.locator('#login')).toBeVisible();await expect(page.locator('#private')).toBeHidden();await expect(page.locator('#upload')).toHaveCount(1)});
test('Pose Lab offers optional on-device audio review',async({page})=>{await page.goto(base+'/pose-lab.html');await expect(page.locator('#audioStart')).toBeVisible();await expect(page.locator('#audioReport')).toBeVisible();await expect(page.locator('#audioStatus')).toContainText('Audio analysis is off')});

test('all global navigation destinations exist on the local site',async({page,request})=>{await page.goto(base+'/index.html');const links=await page.locator('#aom-global-nav a').evaluateAll(nodes=>nodes.map(a=>a.getAttribute('href')).filter(Boolean));for(const href of [...new Set(links)]){const response=await request.get(new URL(href,base+'/index.html').href);expect(response.status(),href).toBe(200)}});
test('progression reviews can be exported and restored without duplicates',async({page})=>{await page.goto(base+'/progression-review.html');await page.locator('[name=notes]').fill('Controlled range with no pain');await page.locator('#form button').click();await expect(page.locator('#history .record')).toHaveCount(1);const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const fs=require('node:fs');const backup=fs.readFileSync(await download.path(),'utf8');const parsed=JSON.parse(backup);expect(parsed.rows).toHaveLength(1);page.once('dialog',d=>d.accept());await page.locator('#import').setInputFiles({name:'reviews.json',mimeType:'application/json',buffer:Buffer.from(backup)});await expect(page.locator('#history .record')).toHaveCount(1);await expect(page.locator('#result')).toContainText('Backup restored')});

test('local Academy backup restores missing records without overwriting existing values',async({page})=>{await page.goto(base+'/academy-backup.html');await page.evaluate(()=>localStorage.setItem('aom_qa_restore','before'));const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const fs=require('node:fs');const backup=fs.readFileSync(await download.path(),'utf8');await page.evaluate(()=>localStorage.removeItem('aom_qa_restore'));await page.locator('#import').setInputFiles({name:'academy.json',mimeType:'application/json',buffer:Buffer.from(backup)});page.once('dialog',d=>d.accept());await page.locator('#restore').click();await expect(page.locator('#status')).toContainText('Restored');expect(await page.evaluate(()=>localStorage.getItem('aom_qa_restore'))).toBe('before');await page.evaluate(()=>localStorage.setItem('aom_qa_restore','newer'));await page.locator('#restore').click();expect(await page.evaluate(()=>localStorage.getItem('aom_qa_restore'))).toBe('newer')});

test('backup rejects malformed JSON and unsupported backup formats',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{broken')});
 await expect(page.locator('#status')).toContainText('Cannot use backup');
 await expect(page.locator('#restore')).toBeDisabled();
 await page.locator('#import').setInputFiles({name:'wrong.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'other',data:{aom_test:'value'}}))});
 await expect(page.locator('#status')).toContainText('Unrecognized Academy backup format');
 await expect(page.locator('#restore')).toBeDisabled();
});
test('backup rejects non-Academy keys and oversized files',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.locator('#import').setInputFiles({name:'foreign.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'aom-local-backup-v1',data:{other_app_token:'secret'}}))});
 await expect(page.locator('#status')).toContainText('invalid Academy key');
 await expect(page.locator('#restore')).toBeDisabled();
 await page.locator('#import').setInputFiles({name:'huge.json',mimeType:'application/json',buffer:Buffer.alloc(5_000_001,32)});
 await expect(page.locator('#status')).toContainText('5 MB');
 await expect(page.locator('#restore')).toBeDisabled();
});
test('backup replacement requires explicit opt in and confirmation',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.evaluate(()=>localStorage.setItem('aom_qa_replace','current'));
 const payload=JSON.stringify({format:'aom-local-backup-v1',data:{aom_qa_replace:'backup'}});
 await page.locator('#import').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(payload)});
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 expect(await page.evaluate(()=>localStorage.getItem('aom_qa_replace'))).toBe('current');
 await page.locator('#overwrite').check();
 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('#restore').click();
 expect(await page.evaluate(()=>localStorage.getItem('aom_qa_replace'))).toBe('current');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 expect(await page.evaluate(()=>localStorage.getItem('aom_qa_replace'))).toBe('backup');
});
test('backup export excludes unrelated localStorage keys',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.evaluate(()=>{localStorage.setItem('aom_qa_private','academy');localStorage.setItem('unrelated_private_token','must_not_export')});
 const event=page.waitForEvent('download');await page.locator('#export').click();const file=await event;
 const fs=require('node:fs'),obj=JSON.parse(fs.readFileSync(await file.path(),'utf8'));
 expect(obj.data.aom_qa_private).toBe('academy');
 expect(obj.data).not.toHaveProperty('unrelated_private_token');
});
test('live camera does not start without explicit user action',async({page})=>{
 await page.addInitScript(()=>{window.__cameraCalls=0;const original=navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices);if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=(...args)=>{window.__cameraCalls++;return original?original(...args):Promise.reject(new Error('No camera'))}});
 await page.goto(base+'/live-coach.html');
 await expect(page.locator('#start')).toBeEnabled();
 expect(await page.evaluate(()=>window.__cameraCalls)).toBe(0);
 await expect(page.locator('#record')).toBeDisabled();
});
test('assessment notes are rendered as text, not executable HTML',async({page})=>{
 await page.goto(base+'/assessment-history.html');
 await page.locator('[name=skill]').fill('<img src=x onerror=alert(1)>');
 await page.locator('[name=notes]').fill('<script>window.__unsafe=1</script>');
 await page.locator('#form button').click();
 await expect(page.locator('.entry')).toHaveCount(1);
 expect(await page.evaluate(()=>window.__unsafe||0)).toBe(0);
 await expect(page.locator('.entry img')).toHaveCount(0);
});

test('guided coaching sequence progresses without camera or false certification',async({page})=>{
 await page.goto(base+'/live-coach.html');
 await expect(page.locator('#sequenceStatus')).toContainText('0 of 3');
 await page.locator('#sequenceStart').click();
 await expect(page.locator('#mode')).toHaveValue('stance');
 await expect(page.locator('#sequenceNext')).toBeEnabled();
 await page.locator('#sequenceNext').click();
 await expect(page.locator('#mode')).toHaveValue('alignment');
 await page.locator('#sequenceNext').click();
 await expect(page.locator('#mode')).toHaveValue('balance');
 await page.locator('#sequenceNext').click();
 await expect(page.locator('#sequenceNext')).toBeDisabled();
 await expect(page.locator('#sequenceSummary')).toContainText('skipped');
 await expect(page.locator('#sequenceStatus')).toContainText('0 of 3');
 await page.locator('#sequenceReset').click();
 await expect(page.locator('#sequenceSummary')).toContainText('Sequence:');
});

test('guided coaching saves only observation metadata locally',async({page})=>{
 await page.goto(base+'/live-coach.html');
 await expect(page.locator('#saveSequence')).toBeDisabled();
 await page.locator('#sequenceStart').click();
 await page.locator('#sequenceNext').click();
 await expect(page.locator('#saveSequence')).toBeEnabled();
 await page.locator('#saveSequence').click();
 const rows=await page.evaluate(()=>JSON.parse(localStorage.getItem('aom_guided_coach_sessions_v1')));
 expect(rows).toHaveLength(1);
 expect(rows[0].results[0]).toEqual({focus:'Grounded stance',status:'skipped'});
 expect(JSON.stringify(rows)).not.toMatch(/landmarks|coordinates|video_data|audio_data/);
 await page.locator('#sequenceReset').click();
 await expect(page.locator('#saveSequence')).toBeDisabled();
});

test('motion comparison validates local exports and renders identical reference safely',async({page})=>{
 await page.goto(base+'/motion-comparison.html');
 await expect(page.locator('#results')).toBeHidden();
 const observations=Array.from({length:25},(_,i)=>({time_seconds:i*.25,landmarks_visible:28,metrics:{shoulder_width_normalized:.23,hip_lateral_offset_relative_to_shoulders:Math.sin(i/24*Math.PI*2),hip_vertical_offset_relative_to_shoulders:1.2,shoulder_tilt_degrees:3,hip_tilt_degrees:4}}));
 const data=Buffer.from(JSON.stringify({format:'aom-pose-observations-v1',observations}));
 await page.locator('#reference').setInputFiles({name:'reference.json',mimeType:'application/json',buffer:data});
 await page.locator('#practice').setInputFiles({name:'practice.json',mimeType:'application/json',buffer:data});
 await page.locator('#compare').click();
 await expect(page.locator('#status')).toContainText('Comparison ready');
 await expect(page.locator('#results')).toBeVisible();
 await expect(page.locator('#metrics tr')).toHaveCount(4);
 await expect(page.locator('#chart polyline')).toHaveCount(2);
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const download=await downloadPromise;expect(download.suggestedFilename()).toBe('academy-motion-comparison.json');
});
test('motion comparison rejects invalid files without showing stale results',async({page})=>{
 await page.goto(base+'/motion-comparison.html');
 await page.locator('#reference').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await page.locator('#practice').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await page.locator('#compare').click();
 await expect(page.locator('#status')).toContainText('Comparison unavailable');
 await expect(page.locator('#results')).toBeHidden();
});

test('paired model-estimated 3D avatars require explicit world-landmark exports',async({page})=>{
 await page.goto(base+'/motion-comparison.html');
 const world=Array.from({length:33},(_,i)=>({x:i*.02,y:(i%10)*.04,z:i*.01,visibility:.95}));
 const observations=Array.from({length:25},(_,i)=>({time_seconds:i*.25,landmarks_visible:28,world,metrics:{shoulder_width_normalized:.23,hip_lateral_offset_relative_to_shoulders:Math.sin(i/24*Math.PI*2),hip_vertical_offset_relative_to_shoulders:1.2,shoulder_tilt_degrees:3,hip_tilt_degrees:4}}));
 const json=Buffer.from(JSON.stringify({format:'aom-pose-observations-v1',observations}));
 await page.locator('#reference').setInputFiles({name:'reference.json',mimeType:'application/json',buffer:json});
 await page.locator('#practice').setInputFiles({name:'practice.json',mimeType:'application/json',buffer:json});
 await page.locator('#compare').click();
 await expect(page.locator('#avatarReplay')).toBeVisible();
 await page.locator('#avatarPhase').evaluate(el=>{el.value='50';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await expect(page.locator('#avatarFrameStatus')).toContainText('50%');
 await page.locator('#avatarYaw').evaluate(el=>{el.value='90';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await page.locator('#playAvatars').click();
 await page.locator('#pauseAvatars').click();
 await expect(page.locator('#avatarReplay')).toBeVisible();
});
test('Live Coach 3D avatar is opt in and off before camera permission',async({page})=>{
 await page.goto(base+'/live-coach.html');
 await expect(page.locator('#avatarToggle')).toHaveAttribute('aria-pressed','false');
 await expect(page.locator('#avatarCanvas')).toBeHidden();
 await page.locator('#avatarToggle').click();
 await expect(page.locator('#avatarCanvas')).toBeVisible();
 await expect(page.locator('#avatarStatus')).toContainText('Waiting for camera');
 await page.locator('#avatarToggle').click();
 await expect(page.locator('#avatarCanvas')).toBeHidden();
});

test('tempo-aware comparison is opt-in and explicitly not a grade',async({page})=>{
 await page.goto(base+'/motion-comparison.html');
 const observations=Array.from({length:25},(_,i)=>({time_seconds:i*.25,landmarks_visible:29,metrics:{shoulder_width_normalized:.22,hip_lateral_offset_relative_to_shoulders:Math.sin(i/24*Math.PI*2),hip_vertical_offset_relative_to_shoulders:1.2,shoulder_tilt_degrees:2,hip_tilt_degrees:3}}));
 const buffer=Buffer.from(JSON.stringify({format:'aom-pose-observations-v1',observations}));
 await page.locator('#reference').setInputFiles({name:'reference.json',mimeType:'application/json',buffer});
 await page.locator('#practice').setInputFiles({name:'practice.json',mimeType:'application/json',buffer});
 await page.locator('#alignmentMethod').selectOption('tempo-aware');
 await page.locator('#compare').click();
 await expect(page.locator('#status')).toContainText('Comparison ready');
 await expect(page.locator('#durations')).toContainText('tempo-aware');
 await expect(page.locator('#results')).toContainText('not a movement grade');
});

test('technique calibration lab requires instructor evidence and refuses automatic grades',async({page})=>{
 await page.goto(base+'/technique-calibration.html');
 await expect(page.locator('#gradingStatus')).toContainText('not_calibrated');
 await page.locator('#checkRubric').click();
 await expect(page.locator('#rubricStatus')).toContainText('Valid rubric structure');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#downloadTemplate').click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('academy-instructor-labels-template.json');
 const examples=Array.from({length:50},(_,i)=>({id:'take-'+i,performer_id:'performer-'+i,camera_setup:i%2?'front tripod':'side tripod',instructor_id:i%2?'teacher-a':'teacher-b',split:i<30?'train':'validation',labels:{posture:2,control:2,support:2,stability:2}}));
 await page.locator('#dataset').setInputFiles({name:'labels.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'aom-technique-labels-v1',skill:'Supported balance fundamentals',examples}))});
 await page.locator('#evaluate').click();
 await expect(page.locator('#evaluation')).toContainText('NOT READY');
 await expect(page.locator('#evaluation')).toContainText('No automated grade issued');
});

test('Live Coach animated character can switch to skeletal view and outfit without camera',async({page})=>{
 await page.goto(base+'/live-coach.html');
 await expect(page.locator('#avatarStyle')).toHaveValue('character');
 await page.locator('#avatarToggle').click();
 await expect(page.locator('#avatarCanvas')).toBeVisible();
 await page.locator('#avatarPalette').selectOption('sage');
 await page.locator('#avatarStyle').selectOption('skeleton');
 await expect(page.locator('#avatarStyle')).toHaveValue('skeleton');
 await expect(page.locator('#avatarToggle')).toHaveAttribute('aria-pressed','true');
 await page.locator('#avatarToggle').click();
 await expect(page.locator('#avatarCanvas')).toBeHidden();
});
test('paired motion avatars provide animated character and skeleton styles',async({page})=>{
 await page.goto(base+'/motion-comparison.html');
 const world=Array.from({length:33},(_,i)=>({x:i*.02,y:(i%10)*.04,z:i*.01,visibility:.95}));
 world[11]={x:-.2,y:-.5,z:0,visibility:1};world[12]={x:.2,y:-.5,z:0,visibility:1};world[23]={x:-.1,y:0,z:0,visibility:1};world[24]={x:.1,y:0,z:0,visibility:1};
 const observations=Array.from({length:25},(_,i)=>({time_seconds:i*.25,landmarks_visible:29,world,metrics:{shoulder_width_normalized:.25,hip_lateral_offset_relative_to_shoulders:Math.sin(i/24*Math.PI*2),hip_vertical_offset_relative_to_shoulders:1.1,shoulder_tilt_degrees:2,hip_tilt_degrees:3}}));
 const buffer=Buffer.from(JSON.stringify({format:'aom-pose-observations-v1',observations}));
 await page.locator('#reference').setInputFiles({name:'reference.json',mimeType:'application/json',buffer});
 await page.locator('#practice').setInputFiles({name:'practice.json',mimeType:'application/json',buffer});
 await page.locator('#compare').click();
 await expect(page.locator('#avatarReplay')).toBeVisible();
 await expect(page.locator('#avatarStyle')).toHaveValue('character');
 await page.locator('#avatarPalette').selectOption('midnight');
 await page.locator('#avatarStyle').selectOption('skeleton');
 await expect(page.locator('#avatarFrameStatus')).toContainText('Model-estimated');
});

test('skinned avatar studio exposes local rig import and stable visual inspection controls',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await expect(page.locator('#avatarFile')).toHaveAttribute('accept',/glb/);
 await expect(page.locator('#poseFile')).toHaveAttribute('type','file');
 await expect(page.locator('#skinTone')).toBeVisible();
 await page.locator('#skinTone').selectOption('0x5e392d');
 await page.locator('#palette').selectOption('sage');
 await page.locator('#yaw').fill('90');
 await expect(page.locator('#yaw')).toHaveValue('90');
 await expect(page.locator('#status')).toContainText('Waiting');
 await page.screenshot({path:'test-results/skinned-avatar-studio-mobile.png',fullPage:true});
});

test('licensed avatar demo requires opt-in and provides built-in dance preview',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await expect(page.locator('#loadMichelle')).toBeVisible();
 await expect(page.locator('#demoDance')).toBeDisabled();
 await expect(page.locator('#avatarFile')).toHaveAttribute('type','file');
 await expect(page.locator('#status')).toContainText('Waiting');
});

test('avatar studio camera presets and prototype reset work on mobile',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await expect(page.locator('#characterLabel')).toContainText('Prototype');
 await page.locator('#frontView').click();await expect(page.locator('#yaw')).toHaveValue('0');
 await page.locator('#sideView').click();await expect(page.locator('#yaw')).toHaveValue('90');
 await page.locator('#backView').click();await expect(page.locator('#yaw')).toHaveValue('180');
 await page.locator('#resetView').click();await expect(page.locator('#yaw')).toHaveValue('25');
 await page.locator('#resetCharacter').click();await expect(page.locator('#characterLabel')).toContainText('Prototype');
 await expect(page.locator('#status')).toContainText('restored');
});

test('avatar visual frames and rendering performance budget on mobile',async({page},testInfo)=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/skinned-avatar-studio.html');
 await expect(page.locator('#stage')).toBeVisible();
 await page.waitForFunction(()=>{const c=document.querySelector('#stage');return c&&c.width>0&&c.height>0});
 await page.locator('#frontView').click();
 await page.locator('#stage').screenshot({path:testInfo.outputPath('avatar-front.png')});
 await page.locator('#sideView').click();
 await page.locator('#stage').screenshot({path:testInfo.outputPath('avatar-side.png')});
 await page.locator('#backView').click();
 await page.locator('#stage').screenshot({path:testInfo.outputPath('avatar-back.png')});
 await page.locator('#resetView').click();
 const metrics=await page.evaluate(async()=>{
  const times=[];let previous=performance.now();
  for(let i=0;i<90;i++)await new Promise(resolve=>requestAnimationFrame(now=>{if(i>0)times.push(now-previous);previous=now;resolve()}));
  times.sort((a,b)=>a-b);
  const resources=performance.getEntriesByType('resource');
  return {medianFrameMs:times[Math.floor(times.length/2)],p95FrameMs:times[Math.floor(times.length*.95)],longFrames:times.filter(t=>t>50).length,resources:resources.length,webgl:!!document.querySelector('#stage').getContext('webgl2')};
 });
 const fs=require('node:fs');fs.writeFileSync(testInfo.outputPath('avatar-performance.json'),JSON.stringify(metrics,null,2));
 expect(errors).toEqual([]);
 expect(metrics.webgl).toBe(true);
 expect(metrics.medianFrameMs).toBeLessThan(50);
 expect(metrics.p95FrameMs).toBeLessThan(120);
});

test('avatar appearance presets and browser-local save/restore',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await page.locator('#appearancePreset').selectOption('ballet');
 await expect(page.locator('#bodyHeight')).toHaveValue('1.06');
 await expect(page.locator('#hairStyle')).toHaveValue('bun');
 await page.locator('#saveAppearance').click();
 await expect(page.locator('#appearanceStatus')).toContainText('saved');
 await page.locator('#appearancePreset').selectOption('contemporary');
 await expect(page.locator('#hairStyle')).toHaveValue('puff');
 await page.locator('#restoreAppearance').click();
 await expect(page.locator('#hairStyle')).toHaveValue('bun');
 await page.reload();
 await page.locator('#restoreAppearance').click();
 await expect(page.locator('#bodyHeight')).toHaveValue('1.06');
 await page.locator('#defaultAppearance').click();
 await expect(page.locator('#appearancePreset')).toHaveValue('studio');
});

test('studio lighting, accessible camera controls and touch rotation',async({page},testInfo)=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await page.locator('#lightingPreset').selectOption('silhouette');
 await expect(page.locator('#lightingPreset')).toHaveValue('silhouette');
 await page.locator('#lightingPreset').selectOption('bright');
 await expect(page.locator('#lightingPreset')).toHaveValue('bright');
 const stage=page.locator('#stage');
 await expect(stage).toHaveAttribute('tabindex','0');
 // The canvas must own touch gestures; pan-y can trigger pointercancel during drag.
 await expect(stage).toHaveCSS('touch-action','none');
 await stage.focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('#yaw')).toHaveValue('35');
 await page.keyboard.press('0');
 await expect(page.locator('#yaw')).toHaveValue('25');
 // Record the actual pointer stream so a failed mobile CI run identifies delivery vs cancellation.
 await stage.evaluate(el=>{window.__studioTouchEvents=[];for(const type of ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture'])el.addEventListener(type,e=>window.__studioTouchEvents.push({type,id:e.pointerId,x:Math.round(e.clientX),y:Math.round(e.clientY)}))});
 await stage.scrollIntoViewIfNeeded();
 const bounds=await stage.boundingBox();expect(bounds).toBeTruthy();
 // Chromium mobile emulation may suppress mouse drags. Exercise genuine touch events instead.
 const client=await page.context().newCDPSession(page);
 const y=Math.round(bounds.y+bounds.height*.4),start=Math.round(bounds.x+bounds.width*.4),end=Math.round(bounds.x+bounds.width*.6);
 await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y,id:1}]});
 for(let x=start+10;x<=end;x+=10){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y,id:1}]});await page.waitForTimeout(20)}
 await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const events=await page.evaluate(()=>window.__studioTouchEvents||[]);
 const finalYaw=Number(await page.locator('#yaw').inputValue());
 const diagnostics={start,end,y,bounds,events,finalYaw,devicePixelRatio:await page.evaluate(()=>devicePixelRatio),touchAction:await stage.evaluate(el=>getComputedStyle(el).touchAction)};
 await testInfo.attach('studio-touch-rotation-diagnostics',{body:Buffer.from(JSON.stringify(diagnostics,null,2)),contentType:'application/json'});
 expect(events.some(e=>e.type==='pointerdown'),'Touch must reach the studio canvas as pointerdown; events='+JSON.stringify(events)).toBe(true);
 expect(events.some(e=>e.type==='pointermove'),'Touch drag must generate pointermove; events='+JSON.stringify(events)).toBe(true);
 expect(events.some(e=>e.type==='pointercancel'),'Browser must not cancel studio drag; events='+JSON.stringify(events)).toBe(false);
 expect(finalYaw,'Pointer drag must change yaw from 25; events='+JSON.stringify(events)).not.toBe(25);
});
test('studio rejects unsupported GLB with actionable error',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await page.locator('#avatarFile').setInputFiles({name:'bad.glb',mimeType:'model/gltf-binary',buffer:Buffer.from('bad')});
 await expect(page.locator('#status')).toContainText('GLB load failed');
 await expect(page.locator('#status')).toHaveAttribute('data-kind','error');
});

test('studio playback speed loop frame stepping and restart',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 const world=Array.from({length:33},()=>({x:0,y:0,z:0,visibility:1}));
 for(const i of [11,13,15,23,25,27])world[i].x=-.2;
 for(const i of [12,14,16,24,26,28])world[i].x=.2;
 for(const i of [11,12,13,14,15,16])world[i].y=-.7;
 for(const i of [25,26])world[i].y=.7;
 for(const i of [27,28])world[i].y=1.5;
 const observations=Array.from({length:10},(_,i)=>({world:world.map(p=>({...p,x:p.x+i*.005}))}));
 await page.locator('#poseFile').setInputFiles({name:'pose.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'aom-pose-observations-v1',observations}))});
 await expect(page.locator('#restart')).toBeEnabled();
 await page.locator('#playSpeed').selectOption('.5');
 await page.locator('#loopMotion').uncheck();
 await page.locator('#stepForward').click();
 expect(Number(await page.locator('#phase').inputValue())).toBeGreaterThan(0);
 await page.locator('#restart').click();
 await expect(page.locator('#phase')).toHaveValue('0');
 await page.locator('#play').click();
 await expect(page.locator('#play')).toContainText('Playing');
 await page.locator('#pause').click();
 await expect(page.locator('#play')).toContainText('Play');
});

test('Academy workflow navigation and local-only studio session notes',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await expect(page.locator('#aom-studio-workflow')).toBeVisible();
 await expect(page.locator('#practiceNote')).toBeVisible();
 await page.locator('#practiceNote').fill('Reviewed turns');
 await page.locator('#savePracticeSession').click();
 await expect(page.locator('#practiceHistory')).toContainText('Saved');
 await page.goto(base+'/local-studio-sessions.html');
 await expect(page.locator('#sessions')).toContainText('Reviewed turns');
 await expect(page.locator('#status')).toContainText('local session');
});
test('Pose Lab direct transfer controls remain opt-in',async({page})=>{
 await page.goto(base+'/pose-lab.html');
 await expect(page.locator('#sendAvatar')).toBeDisabled();
 await expect(page.locator('#sendCompare')).toBeDisabled();
 await expect(page.locator('#includeWorld')).not.toBeChecked();
 await expect(page.locator('#aom-studio-workflow')).toBeVisible();
});
test('Motion Comparison imports explicit same-tab Pose Lab handoff',async({page})=>{
 await page.goto(base+'/pose-lab.html');
 const data={format:'aom-pose-observations-v1',observations:Array.from({length:15},(_,i)=>({time_seconds:i*.4,landmarks_visible:29,metrics:{hip_tilt_degrees:1}}))};
 await page.evaluate(value=>window.AOMIntegration.handoff(sessionStorage,value),data);
 await page.goto(base+'/motion-comparison.html?from=pose-lab');
 expect(await page.locator('#practice').evaluate(el=>el.files.length)).toBe(1);
 await expect(page.locator('#handoffStatus')).toContainText('Transferred');
 await page.locator('#handoffReference').click();
 await expect(page.locator('#handoffStatus')).toContainText('reference');
 await page.locator('#clearHandoff').click();
 await expect(page.locator('#handoffStatus')).toContainText('cleared');
});

test('Android phone and narrow viewport avatar layout snapshots and controls',async({page},testInfo)=>{
 for(const [width,height,label] of [[360,740,'android-compact'],[412,915,'android-large'],[768,1024,'tablet']]){
  await page.setViewportSize({width,height});
  await page.goto(base+'/skinned-avatar-studio.html');
  await expect(page.locator('#stage')).toBeVisible();
  await expect(page.locator('#frontView')).toBeVisible();
  await expect(page.locator('#appearancePreset')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow,label).toBeLessThanOrEqual(2);
  await page.locator('#sideView').click();
  await expect(page.locator('#yaw')).toHaveValue('90');
  await page.locator('.stage-wrap').screenshot({path:testInfo.outputPath('avatar-'+label+'-side.png')});
  await page.locator('#resetView').click();
  await page.locator('.stage-wrap').screenshot({path:testInfo.outputPath('avatar-'+label+'-front-quarter.png')});
 }
});
test('mobile invalid handoff and session backup fail safely',async({page})=>{
 await page.goto(base+'/local-studio-sessions.html');
 await page.locator('#import').setInputFiles({name:'malformed.json',mimeType:'application/json',buffer:Buffer.from('{bad')});
 await expect(page.locator('#status')).toContainText('Import rejected');
 await expect(page.locator('#sessions li')).toHaveCount(0);
 await page.goto(base+'/motion-comparison.html?from=pose-lab');
 await expect(page.locator('#handoffStatus')).toContainText('Choose local files');
 await page.locator('#handoffPractice').click();
 await expect(page.locator('#handoffStatus')).toContainText('No recent temporary');
});

// Daily-use journey: the same browser must preserve an actual weekly studio completion
// and reflection across reloads and expose that completion in the Studio Record.
test('daily studio completion and reflection survive navigation to Studio Record',async({page})=>{
 await page.goto(base+'/weekly-studio.html?week=3');
 await expect(page.locator('#tabs button')).toHaveCount(7);
 await page.locator('.day.active .check input[type=checkbox]').check();
 await expect(page.locator('#progress')).toContainText('1 of 7');
 await page.locator('#tabs button').nth(6).click();
 await page.locator('#reflection').fill('Week 3: controlled movement, supported variation.');
 await page.reload();
 await expect(page.locator('#progress')).toContainText('1 of 7');
 await page.locator('#tabs button').nth(6).click();
 await expect(page.locator('#reflection')).toHaveValue('Week 3: controlled movement, supported variation.');
 await page.goto(base+'/studio-record.html');
 await expect(page.locator('#weeks tr').filter({has:page.locator('td').filter({hasText:/^03$/})})).toContainText('1 / 7 days');
 await page.goto(base+'/weekly-studio.html?week=3');
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeChecked();
});

// Backup acceptance for a real weekly-studio record rather than a synthetic test key.
test('daily studio progress survives Academy export, local loss, and restore',async({page})=>{
 await page.goto(base+'/weekly-studio.html?week=4');
 await page.locator('.day.active .check input[type=checkbox]').check();
 await expect(page.locator('#progress')).toContainText('1 of 7');
 const key='aom_weekly_studio_v1_4';
 await page.goto(base+'/academy-backup.html');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const download=await downloadPromise;
 const backup=JSON.parse(require('node:fs').readFileSync(await download.path(),'utf8'));
 expect(backup.format).toBe('aom-local-backup-v1');
 expect(JSON.parse(backup.data[key]).done0).toBe(true);
 await page.evaluate(k=>localStorage.removeItem(k),key);
 await page.goto(base+'/weekly-studio.html?week=4');
 await expect(page.locator('#progress')).toContainText('0 of 7');
 await page.goto(base+'/academy-backup.html');
 await page.locator('#import').setInputFiles({name:'studio-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await expect(page.locator('#restore')).toBeEnabled();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 await expect(page.locator('#status')).toContainText('Restored');
 await page.goto(base+'/weekly-studio.html?week=4');
 await expect(page.locator('#progress')).toContainText('1 of 7');
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeChecked();
 await page.goto(base+'/studio-record.html');
 await expect(page.locator('#weeks tr').filter({has:page.locator('td').filter({hasText:/^04$/})})).toContainText('1 / 7 days');
});

// A stale backup must never replace newer daily progress unless the user explicitly opts in.
test('Academy backup protects newer studio progress unless overwrite is explicitly selected',async({page})=>{
 const key='aom_weekly_studio_v1_5';
 await page.goto(base+'/weekly-studio.html?week=5');
 await page.locator('.day.active .check input[type=checkbox]').check();
 await page.goto(base+'/academy-backup.html');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const download=await downloadPromise;
 const backup=JSON.parse(require('node:fs').readFileSync(await download.path(),'utf8'));
 expect(JSON.parse(backup.data[key]).done0).toBe(true);
 await page.evaluate(k=>localStorage.setItem(k,JSON.stringify({done0:false,done1:true})),key);
 const upload=()=>page.locator('#import').setInputFiles({name:'older-studio.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await upload();
 await expect(page.locator('#status')).toContainText('Existing records are protected');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key))).toEqual({done0:false,done1:true});
 await page.locator('#overwrite').check();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),key)).done0).toBe(true);
 await page.goto(base+'/weekly-studio.html?week=5');
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeChecked();
});

// A restore must not leak progress into another week or mutate newer local records.
test('restoring one studio week preserves separate weeks and respects cancelled confirmation',async({page})=>{
 const week6='aom_weekly_studio_v1_6',week7='aom_weekly_studio_v1_7';
 await page.goto(base+'/weekly-studio.html?week=6');
 await page.locator('.day.active .check input[type=checkbox]').check();
 await page.goto(base+'/academy-backup.html');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const backup=JSON.parse(require('node:fs').readFileSync(await (await downloadPromise).path(),'utf8'));
 expect(JSON.parse(backup.data[week6]).done0).toBe(true);
 await page.evaluate(([a,b])=>{localStorage.removeItem(a);localStorage.setItem(b,JSON.stringify({done0:false,done2:true}))},[week6,week7]);
 await page.locator('#import').setInputFiles({name:'week6-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('#restore').click();
 expect(await page.evaluate(k=>localStorage.getItem(k),week6)).toBeNull();
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),week6)).done0).toBe(true);
 expect(JSON.parse(await page.evaluate(k=>localStorage.getItem(k),week7))).toEqual({done0:false,done2:true});
 await page.goto(base+'/weekly-studio.html?week=7');
 await expect(page.locator('#progress')).toContainText('1 of 7');
 await expect(page.locator('.day.active .check input[type=checkbox]')).not.toBeChecked();
 await page.goto(base+'/weekly-studio.html?week=6');
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeChecked();
});

// Never claim that a daily studio record was saved if browser storage rejects writes.
test('weekly studio clearly warns when local storage rejects a save',async({page})=>{
 await page.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(key==='aom_weekly_studio_v1_3')throw new DOMException('Storage quota exceeded','QuotaExceededError');
   return original.call(this,key,value);
  };
 });
 await page.goto(base+'/weekly-studio.html?week=3');
 await page.locator('.day.active .check input[type=checkbox]').check();
 await expect(page.locator('#progress')).toContainText('Not saved: browser storage is unavailable');
 await expect(page.locator('#progress')).toContainText('Export this week');
 await page.reload();
 await expect(page.locator('#progress')).toContainText('0 of 7');
});

test('corrupt weekly studio record is reported and never silently overwritten',async({page})=>{
 const key='aom_weekly_studio_v1_3',broken='{corrupt';
 await page.goto(base+'/weekly-studio.html?week=3');
 await page.evaluate(([k,v])=>localStorage.setItem(k,v),[key,broken]);
 await page.reload();
 await expect(page.locator('#progress')).toContainText('Saved record could not be read');
 await expect(page.locator('#export')).toBeDisabled();
 await expect(page.locator('#export')).toHaveAttribute('title',/unreadable record/);
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeDisabled();
 await page.locator('#tabs button').last().click();
 await expect(page.locator('.day.active textarea')).toBeDisabled();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(broken);
 await expect(page.locator('#progress')).toContainText('Saved record could not be read');
});

test('weekly studio recovers after a transient browser storage failure',async({page})=>{
 await page.addInitScript(()=>{
  const original=Storage.prototype.setItem;
  let failures=1;
  Storage.prototype.setItem=function(key,value){
   if(key==='aom_weekly_studio_v1_8'&&failures-->0)throw new DOMException('Quota exceeded','QuotaExceededError');
   return original.call(this,key,value);
  };
 });
 await page.goto(base+'/weekly-studio.html?week=8');
 await page.locator('.day.active .check input[type=checkbox]').check();
 await expect(page.locator('#progress')).toContainText('Not saved: browser storage is unavailable');
 await page.locator('#tabs button').nth(1).click();
 await page.locator('.day.active .check input[type=checkbox]').check();
 await expect(page.locator('#progress')).toContainText('2 of 7');
 await expect(page.locator('#progress')).toContainText('saved on this device');
 await page.reload();
 await expect(page.locator('#progress')).toContainText('2 of 7');
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeChecked();
 await page.locator('#tabs button').nth(1).click();
 await expect(page.locator('.day.active .check input[type=checkbox]')).toBeChecked();
});


test('Studio Record warns about unreadable weekly data and preserves its raw bytes in recovery export',async({page})=>{
 const key='aom_weekly_studio_v1_5',broken='{unreadable-week-five';
 await page.goto(base+'/studio-record.html');
 await page.evaluate(([k,v])=>localStorage.setItem(k,v),[key,broken]);
 await page.reload();
 await expect(page.locator('#unreadableWarning')).toContainText('1 local Academy record');
 const row=page.locator('#weeks tr').nth(4);
 await expect(row).toContainText('Unreadable — restore backup');
 await expect(page.locator('.tile').filter({hasText:'Daily studio weeks'})).toContainText('0 / 14');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const download=await downloadPromise;
 const snapshot=JSON.parse(require('node:fs').readFileSync(await download.path(),'utf8'));
 expect(snapshot.schema).toBe('aom-local-snapshot-v2');
 expect(snapshot.unreadable_keys).toContain(key);
 expect(snapshot.raw_records[key]).toBe(broken);
 expect(snapshot.records[key]).toBeNull();
 expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(broken);
});

test('Studio Record distinguishes saved null and malformed early-week records from missing records',async({page})=>{
 await page.goto(base+'/studio-record.html');
 const originals=[['aom_week_one_checks_v1','null'],['aom_week_two_checks_v1','[1,2]'],['aom_musicality_pathway_v1','{broken']];
 await page.evaluate(entries=>{for(const [key,value] of entries)localStorage.setItem(key,value)},originals);
 await page.reload();
 await expect(page.locator('#unreadableWarning')).toContainText('3 local Academy record(s)');
 await expect(page.locator('#weeks tr').nth(0)).toContainText('Unreadable — restore backup');
 await expect(page.locator('#weeks tr').nth(1)).toContainText('Unreadable — restore backup');
 await expect(page.locator('.tile').filter({hasText:'Week 1 saved items'})).toContainText('Unreadable');
 await expect(page.locator('.tile').filter({hasText:'Week 2 saved items'})).toContainText('Unreadable');
 await expect(page.locator('.tile').filter({hasText:'Musicality lessons'})).toContainText('Unreadable');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const snapshot=JSON.parse(require('node:fs').readFileSync(await (await downloadPromise).path(),'utf8'));
 for(const [key,value] of originals){
  expect(snapshot.unreadable_keys).toContain(key);
  expect(snapshot.raw_records[key]).toBe(value);
  expect(await page.evaluate(k=>localStorage.getItem(k),key)).toBe(value);
 }
});

test('Studio Record flags corrupt semester and curriculum records instead of claiming zero progress',async({page})=>{
 await page.goto(base+'/studio-record.html');
 const originals=[['aom_term_one_progress_v1','{broken-term'],['aom_term1_curriculum_v1','null']];
 await page.evaluate(entries=>{for(const [key,value] of entries)localStorage.setItem(key,value)},originals);
 await page.reload();
 await expect(page.locator('#unreadableWarning')).toContainText('2 local Academy record(s)');
 await expect(page.locator('#weeks tr').first()).toContainText('Unreadable — restore backup');
 await expect(page.locator('#other')).toContainText('Curriculum checklist: unreadable — restore backup.');
 const downloadPromise=page.waitForEvent('download');
 await page.locator('#export').click();
 const snapshot=JSON.parse(require('node:fs').readFileSync(await (await downloadPromise).path(),'utf8'));
 for(const [key,value] of originals){
  expect(snapshot.unreadable_keys).toContain(key);
  expect(snapshot.raw_records[key]).toBe(value);
 }
});

test('Studio Record discloses unreadable weekly entries excluded from saved-week totals',async({page})=>{
 await page.goto(base+'/studio-record.html');
 await page.evaluate(()=>{localStorage.setItem('aom_weekly_studio_v1_3','{broken');localStorage.setItem('aom_weekly_studio_v1_4',JSON.stringify({done0:true}))});
 await page.reload();
 const tile=page.locator('.tile').filter({hasText:'Daily studio weeks'});
 await expect(tile).toContainText('1 / 14');
 await expect(tile).toContainText('1 unreadable weekly record(s) excluded');
 await expect(page.locator('#weeks tr').nth(2)).toContainText('Unreadable — restore backup');
 await expect(page.locator('#weeks tr').nth(3)).toContainText('1 / 7 days');
});

test('Academy backup rolls back earlier writes if a later storage write fails',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.evaluate(()=>localStorage.setItem('aom_rollback_existing','original'));
 const backup={format:'aom-local-backup-v1',data:{aom_rollback_existing:'replacement',aom_rollback_added:'new-value',aom_rollback_new:'trigger-failure'}};
 await page.locator('#import').setInputFiles({name:'rollback.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await page.locator('#overwrite').check();
 await page.evaluate(()=>{
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
   if(key==='aom_rollback_new')throw new DOMException('Simulated quota failure','QuotaExceededError');
   return original.call(this,key,value);
  };
 });
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 await expect(page.locator('#status')).toContainText('Changes from this attempt were rolled back');
 expect(await page.evaluate(()=>localStorage.getItem('aom_rollback_existing'))).toBe('original');
 expect(await page.evaluate(()=>localStorage.getItem('aom_rollback_added'))).toBeNull();
 expect(await page.evaluate(()=>localStorage.getItem('aom_rollback_new'))).toBeNull();
});

test('Academy backup ignores an earlier file read that finishes after a newer selection',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.evaluate(()=>{
  const original=File.prototype.text;
  let first=true;
  File.prototype.text=function(){
   if(first){first=false;return new Promise(resolve=>{window.finishOldBackup=()=>resolve(JSON.stringify({format:'aom-local-backup-v1',data:{aom_old_selection:'old'}}))})}
   return original.call(this);
  };
 });
 const input=page.locator('#import');
 await input.setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await input.setInputFiles({name:'new.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'aom-local-backup-v1',data:{aom_new_selection:'new'}}))});
 await expect(page.locator('#status')).toContainText('Ready to restore 1 local Academy keys');
 await page.evaluate(()=>window.finishOldBackup());
 await expect(page.locator('#status')).toContainText('Ready to restore 1 local Academy keys');
 page.once('dialog',d=>d.accept());
 await page.locator('#restore').click();
 expect(await page.evaluate(()=>localStorage.getItem('aom_new_selection'))).toBe('new');
 expect(await page.evaluate(()=>localStorage.getItem('aom_old_selection'))).toBeNull();
});

test('Academy backup ignores an old file read error after a newer valid selection',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.evaluate(()=>{
  const original=File.prototype.text;
  let first=true;
  File.prototype.text=function(){
   if(first){first=false;return new Promise((resolve,reject)=>{window.failOldBackup=()=>reject(Error('Delayed old file failure'))})}
   return original.call(this);
  };
 });
 const input=page.locator('#import');
 await input.setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from('{}')});
 await input.setInputFiles({name:'new.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({format:'aom-local-backup-v1',data:{aom_current_backup:'safe'}}))});
 await expect(page.locator('#status')).toContainText('Ready to restore 1 local Academy keys');
 await page.evaluate(()=>window.failOldBackup());
 await expect(page.locator('#status')).toContainText('Ready to restore 1 local Academy keys');
 await expect(page.locator('#restore')).toBeEnabled();
 page.once('dialog',d=>d.accept());
 await page.locator('#restore').click();
 expect(await page.evaluate(()=>localStorage.getItem('aom_current_backup'))).toBe('safe');
});

test('Academy backup requires confirmation before replacing an existing record',async({page})=>{
 await page.goto(base+'/academy-backup.html');
 await page.evaluate(()=>localStorage.setItem('aom_confirm_replace','current'));
 const backup={format:'aom-local-backup-v1',data:{aom_confirm_replace:'older'}};
 await page.locator('#import').setInputFiles({name:'replace.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await expect(page.locator('#restore')).toBeEnabled();
 await page.locator('#overwrite').check();
 page.once('dialog',dialog=>{expect(dialog.message()).toContain('Replace 1 existing values');dialog.dismiss()});
 await page.locator('#restore').click();
 expect(await page.evaluate(()=>localStorage.getItem('aom_confirm_replace'))).toBe('current');
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#restore').click();
 await expect(page.locator('#status')).toContainText('Restored 1 keys');
 expect(await page.evaluate(()=>localStorage.getItem('aom_confirm_replace'))).toBe('older');
});
