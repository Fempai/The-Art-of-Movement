# The Art of Movement — internal release acceptance checklist

Scope: 97 existing lessons across 21 course codes, including 13 BEL101 weekly lessons. The original performance-language elective is separate future scope.

## Verified evidence
- [x] GitHub Actions quiz-browser regression #400: 33 Chromium Playwright tests passed; 0 failed and 0 flaky (user-provided screenshot, November 1, 2026).
- [x] Same run: 97/97 quiz structures passed the structural audit.
- [x] Live MOV101 quiz rendering and BEL101 weekly content rendering were among the passing tests.
- [ ] Recheck all relevant workflows after the latest editorial edits at the eventual release commit.

## Instructional quality
- [ ] Assess all 97 lessons against the nine-dimension rubric in docs/INSTRUCTIONAL_VALIDATION_GATE.md, with passage-level evidence.
- [ ] Independently assess all 388 questions for one defensible answer, teaching alignment, useful distractors and feedback.
- [ ] Assess beginner movement instructions, modifications, progression and stop conditions; disclose limits of internal review.
- [ ] Check BEL101 cultural attribution and accuracy.
- [ ] Verify citation metadata and claims; correct missing or unsupported references.

## Learner experience
- [ ] Check real lessons from each of 21 courses plus BEL101 weekly units for instructions, quiz, explanations and assignments.
- [ ] Test mobile viewport, keyboard focus, accessible labels, tap targets and readable errors.
- [ ] Check return visits, grading retries, saved progress and failure recovery on representative real lessons.
- [ ] Test actual video access and playback, not merely link presence.
- [ ] Complete deployed-site smoke test and document accessibility limitations.

## Release gate
- [ ] Relevant GitHub Actions workflows green at release SHA.
- [ ] All critical issues corrected; accepted limitations explicitly documented.
- [ ] Release notes and known limitations published.

Evidence policy: structural parsing is not instructional validation; a browser test supports only its asserted scenario. No external learner recruitment or instructor signoff is required for the agreed internal review standard. Do not alter answer letters solely for distribution.

## Current verification checkpoint — 2026-11-02

- [x] Inspected the current Q1 explanation text in all 15 advanced lessons affected by the A/B option reorder; each now references the current `(A)` distractor rather than stale `(B)`.
- [x] Added those 15 cases to `tests/audit-quiz-ambiguity-regressions.cjs`; the existing `instructional-coverage.yml` runs this audit on push and pull requests affecting lesson/audit files.
- [x] Completed a focused text-based BEL101 editorial pass across 17 lesson files; Weeks 08 and 16 now require documented, comparable baseline evidence rather than inferred progress.
- [ ] **Fresh CI evidence:** Open GitHub Actions for the release commit and record the workflow run URL, numeric run ID, head SHA, conclusion, and individual jobs for instructional coverage, quiz-browser regression, and other required workflows. A push triggering a workflow is not proof it passed.
- [ ] **Instructional evidence:** For every lesson, complete all nine dimensions with passage-level evidence. Text edits and structural scans alone do not close this item.
- [ ] **Media acceptance:** Open and play every required video in the actual deployed learner experience, verify access permissions, seek controls and lesson-topic correspondence, and record failures. URL presence does not prove playback.
- [ ] **Deployed release acceptance:** Test representative real lessons from all 21 courses, BEL101 weekly material, keyboard/mobile interaction, saved progress and recovery; retain results and critical-issue disposition.

**Evidence limitation:** GitHub connector currently exposes individual commit and file reads but not a reliable listing of push-triggered Actions runs. No current green workflow conclusion, live playback success, or full nine-dimension signoff is asserted here. Do not mark the release gate passed until the missing observations are recorded.

## Confirmed commit checks — user screenshot, 2026-11-02

At commit `dc99ec02fa40b72ee6ac7dc850374461896c4d87` on `main`, the GitHub commit checks popup showed **7 successful checks**: `pages build and deployment / build (dynamic)` (23s), `pages build and deployment / deploy (dynamic)` (13s), `Academy desktop and mobile browser regression / mobile-e2e (push)` (1m), `pages build and deployment / report-build-status (dynamic)` (5s), `Academy static regression checks / static-checks (push)` (15s), `Academy static integrity / static-qa (push)` (11s), and `Academy lesson and quiz verification / verify (push)` (53s). Evidence: user-supplied GitHub screenshot in chat. This is **confirmed for that SHA only**. The screenshot did not list the separately named instructional-coverage triage or quiz-browser regression workflows; do not infer their status from the seven checks. Later commits require their own checks.

## BEL101 full text-rubric checkpoint — 2026-11-02

- [x] Completed and recorded all nine dimensions for all 17 BEL101 lessons in [`BEL101-NINE-DIMENSION-REVIEW.md`](BEL101-NINE-DIMENSION-REVIEW.md), including passage-specific support and open evidence limits.
- [x] Six text-assessable dimensions per lesson passed the internal editorial standard (102/153 rubric cells).
- [ ] Movement correctness (17 lessons): technique-level observation is still needed to substantiate execution; written cautions are not a substitute.
- [ ] Cultural/source accuracy (17 lessons): source passages, historical terms, and video-to-topic correspondence still require verification.
- [ ] Reader integration (17 lessons): deployed content, actual video playback, quiz interaction and accessibility still require direct testing.
- [ ] Fresh green checks for the latest head commit, after Week 07 and Weeks 09–15 changes; earlier screenshot evidence applies only to `dc99ec0`.

The 51 open rubric cells are **NEEDS HUMAN REVIEW**, not automatic failures. This internal editorial coverage does not establish a completed release gate or physical technique certification. No external reviewer recruitment is required for the agreed internal process.

## BEL101 external acceptance attempt — 2026-11-02

See [`BEL101-RELEASE-VERIFICATION.md`](BEL101-RELEASE-VERIFICATION.md) for the evidence and outstanding tests. Attempted the expected Pages site and one scheduled Drive source via available web access; both were inaccessible from this environment. This is **not** proof the public site or source is broken for a real learner. Actual playback, accessibility, physical technique, source authentication, and current-head CI remain unverified. Do not close the release gate on this basis.
