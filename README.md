# JumpingJobs

**A job-search and resume toolkit for AI coding agents.** Build a durable profile, find and
assess roles, tailor your resume to each posting, and generate interview prep, all from your
agent's chat.

[![CI](https://github.com/jumpingjobs/jumpingjobs/actions/workflows/ci.yml/badge.svg)](https://github.com/jumpingjobs/jumpingjobs/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/jumpingjobs.svg)](https://www.npmjs.com/package/jumpingjobs)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Works in Claude Code, Cursor, GitHub Copilot, Gemini CLI, Codex CLI, OpenCode, and Kiro.

---

## What it is

One onboarding command, six workflow commands, and two supporting skills:

| Command | What it does |
|---|---|
| **`/init-resume`** | **Start here.** Scaffolds your workspace, adds the resume template, and builds your `profile.md` by reading your existing resume and interviewing you. |
| `/find-jobs` | Sweeps your configured job boards for new, on-profile roles, deduped against what you have saved. |
| `/scrape-job <url>` | Saves a posting as structured Markdown. |
| `/assess-job` | Scores a posting's fit against your profile and hard constraints. |
| `/tune-resume` | Tailors your resume to a posting (2 pages, honest, targeted). |
| `/interview-prep` | Deep company research into a full dossier plus a condensed cheat sheet. |
| `/move-job` | Moves a posting through applied / interview / lost / archived. |

The two skills the commands rely on: **applicant-profile** (maintains `profile.md`, your source
of truth) and **interview-cheatsheet** (a tight, in-the-room prep sheet).

---

## Install

### Claude Code

```
/plugin marketplace add jumpingjobs/jumpingjobs
/plugin install jumpingjobs@jumpingjobs
```

Reload plugins. Commands appear namespaced, e.g. `/jumpingjobs:init-resume`.

### Cursor, Copilot, Gemini, Codex, OpenCode, Kiro

```
npx jumpingjobs install          # auto-detects your harness from the current project
```

Or target one explicitly / see what is supported:

```
npx jumpingjobs install --harness cursor
npx jumpingjobs list
```

This copies the skills into your tool's directory (`.cursor/skills/`, `.github/skills/`,
`.gemini/skills/`, ...). Run `npx jumpingjobs update` later to refresh them.

---

## Quick start

1. **Onboard.** Run `/init-resume` (Claude Code) or invoke `init-resume` after installing.
2. **Build your profile.** Hand it your existing resume and/or LinkedIn. It extracts what it
   can, then interviews you to fill the gaps, writing `resume/<your-slug>/profile.md`.
3. **Get a starter resume.** It produces `resume/<your-slug>/<your-slug>-resume.html` from the
   template.
4. **Work the pipeline.** `/find-jobs` -> `/scrape-job` -> `/assess-job` -> `/tune-resume` ->
   `/interview-prep`, moving postings with `/move-job` as their status changes.

---

## How it works

### Your workspace

```
resume/<your-slug>/
  profile.md                 # source of truth (verbose; you maintain this)
  <your-slug>-resume.html    # layout skeleton tune-resume fills per posting
  job-boards.md              # your boards + search config (edit for your market)
  job-postings/
    applied/  interview/  lost/  archived/
```

### profile.md is the source of truth

Your resume is a lossy **projection** of `profile.md`. Keep the detail (real metrics, stories,
constraints) in the profile; let `/tune-resume` trim a 2-page resume from it per job. After
every tune, new facts surfaced in the conversation are folded **back** into `profile.md`, so it
never goes stale. **Maintain the profile, not the HTML.**

---

## Prerequisites and localization

- **Browser automation** makes `/find-jobs` and deep `/interview-prep` research work well, since
  job-board search pages and many company/registry pages are JavaScript-rendered or gated.
  Without it you can still scrape single postings and run everything else.
- **Job boards are market-specific.** `job-boards.md` ships with working examples for two
  Norwegian boards (Finn.no, The Hub) so you can see the shape. Replace them with your own boards
  and write the matching extractor (each board structures its result cards differently).
- **Company registries are jurisdiction-specific.** `/interview-prep` references "the registry
  for the company's jurisdiction" (SEC EDGAR, Companies House, your national register, ...).
  Point it at yours.

---

## Supported harnesses

Claude Code, Cursor, GitHub Copilot (VS Code), Gemini CLI, Codex CLI, OpenCode, Kiro, and the
generic [Agent Skills](https://agentskills.io) layout. Adding another is one config entry, see
[docs/DEVELOP.md](docs/DEVELOP.md).

---

## Contributing

The single source of truth is `source/skills/<name>/SKILL.md`. A small, dependency-free Node
build transforms it into per-harness output:

```
npm run build      # source/ -> all harness trees
npm run check      # validate manifests + skills
npm run rebuild    # clean + build
```

CI validates every push and fails if the committed harness trees drift from `source/`. See
[docs/DEVELOP.md](docs/DEVELOP.md) for the architecture and how to add a harness.

## License

MIT, see [LICENSE](LICENSE).
