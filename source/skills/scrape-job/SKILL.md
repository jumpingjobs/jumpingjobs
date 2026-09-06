---
name: scrape-job
description: >-
  Scrape a job posting from a URL and save it as a structured Markdown file in the
  job-postings folder, deduping against everything already saved. Triggers: "scrape this job",
  "save this posting", "add this job <url>".
user-invocable: true
argument-hint: "[posting url]"
license: MIT
---

# scrape-job

Scrape a job posting URL and save it as a structured Markdown file in the job-postings folder.

## Instructions

1. Take the user's input as a URL to a job posting.
2. **Dedupe first — check ALL job-postings subfolders before scraping.** A role may already
   exist as scraped, applied, in-interview, lost, or archived. Search the whole tree
   (`job-postings/1-scraped/`, `2-applied/`, `3-interview/`, `4-lost/`, `5-archived/`, plus
   the root for strays) for a match by **(a) the posting URL/job-ID** and **(b) company +
   job title** (the same role is often reposted under a new URL/ID, and the same job appears on
   multiple boards with different IDs). Quick check: `grep -rli "<job-id>"` and
   `grep -rli "<company>"` across the `job-postings/` tree.
   - **If a match exists, do NOT re-scrape.** Tell the user where it lives and its status
     (active / applied / lost / archived), and stop unless they explicitly want it re-scraped
     or revived. This prevents the duplicate-scrape problem (e.g. a role scraped weeks ago and
     archived getting scraped again under today's date).
3. Fetch the page content. (A plain web fetch works for most single posting pages. If the page
   is JS-rendered or blocks fetching, use a browser-automation tool against a logged-in
   session.)
4. Extract all details: job title, company, location, employment type, date posted,
   application deadline/expiration date, contact info, description, responsibilities,
   requirements, qualifications, benefits, and any other relevant information.
5. Save as a Markdown file in the applicant's `job-postings/1-scraped/` folder (e.g.
   `resume/<slug>/job-postings/1-scraped/`). Ask which applicant if unclear.
6. Name the file using the pattern: `YYYYMMDD-<company>-<job-title>.md` (lowercase, hyphenated).
   The `YYYYMMDD` prefix is the **date the job is scraped/added** (use today's date) so
   postings sort chronologically. Example: `20260606-acme-staff-engineer.md`.

   **This slug is the posting's permanent identity.** Every artifact for the posting reuses it
   *character-for-character* — the same date, company, and role spelling — plus a suffix:
   - `<slug>.md` — the posting (this skill)
   - `<slug>.html` — the tuned resume (`tune-resume`)
   - `<slug>-cheatsheet.md` — interview cheat sheet (`interview-cheatsheet`)
   - `<slug>-interview-prep.md` — interview dossier (`interview-prep`)
   - `<slug>-cover.md` — cover letter, and any other derived file: `<slug>-<what>.md`
   Never re-derive the slug from the posting title, re-spell the company, or re-date it — a
   revived or re-scraped role keeps its **original** date. Files that share the prefix sort
   together in the folder; a drifted prefix orphans the artifact.
7. Use this structure for the file:

```
# <Job Title> - <Company>

**Company:** <company>
**Location:** <location>
**Employment Type:** <type>
**Posted:** <date if available>
**Deadline:** <application deadline if available>
**Contact:** <contact info>
**URL:** <original url>

---

## About

<company description>

---

## Key Responsibilities

<bulleted list>

---

## Required Qualifications & Experience

<bulleted list>

---

## Desired Qualities

<bulleted list>

---

## Benefits

<bulleted list if available>
```

8. Add a `## Notes` section flagging any hard-constraint hits against `profile.md` (language,
   degree, salary floor, location) and a one-line fit read.
9. Confirm the file was created and ask if the user wants to assess fit with
   `/assess-job` or tailor their resume with `/tune-resume`.
