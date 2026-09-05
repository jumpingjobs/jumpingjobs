#!/usr/bin/env node
// JumpingJobs build: transform the single source of truth (source/skills/<name>/SKILL.md)
// into per-harness output directories (.claude/, .cursor/, .github/, ...).
//
// Usage:
//   node scripts/build.mjs            # generate all harness outputs
//   node scripts/build.mjs --clean    # remove generated harness dirs
//
// Source of truth: source/skills/<name>/{SKILL.md, reference/*, scripts/*}
// Output: <configDir>/skills/<name>/...  (one tree per provider in providers.mjs)

import {
  cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROVIDERS, NEUTRAL_PREFIX } from './lib/providers.mjs';
import { parseSkill, applyCommandPrefix, assembleSkill, listDirs, listFiles } from './lib/utils.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC_SKILLS = join(ROOT, 'source', 'skills');

const clean = process.argv.includes('--clean');

function cleanGenerated() {
  for (const { configDir, displayName } of Object.values(PROVIDERS)) {
    const dir = join(ROOT, configDir, 'skills');
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`  cleaned ${configDir}/skills  (${displayName})`);
    }
  }
}

function buildSkillForProvider(skillName, provider, skillNames) {
  const { configDir, commandPrefix } = provider;
  const srcDir = join(SRC_SKILLS, skillName);
  const outDir = join(ROOT, configDir, 'skills', skillName);
  mkdirSync(outDir, { recursive: true });

  // 1. SKILL.md — rewrite slash commands into this harness's spelling (no-op for "/").
  const raw = readFileSync(join(srcDir, 'SKILL.md'), 'utf8');
  const { frontmatter, body } = parseSkill(raw);
  const outBody = applyCommandPrefix(body, commandPrefix, skillNames);
  const outFront = applyCommandPrefix(frontmatter, commandPrefix, skillNames);
  writeFileSync(join(outDir, 'SKILL.md'), assembleSkill(outFront, outBody));

  // 2. Copy sibling reference/ and scripts/ directories, applying the same slash-command
  //    rewrite to .md files (other files are copied verbatim).
  for (const sib of ['reference', 'scripts']) {
    const sibSrc = join(srcDir, sib);
    if (!existsSync(sibSrc)) continue;
    const sibOut = join(outDir, sib);
    cpSync(sibSrc, sibOut, { recursive: true });
    if (commandPrefix === NEUTRAL_PREFIX) continue;
    for (const f of listFiles(sibOut).filter((p) => p.endsWith('.md'))) {
      writeFileSync(f, applyCommandPrefix(readFileSync(f, 'utf8'), commandPrefix, skillNames));
    }
  }
}

function build() {
  if (!existsSync(SRC_SKILLS)) {
    console.error(`No source skills found at ${SRC_SKILLS}`);
    process.exit(1);
  }
  const skills = listDirs(SRC_SKILLS).sort();
  console.log(`Building ${skills.length} skill(s) for ${Object.keys(PROVIDERS).length} provider(s)...\n`);

  for (const [key, provider] of Object.entries(PROVIDERS)) {
    for (const skill of skills) buildSkillForProvider(skill, provider, skills);
    console.log(`  ${provider.configDir.padEnd(10)} ${provider.displayName} — ${skills.length} skills`);
  }

  console.log(`\nDone. Source of truth: source/skills/  ->  generated per-harness trees.`);
  console.log(`Skills: ${skills.join(', ')}`);
}

if (clean) {
  console.log('Cleaning generated harness output...');
  cleanGenerated();
  console.log('Done.');
} else {
  build();
}
