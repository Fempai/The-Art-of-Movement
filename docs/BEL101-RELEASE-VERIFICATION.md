# BEL101 release verification

Date: 2026-11-02

## Evidence collected

- Seventeen lesson texts have documented nine-dimension editorial reviews in `docs/BEL101-NINE-DIMENSION-REVIEW.md`.
- The catalog contains twelve distinct scheduled Google Drive video references, plus one supplementary acrobatics video. Catalog presence verifies neither permissions nor playback.
- The user previously supplied a screenshot of seven green checks at commit `dc99ec0`; this does not establish checks at subsequent commits.

## Acceptance status

- Technique: OPEN. Written count sequences and safety cautions reviewed, but physical demonstrations and technique execution not observed.
- Cultural sources: OPEN. The lessons avoid claiming original exercises are authenticated traditional choreography, but scholarly passage checks and practitioner-specific video comparisons have not been completed.
- Video playback: PARTIALLY CONFIRMED BY USER. On 2026-11-02, the Academy owner reported that a belly-dance video played successfully on their device. The particular video, playback controls, seeking, other scheduled sources, and lesson-topic matching were not identified or independently verified. An earlier attempt in the assistant's web environment was inaccessible; that does not override the owner's successful playback observation.
- Deployed site: BLOCKED. An attempt to open the expected GitHub Pages URL returned inaccessible in the available web environment. Browser behavior and accessibility were not directly tested.
- Current CI: OPEN. New head-commit checks require independent confirmation.

## Evidence required to close

For each scheduled video, record access permission, actual playback and seeking, lesson-topic match, and failure reason. For each deployed lesson, record viewport, keyboard navigation, quiz submission, explanation display, progress persistence, and errors. Preserve test date, URL, and commit SHA. Do not mark any blocked check as passed.

## November 4 CI evidence and next release gates

- The owner supplied a GitHub Actions screenshot confirming success at commit `ed960385bfb70302885b1293debeba47683fbb2d` for Academy lesson and quiz verification (#1177, 52s), Quiz browser regression (#897, 3m 54s), Academy static regression checks (#1793, 17s), and Published Academy smoke check (#442, 6s). This establishes the automated checks' asserted scope **at that commit**, including the corrected BEL101-04 regression assertion.
- A subsequent repository update added BEL101 video-catalog regression guards: 12 scheduled study sources, one supplementary clip, nonempty week assignments, and exclusion of acrobatic forward rolls from the Friday course schedule. The test executes in the instructional-coverage workflow when triggered, but **its latest execution result is not yet verified**.
- Remaining acceptance evidence: actually open and seek each scheduled video, confirm the lesson-topic match and permission on the learner's device; inspect deployed lesson and quiz interactions; review movement execution and specific cultural-source claims. A successful automated text check cannot substitute for those observations.
- The latest-head release gate remains **OPEN** until post-change CI results are observed; do not generalize the screenshot's successful commit to later commits.

## Source-by-source video acceptance tracking

The 12 scheduled BEL101 Friday video sources, mapped weeks, original Drive URLs, and separate playback/lesson-match/technique-verification statuses are recorded in [`BEL101-VIDEO-EVIDENCE-LEDGER.md`](BEL101-VIDEO-EVIDENCE-LEDGER.md). All per-video observations remain **Not verified** pending actual playback and source comparison. The supplementary forward-roll clip is explicitly excluded from Friday lesson scheduling. Do not interpret the ledger as verification evidence until individual observations are documented.
