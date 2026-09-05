#!/usr/bin/env node
// JumpingJobs installer CLI.
//
//   npx jumpingjobs install [--harness <name>] [--dir <path>]
//   npx jumpingjobs update  [--harness <name>] [--dir <path>]
//   npx jumpingjobs list
//   npx jumpingjobs build
//
// `install` detects which AI coding harness a project uses (by the dot-directory it keeps)
// and copies the matching generated skills tree into it. For Claude Code you can instead use
// the native plugin marketplace (see the README) — this CLI is for the other harnesses and
// for non-interactive setups.

import { cpSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { PROVIDERS } from '../scripts/lib/providers.mjs';

const PKG_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--harness' || a === '--dir') args[a.slice(2)] = argv[++i];
    else args._.push(a);
  }
  return args;
}

// Detect harness by the marker directory/file present in the target project.
function detectHarness(targetDir) {
  const markers = {
    claude: ['.claude', 'CLAUDE.md'],
    cursor: ['.cursor'],
    gemini: ['.gemini'],
    codex: ['.codex'],
    opencode: ['.opencode'],
    kiro: ['.kiro'],
  };
  const found = [];
  for (const [harness, ms] of Object.entries(markers)) {
    if (ms.some((m) => existsSync(join(targetDir, m)))) found.push(harness);
  }
  return found;
}

function ensureBuilt(harness) {
  const dir = join(PKG_ROOT, PROVIDERS[harness].configDir, 'skills');
  if (!existsSync(dir) || readdirSync(dir).length === 0) {
    console.log('Generated output missing; running build...');
    spawnSync(process.execPath, [join(PKG_ROOT, 'scripts', 'build.mjs')], { stdio: 'inherit' });
  }
  return dir;
}

function install(args, { update = false } = {}) {
  const targetDir = args.dir ? args.dir : process.cwd();
  let harness = args.harness;

  if (!harness) {
    const detected = detectHarness(targetDir);
    if (detected.length === 1) {
      harness = detected[0];
      console.log(`Detected harness: ${harness} (${PROVIDERS[harness].displayName})`);
    } else if (detected.length > 1) {
      console.error(`Multiple harnesses detected (${detected.join(', ')}). Re-run with --harness <name>.`);
      process.exit(1);
    } else {
      console.error('No harness detected. Re-run with --harness <name>. Options: ' + Object.keys(PROVIDERS).join(', '));
      process.exit(1);
    }
  }

  if (!PROVIDERS[harness]) {
    console.error(`Unknown harness "${harness}". Options: ${Object.keys(PROVIDERS).join(', ')}`);
    process.exit(1);
  }

  const srcSkills = ensureBuilt(harness);
  const { configDir, displayName } = PROVIDERS[harness];
  const destSkills = join(targetDir, configDir, 'skills');

  cpSync(srcSkills, destSkills, { recursive: true });
  console.log(`${update ? 'Updated' : 'Installed'} JumpingJobs skills into ${configDir}/skills for ${displayName}.`);
  console.log(`Also copy the resume + profile templates: see ${join(PKG_ROOT, 'templates')}`);
}

function list() {
  console.log('Supported harnesses:\n');
  for (const [key, p] of Object.entries(PROVIDERS)) {
    console.log(`  ${key.padEnd(10)} -> ${p.configDir.padEnd(10)} ${p.displayName}`);
  }
  console.log('\nClaude Code can also install via the native plugin marketplace (see README).');
}

function build() {
  spawnSync(process.execPath, [join(PKG_ROOT, 'scripts', 'build.mjs')], { stdio: 'inherit' });
}

function help() {
  console.log(`JumpingJobs CLI

  jumpingjobs install [--harness <name>] [--dir <path>]   Copy skills into a project
  jumpingjobs update  [--harness <name>] [--dir <path>]   Re-copy (refresh) skills
  jumpingjobs list                                        List supported harnesses
  jumpingjobs build                                       Regenerate per-harness output

Harnesses: ${Object.keys(PROVIDERS).join(', ')}
Claude Code users can also: /plugin marketplace add jumpingjobs/jumpingjobs`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
switch (cmd) {
  case 'install': install(args); break;
  case 'update': install(args, { update: true }); break;
  case 'list': list(); break;
  case 'build': build(); break;
  case undefined:
  case 'help':
  case '--help':
  case '-h': help(); break;
  default:
    console.error(`Unknown command "${cmd}".\n`);
    help();
    process.exit(1);
}
