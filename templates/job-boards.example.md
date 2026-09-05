# Job boards (example config for `find-jobs`)

`find-jobs` reads this file to know which boards to search, how to build each search URL, and
how to extract result cards from each board's (JavaScript-rendered) search page.

**Boards are market-specific.** The two below are real, working examples for the Norwegian
market (Finn.no and The Hub). For your country/market, replace them with your boards and write
the matching extractor. Each board needs its own selectors because every site structures its
result cards differently. Copy this file to `resume/<slug>/job-boards.md` and edit it.

## Default search terms

- Primary: `AI` (swap for your target role/keywords)
- Also consider: your specialty keywords, seniority terms.

---

## Board: Finn.no (Norway) — EXAMPLE

- **Search URL:** `https://www.finn.no/job/search?q=<TERM>&sort=PUBLISHED_DESC`
  (`PUBLISHED_DESC` = newest first, so the top of the list is what changed since last sweep.)
- **Posting URL shape:** `https://www.finn.no/job/ad/<id>`
- **Extractor** (run with the browser tool's evaluate-script against the search page):

```js
() => {
  const out = [], seen = new Set();
  document.querySelectorAll('a[href*="/job/ad/"]').forEach(a => {
    const m = a.href.match(/\/job\/ad\/(\d+)/); if (!m) return;
    const id = m[1]; const title = (a.textContent || '').trim();
    if (!title || title.length < 5 || seen.has(id)) return; seen.add(id);
    const art = a.closest('article');
    const lines = art ? art.innerText.split('\n').map(s => s.trim()).filter(Boolean) : [];
    out.push({ id, url: a.href, title, lines }); // lines ~ [title, company, teaser, location, age]
  });
  return { count: out.length, jobs: out };
}
```

---

## Board: The Hub (Nordics) — EXAMPLE

- **Search URL:** `https://thehub.io/jobs?search=<TERM>&countryCode=NO&sorting=mostPopular`
- **Posting URL shape:** `https://thehub.io/jobs/<id>`
- **Note:** The Hub is a SPA; the card text is a *sibling* of the `/jobs/<id>` link, not inside
  it, so `a.innerText` is empty. Walk up to the card container.
- **Extractor:**

```js
() => {
  const out = [], seen = new Set();
  [...document.querySelectorAll('a[href*="/jobs/"]')]
    .filter(a => { const s = (a.getAttribute('href') || '').split('/jobs/')[1]; return s && s.length > 6; })
    .forEach(a => {
      const slug = a.getAttribute('href').split('/jobs/')[1]; if (seen.has(slug)) return; seen.add(slug);
      let node = a;
      for (let i = 0; i < 6; i++) {
        if (!node.parentElement) break; node = node.parentElement;
        if (node.querySelectorAll('a[href*="/jobs/"]').length === 1) {
          const t = node.innerText.replace(/\s+/g, ' ').trim();
          if (t.length > 6) { out.push({ href: a.href, text: t.slice(0, 160) }); return; }
        }
      }
    });
  return { count: out.length, jobs: out }; // text ~ "Title Company Location Full-time"
}
```

---

## Adding your own board

1. Find the board's search URL and confirm a `newest-first` sort param.
2. Open the search page in the browser tool and inspect a result card.
3. Write an extractor that returns `{ url, title, lines }` (or `{ href, text }`) per card.
4. Note the single-posting URL shape so `scrape-job` can fetch each hit.

Common boards by market: LinkedIn Jobs and Indeed (global, often gated — a logged-in browser
session helps), Otta / Welcome to the Jungle (EU), Wellfound (startups, US), and your country's
national boards.

---

## Maintenance (who keeps this file true)

This file is **living config, not set-and-forget**:

- **`find-jobs` owns the extractors.** Boards redesign their markup and extractors rot
  silently — a broken extractor looks exactly like "no new jobs." When a board returns 0 cards
  but the page visibly shows results, `find-jobs` repairs the extractor against the live DOM
  and writes the fix back here.
- **`applicant-profile` keeps the search terms honest.** When the profile's target roles/lanes
  change, the `## Default search terms` above are updated to match — a lane recorded only in
  `profile.md` never gets swept for.
- Every change lands as a dated line below, **newest first**, so a sweep can see when a board
  was last verified working.

## Change log

- YYYY-MM-DD: (example) Finn.no extractor rewritten — result cards moved from `<article>` to
  `<div data-testid="job-card">` in a site redesign.
- YYYY-MM-DD: File created from templates/job-boards.example.md.
