# Creator video permission and approval workflow

## What to send for review
Share **the creator's written permission** as a screenshot, PDF, email, signed license, or link to their publicly published license. If the permission is in a DM, include the creator account, date, and full relevant exchange. You can redact unrelated personal information. A screenshot is evidence to review, not automatic proof of ownership.

Include:
- Creator/instructor's name or authorized rights holder and a link identifying the specific video(s).
- Whether you may **embed**, **download**, **store in our cloud**, **stream to academy visitors**, **edit/crop**, **caption**, **create derivative instruction**, and **use commercially** if applicable.
- Whether the permission covers **music, choreography, performer likeness, filming, and any third-party assets**; creator permission for their video does not necessarily clear copyrighted music.
- Geographic, audience, expiry and attribution conditions.
- Whether the creator can revoke permission, and the agreed takedown process.

## Permission request template
Subject: Permission to feature your dance class in The Art of Movement

Hello [creator],

I'm developing The Art of Movement, an online dance and flexibility academy. I would love to feature your [specific class/video] as a follow-along lesson, with clear credit and a link to your work.

Would you permit us to [embed the original video / host a copy on our cloud storage and stream it without ads]? The second option requires explicit authorization to copy and redistribute the video. Please let me know whether any music, choreography, performer or other third-party rights limit that permission, and any credit, territory, term, or withdrawal conditions.

I won't download or rehost your video without the necessary rights. Thank you for considering it.

## Internal approval record
For each lesson store:
- lesson_id, title, instructor, discipline, source_url
- proof_reference (private file, not public GitHub), permission_granted_by, approval_date, expiration_date
- permitted_actions, territory, attribution, music_rights_status, performer_release_status
- host_provider, approved_media_url, caption_url, takedown_contact, reviewer
- state: pending, approved, expired, revoked
Only approved, verified, non-expired entries may appear in the public cloud-streaming manifest. Do **not** put private permission emails or secrets in the public manifest.

## AI-generated dancers and choreography
AI video can provide concept art, choreography visualization, and supplemental movement illustrations, but a convincing video is **not proof of anatomically sound or safe instruction**. For ballet, acro and flexibility, risks include impossible joint angles, missing load transfer, unsafe landings, implausible balance and inaccurate timing. A professional instructor should design, perform or validate every technique before publication. Do not create realistic depictions of a real instructor without consent or imply endorsement.

Production gate: qualified human-created syllabus → demonstrator footage or carefully directed AI draft → expert anatomical/technical review → corrections → accessible narration/captions → learner testing → published lesson. AI content must be labeled accurately. Do not publish AI-only acro instruction as authoritative safety guidance.

## Cloud and costs
The user's Google subscription includes 5 TB shared personal storage, but Google Drive API terms prohibit use as a replacement for a large-scale CDN. Supabase free plan storage and egress are limited; do not assume 5 TB of Google storage is equivalent to 5 TB of public video streaming bandwidth. Avoid automatic provider sharding to evade service limits. A separate licensed video hosting provider may be needed as the catalog grows. No paid service, API billing, or public Drive exposure without approval.
