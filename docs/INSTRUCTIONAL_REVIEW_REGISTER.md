# Instructional review register — 97 lessons

**Status: NOT YET VALIDATED.** This register is for human editorial decisions after the automated coverage triage. A green CI run is not a technique or answer-key certification.

## Review instructions
For each lesson, record its ID, reviewer/date, and an evidence-based result for each dimension below. Use **PASS**, **FAIL**, or **NEEDS REVIEW**. Cite exact headings, passages, question numbers, and any relevant source. If a claim cannot be checked, use NEEDS REVIEW, never assume PASS.

| Dimension | Evidence to inspect | Result |
| --- | --- | --- |
| Outcome alignment | Stated outcome demonstrable through practice, quiz or assignment | NEEDS REVIEW |
| Practice sequence | Timed/countable steps, setup, repetitions, progression | NEEDS REVIEW |
| Movement correctness | Joint action, loading, coordination, contraindications and overclaims | NEEDS REVIEW |
| Modifications | Specific accessible alternatives for movement limitations | NEEDS REVIEW |
| Self-correction | Observable error, actionable adjustment, readiness criterion | NEEDS REVIEW |
| Quiz correctness | Each of 4 keyed answers is unambiguously best, explanation supports it | NEEDS REVIEW |
| Assignment | Deliverable and rubric assess stated outcome | NEEDS REVIEW |
| Evidence and cultural care | Claims supported, traditions distinguished, limitations disclosed | NEEDS REVIEW |
| Reader experience | Complete lesson, video, questions, feedback, assignment work in UI | NEEDS REVIEW |

## Review record (duplicate once per lesson)

**Lesson ID:** `BEL101-01` (example; replace)

**Reviewer and date:** Unassigned

**Automated triage:** Pending review of workflow artifact

**Instructional decisions:** All nine dimensions NEEDS REVIEW

**Four-question key review:** Q1 pending; Q2 pending; Q3 pending; Q4 pending

**Source/video verification:** Pending

**Findings and exact file/line references:** Pending

**Corrections made and commit:** None recorded

**Re-test evidence:** Pending

**Disposition:** NOT VALIDATED

## Sign-off rules
A lesson can be marked internally validated only when all nine dimensions pass with documented evidence and no unresolved factual, cultural, technique, or learner-interface concerns. A failed dimension requires a correction and repeat review. Human review does not imply professional certification, injury prevention, external instructor endorsement, or independent learner testing.

## Priority
Start with BEL101-01 through BEL101-04 and BEL101-W04 through BEL101-W16, then the remaining introductory dance tracks, then the other course families. Review all 97 linked quizzes; do not confuse the 84 core lesson files with the full 97-item linked inventory.

## BEL101 restored-video verification register (owner action pending)

The source catalog at `curriculum/BEL101-VIDEO-SOURCES.json` records the owner-provided URLs. The dedicated Week 4–16 lesson files now link to their original scheduled sources. Automated checks can confirm URL consistency but **cannot** confirm Google Drive permission, playable video streams, demonstration accuracy, or whether the lesson's technique matches the recording.

| Week(s) | Video source focus | Link consistency | Playback | Technique comparison |
| --- | --- | --- | --- | --- |
| 1, 8, 16 | Hip work | Catalog mapped; Week 8/16 lesson links restored | NOT TESTED | NEEDS REVIEW |
| 2, 8 | Hip slide | Catalog mapped; Week 8 lesson link restored | NOT TESTED | NEEDS REVIEW |
| 3 | Hip drills | Catalog mapped | NOT TESTED | NEEDS REVIEW |
| 4 | Snake arms / chest circles | Lesson link restored | NOT TESTED | NEEDS REVIEW |
| 5 | Ten beginner moves | Lesson link restored | NOT TESTED | NEEDS REVIEW |
| 6, 16 | Egyptian shimmy | Lesson links restored | NOT TESTED | NEEDS REVIEW |
| 7, 9, 10, 14 | Traveling / figure-eight transitions | Lesson links restored | NOT TESTED | NEEDS REVIEW |
| 11 | Belly roll | Lesson link restored | NOT TESTED | NEEDS REVIEW |
| 12 | Layering | Lesson link restored | NOT TESTED | NEEDS REVIEW |
| 13 | Belly work | Lesson link restored | NOT TESTED | NEEDS REVIEW |
| 15 | Hands and arms / undulations | Both lesson links restored | NOT TESTED | NEEDS REVIEW |

**Verification procedure:** Open each unique scheduled video using an account authorized to access it; verify that it plays, supports seeking, and matches its catalog title; compare the demonstrated movement with the corresponding written lesson, recording discrepancies by timecode. Repeated weekly uses of one video do not require redundant playback checks but do require lesson-specific content comparison. Do not mark a source verified solely because its URL resolves or the file appears in Drive.

**Learner-interface procedure:** Open BEL101 Week 4 and Week 16 in the deployed reader, confirm all four options render for each question, select an incorrect option and inspect explanatory feedback, then reload to verify progress persistence. Test one restored video from the reader. Record device/browser, date, observed result, and screenshots or console details for failures.

**Status:** No owner action required until the automated gate is checked and a focused browser test is requested. No video or reader result has been fabricated.

## BEL101 repository inspection — 2026-11-01

A repository-content inspection (not an Actions execution or a deployed-browser test) examined the current 17 BEL101 lesson files against the canonical source catalog. All 17 contained four parseable multiple-choice question sets and four numbered answer explanations, for **68 questions total**. No lesson had a four-question key using fewer than three answer positions, or the conspicuously sequential `ABCD`/`DCBA` patterns. All Week 4–16 lesson files contained the scheduled catalog source IDs; Week 8, 15, and 16 correctly contained two source IDs each. No missing weekly source ID was observed.

**Interpretation:** This is a static consistency review, not proof that the keyed answers are substantively correct, that a video is accessible or plays, that a movement is culturally/technically accurate, or that the deployed reader persists quiz progress. The nine-dimensional review and all browser/playback statuses remain **NEEDS REVIEW** until evidence is recorded. Do not promote these findings to an instructional sign-off.

## BEL101 foundational editorial review — 2026-11-01

The four foundational lessons were read for stated learning outcomes, follow-along sequences, four answer keys each, explanations, modifications, assignment alignment, and evidence boundaries. The reviewer compared the **written answer keys to the written lesson instructions**, not to an independent dance demonstration. All 16 foundational keyed choices were consistent with the corresponding written drills at this level of review:

| Lesson | Key sequence | Written-lesson consistency | Outstanding checks |
| --- | --- | --- | --- |
| BEL101-01 | A C B D | No contradiction identified in four explanations | Independent technique/cultural-source review; browser behavior |
| BEL101-02 | C A D B | No contradiction identified in four explanations | Independent technique/cultural-source review; browser behavior |
| BEL101-03 | D B A C | No contradiction identified in four explanations | Independent shimmy-technique review; browser behavior |
| BEL101-04 | B D A C | No contradiction identified in four explanations; stale missing-link statement corrected | Independent technique/cultural-source review; browser behavior |

**Evidence:** `curriculum/final-lessons/BEL101-01.md` through `BEL101-04.md`, sections `Follow-along practice`, `Knowledge check`, `Answers and explanations`, and `Assignment and reflection`. These are internal text-consistency findings only. The questions primarily test recognition of explicitly taught instructions and safety choices; they do not establish authentic regional technique, independent learner comprehension, or physical proficiency. Keep all nine final approval dimensions open until the corresponding external and reader evidence is recorded.

## BEL101 weekly knowledge-check editorial pass — 2026-11-01

Read all **52** questions, four answer choices per question, keyed choices, and explanatory paragraphs in `curriculum/final-lessons/BEL101-W04.md` through `BEL101-W16.md`. Compared each answer's **meaning against the stated written drill and the other offered options**. No direct contradiction between the keyed response and the described beginner task was identified in this pass. This does **not** independently establish technical correctness, cultural authenticity, or actual learner comprehension.

| Weekly lesson | Keyed answers | Internal text/option consistency | Release disposition |
| --- | --- | --- | --- |
| BEL101-W04 | C A D B | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W05 | B D A C | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W06 | C A D B | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W07 | D B A C | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W08 | C A D B | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W09 | B C A D | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W10 | C B A D | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W11 | B C A D | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W12 | B C A D | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W13 | C B A D | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W14 | B C A D | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W15 | C A D B | No direct contradiction identified | NEEDS REVIEW |
| BEL101-W16 | D B A C | No direct contradiction identified | NEEDS REVIEW |

**Editorial observations:** The questions are mainly recognition, count recall, low-range adaptation, and evidence-boundary choices. Many distractors are obviously unsafe or categorically unsupported (e.g. jumps, breath holding, certification claims); this makes some items too easy to discriminate among choices. Consequently, an all-correct quiz result would be weak evidence of transfer to actual movement performance. For later revisions, replace some implausible distractors with realistic beginner errors, add scenarios where two choices seem superficially reasonable but only one matches the taught count or movement pathway, and retain explicit safety guidance outside the quiz. Do not change the correct key merely to make the distribution look balanced.

**Evidence scope:** Static editorial inspection of written material, not execution of GitHub Actions or video playback. Final nine-dimensional instructional validation stays open. The first four foundation lessons' 16 answers were separately inspected above, bringing the **written key/option consistency review to 68/68** questions; this is not a pass for independent technique verification or pedagogical effectiveness.
