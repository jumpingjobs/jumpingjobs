// Provider (harness) configuration map.
// Adding a new harness = one entry here. The build loop in scripts/build.mjs picks it up.
//
// Each entry:
//   configDir    - the dot-directory the harness reads skills from
//   displayName  - human label for build logs
//   placeholders - values substituted into {{...}} tokens in skill bodies
//
// Placeholders currently used by the source skills:
//   {{command_prefix}} - slash-command prefix ("/" for most, "$" for Codex)
//   {{model}}          - provider model family name (for prose that names the assistant)

export const PROVIDERS = {
  claude: {
    configDir: '.claude',
    displayName: 'Claude Code',
    placeholders: { command_prefix: '/', model: 'Claude' },
  },
  cursor: {
    configDir: '.cursor',
    displayName: 'Cursor',
    placeholders: { command_prefix: '/', model: 'the agent' },
  },
  copilot: {
    configDir: '.github',
    displayName: 'GitHub Copilot (VS Code)',
    placeholders: { command_prefix: '/', model: 'Copilot' },
  },
  gemini: {
    configDir: '.gemini',
    displayName: 'Gemini CLI',
    placeholders: { command_prefix: '/', model: 'Gemini' },
  },
  codex: {
    configDir: '.codex',
    displayName: 'Codex CLI',
    placeholders: { command_prefix: '$', model: 'GPT' },
  },
  opencode: {
    configDir: '.opencode',
    displayName: 'OpenCode',
    placeholders: { command_prefix: '/', model: 'the agent' },
  },
  kiro: {
    configDir: '.kiro',
    displayName: 'Kiro',
    placeholders: { command_prefix: '/', model: 'the agent' },
  },
  // Generic Agent Skills layout (open standard: https://agentskills.io)
  agents: {
    configDir: '.agents',
    displayName: 'Agent Skills (generic)',
    placeholders: { command_prefix: '/', model: 'the agent' },
  },
};
