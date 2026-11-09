# Twerk — standalone Academy discipline (TWK101–TWK401)

**Status (2026-11-09):** TWK101 written pilot drafted (8/8 lessons; 32 keyed questions). Filmed demonstrations, practitioner cultural review, automated assessment audits, and learner acceptance remain pending. A standalone written-pilot page and homepage entry are implemented, but deployed browser acceptance and cloud-synced progress are not verified. Twerk is an independent dance pathway, not a hip-hop subsection or a generic glute workout. No existing published lessons are replaced.

## Educational principles
Teach musicality, movement control, embodied expression, and historical context together. Discuss West and Central African and African-diasporic hip/pelvic movement traditions without asserting that all such traditions are interchangeable or that one specific dance directly originated all modern twerking. Introduce the documented importance of New Orleans bounce and Black social dance communities; require passage-level sourcing and practitioner review before publishing historical claims. Distinguish pelvic tilts and spinal/pelvic articulation from leg-driven pulses, and deliberate alternating actions from momentum. Do not infer isolated muscle activation from video appearance.

## Four levels — eight lessons each
| Level | Code | Lessons 1–8 |
|---|---|---|
| Foundations | TWK101 | 01 pulse, stance and rhythm; 02 anterior/posterior pelvic tilts; 03 small-range bounce and return; 04 lateral weight shifts; 05 standing versus supported variations; 06 accent placement and tempo; 07 four-pattern transitions; 08 eight-count foundation performance |
| Technique | TWK201 | 01 rebound mechanics; 02 alternating sides and asymmetry; 03 controlled hip hinges; 04 rhythmic subdivisions; 05 squat depth and endurance choices; 06 supported hands-on-thighs positions; 07 multi-pattern phrase; 08 technique evaluation |
| Advanced | TWK301 | 01 layered accents; 02 quick-to-slow timing; 03 directional travel; 04 levels without forced depth; 05 supported floor entry and exit; 06 floorwork with knee/wrist alternatives; 07 sustained phrase and recovery; 08 complex combination |
| Performance | TWK401 | 01 improvisation prompts; 02 bounce music analysis; 03 dynamics and texture; 04 transitions and stage orientation; 05 expressive choices; 06 endurance pacing; 07 original choreography; 08 recorded capstone and reflection |

## Contract for every lesson
- A measurable objective and specific prerequisite/exit checkpoint.
- Cultural context with explicit source and attribution boundaries.
- Warm-up, counted movement breakdown, 10–15 minute follow-along practice, one eight-count phrase, and cooldown.
- At least one standing small-range option and a supported or seated alternative with **honest description of what is and is not mechanically equivalent**.
- Self-correction cues and stop conditions (pain, dizziness, loss of balance); no forced spinal extension, maximal squats, or repeated impact as a novice prerequisite.
- Four keyed, explained knowledge-check questions plus a practice assignment and observable rubric. Video completion alone does not establish skill mastery.
- Instructor demonstration with useful front/side views and accessible captions **before** marking video-complete; no invented links or claims of validated biomechanics.

## Acceptance gates
1. Complete 32 distinct written lessons with four valid questions each; audit answer keys and instructional alignment.
2. Review historical claims and safety language, then obtain qualified technique review before representing instruction as professionally validated.
3. Integrate course cards, routes, progress storage, assessment persistence, and mobile layout without changing existing course IDs.
4. Verify actual playable authorized video, audio/captions, and alternative formats before release.
5. Run regression tests on the existing academy plus a new TWK101 end-to-end learner path.

## Initial rollout
The **written TWK101 pilot** now exists as eight Markdown lessons under `curriculum/final-lessons/TWK101-01.md` through `TWK101-08.md`. Next implement and validate its interface and media. Keep Levels II–IV unpublished until foundational technique and video gates pass.

## Web integration checkpoint (2026-11-09)
- `twerk-foundations.html` presents eight draft lessons and an explicitly browser-local review checklist.
- `index.html` links to this standalone pilot.
- Written lessons currently link to GitHub Markdown, not an embedded lesson player.
- **Important assessment issue:** TWK101-03 through TWK101-08 currently use broad, repetitive questions with all correct answers keyed A. Replace with four lesson-specific discriminating questions and mixed answer positions before learner assessment release. The current review checklist is not assessment completion.
- No CI or live browser pass was obtained in this session; user confirmation of earlier checks is not evidence for these new commits.
