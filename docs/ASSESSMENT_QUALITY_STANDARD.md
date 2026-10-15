# Academic assessment standard and privacy boundaries

## Current state
- Private video uploads and review queue work.
- Pose Lab supports local MediaPipe body landmarks, with accuracy not yet calibrated.
- Supabase Edge Function `aom-pose-feedback` deployed with JWT verification. It accepts authenticated review IDs plus structured, timestamped pose evidence and invokes Cloudflare Workers AI with **measurement data only**, not raw video. It returns a preliminary advisory response and does **not** save or issue grades.
- The frontend is not yet wired to extract/send observations to this endpoint.
- No video-aware AI instructor, automatic grade, audio/beat analysis, validated movement rubric, or external instructor calibration is live.
- Gemini and OpenAI are not connected. Do not silently enable paid models or send personal footage to providers.

## Assessment design
1. Capture footage with consistent framing and sufficient body visibility; obtain permission for any external video processing.
2. Extract time-indexed pose landmarks locally and compute reproducible movement metrics; capture model confidence, occlusion, frame rate and camera view.
3. Evaluate discipline-specific evidence: e.g. head slides need facial/head tracking and shoulder reference, not just whole-body pose; flexibility assessments need clearly visible joint landmarks and standardized positions; dance musicality requires actual audio/beat alignment.
4. Cloudflare may summarize measured evidence, cite timestamps, identify limitations and recommend drills. It must not claim to have watched video it did not receive.
5. Graded assessments require validated skill-specific rubrics and adequate video/audio evidence. If insufficient, report **Not gradable** with a reason, not an invented proficiency.
6. Compare repeated takes, provide actionable corrections and a next-level gate. Track inter-rater reliability against a qualified dance teacher before claiming university-level accuracy.
7. Preserve the distinction between self-checks, AI preliminary observations, AI-issued grades, and qualified human assessment. AI grades are never human certification.
8. High-risk acrobatics/contortion must be supervised in person.

## Security and cost
- Cloudflare token and account ID live only in Supabase Edge Function secrets.
- Never publish video, tokens or service-role keys to GitHub Pages.
- Private Supabase Storage remains the system of record. Users own their recordings.
- Free tier only by default; fail closed on quota exhaustion, no automatic paid fallback.
- Implement usage quotas, rate limits, deletion, and retention policy before broad rollout.
