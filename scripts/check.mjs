#!/usr/bin/env node
// Validation: JSON manifests parse and agree on version, source skills are well-formed and
// harness-neutral, and (if built) every generated harness tree is complete and correctly
// rewritten. Exits non-zero on any problem (used by CI and `npm run check`).
//
// Generated trees are NOT committed — run `npm run build` first, or pass --source-only to
// check just the committed files.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROVIDERS, NEUTRAL_PREFIX } from './lib/providers.mjs';
import { parseSkill, listDirs } from './lib/utils.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceOnly = process.argv.includes('--source-only');
let errors = 0;
const fail = (m) => { console.error(`  FAIL  ${m}`); errors++; };
const ok = (m) => console.log(`  ok    ${m}`);

// 1. JSON manifests must parse.
const manifests = {};
for (const f of ['.claude-plugin/marketplace.json', '.claude-plugin/plugin.json', 'package.json']) {
  try { manifests[f] = JSON.parse(readFileSync(join(ROOT, f), 'utf8')); ok(`json  ${f}`); }
  catch (e) { fail(`json  ${f}: ${e.message}`); }
}

// 2. The three manifests must agree on version — a stale plugin manifest ships the wrong
//    version to Claude plugin-marketplace users, who install from git rather than npm.
const versions = {
  'package.json': manifests['package.json']?.version,
  '.claude-plugin/plugin.json': manifests['.claude-plugin/plugin.json']?.version,
  '.claude-plugin/marketplace.json': manifests['.claude-plugin/marketplace.json']?.plugins?.[0]?.version,
};
const distinct = [...new Set(Object.values(versions).filter(Boolean))];
if (distinct.length === 1) ok(`version ${distinct[0]} consistent across manifests`);
else fail(`version mismatch: ${JSON.stringify(versions)} — all three must match`);

// 3. The native Claude plugin installs straight from git with no build step, so its skills
//    path must point at a committed directory (source/), never at generated output.
const skillsPath = manifests['.claude-plugin/plugin.json']?.skills || '';
if (/^\.\/source\/skills\/?$/.test(skillsPath)) ok(`plugin.json skills -> ${skillsPath} (committed)`);
else fail(`plugin.json skills is "${skillsPath}" — must be "./source/skills/", since generated trees are not committed`);

// 4. Source skills: frontmatter has name (matching the directory) and a description.
const SRC = join(ROOT, 'source', 'skills');
const skills = listDirs(SRC).sort();
if (skills.length === 0) fail('no source skills found under source/skills/');
for (const name of skills) {
  const raw = readFileSync(join(SRC, name, 'SKILL.md'), 'utf8');
  const { frontmatter } = parseSkill(raw);
  const nameM = frontmatter.match(/^name:\s*(.+)$/m);
  const hasDesc = /^description:/m.test(frontmatter);
  const leftover = raw.match(/\{\{(\w+)\}\}/);
  if (!nameM) fail(`source ${name}: missing "name"`);
  else if (nameM[1].trim() !== name) fail(`source ${name}: name "${nameM[1].trim()}" does not match directory`);
  if (!hasDesc) fail(`source ${name}: missing "description"`);
  // Source is written in the neutral form and read directly by Claude — a leftover
  // {{token}} would reach the user verbatim.
  if (leftover) fail(`source ${name}: contains template token ${leftover[0]} — source must be literal`);
  if (nameM && nameM[1].trim() === name && hasDesc && !leftover) ok(`skill ${name}`);
}

// 5. Generated trees (only meaningful after a build): complete, and rewritten for harnesses
//    whose command prefix differs from the neutral one.
const built = Object.values(PROVIDERS).some((p) => existsSync(join(ROOT, p.configDir, 'skills')));
if (sourceOnly || !built) {
  console.log(`  skip  generated trees (${sourceOnly ? '--source-only' : 'not built; run npm run build'})`);
} else {
  const names = skills.join('|');
  const countCmds = (text, prefix) =>
    (text.match(new RegExp(`\\${prefix}(${names})\\b`, 'g')) || []).length;

  for (const provider of Object.values(PROVIDERS)) {
    let providerOk = true;
    for (const name of skills) {
      const f = join(ROOT, provider.configDir, 'skills', name, 'SKILL.md');
      if (!existsSync(f)) { fail(`${provider.configDir}: missing "${name}" (run npm run build)`); providerOk = false; continue; }
      const out = readFileSync(f, 'utf8');
      const src = readFileSync(join(SRC, name, 'SKILL.md'), 'utf8');
      const want = countCmds(src, NEUTRAL_PREFIX);
      const got = countCmds(out, provider.commandPrefix);
      // Both directions matter: the neutral form must be gone AND the harness's own form
      // must appear exactly as often, or the rewrite mangled the command names.
      if (got !== want) {
        fail(`${provider.configDir}/${name}: expected ${want} "${provider.commandPrefix}command" reference(s), found ${got}`);
        providerOk = false;
      }
      if (provider.commandPrefix !== NEUTRAL_PREFIX && countCmds(out, NEUTRAL_PREFIX) > 0) {
        fail(`${provider.configDir}/${name}: neutral "/command" survived the rewrite`);
        providerOk = false;
      }
    }
    if (providerOk) ok(`generated ${provider.configDir} (${skills.length} skills)`);
  }
}

console.log(errors
  ? `\n${errors} problem(s) found.`
  : `\nAll checks passed: ${skills.length} skills x ${Object.keys(PROVIDERS).length} providers.`);
process.exit(errors ? 1 : 0);
