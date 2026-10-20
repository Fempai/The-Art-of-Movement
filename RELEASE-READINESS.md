## Advanced coaching implementation update (2026-10-20)
- Added guided three-focus Live Coach sequence with observable/skipped status, spoken transitions, local metadata-only session history, and opt-in camera/recording preserved. Five-second observation is **not** proof of technique.
- Added Pose Lab stable-window JSON export with continuous tracking requirements and no video/audio content.
- Added `assets/motion-comparison.js` and `motion-comparison.html`: reference versus practice 2D hip-displacement trajectories aligned by relative time, four descriptive measurement comparisons, local JSON report export, and strict input validation. Files stay in the browser.
- Added comparison-engine behavioral checks to GitHub Actions and mobile browser tests for successful/invalid comparison.
- **Unresolved advanced goals:** true 3D reconstruction, animated 3D avatar choreography matching, calibrated movement grades, and reliable physical-phone lower-body tracking. The 2D motion comparison is not a substitute. These need reference datasets, camera/calibration choices, technique rubric and real-device evaluation before making accuracy claims.
- Final new-commit browser/deployment workflow status must be verified independently; do not infer success from passing static checks.

## Backend hardening completed (2026-10-20)
- Inspected the live Life OS Supabase project `alwtccdiyudsucfioahr` and Academy tables, owner-scoped RLS, private video bucket, migrations, and the deployed AI feedback function.
- Applied migrations `aom_backend_foreign_key_indexes`, `aom_optimize_owner_rls_policies`, and `aom_consolidate_review_insert_policies`. These add six missing foreign-key indexes, optimize ten owner-policy auth lookups, and merge two overlapping review-insert policies without changing their allowed draft/queued conditions.
- Re-ran Supabase performance advisors: missing foreign-key-index, RLS initplan, and overlapping permissive-policy findings cleared. Remaining unused-index advisories include the new indexes and are expected until representative workloads run; do not remove protective indexes solely for zero usage.
- Inspected private `aom-private-videos` bucket: not public, 100 MiB limit, video MIME allowlist, owner-folder storage policies.
- Deployed `aom-pose-feedback` **version 6** with continuous, distinct timestamp checks, shoulder-scale validity, and finite bounded experimental metric validation. JWT verification remains enabled; original authenticated owner lookup and explicit Cloudflare consent remain in place.
- Confirmed function version 6 is ACTIVE by re-fetching deployment. No authenticated live request or full model-output quality test was executed, and cloud retention/provider controls have not been independently verified.
- Security advisor still reports leaked-password protection disabled for the shared Life OS Supabase Auth project. Changing shared project Auth settings needs a separate, informed decision because it affects non-Academy services.
- **Not certified complete:** end-to-end authenticated review, cloud failure/timeout behavior, independent privacy/retention audit, and real-device camera grading remain release checks.

# The Art of Movement — release readiness

Updated: 2026-10-20. Live Coach hold interruption, background-frame handling, Pose Lab fallback/reset, and cloud review consent were improved in code. These changes are not device-verified. This document distinguishes implemented code from verified behavior. Do not treat a GitHub commit as a passed device test.

## Confirmed by the owner
- 37 Google Drive lesson videos have been audited and play correctly. Keep the existing mappings and assignments.
- Life OS ↔ Academy shared journal and cloud syncing were tested on laptop. Do not rebuild or repeat this test.
- Live Coach camera, voice, and five-second hold have operated on the owner's phone. Lower-body pose tracking still fails intermittently with hips/ankles visibly inside the frame. **Not resolved by UI wording alone.**

## Implemented, not yet release-verified
- 16-week academy curriculum and weekly lesson pages, music/musicality, practice player, flexibility and discipline-specific studies.
- On-device Live Coach with pose skeleton, optional four-second wrist/ankle trails, optional local recording, spoken cues, hold timing, full pose model with fallback.
- Pose Lab with local pose and audio-energy observations, evidence-quality checks (including rejection of discontinuous timestamp windows), preliminary landmark-only AI review, and manual saving of observations to assessment history. Cloud submissions now sample across the stable window rather than taking only the first 60 observations. Real-video validation remains outstanding.
- Human observation rubrics, assessment archive, side-by-side comparisons, and export.
- GitHub Actions static regression workflow (.github/workflows/academy-checks.yml), expanded to eight core pages and privacy-sensitive regression checks. Workflow result not independently confirmed.
- Owner acceptance guide (`OWNER-ACCEPTANCE.md`) for targeted camera diagnostics and final release QA.

## Website-quality work completed (2026-10-20)
- Repaired the broken Week 3 acro link in the global navigation and two page-level links; destination is the existing Week 3 daily studio.
- Fixed a Pose Lab cloud-consent JavaScript syntax error identified by GitHub Actions.
- Corrected mobile navigation dropdown positioning.
- Expanded the all-page static integrity checker to inspect local links, dynamically generated global navigation destinations, duplicate IDs, image alt attributes, language metadata, and mobile viewport metadata.
- Added `academy-backup.html`, a browser-only export/restore utility for `aom_` localStorage records. Restore defaults to skipping existing keys, validates file format and sizes, and explicitly excludes cloud records, video files and sign-in sessions.
- Added JSON restore to progression review history and visible error handling for local save failures.
- Added Playwright browser tests for global navigation, progression-review restore, and local backup restoration without overwriting existing data.
- **Verified GitHub Actions success at commit `a2da965`:** Academy static integrity run `39512876801`, Academy static regression run `39512876779`, and Academy mobile browser smoke tests run `39512876712` (all completed successfully).
- **Scope limit:** these automated checks are not a complete visual/accessibility audit on every physical device; authenticated cloud behavior, actual Samsung camera performance, and final owner acceptance remain separate release blockers.

## Autonomous development remaining (assessment as of 2026-10-20)
- **Code-level:** automated site-wide navigation and metadata checks now pass; local backup and progression-review restore are implemented and covered by browser tests. Any issues uncovered during manual desktop/phone visual review remain to be fixed.
- **Backend:** run authenticated integration and failure-path checks with test credentials where permitted, review AI provider retention terms, and document privacy limitations. Static RLS inspection and successful deployment do not replace these checks.
- **Automation:** confirm GitHub Actions executes successfully and repair workflow failures. Current connector does not provide a complete push-run listing, so success is **unverified**.
- **Research and feature scope:** advanced 3D motion, avatar choreography matching, and defensible grading are substantial uncompleted engineering work, not simply awaiting a phone test. Reliable reference motion and acceptance criteria may require owner decisions.
- **Requires owner/device:** target Samsung lower-body tracking diagnosis, representative private video playback, final phone acceptance, and release approval.
- **No reliable percentage:** the remaining independent workload cannot be measured as a defensible fraction of the total because advanced 3D/avatar requirements are open-ended. Do not claim that all non-owner tasks are finished.

## Release blockers / work still required
1. **Phone lower-body tracking**: reproduce with the owner's actual phone and video, inspect on-screen per-landmark confidence and pose model selection, and adjust the model/conditions or provide a transparent tracking-unavailable state. Do not mark grounded stance verified from ankle heights alone.
2. **Reliable coaching**: repeated pose-processing errors now stop the camera loop with a recoverable error instead of silently retrying forever. Test all practice modes, voice prompts, hold interruption, camera start/stop, permissions, orientation, battery/performance, accessibility, and recovery from model/network failure on the intended phone.
3. **Recorded analysis**: validate Pose Lab with representative private videos, audio capture permissions and playback, seeking, weak-evidence cases, archive save, and AI review authorization/response. No raw video upload is intended.
4. **Cloud privacy/security**: read-only audit confirmed RLS is enabled for Academy tables and user-owned policies exist; private video bucket is non-public and its read/upload/delete policies restrict paths to the signed-in user's ID. The AI edge function is JWT-protected, verifies the user's session and review ownership, and accepts queued reviews only. Server v5 adds input-size limits, an allowlist of numeric pose metrics, and fixes movement-name regex matching. Pose Lab's consent now discloses that measurements go through Supabase to Cloudflare AI, not just Supabase. **Still required**: authenticated end-to-end permission tests, cloud provider retention review, and verification of error handling. Static policy inspection does not establish security by itself.
5. **Advanced movement coaching**: reliable 3D interpretation, real-time virtual avatar and choreography comparison, calibrated movement grading, and progress measurement have **not** been validated or delivered as accurate features. These need feasibility decisions, suitable reference motion, and testing; do not label them complete.
6. **End-to-end QA**: run GitHub Actions, fix failures, desktop browser regression, data backup/restore, accessibility, broken navigation, then final full phone acceptance test. Final phone QA is last, distinct from targeted camera diagnostics.
7. **Release approval**: owner reviews final product, confirms privacy and grading claims, and signs off before 100% complete.

## Operating rules
- No new work on the 37 audited video assignments or tested Life OS journal unless a specific regression is discovered.
- Avoid confident claims of AI instructor-equivalent scoring or reliable 3D tracking based on a 2D pose model.
- Preserve local-only recording by default; cloud review sends pose measurements via Supabase to Cloudflare AI only after explicit confirmation. No raw video/audio is sent in that request.
- Record evidence for each resolved blocker and close it only after appropriate testing.
