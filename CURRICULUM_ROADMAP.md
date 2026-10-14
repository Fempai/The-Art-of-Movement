# Academy curriculum and product roadmap

## Monday launch status (October 19, 2026)

- Cardio belongs **at the end**, after strength, mobility, and a short low-impact dance sampler.
- The Monday page specifies sets, repetitions, hold durations and introductory movement cues.
- Instructor-led video **is not yet available**. Never label AI-generated choreography or exercise demonstrations as verified biomechanics. Only embed appropriately licensed, technically reviewed footage; don't invent video links.
- Training journal currently records session duration, effort and free-text notes. Structured per-set weights/reps and private progress photos are **planned**, not yet implemented.

## Permanent curriculum tracks

- Strength: glutes, lower body, chest, back, arms, core; progressive overload with load, reps, sets, tempo, perceived exertion and equipment.
- Flexibility: hip adductors, hamstrings, hip flexors, ankles, spine, shoulders; active and passive ranges with quality gates, not forced end range.
- Dance: belly dance and isolations; hip-hop; jazz/contemporary; ballet-informed technique; heels; sensual floorwork; burlesque/showgirl; twerk/glute isolations; striptease; freestyle and choreography.
- Embodied expression: optional confidence, musicality, body awareness, sensuality and psychology-inspired reflection. Spirituality is elective and secular alternatives are equally available; no psychological or spiritual claims presented as clinical treatment.
- Acrobatic and advanced contortion pathways: prerequisites and qualified in-person supervision required.

## Planned player features

- Mirror mode (horizontal flip) with clear left/right instruction warnings.
- Playback speed control and looping with accessible captions.
- Performance mode (minimal UI, full-screen, optional camera overlay only with consent).
- Choreography segments, counts, repetitions and practice markers.
- Video submissions and instructor review (pending / corrections / approved) with rubric covering alignment, control, rhythm, transitions and expression. Automated grading is advisory only and must not certify safety.
- Progress timeline, comparison views, opt-in anniversary look-backs and a private time-lapse montage. Video uploads require private Supabase Storage buckets, authentication and verified access rules before release.

## Data model (planned)

- workout_sessions(id,user_id,started_at,completed_at,discipline,notes,effort)
- exercise_sets(id,session_id,exercise_id,set_number,reps,load_value,load_unit,tempo,rpe,notes)
- flexibility_sets(id,session_id,pose_id,side,duration_seconds,intensity,notes)
- dance_practices(id,session_id,style,lesson_id,tempo_pct,notes)
- progress_media(id,user_id,session_id,storage_path,captured_at,consent_scope)
- assessments(id,user_id,skill_id,status,submitted_at,reviewed_at,rubric,feedback)

All private tables require ownership-based RLS. Media must never be served from public GitHub or public Supabase buckets. Do not create public coaching feedback or expose a user's photos in a public repo.

## Release phases

1. Mobile-ready Monday checklist and local journal.
2. Structured strength set logger and flexibility hold tracker.
3. Shared Supabase data and existing Life OS auth integration.
4. Secure progress media and baseline comparisons.
5. Reviewed instructional videos and dance lesson player.
6. Instructor assessment workflow, personalized recommendations and progress montages.

Reference studios mentioned by user (STEEZY, WiDance, Dymension, TMilly TV, Exotic Academy, Dance With Bloom, Dance Masterclass, Irlin & Co) are inspiration for *feature categories* only, not sources of copied videos, curricula or trademarks.
