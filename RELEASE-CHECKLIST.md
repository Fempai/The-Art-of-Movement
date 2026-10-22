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

## Non-automated acceptance, tracked separately
Physical Samsung browser validation, user likeness approval, representative real-dance motion validation, private authenticated Life OS account testing and instructional-video rights/quality signoff are not implied by a green CI run.

## Failure response
Inspect failed step logs, browser traces and screenshot artifacts; reproduce with the exact viewport; commit the narrowest repair; rerun all gates; update [CHANGELOG.md](CHANGELOG.md) and the release evidence. Never label a failing commit release-ready.
