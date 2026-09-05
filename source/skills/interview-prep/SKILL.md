---
name: interview-prep
description: >-
  Research a company ahead of an interview and produce two files: a comprehensive interview-prep
  dossier and a condensed, scannable cheat sheet. Covers company, product, financials,
  ownership, leadership, the role's predecessor, tech stack, competitors, and questions to ask.
  Triggers: "prep me for <company>", "research <company> for my interview", "interview dossier".
user-invocable: true
argument-hint: "[posting file, url, or company]"
license: MIT
---

# interview-prep

Research a company ahead of an interview and produce two files: a comprehensive interview-prep
dossier and a condensed, scannable cheat sheet.

## Instructions

1. Take the user's input as either:
   - A path to a job posting Markdown file (usually in `job-postings/interview/`)
   - A URL to a job posting
   - A job title/company name to look up in `job-postings/` (check root, `applied/`, and
     `interview/`)
2. Read the job posting. Note the company, role, the interviewer/contact, the deadline/interview
   date, and the tech stack.
3. Read the applicant's current resume (e.g. `resume/<slug>/<slug>-resume.html`) and
   `profile.md` so the self-positioning is grounded in their real experience, not generic
   advice.
4. Do deep research (see Research Plan). Prefer launching parallel research agents for
   independent threads (company, people, financials, competitors) to keep the main context
   clean, then synthesize.
5. Produce the two output files (see Output Files). Save both in the same folder as the job
   posting (move the posting to `interview/` first if it is not already, via
   `{{command_prefix}}move-job`).
6. After writing, show the cheat sheet in the chat and summarize the key points.

## Research Plan

Research these threads. Run independent ones in parallel. Cite sources as Markdown links.

- **Company & product** — what they sell, business model, customers, the strategic thesis
  behind the role. What is the company actually betting on?
- **Financials** — pull from the appropriate company registry / filings for the company's
  jurisdiction. (Examples: SEC EDGAR in the US; Companies House in the UK; the national business
  register elsewhere — e.g. Brønnøysundregistrene / Proff.no in Norway, Bundesanzeiger in
  Germany.) Get revenue, operating result, net result, equity, cash, and employee count for the
  last 3 years. **Always check for payment defaults / liens / insolvency notes** — a serious red
  flag. Compute loss margin and a rough runway (cash / monthly burn). Flag big year-over-year
  swings.
- **Funding & ownership** — rounds, amounts, lead investors, cap-table structure, who controls
  what.
- **Leadership & people** — the current CEO/interviewer (background, whether technical), CEO
  succession history (turnover patterns reveal a lot), the board, the founders, and the most
  senior person in the function you would be joining.
- **The role's predecessor** — find who held this role before. If none is findable, say so
  explicitly — a vacant or never-filled seat changes the mandate (founding role vs. backfill).
- **Tech stack** — from the job description plus any engineering blog, GitHub, job ads, or
  press. Note anything over- or under-engineered for the company's size, or hints at
  legacy/migration.
- **Competitive landscape** — tier it: local/national, regional, global, and emerging/new-wave
  reference points. For each key competitor note model, scale signal, and *why it matters to
  this company*. Then synthesize: where is this company squeezed, where can it win, where will
  it struggle?

### Research caveats

- Plain web fetch cannot reach paywalled or bot-protected pages (many professional networks and
  paywalled business press, and some registry tabs that are JS-rendered). Use web search to
  extract facts from snippets, try secondary sources, and use a logged-in browser-automation
  tool where needed. If financials cannot be retrieved, say so explicitly and ask the user to
  paste them. **Do not fabricate numbers.**
- Cross-check employee count and other figures across sources; flag discrepancies rather than
  silently picking one.
- Apply critical analysis: challenge the framing, offer alternative readings of why the role
  exists, and name the risks — do not just collect facts.

## Output Files

Name both after the job posting's basename:
- `<basename>-interview-prep.md` — the full dossier
- `<basename>-cheatsheet.md` — the condensed one-pager

### Interview-prep dossier structure

```
# Interview Prep: <Role> @ <Company>

**Interview date:** <date>  |  **Contact:** <name, title>  |  **Source:** <link>

## Company Overview
## Product & Market
## Financial Situation        (table: year / revenue / operating result / net result / cash /
                               equity; loss-margin & runway; payment-default flag; questions)
## Ownership Structure        (cap table + who's who)
## Board of Directors
## Key People                 (current CEO, CEO history, notable investors)
## Founder Profiles           (one block each: role, background, shareholding, why it matters)
## The Role's Predecessor     (who held it before, or explicit note that no one did)
## Tech Stack                 (with commentary on fit/over-engineering/legacy)
## Funding History
## Competitive Landscape      (local / regional / global / new-wave; per-competitor why-it-matters)
## Strategic Context          (what they are building and why; where they win/struggle)
## Questions to Ask           (grouped: funding, tech, strategy, comp; prioritized)
## Things to Watch For        (red flags + how to probe them)
## Sources
```

### Cheat sheet structure (tight, scannable, ~1-2 pages)

```
# <Company> <Role> — Interview Cheat Sheet
**<Date>** | **<Interviewer>** | Reference: link to the prep dossier

## 30-second context           (3-4 sentences + any unresolved fact to ask about)
## Financial reality           (compact 3-year table + 4-5 bullets incl. payment defaults & runway)
## Who's in the room            (people table + the power-dynamic read)
## Questions to ask             (grouped & numbered, open with the highest-stakes ones)
## What "good answers" look like / Red flags in answers
## Comp framing                 (treat equity soberly given the financials; what to negotiate)
## Stack                        (one line + commentary)
## Competitive landscape        (tiered tables + a "what this means for positioning" synthesis)
## One-liner positioning for yourself   (grounded in the resume)
## If you forget everything else, remember   (5-7 must-do bullets)
```

Keep the cheat sheet genuinely condensed — it is the in-the-room reference, not a second copy of
the dossier. Bold the numbers and names that matter. Lead with whatever is most
decision-relevant (often the financials).
