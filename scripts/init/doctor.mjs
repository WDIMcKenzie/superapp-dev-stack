#!/usr/bin/env node
/**
 * Quick health survey — no installs. Run: pnpm run doctor
 */
import { banner, section, ok, warn, fail } from './ui.mjs';
import { runPreflight, dockerRunning, gitConfigOk } from './checks.mjs';
import { REPO_ROOT } from './profile.mjs';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

banner();
section('SuperApp doctor — read-only checks');

for (const r of runPreflight(false)) {
  if (r.ok) ok(`${r.label}: ${r.version ?? 'ok'}`);
  else if (r.required) fail(`${r.label}: missing`);
  else warn(`${r.label}: missing (optional)`);
}

const docker = runPreflight(false).find((x) => x.id === 'docker');
if (docker?.ok) {
  if (dockerRunning()) ok('Docker daemon: running');
  else warn('Docker daemon: not running');
}

const git = gitConfigOk();
if (git.ok) ok(`Git identity: ${git.name} <${git.email}>`);
else warn('Git user.name / user.email not configured');

if (existsSync(join(REPO_ROOT, 'scripts', 'leak-scan.sh'))) {
  ok('Leak scan script present');
} else {
  warn('leak-scan.sh missing');
}

section('Next');
console.log('  Run full setup: pnpm run init');
console.log('  Curriculum:   docs/00-start-here.md');
