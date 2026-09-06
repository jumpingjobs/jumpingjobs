---
name: move-job
description: >-
  Move a job posting (and its tuned resume if one exists) to a status folder in the pipeline:
  applied, interview, lost, or archived. Triggers: "move <job> to applied", "<job> got an
  interview", "rejected from <job>", "withdraw <job>", "archive <job>", "not worth applying
  to <job>".
user-invocable: true
argument-hint: "[job] [status]"
license: MIT
---

# move-job

Move a job posting (and its tuned resume if one exists) to a status folder.

## Instructions

1. Take the user's input as a job posting name or filename, and a target status.
2. Look up the job posting in the applicant's `job-postings/` directory (e.g.
   `resume/<slug>/job-postings/`). Check all five stage folders: `1-scraped/`, `2-applied/`,
   `3-interview/`, `4-lost/`, `5-archived/` (and the root, for strays).
3. Move **every file that shares the posting's slug prefix** to the target status folder —
   the posting `.md`, the tuned resume `.html`, and any `-cheatsheet.md`,
   `-interview-prep.md`, `-cover.md`, or other `<slug>-*` artifact. List the current folder
   for `<slug>*` before moving so nothing is left behind; a stranded artifact loses its
   posting. Never rename any of them in transit — the `YYYYMMDD-company-role` prefix is the
   posting's permanent identity and is what keeps the family grouped.

## Folder structure

Job postings move through these stages. The numeric prefixes exist so the folders sort in
pipeline order in file browsers — keep them.

- **`job-postings/1-scraped/`** — Scraped / in progress, not yet applied. New postings land
  here.
- **`job-postings/2-applied/`** — Application submitted. Move here after applying.
- **`job-postings/3-interview/`** — Got an interview. Move here when invited.
- **`job-postings/4-lost/`** — Rejected or withdrawn *after applying*. Move here when the
  opportunity is closed. If the rejection came with any feedback or reason, capture it via
  the `applicant-profile` skill (its interview-feedback operation) before or right after the
  move — do not reduce a rejection to just a folder change.
- **`job-postings/5-archived/`** — Looked at but **decided not to apply** (fails a hard
  constraint, below level, off-profile). Distinct from `4-lost/`: nothing was submitted.
  Future `/find-jobs` sweeps treat archived roles as already-seen, so they will not
  resurface.

**Migration:** if the workspace still has the old layout (postings loose in the
`job-postings/` root, and/or un-numbered `applied/`, `interview/`, `lost/`, `archived/`
folders), migrate it before moving anything: rename the old folders to their numbered names
and move root-level postings into `1-scraped/` (contents intact), then tell the user what you
did. Never leave both layouts side by side — a split pipeline breaks dedupe and lookups.

## Usage

The user can say things like:
- "move acme to applied"
- "acme got an interview"
- "rejected from acme"
- "withdraw acme"
- "archive acme" / "not worth applying to acme"

Infer the target folder from context. Confirm the move after completing it.
