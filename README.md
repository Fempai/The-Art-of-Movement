# The Art of Movement

A mobile-first, multi-track dance and movement Academy hosted on GitHub Pages and connected to Dre After Dark Life OS through an **existing authenticated, private Supabase journal/assessment bridge**.

**Live site:** https://fempai.github.io/The-Art-of-Movement/

## Available tools (October 2026)
- 16-week curriculum navigation, Week 1 and Week 2 studios, weekly lesson planning, movement lexicon, and lesson library. Instructor-video coverage is incomplete; a lesson card is not evidence of a playable, reviewed class.
- Strength, flexibility, progress, practice and assessment records; some modules use local browser storage, while selected cloud tools use authenticated Supabase records.
- Pose Lab and Live Coach for experimental on-device landmark analysis; camera-estimated measurements are not validated dance grades or clinical safety clearance.
- Skinned Avatar Studio for experimental 3D pose playback, optional rigged GLB import, character presets, camera/lighting/playback controls, and local practice notes.
- Motion Comparison, local Pose Lab handoff, session export/restore, and the authenticated Life OS movement bridge.
- Practice players for local files and permitted Drive previews. Drive iframe streams do not support the same controls as locally selected videos.

## Privacy and limitations
- The temporary Pose Lab handoff uses same-tab sessionStorage. Studio practice notes use localStorage and **do not automatically sync to Life OS**. Browser-local data can be lost; export backups.
- The shared cloud journal and selected assessments require authentication. Do not confuse these with local records. See [ACADEMY-LIFE-OS-CONTRACT.md](ACADEMY-LIFE-OS-CONTRACT.md).
- Private videos are not made public by the Academy. Do not rehost third-party classes without appropriate rights.
- Full instructional coverage, verified automated technique grading, personal likeness, physical Android/Samsung acceptance, and real-world movement calibration are **not complete**.
- Advanced acrobatics and extreme flexibility require qualified in-person instruction.

## Automated quality assurance
GitHub Actions runs static integrity, static/numerical regression and Chromium desktop/mobile browser checks, with screenshots, pixel-difference checks, resource/frame timing, and responsive layout scans. GitHub Pages deployment is a separate workflow. Passing emulated-browser checks does not equal physical phone validation.

See [RELEASE-CHECKLIST.md](RELEASE-CHECKLIST.md), [CHANGELOG.md](CHANGELOG.md), [RELEASE-READINESS.md](RELEASE-READINESS.md), and [OWNER-ACCEPTANCE.md](OWNER-ACCEPTANCE.md).

## Development
Static site: serve the repository root with `python3 -m http.server 8765`. CI installs Playwright/Chromium, then runs `tests/mobile-academy.spec.js`, `tests/desktop-academy.spec.js`, and `tests/site-layout.spec.js`. Node/Python numerical and privacy-contract checks are in `scripts/`.

**Release status is determined by the latest GitHub Actions run, not by this README.**
