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
   `resume/<slug>/job-postings/`). Check the root, `applied/`, `interview/`, `lost/`, and
   `archived/` folders.
3. Move the `.md` file and the `.html` file (if it exists) to the target status folder. Keep
   them together — they share a slug.

## Folder structure

Job postings move through these stages:

- **`job-postings/`** (root) — Scraped, not yet applied. New postings land here.
- **`job-postings/applied/`** — Application submitted. Move here after applying.
- **`job-postings/interview/`** — Got an interview. Move here when invited.
- **`job-postings/lost/`** — Rejected or withdrawn *after applying*. Move here when the
  opportunity is closed. If the rejection came with any feedback or reason, capture it via
  the `applicant-profile` skill (its interview-feedback operation) before or right after the
  move — do not reduce a rejection to just a folder change.
- **`job-postings/archived/`** — Looked at but **decided not to apply** (fails a hard
  constraint, below level, off-profile). Distinct from `lost/`: nothing was submitted. Future
  `{{command_prefix}}find-jobs` sweeps treat archived roles as already-seen, so they will not
  resurface.

## Usage

The user can say things like:
- "move acme to applied"
- "acme got an interview"
- "rejected from acme"
- "withdraw acme"
- "archive acme" / "not worth applying to acme"

Infer the target folder from context. Confirm the move after completing it.
