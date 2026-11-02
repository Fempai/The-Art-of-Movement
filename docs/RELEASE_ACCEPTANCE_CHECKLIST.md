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
