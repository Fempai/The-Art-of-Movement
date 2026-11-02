# Instructional validation gate — The Art of Movement

This gate supplements, and does not replace, the existing 97-quiz structural audit and browser regression suite.

## Scope and evidence
- Inventory: 21 course codes, 84 four-lesson core units plus 13 BEL101 weekly units = 97 linked lesson quizzes. A passing inventory count is not proof of instructional quality.
- Browser tests verify rendering, grading, persistence, and race-condition handling; they do not verify movement correctness or whether the keyed answer is pedagogically true.
- A structurally valid four-question quiz can still have weak distractors, ambiguous wording, unsupported claims, or inaccurate explanations.

## Per-lesson review rubric (record evidence and pass/fail separately)
1. **Learning outcomes:** Observable, beginner-appropriate actions and concepts, aligned with practice and assessment.
2. **Instructional sequence:** Preparation, safe setup, counted follow-along instructions, practice repetitions, and a clear progression.
3. **Movement correctness:** Anatomical instructions are internally consistent; no forced joint positions, extreme range requirements, or unsupported safety guarantees.
4. **Modifications:** At least one usable reduced-range, supported, or alternative version; stop conditions where appropriate.
5. **Self-correction:** Observable signs of a common error, an actionable correction, and a criterion for moving on.
6. **Knowledge checks:** Exactly four meaningful questions, each with a defensible unique best answer; distractors plausible but not misleading; explanations actually justify the correct choice.
7. **Assignment:** Independent task with deliverable, observable criteria, and alignment to the outcomes.
8. **Sources and cultural attribution:** Technique and historical claims distinguish evidence from original teaching material; bellydance traditions are not collapsed into one lineage.
9. **Reader integration:** The complete lesson, videos, questions, explanations, and assignment are accessible in the learner interface.

## Acceptance
Mark each dimension PASS, FAIL, or NEEDS HUMAN REVIEW, and cite a file path and passage. Do not infer PASS from the existence of a heading or from CI being green. Fix factual and instructional issues before marking a lesson validated. An unresolved external-source claim or unreviewed movement-technique claim must remain NEEDS HUMAN REVIEW rather than PASS.

## Priority review
1. BEL101 introductory and weekly material: cultural terminology, isolation mechanics, links, and progression.
2. All beginner dance tracks: movement setup, joint guidance, and safe regressions.
3. Every lesson's four answer keys and explanations: check correctness, not merely parseability.
4. Remaining lessons: full alignment and assignment quality.

## Release rule
Report structural audit and instructional audit separately. Never label all 97 lessons 'instructionally validated' until every rubric item has been assessed and documented. No independent learner recruitment or external dance-instructor signoff is required for this internal editorial gate; absence of external review must be disclosed.

## Original performance-language development (not yet part of 97-lesson inventory)

The proposed **unnamed original performance-language** elective is described in [the original performance-language brief](../curriculum/ORIGINAL-PERFORMANCE-LANGUAGE.md). Its artistic foundation is audience revelation through psychological mirroring, theatrical contrast, and intentional sensory design. **The Art of Becoming** is a possible title for one transformation-focused phase or work, not the confirmed name of the entire performance language. It is a **new, original compositional framework**, not a historical Egyptian dance or an existing validated course.

Do not publish or count its prototype among the 97 lessons until BEL101 review and playback testing are complete, the elective's learning outcomes and assessment are written, and the same nine-dimension instructional gate has been applied. Separate artistic interpretation from claims of mind-reading, universal audience response, or guaranteed psychological effects. Preserve accessible sensory options and accurate historical attribution.

## Knowledge-check effectiveness gate

An internally consistent answer key is necessary but insufficient. Review each four-question set for **cognitive demand**: identify which questions ask for count recall, error diagnosis, transfer to a new scenario, and evidence/cultural reasoning. Prefer a mix rather than four near-identical recall items. Distractors should be realistic, safe-to-discuss beginner misconceptions rather than solely implausible jumps, forced movements, or unsupported certification claims. Do not make an unsafe action appear defensible merely to increase difficulty.

For each revised question, record (1) the taught passage it tests, (2) why the correct answer is best, (3) why each other option is wrong, (4) the likely novice misconception, and (5) whether a learner can answer by eliminating obviously absurd options. A question can be structurally sound and text-consistent yet still require revision for weak diagnostic value. Re-run the quiz structure audit and reader regression after every question or explanation edit. Never change answer letters solely to satisfy a distribution heuristic.
