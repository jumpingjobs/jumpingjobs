# Developer guide

How JumpingJobs is built and how to extend it. Architecture is modeled on the
config-driven-factory approach used by `pbakaus/impeccable`.

## Source of truth

Everything is authored once, per skill, in:

```
source/skills/<name>/SKILL.md      # one skill (or user-invocable command)
source/skills/<name>/reference/*   # optional supporting reference files
source/skills/<name>/scripts/*     # optional helper scripts
```

`SKILL.md` frontmatter follows the [Agent Skills spec](https://agentskills.io/specification):

```yaml
---
name: skill-name                 # required, lowercase-hyphenated
description: >-                  # required, when to use + triggers
  ...
user-invocable: true             # optional; true => also a slash command
argument-hint: "[target]"        # optional; autocomplete hint
license: MIT                     # optional
---
```

### Write the neutral form — no template tokens

Source bodies are **literal, not templated**. Write slash commands the ordinary way:

```
Then offer `/assess-job` and `/tune-resume`.
```

`source/skills/` is read directly by Claude Code (see [Distribution](#distribution)), so a
`{{token}}` left in source would reach the user verbatim. `npm run check` fails on any `{{...}}`
in `source/`.

The build rewrites the neutral `/command` form for harnesses that spell commands differently —
today only Codex (`$assess-job`). Only the known skill names are rewritten, so slashes in prose,
paths, and URLs are untouched.

## Build

```
npm run build      # source/ -> per-harness trees (.claude, .cursor, .github, ...)
npm run clean      # remove generated skills/ trees
npm run rebuild    # clean + build
```

Pure Node (>=18), no dependencies. The build:

1. reads every `source/skills/<name>/SKILL.md`,
2. rewrites slash commands into each provider's spelling (a no-op for the seven `/` harnesses),
3. writes `<configDir>/skills/<name>/SKILL.md` (plus any `reference/`, `scripts/` siblings).

**Generated trees are not committed** — `source/skills/` is the only copy in git. They are
regenerated on demand:

- `prepublishOnly` rebuilds them, so every npm tarball ships all eight harnesses.
- `bin/jumpingjobs.mjs` builds them on the fly if they are missing, so `install` works from a
  bare clone.
- CI builds and validates them on every push.

This keeps a one-line skill edit a one-line diff rather than an eight-file one. The trade-off:
the trees you can browse on GitHub are gone, so read `source/` (or build locally) to see what
a harness actually receives.

## Adding a harness

Add one entry to `PROVIDERS` in `scripts/lib/providers.mjs`:

```js
myharness: {
  configDir: '.myharness',
  displayName: 'My Harness',
  commandPrefix: '/',        // '$' etc. if it does not use slash commands
},
```

Run `npm run build`. The installer CLI (`bin/jumpingjobs.mjs`) picks it up automatically; add a
detection marker to `detectHarness()` there if the harness keeps a recognizable dot-directory.

## Distribution

- **Claude Code:** `.claude-plugin/marketplace.json` makes the repo a marketplace; the single
  plugin's `source` is the repo root. Install: `/plugin marketplace add jumpingjobs/jumpingjobs`.
  A marketplace install is a plain git clone with **no build step**, which is why
  `plugin.json` points `skills` at `./source/skills/` — a committed directory. Never repoint it
  at a generated tree; `npm run check` enforces this.
- **Other harnesses:** `npx jumpingjobs install` detects the harness and copies the matching
  generated `skills/` tree into the project (building it first if absent).

## Repository structure

```
.
  .claude-plugin/
    marketplace.json     # marketplace catalog (Claude Code)
    plugin.json          # plugin metadata; skills -> ./source/skills/
  source/skills/         # SOURCE OF TRUTH — the only skill copy in git; edit these
  templates/             # resume.template.html, profile.example.md, job-boards.example.md
  scripts/
    build.mjs            # build orchestrator
    check.mjs            # validation (manifests, versions, source, generated output)
    lib/providers.mjs    # harness config map (add a harness here)
    lib/utils.mjs        # frontmatter parse + slash-command rewrite
  bin/jumpingjobs.mjs    # installer CLI
  .claude/ .cursor/ ...  # GENERATED, gitignored — `npm run build` to materialize
  README.md  LICENSE  package.json
```

## Testing locally before publishing

Claude Code (native plugin), from a clone:

```
/plugin marketplace add /absolute/path/to/jumpingjobs/plugin
/plugin install jumpingjobs@jumpingjobs
# reload plugins, then confirm /jumpingjobs:init-resume and the others appear
```

Other harness (copy into a throwaway project):

```
npx jumpingjobs install --harness cursor --dir /tmp/test-project
```

Then dry-run the workflow: `init-resume` in a scratch dir, `scrape-job` a real URL,
`assess-job`, `tune-resume` against the template, `move-job`.
