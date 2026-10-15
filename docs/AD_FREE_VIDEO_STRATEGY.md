# Ad-free instructional video delivery strategy

## What is shipped
- `ad-free-practice.html`: browser-native ad-free player for original, owned, or properly licensed video files; import into device-local IndexedDB or play temporary local file without saving. Mirror, speed, skip, full and segment loops.
- No ad network or third-party embed in the ad-free player. It does not bypass advertisements or download/rehost videos from third-party platforms.
- The Level I ballet YouTube embed remains an external, potentially ad-supported class. It is clearly identified as such.

## Sustainable instructor-led video model
1. **Original academy instruction**: produce instructor-led classes with demonstrator permission and appropriate credentials. Use MP4/WebM with captions/transcripts and clear safety modifications. Requires qualified instruction, production and licensing resources.
2. **Explicitly licensed creator classes**: negotiate permission to host or embed ad-free video, covering streaming, storage, derivative editing, duration, territory, music synchronization/performance and attribution. A public YouTube video alone does not confer hosting rights.
3. **Learner-supplied authorized videos**: locally saved videos from legitimately owned/licensed files. This is already available for personal practice; does not create a free library of third-party instructor classes.
4. **Creator-owned ad-free platform embeds**: some providers offer ad-free embedded playback on paid tiers, but confirm actual pricing, rights, video storage, data retention, and any bandwidth limits before enabling. Do not assume free Vimeo/Cloudflare Stream/Bunny/Mux tiers or claim no ads without verification.

## Engineering next steps
- Mobile test: local video file play, save, reload, repeat, segment loop, mirror, storage quota failure.
- Add original or licensed hosted video manifests with signed media URLs, not arbitrary user-submitted streaming URLs.
- Add caption tracks, searchable instructor transcripts, chapter markers, progress persistence, class completion confirmation and cross-device cloud library where rights allow.
- Storage budgeting: video bandwidth and CDN egress can incur charges. No provider billing should be enabled without explicit user approval.
- Offline persistence is best-effort: IndexedDB can be evicted, cleared, and may be limited by mobile browser. Keep original files backed up.

## Acceptance criteria
The academy's required follow-along catalog is **not complete** merely because a clean player exists. An ad-free class requires a real playable instructor-led video with appropriate rights, technique breakdown, follow-along practice and safe modifications.
