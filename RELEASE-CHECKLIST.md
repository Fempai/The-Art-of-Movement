# Academy release checklist

Use the **latest commit SHA**, not an older passing workflow run.

## Automated gates
- [ ] Academy static integrity completed successfully.
- [ ] Academy static regression checks, including numerical humanoid tests, completed successfully.
- [ ] Academy desktop and mobile browser regression completed successfully, with **zero failed tests**.
- [ ] All-page 360px viewport scan and selected tablet/desktop scans have no unexplained horizontal overflow.
- [ ] Camera gesture, keyboard, lighting, playback and invalid JSON/GLB browser tests pass.
- [ ] Avatar screenshot pixel-difference test detects distinct camera views and returns to a stable front baseline.
- [ ] Browser screenshots, frame/resource metrics, layout reports, and HTML/trace diagnostics are retained as CI artifacts.
- [ ] GitHub Pages build and deployment completed successfully **for the same commit**.
- [ ] Published site URL loads, including Avatar Studio, Pose Lab and Motion Comparison.

## Release evidence
Record: commit SHA, workflow run IDs, each conclusion, page deployment run, screenshot-difference report, viewport overflow report, known limitations, and any outstanding issue in [RELEASE-READINESS.md](RELEASE-READINESS.md). Do not infer successful deployment from a passing unit test.

## Final release evidence record (fill in before owner sign-off)

| Evidence | Result / reference |
| --- | --- |
| Candidate release commit SHA | `a78e9808912035b6bb7ea2b8421349f80ef2c1eb` was owner-confirmed **8/8 green checks** (screenshot, 2026-11-05); **historical evidence only** after any later commit. Record final release SHA at sign-off. |
| Static integrity and numerical regression | Owner screenshot shows 8/8 checks for `a78e980`; individual workflow names, numerical test conclusions and run IDs not yet independently collected. |
| Desktop/mobile Chromium browser tests | Pending latest-commit workflow links and conclusions |
| GitHub Pages deployment and published-site smoke check | Pending latest-commit workflow link and live-site confirmation |
| Existing owner-tested 37 lesson videos and Life OS shared journal | Previously owner-tested; recheck only on a specific regression |
| Restored BEL101 Friday source-video content matching | Not independently verified; document source-specific limitation |
| Physical phone camera/Pose Lab behavior | Owner acceptance outstanding unless separately evidenced |
| Authenticated cloud privacy and account-boundary behavior | End-to-end owner acceptance outstanding unless separately evidenced |
| Experimental avatar and automated technique grading | Research-grade / uncalibrated; do not imply validated dance grading |
| Release decision, limitations, and owner sign-off | Pending explicit owner approval |

A green commit status must not automatically fill the phone, cloud, source-matching, or owner-signoff rows. Separate **release blockers** from **disclosed limitations** and **future research** for the chosen scope; do not silently change that scope to call the project complete.

## CI evidence access limitation

The connected GitHub workflow-run lookup currently returns only pull-request-triggered runs, so an empty response **does not mean** that push-triggered GitHub Actions failed or did not run. The owner-provided commit screenshot confirms the aggregate 8/8 checks for `a78e980`, but does not by itself establish workflow run IDs, deployed-site status, or physical-device acceptance. Do not claim independent CI verification from this limited lookup. For a final release record, attach the exact push-run URLs or GitHub Actions summary for the final SHA, without rerunning previously passed checks solely to collect screenshots.

## Non-automated acceptance, tracked separately
Physical Samsung browser validation, user likeness approval, representative real-dance motion validation, private authenticated Life OS account testing and instructional-video rights/quality signoff are not implied by a green CI run.

## Failure response
Inspect failed step logs, browser traces and screenshot artifacts; reproduce with the exact viewport; commit the narrowest repair; rerun all gates; update [CHANGELOG.md](CHANGELOG.md) and the release evidence. Never label a failing commit release-ready.
