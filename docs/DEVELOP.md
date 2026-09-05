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

### Body placeholders

Bodies may use `{{tokens}}` that the build substitutes per harness:

- `{{command_prefix}}` — `/` for most harnesses, `$` for Codex.
- `{{model}}` — the assistant's name for prose (`Claude`, `Gemini`, `GPT`, or `the agent`).

Unknown tokens are left intact (so typos are visible, not silently blanked).

## Build

```
npm run build      # source/ -> per-harness trees (.claude, .cursor, .github, ...)
npm run clean      # remove generated skills/ trees
npm run rebuild    # clean + build
```

Pure Node (>=18), no dependencies. The build:

1. reads every `source/skills/<name>/SKILL.md`,
2. substitutes placeholders for each provider,
3. writes `<configDir>/skills/<name>/SKILL.md` (plus any `reference/`, `scripts/` siblings).

Generated trees are committed so the repo is clone-and-go and so the native Claude plugin (which
reads `./.claude/skills/` via `.claude-plugin/plugin.json`) works without a build step on the
user's side. To ship source-only instead, see the commented block in `.gitignore`.

## Adding a harness

Add one entry to `PROVIDERS` in `scripts/lib/providers.mjs`:

```js
myharness: {
  configDir: '.myharness',
  displayName: 'My Harness',
  placeholders: { command_prefix: '/', model: 'the agent' },
},
```

Run `npm run build`. The installer CLI (`bin/jumpingjobs.mjs`) picks it up automatically; add a
detection marker to `detectHarness()` there if the harness keeps a recognizable dot-directory.

## Distribution

- **Claude Code:** `.claude-plugin/marketplace.json` makes the repo a marketplace; the single
  plugin's `source` is the repo root. Install: `/plugin marketplace add jumpingjobs/jumpingjobs`.
- **Other harnesses:** `npx jumpingjobs install` detects the harness and copies the matching
  generated `skills/` tree into the project.

## Repository structure

```
.
  .claude-plugin/
    marketplace.json     # marketplace catalog (Claude Code)
    plugin.json          # plugin metadata; skills -> ./.claude/skills/
  source/skills/         # SOURCE OF TRUTH — edit these
  templates/             # resume.template.html, profile.example.md, job-boards.example.md
  scripts/
    build.mjs            # build orchestrator
    lib/providers.mjs    # harness config map (add a harness here)
    lib/utils.mjs        # frontmatter parse + placeholder substitution
  bin/jumpingjobs.mjs    # installer CLI
  .claude/ .cursor/ ...  # GENERATED per-harness output (do not edit by hand)
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
