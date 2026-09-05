---
name: find-jobs
description: >-
  Hunt for new roles on the applicant's configured job boards, dedupe against everything already
  scraped, filter to the applicant's profile and hard constraints, and save the genuinely-new
  ones. Triggers: "find jobs", "search for roles", "any new <keyword> jobs", "job sweep".
user-invocable: true
argument-hint: "[role/keywords or board url]"
license: MIT
---

# find-jobs

Hunt for new roles on the applicant's configured job boards, dedupe against everything already
scraped, filter to the applicant's profile, and save the genuinely-new ones.

> [!important] Browser automation reads JS-rendered search pages; plain fetch usually cannot.
> Most modern job boards render search results with JavaScript and block plain HTTP fetching.
> Use a browser-automation tool (driving a real, ideally logged-in browser) to read the live
> DOM of **search** pages. Plain fetch is still fine for scraping a *single* posting once you
> have its URL (see step 5).

## Inputs

- No argument -> run the **default sweep** using the search terms configured in the applicant's
  `job-boards.md`.
- An argument (role title, keywords, or a posting URL) -> use it as the search term. If a URL,
  fetch it first to understand the role, then search for similar.

## 0. Load context first

1. Read the applicant's **`profile.md`** (e.g. `resume/<slug>/profile.md`) — especially
   **`## Hard constraints & filters`** (degree, language, salary floor, location) and the
   stated preferences. These gate what counts as a hit.
2. Read the applicant's **`job-boards.md`** (start from `templates/job-boards.example.md`). It
   lists the boards to search, the search URL pattern for each, default search terms, and the
   per-board DOM-extraction approach. **Boards are jurisdiction-specific** — the user maintains
   this file for their country/market.
3. **Build the dedupe set:** list the applicant's `job-postings/` (and its `applied/`,
   `interview/`, `lost/`, `archived/` subfolders) and note every `<company>` + `<role>`. Also
   treat anything in the active interview pipeline as already-known. Never re-scrape a
   company+role already present.

## 1. Search each configured board

For each board in `job-boards.md`, open its search URL (substituting the search term) in the
browser and extract the result cards with the board's configured extraction script. The example
config ships with working extractors for a couple of boards as a starting point; other boards
need their own selectors (the README is explicit about this).

Prefer a newest-first sort in the search URL — the top of the list is then exactly the delta
since the last sweep. Decline a cookie banner only if it blocks interaction; otherwise ignore
it — banners don't block DOM reads.

## 2. Filter to the profile

Drop noise (roles clearly off the applicant's profile). Keep on-profile roles — and do not
down-rank leadership / strategy / architect / advisory roles just because they are not
hands-on coding; check `profile.md` for whether the applicant is open to them. Apply hard
constraints as **flags, not silent drops** — still surface a strong role that lists a blocking
requirement, but mark the risk so the user decides.

## 3. Dedupe + present

Remove anything in the dedupe set from step 0. Present a clean table grouped by board with
**Role · Company · Location · fit / flag**, and explicitly list what was skipped as
already-tracked. Recommend a few top picks on the applicant's stated priorities. Close with a
one-line tally: N new, N saved, N already-tracked.

## 4. Scrape the new ones

For each new role the user wants saved, run **`$scrape-job`** on its URL
(fetching the single ad page works fine even though search pages do not). Save with the
`YYYYMMDD-<company>-<job-title>.md` pattern (today's date). Add a `## Notes` section flagging
any hard-constraint hits and a one-line fit read. Then offer `$assess-job` and
`$tune-resume`.

## 5. Keep the profile current

If the sweep surfaces a new preference signal (e.g. the applicant reacts to a role type), fold
it back into `profile.md` via the `applicant-profile` skill.
