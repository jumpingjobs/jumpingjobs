#!/usr/bin/env node
// Validation: JSON manifests parse, source skills are well-formed, and every generated
// harness tree is complete with no unresolved {{placeholders}}.
// Exits non-zero on any problem (used by CI and `npm run check`).

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROVIDERS } from './lib/providers.mjs';
import { parseSkill, listDirs } from './lib/utils.mjs';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
let errors = 0;
const fail = (m) => { console.error(`  FAIL  ${m}`); errors++; };
const ok = (m) => console.log(`  ok    ${m}`);

// 1. JSON manifests must parse.
for (const f of ['.claude-plugin/marketplace.json', '.claude-plugin/plugin.json', 'package.json']) {
  try { JSON.parse(readFileSync(join(ROOT, f), 'utf8')); ok(`json  ${f}`); }
  catch (e) { fail(`json  ${f}: ${e.message}`); }
}

// 2. Source skills: frontmatter has name (matching the directory) and a description.
const SRC = join(ROOT, 'source', 'skills');
const skills = listDirs(SRC).sort();
if (skills.length === 0) fail('no source skills found under source/skills/');
for (const name of skills) {
  const { frontmatter } = parseSkill(readFileSync(join(SRC, name, 'SKILL.md'), 'utf8'));
  const nameM = frontmatter.match(/^name:\s*(.+)$/m);
  const hasDesc = /^description:/m.test(frontmatter);
  if (!nameM) fail(`source ${name}: missing "name"`);
  else if (nameM[1].trim() !== name) fail(`source ${name}: name "${nameM[1].trim()}" does not match directory`);
  if (!hasDesc) fail(`source ${name}: missing "description"`);
  if (nameM && nameM[1].trim() === name && hasDesc) ok(`skill ${name}`);
}

// 3. Generated trees: every provider has every skill, with no leftover {{placeholders}}.
for (const provider of Object.values(PROVIDERS)) {
  let providerOk = true;
  for (const name of skills) {
    const f = join(ROOT, provider.configDir, 'skills', name, 'SKILL.md');
    if (!existsSync(f)) { fail(`${provider.configDir}: missing "${name}" (run npm run build)`); providerOk = false; continue; }
    const leftover = readFileSync(f, 'utf8').match(/\{\{(\w+)\}\}/);
    if (leftover) { fail(`${provider.configDir}/${name}: unresolved placeholder ${leftover[0]}`); providerOk = false; }
  }
  if (providerOk) ok(`generated ${provider.configDir} (${skills.length} skills)`);
}

console.log(errors
  ? `\n${errors} problem(s) found.`
  : `\nAll checks passed: ${skills.length} skills x ${Object.keys(PROVIDERS).length} providers.`);
process.exit(errors ? 1 : 0);
