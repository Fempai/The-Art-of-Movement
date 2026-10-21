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

test('studio lighting, accessible camera controls and touch rotation',async({page})=>{
 await page.goto(base+'/skinned-avatar-studio.html');
 await page.locator('#lightingPreset').selectOption('silhouette');
 await expect(page.locator('#lightingPreset')).toHaveValue('silhouette');
 await page.locator('#lightingPreset').selectOption('bright');
 await expect(page.locator('#lightingPreset')).toHaveValue('bright');
 const stage=page.locator('#stage');
 await expect(stage).toHaveAttribute('tabindex','0');
 await stage.focus();
 await page.keyboard.press('ArrowRight');
 await expect(page.locator('#yaw')).toHaveValue('35');
 await page.keyboard.press('0');
 await expect(page.locator('#yaw')).toHaveValue('25');
 const bounds=await stage.boundingBox();expect(bounds).toBeTruthy();
 await page.mouse.move(bounds.x+bounds.width*.4,bounds.y+bounds.height*.4);
 await page.mouse.down();
 await page.mouse.move(bounds.x+bounds.width*.6,bounds.y+bounds.height*.4,{steps:5});
 await page.mouse.up();
 expect(Number(await page.locator('#yaw').inputValue())).toBeGreaterThan(25);
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
