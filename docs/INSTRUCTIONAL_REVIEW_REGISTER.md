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

## BEL101 diagnostic-distractor revision — 2026-11-01

Weeks **05–10** have received a first editorial revision of their incorrect answer options. Replaced obvious jump/forced-backbend/certification distractors with plausible confusion about counts, lateral versus looping pathways, seated alternatives, rhythmic alternation, and the difference between observing a drill and authenticating a source. **The keyed answer letters were intentionally retained**; correct answers and feedback were not rewritten merely to balance answer distribution. Weeks 11–16 and the foundational lesson questions remain candidates for equivalent diagnostic improvement.

**Quality caveat:** These edits are unverified until the automated quiz parser, actual rendered reader, and substantive instructional review are rerun. They are not evidence that learners will perform better or that the movements match source videos. After each quiz change, check that no new distractor could also reasonably be correct under the written instructions; document and revise ambiguities.

## BEL101 weekly distractor revisions extended — 2026-11-01

The diagnostic-distractor pass now also covers **BEL101-W11 through BEL101-W16** (24 questions), following Weeks 05–10. These revisions focus on plausible confusion about breath-linked release, sequential torso movement, concurrent layering versus sequential actions, transitions between eight-count phrases, adaptation versus omission, and fair comparison of the Week 8 and Week 16 assessments. The four correct-answer letters and explanations per lesson were left unchanged. **Weeks 05–16 are now editorially revised; BEL101-W04 and BEL101-01 through BEL101-04 still need equivalent distractor refinement.**

**Release caveat:** Revised alternatives have not been evaluated with learners or checked in the deployed reader. An independent reviewer should confirm that the new alternatives are unambiguously less correct than the keyed answers, especially where reasonable adaptations or modifications are mentioned. The automated structure and browser tests must be rerun; no final instructional sign-off is implied.

## BEL101 first-pass distractor coverage complete — 2026-11-01

All **17 BEL101 lesson files (68 four-option questions)** now have a first editorial distractor revision, including foundation lessons `BEL101-01` through `BEL101-04`, `BEL101-W04`, and weekly lessons `BEL101-W05` through `BEL101-W16`. The revisions replace implausible distractors with count/pathway mistakes, confusion about sequencing versus layering, support/adaptation errors, and overclaims about demonstrated skill or video authenticity. Correct answer letters and existing explanatory feedback were intentionally preserved.

**Current gate:** EDITED / **NOT VALIDATED**. The first-pass coverage is not proof of question difficulty, uniqueness of the best answer, movement correctness, cultural appropriateness, or browser behavior. Re-run `node tests/audit-bellydance-feedback.cjs`, `node tests/audit-all-quizzes.cjs`, and browser tests in the GitHub Actions environment; inspect any flagged ambiguities before release. Video playback and source-to-lesson comparisons remain pending.

## BEL101 post-revision static regression inspection — 2026-11-01

After the 17-lesson distractor revisions, an independent repository-content inspection fetched all 17 current BEL101 lesson files and parsed each question and answer explanation with the same essential patterns used by the BEL101 audit. **Result: 17/17 parseable four-question lessons, 68/68 numbered answer explanations, no duplicate choices within a question, no short explanations under the audit threshold, no sequential ABCD/DCBA answer keys, no missing scheduled Week 4–16 source IDs, and no flagged stale missing-link claims.** This is an inspection performed against fetched repository content; it is **not** evidence of a Node process, completed GitHub Actions run, or deployed reader behavior.

The instructional coverage workflow was updated to run `node tests/audit-all-quizzes.cjs` for the entire 97-lesson inventory in addition to the BEL101-specific checks. That workflow's successful execution is **not yet confirmed**. Week 8's outdated instruction about future restoration of already-restored source links was corrected, and the BEL101 audit now detects the same stale wording. The editorial and nine-dimension release gates remain open.

## CI audit evidence capture — 2026-11-01

The instructional-coverage workflow now executes both the full **97-lesson quiz compatibility audit** and the **17-lesson BEL101 feedback/source audit** as explicit steps. Their outputs are captured as `all-quizzes-audit.log` and `bellydance-feedback-audit.log` and included with `instructional-coverage.log` in the workflow artifact and run summary. This makes it possible to distinguish a successful structural check from a missing, skipped, or failed step. The workflow configuration was committed, but **no successful GitHub Actions run has yet been verified in this review register**. Obtain the actual run URL, job conclusions, and logs before changing any CI status to PASS.

## 97-lesson CI gate hardening — 2026-11-01

The all-quiz audit now flags repeated question prompts within a lesson, unusually short answer explanations (under 25 characters), and missing keyed-option text in addition to its existing four-question/answer checks. The instructional-coverage workflow captures both stdout and stderr into retained audit logs while retaining `pipefail`, and now runs on relevant pull requests as well as pushes. These are prospective checks: **the newly strengthened audit has not been observed passing in GitHub Actions**. The latest combined commit-status endpoint returned no status entries, which is not a pass or fail conclusion. Check the actual Actions run/job details and logs before claiming CI success.

## Cross-course applied quiz revision — 2026-11-01

After the BEL101 first-pass revision, **MOV101-01** and **DNC101-01 through DNC101-03** received editorial question/distractor revisions. MOV101-01 now tests the distinction between observed body position and joint-specific motion; DNC101-01 tests tendu support, floor contact, and controlled return; DNC101-02 tests plié depth, phrasing, and heel contact; DNC101-03 tests relevé definition, supported modifications, and controlled lowering. Existing correct-answer letters and feedback were retained. These are four **edited**, not validated, lessons: ambiguity review, full quiz regression, and browser verification remain pending.

The 97-lesson audit now also detects duplicate prompts and exceptionally short explanations; this new threshold may identify legacy lessons that require editorial attention. A configured workflow is not a verified passing run. Keep CI status unconfirmed until job evidence is inspected.

## Beginner dance quiz editorial expansion — 2026-11-01

The first distractor-improvement pass now includes **DNC101-01 through DNC101-04 (16 questions), CON101-01 through CON101-02 (8 questions), and HIP101-01 through HIP101-04 (16 questions)**, in addition to MOV101-01 and the 17 BEL101 lessons. DNC101-04 addresses the bend–unfold–return sequence and support for développé; CON101-01/02 address comfortable breath phrasing, initiation, and limits of inferring intent; HIP101-01/04 address groove, rhythmic accents, syncopation, call-and-response, and avoiding unsupported historical attribution. Correct-answer keys and existing explanations were preserved. These revisions remain **EDITED / NOT VALIDATED** until ambiguity, movement accuracy, cultural claims, CI, and learner-browser gates are checked.

## Contemporary and music foundations quiz expansion — 2026-11-01

First-pass distractor revision now covers **CON101-01 through CON101-04 (16 questions)** and **MUS101-01 through MUS101-04 (16 questions)**. CON101-03/04 now emphasize suspended timing comparisons, stable support transitions, and observable versus inferred claims; MUS101-01/04 now use plausible errors in beat-unit interpretation, seconds-per-beat calculations, subdivision, syncopation, meter, and reproducible movement scoring. Keyed answers and explanations were not changed. These are **editorial improvements only**; individual option ambiguity, accuracy, structural CI results, and browser behavior remain unverified. The original 97-lesson release gate remains in force.

## Composition and historical-evidence assessment revision — 2026-11-01

First-pass diagnostic distractor revision now covers **CMP101-01 through CMP101-04** and **HIS101-01 through HIS101-04**, totaling 32 knowledge-check questions across eight lessons. Composition items emphasize motif recurrence, phrase boundaries, support-foot transitions, and reproducible notation. History items distinguish direct observation, lineage evidence, primary-source testimony, archival selection, attribution, copyright permission, and justified uncertainty. An initial CMP101-03 question 2 revision inadvertently introduced multiple defensible alternatives; a follow-up commit corrected the choices to preserve the intended support-conflict answer. All original keyed answers and feedback remain in place. These are **edited / not validated**: the new options still require a complete ambiguity and factual audit, automated quiz regression, and learner-browser verification. Do not interpret the GitHub commits as CI or instructional approval.

## Repertory and strength assessment editorial revision — 2026-11-01

The first distractor-improvement pass now covers **LAB101-01 through LAB101-04 (16 questions)** and **STG101-01 through STG101-04 (16 questions)**. LAB101 checks count sequencing, controlled support, observation versus intention, retrieval practice, and phrase-boundary transitions. STG101 checks resistance selection, safe equipment anchoring, controlled pushing and pulling, supported trunk work, interval notation, and interpretable progression. The correct answer letters and existing explanations were preserved. These are **edited, not validated**: each new alternative still requires ambiguity review and substantive movement/fitness correctness assessment; GitHub Actions and learner-browser verification are outstanding. Do not infer clinical safety from a quiz score.

## Flexibility and movement science assessment revision — 2026-11-01

First-pass diagnostic distractor revision now covers **FLE101-01 through FLE101-04 (16 questions)** and **MOV101-01 through MOV101-04 (16 questions)**. FLE101 focuses on hip motion versus lumbar compensation, active versus passive range, comfortable modifications, and repeatable progress comparisons. MOV101 focuses on joint reference frames, muscle action during static holds, base-of-support interpretation, weight transfers, and turnout limitations. Original answer keys and feedback were preserved. All remain **edited / not validated** pending ambiguity review, domain correctness, actual CI execution, and learner-browser checks. In particular, anatomy and exercise modifications must not be presented as clinically validated from these editorial changes.

## Movement analysis, performance, and bellydance ambiguity corrections — 2026-11-01

First-pass quiz distractor revision now covers **LMA201-01 through LMA201-04 (16 questions)** and **PER201-01 through PER201-04 (16 questions)**. The movement-analysis set now tests Body, Effort, Shape, and Space distinctions through more plausible category confusions; the performance set tests gaze, artistic intention, observable evidence, camera framing, and comfortable alternatives without claiming universal audience responses. **BEL101-04 question 3** was corrected because a previously revised option was also defensibly true; the new incorrect option claims that combining familiar movements automatically authenticates all regional bellydance traditions. Existing answer keys and explanations were retained. All edits remain **NOT VALIDATED** until a full unique-best-answer review, source/technique review, automated regression, and learner-browser verification. This section records committed editorial changes, not a successful CI run.

## Advanced research and composition assessment revisions — 2026-11-01

First-pass distractor improvement now covers **RES501-01 through RES501-04 (16 questions)** and **CMP502-01 through CMP502-04 (16 questions)**. Research questions emphasize operationalization, units of analysis, limits of small samples, source specificity, coding missing observations, reflexivity, and consent. Composition questions emphasize retrograde event order, overlapping canon entries, accumulation stages, chance-procedure constraints, and transparent safety revisions. **CMP502-01 question 2** was corrected in a follow-up commit after an initial revision produced multiple defensible alternatives. Existing correct answer keys and explanations remain unchanged. These changes are **NOT VALIDATED**: question-by-question unique-best-answer review, historical/technical correctness checks, actual CI regression, and learner-browser tests remain outstanding.

## Motor-learning and dance-aesthetics assessment revision — 2026-11-01

First-pass diagnostic distractor revision now covers **SCI503-01 through SCI503-04 (16 questions)** and **EST504-01 through EST504-04 (16 questions)**. SCI503 items test retention versus immediate performance, controlled practice variability, unaided retrieval, knowledge of results versus performance, fatigue, and descriptive limits. EST504 items test observation versus interpretation, source-specific evidence, ethical critique, attribution, and alternative readings. Existing answer keys and explanations were preserved. **Status: edited / not validated.** Correctness and unique-best-answer audits, bibliographic/source verification, automated structural quiz regression, and learner-browser verification remain outstanding. GitHub commit acceptance is not evidence of passing CI.
