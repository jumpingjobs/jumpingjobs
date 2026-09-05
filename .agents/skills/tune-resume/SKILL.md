---
name: tune-resume
description: >-
  Tailor the applicant's resume HTML to a specific job posting: analyze gaps against profile.md,
  propose targeted wording changes, then write a tuned 2-page resume saved next to the posting.
  Triggers: "tune my resume for <job>", "tailor resume to this posting", "adapt my CV for <job>".
user-invocable: true
argument-hint: "[posting file, url, or company]"
license: MIT
---

# tune-resume

Fine-tune the resume HTML to better match a specific job posting.

## Instructions

1. Take the user's input as either:
   - A path to a job posting Markdown file in the applicant's `job-postings/` subdirectory
     (e.g. `resume/<slug>/job-postings/`)
   - A URL to a job posting (fetch and analyze it)
   - A job title/company name to look up in the applicant's `job-postings/` directory
2. Read the applicant's **`profile.md`** (e.g. `resume/<slug>/profile.md`) — this is the
   verbose **source of truth for content**. Pull accurate detail, metrics, and constraints from
   it. Also read the base resume HTML (e.g. `resume/<slug>/<slug>-resume.html`), which is the
   **layout/formatting skeleton** to copy — NOT a content source; its bullets are already
   trimmed. If no `profile.md` exists, suggest running the `applicant-profile` skill to create
   one.
3. Read the job posting details.
4. Analyze the gaps between the **profile** and the job requirements.
5. Before presenting the alignment report, ask clarifying questions about any experience or
   skills the applicant may have that are relevant to the posting but not currently reflected
   in the resume. For example: "The posting asks for X — do you have any experience with that?"
   This ensures the tuned resume can highlight real experience that is simply missing from the
   current version.
6. Present a structured comparison:

### Alignment Report
- **Strong matches:** Skills/experience that directly map to requirements
- **Gaps or weak areas:** Requirements not well represented in the resume
- **Unique differentiators:** Things in the resume that set the candidate apart for this role

### Proposed Changes
For each section of the resume (the shipped template's sections are **Knowledge, Experience,
Skills, Items of Interest, and Select History** — use your own template's names if they
differ), propose specific wording changes that:
- Better align with the job posting language and requirements
- Highlight relevant experience that may be undersold
- Remain truthful — never fabricate experience or inflate claims
- Keep the same formatting style (Title Case for list items)

**Important style + length rules (defaults — document overrides in the README):**
- Never use dashes (em dash, en dash) in resume bullet points. Use commas or restructure the
  sentence instead.
- The tuned resume MUST fit on exactly 2 pages.
- The tuned HTML MUST carry this rule in its `<style>` block — without it, a print silently
  paginates to 4 pages even though the content fits 2:
  ```css
  @page { size: Letter; margin: 0; }
  ```
  (Use `size: A4` in A4 markets.) The shipped template includes it; if you copy any skeleton
  that lacks it, add it.
- Select only the **3 most relevant roles** for the work-history section (Select History);
  drop the rest. The master profile has all roles for reference, but the tuned version is
  trimmed.
- Each work-history role MUST have **at most 5 bullets**. Pick the 5 most relevant
  accomplishments for the posting; drop the rest.
- The Knowledge and Experience sections (the short qualification lists at the top) MUST each
  have **at most 4 items**. Pick the 4 most relevant for the posting.
- **Every Experience item MUST start with a year count** (e.g. "3+ Years ...", "10+ Years
  ..."). No Experience line without a year prefix. Keep the figure honest — derive it from
  `profile.md`, and use a conservative "N+ Years" when unsure. (Knowledge / Skills / Items of
  Interest do not take year prefixes.)

7. Wait for the user to approve or adjust before making any changes.
8. Copy the base resume to a new HTML file. The filename MUST match the job posting Markdown
   filename but with an `.html` extension, saved in the **same directory as the job posting**.
   For example, if the posting is `job-postings/20260606-acme-staff-engineer.md`, the tuned
   resume is `job-postings/20260606-acme-staff-engineer.html`.
9. Apply approved changes to the new HTML file. Match the section structure of the base
   template exactly — do not invent new section names.
10. **Verify the page count before reporting done.** Render the tuned HTML to PDF headlessly
    and count the pages:
    ```bash
    # Chrome binary: "google-chrome" on Linux;
    # "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" on macOS
    google-chrome --headless --disable-gpu --print-to-pdf=/tmp/cv.pdf \
      "file:///abs/path/to/tuned.html"
    python3 -c "import re;print(len(re.findall(rb'/Type\s*/Page[^s]',open('/tmp/cv.pdf','rb').read())))"
    ```
    A tune is not finished until this prints `2`. Never report a resume as ready with
    verification pending — trim content and re-check until it passes.
11. **Update `profile.md` with any new insights surfaced during tuning.** The tuning
    conversation often reveals facts the profile does not yet capture (corrected dates, real
    metrics, a tool actually used vs. not, a newly stated constraint, a strength). Fold these
    back into the applicant's `profile.md` (via the `applicant-profile` skill) so the source of
    truth stays current. **Never let an insight live only in a single tuned resume.**
12. Offer to draft a short cover letter tailored to the role.
