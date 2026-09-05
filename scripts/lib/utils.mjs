// Small, dependency-free helpers for the build.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Split a SKILL.md into its raw frontmatter block and body.
// Returns { frontmatter, body }. frontmatter is the YAML text between the leading
// `---` fences (without the fences); body is everything after.
export function parseSkill(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { frontmatter: '', body: text };
  return { frontmatter: m[1], body: m[2] };
}

// Replace {{key}} tokens with values from the placeholders map.
// Unknown tokens are left untouched (so a typo is visible rather than silently blanked).
export function replacePlaceholders(text, placeholders) {
  return text.replace(/\{\{(\w+)\}\}/g, (whole, key) =>
    Object.prototype.hasOwnProperty.call(placeholders, key) ? placeholders[key] : whole
  );
}

// Re-assemble a SKILL.md from frontmatter + body.
export function assembleSkill(frontmatter, body) {
  return `---\n${frontmatter}\n---\n${body.startsWith('\n') ? '' : '\n'}${body}`;
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
