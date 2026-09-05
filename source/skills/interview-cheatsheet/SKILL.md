---
name: interview-cheatsheet
description: >-
  Build an interview cheat sheet for a job in the applicant's pipeline. ALWAYS create it as a
  NEW standalone Markdown file (never appended into the job-posting note), saved next to the
  posting in the same job-postings subfolder, named `<posting-slug>-cheatsheet.md`. Researches
  the company (what they do, the team/interviewer, financials/backing) and maps the applicant's
  profile to the role (why they are the best fit) plus honest gaps, why-this-company, smart
  questions, and logistics. Triggers: "interview cheat sheet", "cheat sheet for <company>",
  "prep me for the <company> interview", "create a cheat sheet".
user-invocable: true
argument-hint: "[company or posting]"
license: MIT
---

# Interview cheat sheet skill

Produce a tight, high-signal prep doc for a specific interview. **The output is ALWAYS a new
`.md` file** — do not embed it inside the job-posting note.

## Output: a new standalone file

- **Location:** the **same folder as the job posting** (usually
  `resume/<slug>/job-postings/interview/`, since a cheat sheet means an interview is happening).
- **Name:** the posting slug + `-cheatsheet.md`. The posting `.md`, the tuned resume `.html`,
  and the cheat sheet `.md` then share one slug, e.g.:
  - `20260606-acme-staff-engineer.md` (posting)
  - `20260606-acme-staff-engineer.html` (resume)
  - `20260606-acme-staff-engineer-cheatsheet.md` (cheat sheet) <- this skill
- **Cross-link:** add a one-line pointer in the posting note's Interview section:
  `Cheat sheet: <slug>-cheatsheet.md`.

## Inputs to gather first

1. **The posting note** — role, responsibilities, requirements, contact, any fit notes already
   there.
2. **The interview email/invite** — who is interviewing, round type, format (video/in-person),
   time, tools (e.g. transcription). Ask the user to paste it if it is not already captured.
3. **Company research** — use the web (a browser-automation tool against a logged-in session is
   most reliable for JS-rendered pages; plain fetch works for simple pages). Pull: the company
   about page (team, mission, product, scale), the relevant company/registry source for
   financials where applicable, recent funding/news. Public profiles of the interviewer where
   available. Cite sources as links.
4. **The applicant's profile** — `resume/<slug>/profile.md` for their real strengths, metrics,
   and **hard constraints / honest gaps** (never fabricate; same honesty bar as resume tuning).

## Read the round (set the depth accordingly)

Tailor the sheet to **who is interviewing** — check the inviter's title:
- **Recruiter / People & Talent / Talent Acquisition -> screening round.** Motivation,
  background, "why us / why this role," comp + logistics, communication. Be warm, concise,
  clearly above-bar; **signal depth, do not deep-dive.** Goal: advance to the
  technical/hiring-manager round.
- **Hiring manager / engineer / senior technical leader -> technical/fit round.** Go deeper on
  the substance and concrete stories.
- **Panel / on-site / founder coffee -> relationship + vision.** Lean on narrative, questions,
  rapport.
Always note the **format** (video/in-person), **tools** (transcription), and any
**clash/logistics**.

## Structure (sections — adapt, keep it tight)

```markdown
# Cheat sheet — <Company>, <Role> (<round type>, <date/time or TBC>)

### Read the room
Who is interviewing (name + title) -> what kind of round it is, and how to play it.
Format + tools + logistics.

### What <Company> does
What they build, market, stage, scale. Product names. Mission. (1 short paragraph + a few
bullets.)

### Team / interviewer
The interviewer's background, the founders/CEO/CTO, team size/shape. (Who you will actually be
talking to.)

### Financials / backing  *(when relevant — funding, investors, valuation, revenue, pivots)*

### Why you are the best fit  *(lead with the single strongest hook; map the profile 1:1 to
their needs)*

### Honest gaps  *(real gaps + how to frame them; never bluff — see profile.md hard constraints)*

### Tough questions they will ask — and your answers  (do NOT skip this)
Pre-draft crisp answers to the **5-8 hardest questions this specific interviewer is likely to
ask** — and **weight them toward the candidate's known gaps**, not their strengths. Pull the
gaps from profile.md + the role's requirements and rehearse the *exact* areas where they are
weak. A cheat sheet that only covers strengths leaves the candidate exposed on the questions
that actually sink interviews. For each: the likely question + a 2-3 sentence answer that
reframes a real strength into what they are looking for.

### Why <Company>  *(a crisp, genuine motivation answer ready to deliver)*

### Questions to ask  *(4-6 sharp, specific questions)*

### Logistics  *(date, time, format, link, contact; flag any calendar clash)*
```

Drop sections that do not apply (e.g. financials for a big public company). Keep it skimmable —
this is a pre-interview glance, not an essay.

## Style

- Lead with the applicant's **#1 hook** (the strongest 1:1 match between their profile and the
  role).
- **Honest about gaps** — same bar as resume tuning; frame transferable, do not fabricate.
  Respect profile.md hard constraints.
- Concrete > generic: real metrics, real names, real product names.
- Terse, bulleted, skimmable.

## After creating it

- Confirm the path to the user and give a short summary of the key points.
- Add the `Cheat sheet: <slug>-cheatsheet.md` pointer to the posting note.
- If the interview time is not set yet, note it as TBC.
