# Academy release acceptance: authenticated cloud and Samsung mobile

This is a **manual acceptance protocol**, not evidence that tests have passed. Automated CI/static checks are necessary but do not establish actual Supabase authorization, browser playback, or physical-device operation.

## Preparation
- Use the **deployed** Academy URL, not a local file. Record URL, commit SHA, date, Android version, browser version, and test account IDs as aliases A/B (never store email addresses, OTP codes, tokens, or private media in an issue).
- Prepare two separate authorized test accounts, A and B, with distinct non-sensitive dummy records. Avoid using personal movement recordings for isolation tests.
- Verify RLS and storage policies from an authenticated environment; do not assume client-side `.eq('user_id', ...)` is an authorization boundary.
- Check the latest GitHub Actions run for the exact release SHA.

## Account-isolation tests (repeat for Cloud Journal, Baseline Studio, and My Academy where applicable)
| ID | Action | Expected result |
| --- | --- | --- |
| AUTH-01 | Sign in as A, save a dummy record, refresh | A's record remains visible |
| AUTH-02 | Sign out of A while a record/media request is pending | Private data disappears immediately and cannot reappear when the old response arrives |
| AUTH-03 | Sign in as B in the same browser | A's records, media, and pending OTP email do not appear |
| AUTH-04 | Save and refresh B's own dummy record | Only B's record is visible |
| AUTH-05 | Attempt to fetch A's record using B's authenticated session through the normal backend API (no privileged credentials) | Database/storage policy denies access; client-side filtering alone does not count |
| AUTH-06 | Switch accounts during an in-flight save/upload/delete | Old account response does not mutate the new account UI; no cross-account write occurs |
| AUTH-07 | Expire/revoke session, then refresh/save/delete | Private content is concealed; operation requires valid reauthentication |
| AUTH-08 | Request a new OTP while an earlier request is pending; try invalid/blank OTP | Superseded response is ignored; invalid credentials do not authenticate |
| AUTH-09 | Sign out, then navigate back and reload | No private record is exposed before authentication |
| AUTH-10 | Retry after network loss and sign-out failure | No stale data appears; recovery and error messages are accurate |

## Samsung Android acceptance
| ID | Action | Expected result |
| --- | --- | --- |
| MOB-01 | Open home and navigate to Academy, Cloud Journal, Baseline Studio and My Academy | Navigation, readable text, and controls work without horizontal overflow |
| MOB-02 | Request and verify email OTP in mobile browser | Keyboard/input, redirects, and authenticated state work |
| MOB-03 | Record and reload a cloud journal entry | Correct values and notes, no duplicate saves |
| MOB-04 | Record/select a permitted baseline image or video | Upload preview, playback, and controls work; no unintended public URL |
| MOB-05 | Change category/filter and compare two baselines | Correct filtered comparison; no stale media after sign-out |
| MOB-06 | Use camera-based Live Coach only after granting permission | Clear camera permission/error handling; stop releases camera |
| MOB-07 | Test portrait, landscape, background/foreground, and browser back | State and private content remain correct |
| MOB-08 | Test offline or interrupted connection | Clear failure feedback, no false save confirmation |

## Evidence and exit criteria
Record each case as PASS / FAIL / BLOCKED / NOT APPLICABLE, with date, environment, and sanitized notes. Do not upload sensitive account or media data. Any account-isolation failure blocks release. Other failures need documented resolution or explicit acceptance before sign-off.

**Release-ready only when:** the exact release SHA has passing CI, real A/B account isolation passes, Samsung acceptance passes for supported features, and the deployed URL is smoke-tested. A green static test alone does not satisfy these gates.
