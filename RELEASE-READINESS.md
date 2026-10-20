# The Art of Movement — release readiness

Updated: 2026-10-20. Live Coach hold interruption, background-frame handling, Pose Lab fallback/reset, and cloud review consent were improved in code. These changes are not device-verified. This document distinguishes implemented code from verified behavior. Do not treat a GitHub commit as a passed device test.

## Confirmed by the owner
- 37 Google Drive lesson videos have been audited and play correctly. Keep the existing mappings and assignments.
- Life OS ↔ Academy shared journal and cloud syncing were tested on laptop. Do not rebuild or repeat this test.
- Live Coach camera, voice, and five-second hold have operated on the owner's phone. Lower-body pose tracking still fails intermittently with hips/ankles visibly inside the frame. **Not resolved by UI wording alone.**

## Implemented, not yet release-verified
- 16-week academy curriculum and weekly lesson pages, music/musicality, practice player, flexibility and discipline-specific studies.
- On-device Live Coach with pose skeleton, optional four-second wrist/ankle trails, optional local recording, spoken cues, hold timing, full pose model with fallback.
- Pose Lab with local pose and audio-energy observations, evidence-quality checks, preliminary landmark-only AI review, and manual saving of observations to assessment history.
- Human observation rubrics, assessment archive, side-by-side comparisons, and export.
- GitHub Actions static regression workflow (.github/workflows/academy-checks.yml).

## Release blockers / work still required
1. **Phone lower-body tracking**: reproduce with the owner's actual phone and video, inspect on-screen per-landmark confidence and pose model selection, and adjust the model/conditions or provide a transparent tracking-unavailable state. Do not mark grounded stance verified from ankle heights alone.
2. **Reliable coaching**: test all practice modes, voice prompts, hold interruption, camera start/stop, permissions, orientation, battery/performance, accessibility, and recovery from model/network failure on the intended phone.
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
