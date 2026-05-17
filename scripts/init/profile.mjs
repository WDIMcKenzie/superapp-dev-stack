import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = join(__dirname, '../..');

export function profilePath(projectDir) {
  return join(projectDir, '.superapp', 'profile.json');
}

export function writeProfile(projectDir, profile) {
  const dir = join(projectDir, '.superapp');
  mkdirSync(dir, { recursive: true });
  const payload = {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    ...profile,
  };
  writeFileSync(profilePath(projectDir), `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

export function readProfile(projectDir) {
  const p = profilePath(projectDir);
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}
