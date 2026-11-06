# The Art of Movement — final owner acceptance

Use this checklist only when implementation and developer checks are finished. The 37 lesson videos and Life OS ↔ Academy shared journal have already been tested by the owner; **do not repeat those audits without a regression**.

## Release scope and evidence boundaries

**Main development is not a future phase.** This is the release-acceptance phase for the existing Academy. A passing GitHub commit check is evidence of the automated gates on that commit, not a substitute for the owner acceptance below. Do not restart previously completed 37-video playback or shared-journal audits without a concrete regression.

**Distinct video claims:** The owner-tested 37 lesson videos are not the same claim as independent content-and-technique matching for the restored BEL101 Friday Google Drive sources. Keep that narrower BEL101 source-match limitation visible; it does not invalidate the previously completed owner playback audit. If a source cannot be accessed, label it *unverified* rather than silently replacing it or marking the whole curriculum failed.

**Release decision:** Record the exact release commit, the automated checks for that commit, published-site acceptance, and any remaining phone/cloud issues. Mark each issue as *blocking for the selected release scope*, *known limitation disclosed to learners*, or *future research feature*. The experimental 3D avatar and uncalibrated automatic technique grading must not be advertised as validated; their research-grade status does not by itself require rebuilding the main curriculum. A release can only be approved after its selected scope and limitations are explicitly documented and the owner signs off.

## Targeted camera diagnostic (separate from final phone QA)

1. Open `live-coach.html` on the actual phone, allow the camera, and select **Voice cues** on or off.
2. Stand with the full body visible, as already demonstrated. **Do not assume that a framing instruction will solve the known hip/ankle issue.**
3. Expand **Camera tracking diagnostics**. Record model selection (Full/Lite), video resolution, processing rate, and confidence for both shoulders, hips, and ankles. Use **Copy diagnostic text** if available.
4. Test alignment, stance, and balance separately. The coach must abstain when the required joints are uncertain; it must not award a five-second hold from low-confidence frames.
5. During a valid hold, cover the camera briefly or switch apps. The hold must restart rather than complete. Return to the page and test recovery.
6. Test Start, Stop, voice on/off, and recording. A recording must stay local until explicitly downloaded. Verify there is no automatic cloud upload.
7. If lower-body landmarks remain unreliable, mark the feature **tracking-limited** rather than claiming accurate technique grading.

## Recorded Pose Lab acceptance

1. Select a representative locally stored movement video, start tracking, and play at least five seconds of continuous movement.
2. Confirm the preliminary analysis describes measured 2D observations, **not a grade**.
3. Seek to another part of the video and confirm old evidence cannot be saved; replay to collect fresh evidence.
4. Restart tracking and confirm both pose and audio observations reset.
5. Test Full model loading and fallback behavior on the target device.
6. For optional cloud review, verify the consent identifies **Supabase and Cloudflare AI**, names the selected review, and explains that pose measurements (not video/audio) are transferred.
7. Cancel the confirmation: no request should be sent. Approve a matching queued review: expect a preliminary response or a clear error. Never claim Cloudflare watched the video.

## Final desktop and phone QA

- Navigate from the Academy home page to all primary curriculum, practice, assessment, history, and profile pages. Confirm no blank pages, broken links, overlapping controls, or inaccessible dialogs.
- Verify forms, saved assessment records, compare/export, reload persistence, and cloud sign-in/session recovery.
- Check narrow phone layouts, portrait/landscape behavior, keyboard focus, visible focus states, descriptive labels, reduced-motion preferences, and readable contrast.
- Confirm a failed network request never silently reports success and that signed-out users cannot access another user's private reviews or videos.
- Check local assessment export before clearing browser storage; local-only data is not necessarily recoverable across devices.
- Review the privacy wording, experimental-coaching limitations, and final release decision.

## Completion criteria

The release is not 100% until code-level checks, authenticated end-to-end cloud tests, real-device camera and Pose Lab validation, desktop regression, final phone QA, and owner sign-off are documented. Reliable 3D coaching/avatar comparison remains a separate research-and-implementation milestone unless the owner explicitly narrows the release scope.
