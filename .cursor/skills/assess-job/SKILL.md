---
name: assess-job
description: >-
  Assess how well a job posting fits the applicant's experience, wants, and hard constraints,
  producing a structured fit score, pros/cons, dealbreaker check, and verdict. Triggers:
  "assess this job", "is this a good fit", "rate this posting", "should I apply to <job>".
user-invocable: true
argument-hint: "[posting file, url, or company]"
license: MIT
---

# assess-job

Assess how relevant a job posting is to the applicant's experience, wants, and needs.

## Applicant profile

Read the applicant's **`profile.md`** (e.g. `resume/<slug>/profile.md`) — it is the source of
truth for background, preferences, and especially **`## Hard constraints & filters`** (degree
requirements, language dealbreakers, salary floor, location, contract type). Base the
assessment on it. If no `profile.md` exists, suggest running the `applicant-profile` skill to
create one.

Always check the posting against the constraints recorded in the profile. Common gatekeepers:
- **Degree requirement** vs the applicant's education -> flag roles where a degree is a *hard*
  requirement if the applicant lacks one.
- **Language fluency required** vs the applicant's languages -> flag as a dealbreaker if the
  required language is one they do not have.
- **Salary** below the profile's stated floor -> flag.
- **Location** incompatible with the applicant's remote / hybrid / on-site preference -> flag.

Do not hardcode specific numbers or languages here — read them from `profile.md`.

## Instructions

1. Take the user's input as either:
   - A path to a job posting Markdown file in `job-postings/`
   - A URL to a job posting (fetch and analyze it)
   - A job title/company name to look up in `job-postings/`
2. Read the job posting details.
3. Produce a structured assessment:

### Fit Score: X/10

### Pros
- Bullet list of what makes this a good match (experience alignment, company stage, exciting
  work, etc.)

### Cons
- Bullet list of concerns (gaps in experience, formal education requirements, language
  requirements, etc.)

### Dealbreaker Check
- Required language the applicant lacks? Yes/No
- Location compatible? Yes/No
- Salary likely meets the profile floor? Yes/No/Unknown
- Degree hard-required and missing? Yes/No

### Experience Match
Rate each requirement against the applicant's background:
- Requirement -> How the applicant's experience maps (or does not)

### Verdict
A 2-3 sentence honest summary. Is this worth applying to? What is the biggest risk and the
biggest upside?

4. If multiple jobs are provided, assess each and rank them by fit.
