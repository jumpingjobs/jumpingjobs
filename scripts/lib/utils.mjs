// Small, dependency-free helpers for the build.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { NEUTRAL_PREFIX } from './providers.mjs';

// Split a SKILL.md into its raw frontmatter block and body.
// Returns { frontmatter, body }. frontmatter is the YAML text between the leading
// `---` fences (without the fences); body is everything after.
export function parseSkill(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { frontmatter: '', body: text };
  return { frontmatter: m[1], body: m[2] };
}

// Rewrite the neutral slash-command form used in source/ ("/find-jobs") into a provider's
// own spelling ("$find-jobs" on Codex). Only the known skill names are rewritten, so
// ordinary slashes in prose, paths and URLs are never touched.
// A provider using the neutral prefix gets the text back unchanged.
export function applyCommandPrefix(text, prefix, skillNames) {
  if (prefix === NEUTRAL_PREFIX) return text;
  const names = [...skillNames].sort((a, b) => b.length - a.length).map(escapeRe).join('|');
  if (!names) return text;
  // Function replacer, not a "$1" string: a prefix of "$" would otherwise be read as an
  // escape by String.replace and emit a literal "$1".
  return text.replace(new RegExp(`/(${names})\\b`, 'g'), (_whole, name) => prefix + name);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Re-assemble a SKILL.md from frontmatter + body.
export function assembleSkill(frontmatter, body) {
  return `---\n${frontmatter}\n---\n${body.startsWith('\n') ? '' : '\n'}${body}`;
}

// List all files under a directory, recursively (absolute paths).
export function listFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

// List immediate subdirectories of a directory (skill names).
export function listDirs(dir) {
  return readdirSync(dir).filter((name) => {
    try {
      return statSync(join(dir, name)).isDirectory();
    } catch {
      return false;
    }
  });
}
