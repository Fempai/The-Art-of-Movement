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
