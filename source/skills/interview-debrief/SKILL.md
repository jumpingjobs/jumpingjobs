---
name: interview-debrief
description: >-
  Capture an interview round immediately after it happens, while recall is still fresh: who
  was in the room, what was asked, which answers landed or stumbled, what the interviewers
  probed, signals about where it's heading, and the promised next step. Writes a per-posting
  debrief file, turns stumbles into next-round prep, and feeds recurring patterns to the
  profile. Triggers: "just had my interview", "debrief", "the <company> interview is done",
  "here's how the interview went", "they asked me about...", right after any interview,
  screening call, or salary conversation.
user-invocable: true
argument-hint: "[company or posting]"
license: MIT
---

# interview-debrief

Capture an interview round right after it happens. This is the most perishable signal in the
whole search: within a day the exact questions, the interviewers' reactions, and the moments
that wobbled blur into "it went okay." External feedback may never arrive — for many
processes the applicant's own debrief is the *only* record of what the interview actually
tested. Run this after **every** round: screen, technical, case, panel, final, and salary
conversations.

## 1. Find the posting

Resolve the applicant (with several `resume/<slug>/` workspaces, use the one named or
implied — otherwise ask) and locate the posting, normally in `job-postings/3-interview/`.
If it is still in an earlier stage, move it there first via the `move-job` skill — an
interview happened, so the pipeline should say so.

## 2. Debrief the applicant

Ask conversationally, a few questions at a time — not a form dump. The goal is to drain
their short-term memory before it fades:

- **Who was in the room** — names and roles. These people reappear in later rounds and in
  negotiations; a name captured now is context later.
- **What was asked** — as close to verbatim as they can manage, especially technical/case
  questions and anything that surprised them. Questions repeat, both across rounds at the
  same company and across companies.
- **What landed / what stumbled** — which answers visibly worked, and where they rambled,
  blanked, or under-sold something they actually have. Get the specifics, not just "the
  system design part was rough."
- **What the interviewers probed or kept returning to** — repeated probing is the clearest
  window into their real concern about the candidacy.
- **Signals** — stated timeline, mention of next rounds or other candidates, hesitations,
  enthusiasm, anything about team, scope, or compensation that the posting didn't say.
- **The promised next step** — who said they'd do what, by when.
- **Gut read** — the applicant's own score out of 10 and why, recorded honestly. Separate
  observation ("they frowned at my answer") from interpretation ("they hated it").

## 3. Write the debrief file

One debrief file per posting, next to it, following the slug rule (copy the posting's
filename character-for-character): **`<slug>-debrief.md`**. First round creates it; every
later round **appends** a section — never a second file:

```markdown
## Round N — YYYY-MM-DD — <type: screen / technical / panel / final / salary>
**Interviewers:** <names, roles>
**Questions asked:** <verbatim where possible>
**Landed:** ...
**Stumbled:** ...
**They kept probing:** ...
**Signals:** ...
**Next step:** <who / what / by when>
**Gut read:** <N>/10 — <why>
```

## 4. Feed it forward

A debrief that only sits in a file changed nothing. Before finishing:

1. **Stumbles become prep.** Convert each stumbled answer into a concrete fix — the story to
   lead with, the framing to reach for, the topic to rehearse — and write it into the
   posting's `<slug>-cheatsheet.md` (create one via the `interview-cheatsheet` skill if none
   exists) so the next round starts from the fix, not the stumble.
2. **Check for recurrence.** Skim the applicant's other `*-debrief.md` files: a question or
   stumble appearing across companies is a pattern, and patterns go to `profile.md` via the
   `applicant-profile` skill (its feedback operation) marked as **self-reported** — external
   feedback and self-assessment are weighed differently.
3. **Track the promised next step.** Record it in the posting note with its date, so a
   passed deadline is visible at the next sweep rather than silently forgotten. Offer to
   draft a thank-you / follow-up note while the details are fresh.
4. **Terminal rounds end the pipeline honestly.** Rejected in the room, or withdrawing?
   Move the posting via `move-job` and capture any feedback via `applicant-profile` — the
   debrief does not replace those steps. An **offer** on the table (or clearly coming)?
   Point at the `assess-offer` skill — it reads this debrief to check the written terms
   against what was promised verbally.

## Conventions

- Fresh beats complete: a five-minute debrief today is worth more than a thorough one next
  week. If the applicant is short on time, capture questions + stumbles + next step and stop.
- Record what happened, not a softened story. The file is private prep material; flattering
  it only degrades the next round.
- Later `interview-prep` runs for the same company must read the debrief file first — the
  previous round is the strongest predictor of the next one.
