---
name: applicant-profile
description: >-
  Create and maintain a verbose, durable applicant profile (profile.md) that is the single
  source of truth for an applicant's experience, strengths, preferences, and hard constraints.
  Resumes are lossy projections pulled from it. Use to initialize a new applicant
  (questionnaire-driven interview), to capture anything newly learned ("remember that I...",
  "I also did...", "my <language> is limited", a new metric or role), or to feed tune-resume,
  assess-job, and find-jobs with accurate detail. Also use to capture post-interview feedback
  or a rejection reason after an interview. Triggers: "create a profile", "init applicant",
  "update my profile", "remember this about me", "add this to my experience", "we lost the X
  role", "capture their feedback", "they rejected me because...", a rejection or feedback
  email arriving after an interview, or whenever a fact about an applicant surfaces that the
  profile does not yet capture.
user-invocable: true
license: MIT
---

# Applicant Profile

The job-search workspace lives under `resume/<applicant-slug>/` (e.g. `resume/jane-doe/`).
**A workspace can hold several applicants side by side** — each gets their own folder, and
each has **one `profile.md`** that is the verbose, durable source of truth for everything we
know about them. When more than one applicant exists, work with the one named in the request
or obvious from context — otherwise ask — and never write one applicant's facts into
another's profile.

## Why this exists

A master *resume* forces premature editorial choices: it trims to two pages, drops exact
metrics, and loses the context and stories that turn out to matter for a *specific* posting.
`profile.md` is the opposite: capture everything in detail, then **project** a tuned resume
from it per job. Resumes are lossy views; the profile is the master copy.

- **`profile.md`** = source of truth for *content* (what is true, in detail).
- **`<slug>-resume.html`** = the layout/formatting skeleton `tune-resume` copies for
  *presentation* only. It is NOT a content source; do not treat its trimmed bullets as
  authoritative.

Keep the two from drifting: when content changes, update `profile.md`, not the HTML.

## When to use

- **Init** — no `profile.md` exists for an applicant, or the user says "create/init a profile."
- **Track** — the user (or a conversation) reveals something the profile does not capture: a
  new role, a real metric, a corrected date, a tool they actually used, a preference, a
  strength, a constraint (language, education, location, salary floor). Capture it immediately
  rather than letting it evaporate.
- **Serve** — `tune-resume`, `assess-job`, and `find-jobs` should read `profile.md` first.
  Constraints in the profile are what stop us surfacing bad-fit roles (e.g. degree-gated or
  language-gated roles).
- **Feed back** — **after every `/tune-resume`**, fold any new insight the
  tuning conversation surfaced (corrected dates, real metrics, a tool used or not, a newly
  stated constraint or strength) back into `profile.md`. The tuning dialogue is one of the
  richest sources of profile updates. Never let an insight live only inside a single tuned
  resume.
- **Learn from outcomes** — after any interview that produces feedback or a rejection reason,
  capture it via Operation 3. External feedback is the most valuable and most perishable input
  the search produces; a rejection reduced to "lost the role" throws it away.

## Operation 1: Init a new applicant

1. Confirm the applicant slug and create `resume/<slug>/profile.md` from the template below.
2. **Bootstrap from existing material first.** Before interviewing, ask the user to hand over
   whatever already exists so we start from a populated skeleton, not a blank page:
   - An existing **resume/CV** (PDF, HTML, or doc — read it directly).
   - Their **LinkedIn** profile (URL to fetch, or pasted text — LinkedIn often blocks
     fetching, so pasted text is the reliable fallback).
   - Any **portfolio / GitHub / personal site**, bios, or past cover letters.
   Extract roles, dates, skills, metrics, and projects from these into the profile **verbatim
   where useful**. This gives the skeleton; the questionnaire then *deepens and corrects* it
   rather than extracting everything from scratch.
3. **Interview the user with a questionnaire** to fill gaps and add depth — this is how the
   profile gets verbose instead of skeletal. Work *from the bootstrapped skeleton*: confirm
   what was imported, then for each role ask the digging questions below. Do not dump all
   questions at once; go section by section. Seed the per-role questions from this bank,
   adapting to their field:
   - How big was the scope? (users, data, money, team size, throughput — get the number)
   - What did you personally build or own vs. the team?
   - What did you do *differently* from how others would have?
   - Hardest problem in this role, and how you solved it?
   - Any measurable impact? (before/after, %, time saved, revenue, scale)
   - Standout feedback, recognition, or outcome?
   - Anything you did here that is NOT on any CV but should be?
   And for the whole-person sections:
   - Preferences: contract type, location/remote, salary floor, company stage, role flavor
     (IC vs lead), domains you want / want to avoid.
   - Motivations: what energizes you, what drains you.
   - Strengths: what you are genuinely better at than most.
   - Constraints / dealbreakers: education, language, visa/work authorization, hard nos.
4. Write answers into the profile **verbosely** — keep the raw detail and numbers, do not
   pre-trim for a resume.
5. Flag anything still unknown under `## Open questions / gaps to fill` so it can be filled
   later.

## Operation 2: Track something new

1. Read the current `profile.md` (it may have changed since you last saw it).
2. Slot the new fact into the right section. Correct contradictions in place rather than
   appending duplicates.
3. **Never fabricate or inflate.** If the user says they built custom orchestration, do not
   write "LangChain." If they lack a degree, record that plainly — it is a filter, not a flaw
   to hide.
4. Add a dated line to `## Change log`.
5. If the fact is a hard constraint (language, education, salary, location), make sure it is in
   `## Hard constraints & filters` so assessments respect it.
6. **If the fact changes what to search for** — a new target role/lane, a dropped one, a new
   specialty keyword, a "stop showing me X" — also update `## Default search terms` in the
   sibling **`job-boards.md`** (same folder), with a dated line in that file's change log.
   The profile drives *filtering*; `job-boards.md` drives *searching* — a lane recorded only
   in the profile never gets swept for.

## Operation 3: Capture interview feedback

**Trigger this whenever an interview produces feedback** — a rejection email with reasons,
verbal feedback relayed after a call, a recruiter's "they felt that...", or even the
applicant's own fresh self-assessment right after a round. This is one of the highest-value
inputs to the profile: it is external, specific, and tells us what to fix. Losing it (or
reducing it to "got rejected") wastes the most expensive signal the search produces.

1. **Preserve the feedback verbatim first.** Rejection feedback is carefully worded and easy
   to soften or distort in paraphrase. Quote the exact sentences into the job-posting note
   *and* mine them for the profile. Record **who** gave it (name, role), **which company +
   round**, and the **date**.
2. **Separate signal from boilerplate.** Rejection emails mix real, specific feedback with
   kind-but-empty filler ("not the right fit at this time", "a different match for the
   scope"). Flag which is which — act on the specific, discount the generic. Note honestly
   that feedback is often softened, so the real gap may be sharper than the words.
3. **Classify each point as capability vs demonstration.** A *capability* gap = the applicant
   genuinely lacks the skill (record it in `## Open questions / gaps to fill` or as a
   constraint). A *demonstration* gap = they have the substance but did not convey it in the
   room (record it as an interview-prep fix). These need opposite responses — do not conflate
   "can't do it" with "didn't show it." When the feedback contradicts what the profile says
   the applicant is strong at, it is almost always a demonstration gap, and that is a
   coachable, high-leverage fix.
4. **Cross-reference against prior feedback — this is the whole point.** Read the existing
   `## Interview feedback & recurring patterns` section before writing. If a *new* rejection
   echoes an *old* one (e.g. "too startup-scale" appearing at two different companies), that
   is a **recurring pattern** and must be elevated and marked as such — a repeated signal from
   independent sources is far stronger than either instance alone, and is the thing most worth
   fixing before the next interview. One-off feedback is noted; repeated feedback is
   escalated.
5. **Convert each real item into a concrete, forward-looking fix** — what to do differently in
   the next interview (a story to lead with, a question to pre-empt, a framing to reach for,
   named tools/frameworks to be ready to discuss). Vague lessons do not change behavior;
   "have the eval-harness story ready as a scenario answer, and pre-empt 'which frameworks'
   with 'built custom, here's why'" does.
6. **Write it into `## Interview feedback & recurring patterns`** (create the section if
   absent) and add a dated `## Change log` line. If the feedback reveals a genuine hard
   constraint or a durable strength/weakness, also update those sections so
   `/tune-resume` and `/assess-job` benefit.
7. **Keep the counterweight honest.** Do not over-fit the profile to a single rejection —
   candidates and recruiters both over-weight one bad stretch. Record the two-sided read:
   what is real signal, what is likely noise, and how confident we are.

## Profile template

```markdown
---
name: <Full Name>
slug: <applicant-slug>
location: <city, country>
citizenship: <for work-authorization context>
languages: <e.g. English (native), Spanish (limited)>
education: <degrees, or "self-taught — no formal degree">
contact: <primary email / phone>
links: <portfolio, GitHub, LinkedIn>
updated: <YYYY-MM-DD>
---

## Snapshot
<2-3 sentence positioning: who they are as a candidate.>

## Hard constraints & filters
<Dealbreakers and gatekeepers that assess-job/find-jobs must respect. e.g.
- No formal degree -> deprioritize roles where a Master's/PhD is a *hard* requirement.
- Language: limited -> roles requiring fluency in that language are a dealbreaker.
- Salary floor, location, contract type, visa.>

## Preferences & motivations
<Role flavor, company stage, what excites/drains, domains wanted/avoided.>

## Strengths
<What they are genuinely better at than most.>

## Skills & technologies
<Grouped (AI/ML, backend, cloud, data, frontend, etc.) with real proficiency and context.
Name what is strong vs. supporting. Be specific: "custom multi-agent orchestration (not
LangChain)" beats "agents".>

## Experience
### <Role> — <Company> (<start> – <end>)
- **Context:** <what the company/product was, the stakes>
- **Built / owned:** <verbose, what they personally did>
- **Metrics:** <hard numbers — scale, throughput, money, team>
- **Stories:** <specific incidents worth telling in interviews/cover letters>
- **Tech:** <stack>
<repeat per role — keep ALL detail, this is not a resume>

## Projects & side work
<Side projects, consulting, founded ventures.>

## Education & credentials
<Formal education, certs, or explicit lack thereof.>

## Notable / items of interest
<Memorable differentiators.>

## Interview feedback & recurring patterns
<External feedback from real interviews. Verbatim where given, with source (company, round,
who, date). Mark each item capability-gap vs demonstration-gap and give it a concrete
forward-looking fix. Elevate anything that recurs across >=2 companies — recurring items are
the priority fixes. End with an honest counterweight: signal vs likely noise.>

## Open questions / gaps to fill
<Things to ask the applicant later.>

## Change log
- <YYYY-MM-DD> — <what changed>
```

## Conventions

- One profile per applicant, at `resume/<slug>/profile.md`.
- Verbose beats tidy — the whole point is to retain detail a resume would discard.
- Truthful always. Record gaps and constraints honestly; they make assessments useful.
- Re-read before editing (an auto-formatter may have reformatted it). Match existing formatting.
- This is the source `tune-resume`, `assess-job`, and `find-jobs` should consult.
