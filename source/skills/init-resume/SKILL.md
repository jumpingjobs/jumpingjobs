---
name: init-resume
description: >-
  One-shot onboarding for a new applicant: scaffold the workspace, drop in the resume HTML
  template, then build the profile.md source of truth by extracting from an existing resume and
  asking clarifying questions about experience and skills. Run this first. Triggers: "set me
  up", "get started", "init resume", "onboard me", "new applicant".
user-invocable: true
argument-hint: "[your-name]"
license: MIT
---

# init-resume

The single "start here" command. It scaffolds a new applicant's workspace and produces both the
`profile.md` source of truth and a starter resume HTML. It **orchestrates** existing pieces — it
does not re-implement the profile questionnaire (that lives in the `applicant-profile` skill).

## Flow

1. **Confirm the applicant slug.** Ask for the applicant's name and derive a lowercase,
   hyphenated `<slug>` (e.g. "Jane Doe" -> `jane-doe`). Confirm it.

2. **Scaffold the workspace.** Create:
   ```
   resume/<slug>/
   resume/<slug>/job-postings/
   resume/<slug>/job-postings/applied/
   resume/<slug>/job-postings/interview/
   resume/<slug>/job-postings/lost/
   resume/<slug>/job-postings/archived/
   ```

3. **Drop in the templates.** Copy:
   - `templates/resume.template.html` -> `resume/<slug>/<slug>-resume.html`
   - `templates/job-boards.example.md` -> `resume/<slug>/job-boards.md` (the user edits this
     for their country/market later)
   Do not copy `profile.example.md` as the real profile — the next step builds the real one.

4. **Build `profile.md` via the `applicant-profile` skill (Init operation).** Hand off to that
   skill: ask the user for an existing resume/CV and/or LinkedIn (URL or pasted text), extract
   roles, dates, skills, and metrics into `resume/<slug>/profile.md`, then run the
   clarifying-question interview section by section to deepen and correct it. Keep it verbose.

5. **Offer a first resume pass.** Once `profile.md` has real content, offer to fill the resume
   template from it by running `{{command_prefix}}tune-resume` with no specific posting — this
   produces a clean master resume at `resume/<slug>/<slug>-resume.html`. (A posting-specific
   tuned resume is produced later, per application.)

6. **Print next steps.** Tell the user the workspace is ready and point them at the workflow:
   - `{{command_prefix}}find-jobs` — sweep configured boards for new roles
   - `{{command_prefix}}scrape-job <url>` — save a specific posting
   - `{{command_prefix}}assess-job` — score fit against the profile
   - `{{command_prefix}}tune-resume` — tailor the resume to a posting
   - `{{command_prefix}}interview-prep` / `{{command_prefix}}interview-cheatsheet` — prep once an
     interview is booked
   - `{{command_prefix}}move-job` — move a posting through applied / interview / lost / archived

## Notes

- `profile.md` is the thing the applicant maintains over time; the resume HTML is a projection
  of it. Reinforce this so they update the profile, not the HTML.
- Be honest about prerequisites: `find-jobs` and deep `interview-prep` research work best with a
  browser-automation tool available; without it, the user can still scrape single postings and
  run the rest of the workflow.
