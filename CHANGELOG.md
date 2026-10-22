# Academy change history

## Unreleased — October 21, 2026: release stabilization
- Constrained Avatar Studio inputs, labels, grid cells and panels to reduce horizontal overflow on narrow Android viewports.
- Added all-page compact Android overflow scans and selected tablet/desktop layout checks.
- Added pixel-level camera-angle screenshot comparison, including a restored front-view baseline.
- Expanded browser failure diagnostics and CI artifact retention for viewport, visual and performance evidence.
- Consolidated the redundant movement smoke workflow into the comprehensive static regression suite; separate static integrity and browser regression gates remain.
- Replaced stale initial-prototype README and added explicit release checklist.
- **Acceptance pending:** Latest-commit browser suite, static checks and Pages deployment must all pass. No physical-device validation is claimed.

## October 21, 2026: automated QA expansion
- Added desktop and Android/tablet avatar screenshots, frame/resource measurements, touch interactions, malformed import checks and numerical humanoid geometry tests.
- Fixed touch-input test to use Chromium touch events and corrected synthetic skeleton test fixtures.
- CI exposed a 25-pixel compact Android horizontal overflow defect.

## October 21, 2026: Academy / Life OS integration
- Added optional temporary Pose Lab transfer to Avatar Studio and Motion Comparison.
- Added browser-local practice notes and session history.
- Preserved existing authenticated Life OS journal and assessment synchronization; no automatic cloud upload of local session notes.

## October 20–21, 2026: character and movement controls
- Added procedural character appearance presets, playback and lighting/camera controls, experimental foot contact and two-bone IK, plus synthetic tests.
- Known limitation: model-estimated 3D coordinates are not calibrated motion capture and the prototype is not a personalized likeness.
