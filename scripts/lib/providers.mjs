// Provider (harness) configuration map.
// Adding a new harness = one entry here. The build loop in scripts/build.mjs picks it up.
//
// Each entry:
//   configDir     - the dot-directory the harness reads skills from
//   displayName   - human label for build logs
//   commandPrefix - how this harness spells a slash command ("/" for most, "$" for Codex)
//
// source/skills/ is written in the neutral form — "/find-jobs" — and is therefore directly
// readable by any harness whose commandPrefix is "/" (which is why the native Claude plugin
// in .claude-plugin/plugin.json can point straight at source/skills/ with no build step).
// The build only *rewrites* for harnesses that diverge from the neutral form.

export const PROVIDERS = {
  claude: {
    configDir: '.claude',
    displayName: 'Claude Code',
    commandPrefix: '/',
  },
  cursor: {
    configDir: '.cursor',
    displayName: 'Cursor',
    commandPrefix: '/',
  },
  copilot: {
    configDir: '.github',
    displayName: 'GitHub Copilot (VS Code)',
    commandPrefix: '/',
  },
  gemini: {
    configDir: '.gemini',
    displayName: 'Gemini CLI',
    commandPrefix: '/',
  },
  codex: {
    configDir: '.codex',
    displayName: 'Codex CLI',
    commandPrefix: '$',
  },
  opencode: {
    configDir: '.opencode',
    displayName: 'OpenCode',
    commandPrefix: '/',
  },
  kiro: {
    configDir: '.kiro',
    displayName: 'Kiro',
    commandPrefix: '/',
  },
  // Generic Agent Skills layout (open standard: https://agentskills.io)
  agents: {
    configDir: '.agents',
    displayName: 'Agent Skills (generic)',
    commandPrefix: '/',
  },
};

// The neutral prefix used in source/skills/. A provider whose commandPrefix equals this
// needs no rewriting at all.
export const NEUTRAL_PREFIX = '/';
