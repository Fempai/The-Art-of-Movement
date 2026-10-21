# Academy ↔ Life OS integration contract (2026-10)

## Existing authenticated bridge (preserved)
The Academy's `movement-bridge.html` uses the existing Supabase project, authenticated user identity, private journal (`aom_shared_journal`), assessment entries (`aom_assessment_entries`), semester progress and STRETCHIT views. This integration pass does not alter its table names, RLS policies, auth, existing data, upsert behavior, or cross-origin access. Life OS must independently sign in to access the same authorized records.

## New optional workflow
- Pose Lab can **explicitly** transfer a locally measured JSON observation window into the same-tab `sessionStorage` using `aom_motion_handoff_v1`. The handoff expires after 30 minutes, is capped below 950 KB, and is never sent to Supabase.
- Pose Lab → Avatar Studio requires the optional estimated 3D landmarks. Pose Lab → Motion Comparison can use ordinary 2D metrics.
- Motion Comparison can assign the transferred recording as reference or practice, with a second file chosen separately. The 3D paired viewer remains conditional on both recordings containing world coordinates.
- Studio practice notes and comparison notes use `aom_studio_sessions_v1` in browser-local `localStorage`, max 100 bounded notes. They contain brief descriptions and duration only, **not** videos, 3D coordinates, private journal entries, or technique grades.
- `local-studio-sessions.html` provides local history, JSON export/import and confirmed deletion. Export files are sensitive to the extent the user writes sensitive notes; treat backups accordingly.

## Safeguards and limitations
- No automatic cross-origin transfer of localStorage or sessionStorage between Life OS and Academy. Browser storage is origin-specific.
- No automatic upload or synchronization of these new local notes to Life OS. Users may deliberately create an entry through the existing authenticated shared journal.
- Motion Comparison computes descriptive camera-dependent differences only; visibility cautions do not become scores, pass/fail classifications or verified choreography accuracy.
- The bridge's existing cloud records and authenticated sync should be tested under the owner's account before claiming cross-app data integrity or full deployment acceptance.
