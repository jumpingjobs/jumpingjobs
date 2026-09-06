---
name: assess-offer
description: >-
  Evaluate a job offer end to end: extract every term from the offer letter into a structured
  file, flag what is missing or ambiguous, check the written terms against what was promised
  verbally, weigh pros/cons and red flags against the profile and the rest of the pipeline,
  build a negotiation plan, and draft the response. Triggers: "I got an offer", "evaluate
  this offer", "should I take it", "help me respond to the offer", "they offered <X>", an
  offer letter or offer email arriving.
user-invocable: true
argument-hint: "[company or posting]"
license: MIT
---

# assess-offer

An offer is the highest-stakes document the search produces, usually arrives with a deadline,
and is written by the other side. Evaluate it the way the rest of the pipeline works:
extract everything, compare against the sources of truth, and decide deliberately — not
under time pressure on a phone call.

## 1. Find the posting and gather the sources

1. Resolve the applicant (several `resume/<slug>/` workspaces -> the one named or implied,
   otherwise ask) and locate the posting, normally in `job-postings/3-interview/`.
2. Get the **offer itself** — pasted text, PDF, or email. Work from the actual document;
   a summary of an offer is not an offer.
3. Read `profile.md` (salary floor, hard constraints, preferences), the posting note, and
   the posting's `<slug>-debrief.md` if one exists — **especially any salary-round section**.
   Verbal promises have a way of shrinking on paper; the debrief is the record to check the
   written terms against.

## 2. Extract every term — `<slug>-offer.md`

Create **one new file next to the posting**, following the slug rule (copy the posting's
filename character-for-character): **`<slug>-offer.md`**. Extract the terms **verbatim
where wording matters** (non-compete, clawback, termination):

```markdown
# Offer — <Company> — <Role>
**Received:** YYYY-MM-DD · **Expires/answer by:** <date or "not stated">

## Terms as written
- **Title / level / reports to:** ...
- **Base salary:** ...
- **Bonus / variable:** <target, cap, criteria, discretionary or contractual>
- **Equity:** <type, amount, vesting schedule, cliff, strike/valuation, leaver terms>
- **Pension / retirement:** ...
- **Vacation:** ...
- **Insurance & benefits:** ...
- **Start date:** ...
- **Probation period & its notice terms:** ...
- **Notice period after probation:** ...
- **Non-compete / non-solicit:** <scope, duration, compensation during — quote it>
- **IP assignment:** <scope — does it reach side projects?>
- **Location / remote terms:** ...
- **Hours / overtime treatment:** ...
- **Anything else:** relocation, signing bonus, clawbacks, training bonds...

## Missing or ambiguous — ask before signing
- <every term the letter does not state or states vaguely>

## Verbal vs written
- <each promise from the debrief/interviews and whether the letter honors it>

## Pros / Cons
## Red flags
## Fit check
## Negotiation plan
## Recommendation
## Decision log
- YYYY-MM-DD — <received / countered / accepted / declined, and why>
```

**Missing terms are findings, not blanks.** An offer silent on bonus criteria, leaver
terms, or non-compete compensation is asking the applicant to sign uncertainty; every gap
becomes a question to send back before any signature.

## 3. Evaluate

- **Fit check** — against the profile: salary floor met? Hard constraints respected?
  Trajectory (step up / lateral / down vs the current role, same test as `assess-job`)?
  Does it match the stated preferences (stage, remote, role flavor), and what did earlier
  assessments of this posting flag?
- **Pros / cons** — honest, including the non-monetary ones (scope, manager, learning,
  commute, stability).
- **Red flags** — read as the other side's lawyer wrote it: broad or uncompensated
  non-competes, IP clauses reaching personal projects, discretionary-only bonus, long
  probation with short notice, clawbacks and training bonds, and **exploding deadlines** —
  pressure to sign fast is itself information. A reasonable employer grants a few days;
  say so plainly if the deadline is not reasonable.
- **Leverage** — look at the rest of the pipeline (`2-applied/`, `3-interview/` across the
  workspace): active processes are the BATNA. Name it explicitly, even if the honest answer
  is "no leverage — the alternative is continuing the search."

## 4. Negotiate and respond

1. **Negotiation plan** — what to counter on and in what order (usually: base, then
   equity/bonus terms, then vacation/flexibility, then the legal terms that cost the
   employer nothing to fix). Anchor each ask in something: the market, the debrief record,
   a competing process, the role's scope. Note what is *not* worth spending leverage on.
2. **Draft the response** — accept, counter, or decline, matching the applicant's decision:
   short, warm, specific. A counter names concrete numbers/terms and reaffirms enthusiasm;
   a decline burns no bridges. **Draft only — never send anything.** The applicant sends it.
3. Record every exchange in the `## Decision log` with dates.

## 5. Follow through on the decision

- **Accepted** -> move the posting (and its whole slug family) to **`job-postings/6-won/`**
  via the `move-job` skill, then update `profile.md` via `applicant-profile`: the accepted
  role is the applicant's **new current role** — the baseline every future trajectory
  comparison uses. Offer to draft polite withdrawals for the other active processes.
- **Declined** -> the posting moves to `4-lost/` (withdrawn), with the reason in the
  decision log — a declined offer is valuable calibration for what would be worth taking.
- **Negotiating** -> the posting stays in `3-interview/` until resolved.

## Conventions

- Advise, don't decide: lay out the analysis and a clear recommendation, but the decision
  and every sent message are the applicant's.
- Compensation norms are jurisdiction-specific (non-compete enforceability, pension,
  vacation minimums). Flag where a term is unusual *for the applicant's market*, and say
  when unsure rather than asserting.
- Never fabricate market data. Distinguish "the market pays X" (sourced) from "this feels
  low" (judgment).
