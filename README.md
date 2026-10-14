# The Art of Movement

A standalone, mobile-friendly movement conservatory, connected in concept to Dre After Dark Life OS.

## Current live foundation

- First-week gym orientation and conservative introductory workout.
- Searchable technique library for strength, mobility and dance.
- Local-only training journal with JSON export.
- Movement baseline observations.

## Important limitations

This initial deployment is **not** the complete v0.6 prototype. It is a small self-contained foundation to enable GitHub Pages deployment and mobile smoke testing. It does not yet sync with Life OS or Supabase. Browser storage is per device/browser and can be lost; export entries. Do not store sensitive health records in this local prototype.

Instructor-reviewed assessments, protected media uploads, cloud synchronization, progression engine and verified instructional media are not yet implemented. Acrobatic skills require qualified in-person supervision.

## GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, choose **main** and **/(root)**, then Save. Once deployed, open https://fempai.github.io/The-Art-of-Movement/ . GitHub Pages publication can take several minutes.

## Next technical milestones

1. Validate mobile behavior and journal export.
2. Audit existing Life OS Supabase authentication and row-level security before shared tables are created.
3. Add private training tables and authenticated sync, with conflict-safe record identifiers.
4. Add academy-to-Life-OS navigation and one shared journal.
5. Add coach review workflow and private storage only after permissions are verified.
