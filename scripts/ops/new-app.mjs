#!/usr/bin/env node
/**
 * Non-interactive new app (for AI / CI).
 * Usage: node scripts/ops/new-app.mjs --name my-app [--db postgres] [--host local-only] [--skip-install]
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { REPO_ROOT } from '../init/profile.mjs';
import { slugify, projectDirFor, displayPath } from '../init/paths.mjs';
import { writeProfile } from '../init/profile.mjs';
import { writeEnvLocal } from '../init/env-writer.mjs';
import { writeIdeBundle } from '../init/ide-setup.mjs';

function parseArgs(argv) {
  const out = {
    name: 'my-superapp',
    db: 'postgres',
    host: 'local-only',
    workspace: join(REPO_ROOT, 'projects'),
    skipInstall: false,
    skipDb: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--name') out.name = argv[++i];
    else if (a === '--db') out.db = argv[++i];
    else if (a === '--host') out.host = argv[++i];
    else if (a === '--workspace') out.workspace = resolve(argv[++i]);
    else if (a === '--skip-install') out.skipInstall = true;
    else if (a === '--skip-db') out.skipDb = true;
    else if (a === '--help') {
      console.log(`Usage: node scripts/ops/new-app.mjs --name <app> [--db postgres|supabase|mongodb] [--host local-only|gcp|...]`);
      process.exit(0);
    }
  }
  return out;
}

function copyTemplate(dest) {
  const src = join(REPO_ROOT, 'template');
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => {
      const rel = path.replace(src, '');
      if (rel.includes('node_modules') || rel.includes('.turbo')) return false;
      if (rel.endsWith('.env.local')) return false;
      return true;
    },
  });
  cpSync(join(REPO_ROOT, 'team'), join(dest, 'team'), { recursive: true });
  cpSync(join(REPO_ROOT, '.cursorrules'), join(dest, '.cursorrules'));
  mkdirSync(join(dest, '.cursor', 'rules'), { recursive: true });
  cpSync(join(REPO_ROOT, '.cursor', 'rules'), join(dest, '.cursor', 'rules'), {
    recursive: true,
  });
  for (const f of ['CLAUDE.md', 'CURSOR.md', 'CHATGPT.md', 'CODEX.md', 'GEMINI.md']) {
    cpSync(join(REPO_ROOT, f), join(dest, f));
  }
  const opsSrc = join(REPO_ROOT, 'scripts', 'ops');
  cpSync(opsSrc, join(dest, 'scripts', 'ops'), { recursive: true });
}

const DB_MAP = {
  postgres: { id: 'postgres', label: 'Local Postgres', playbook: 'local-postgres' },
  supabase: { id: 'supabase', label: 'Supabase local', playbook: 'supabase' },
  mongodb: { id: 'mongodb', label: 'MongoDB', playbook: 'mongodb' },
};

const HOST_MAP = {
  'local-only': { id: 'local-only', label: 'Local dev only' },
  gcp: { id: 'gcp', label: 'Google Cloud' },
  aws: { id: 'aws', label: 'AWS' },
  oracle: { id: 'oracle', label: 'Oracle Cloud' },
  godaddy: { id: 'godaddy', label: 'GoDaddy' },
  bluehost: { id: 'bluehost', label: 'Bluehost' },
  hostinger: { id: 'hostinger', label: 'Hostinger' },
};

const args = parseArgs(process.argv);
const slug = slugify(args.name);
const projectDir = projectDirFor(args.workspace, slug);

if (existsSync(projectDir)) {
  console.error(`Project folder already exists: ${displayPath(args.workspace, projectDir)}`);
  process.exit(1);
}

copyTemplate(projectDir);
writeEnvLocal(projectDir, { databaseId: args.db, appName: args.name });

const database = DB_MAP[args.db] ?? DB_MAP.postgres;
const host = HOST_MAP[args.host] ?? HOST_MAP['local-only'];
const projectPath = displayPath(args.workspace, projectDir);

const profile = writeProfile(projectDir, {
  appName: args.name,
  projectSlug: slug,
  projectPath,
  workspaceRoot: args.workspace,
  database,
  host,
  aiTools: [{ id: 'cursor', label: 'Cursor' }],
});

writeIdeBundle(projectDir, profile);

if (!args.skipInstall) {
  const r = spawnSync('pnpm', ['install'], { cwd: projectDir, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

if (!args.skipDb) {
  spawnSync('pnpm', ['run', 'db:up'], { cwd: projectDir, stdio: 'inherit' });
  spawnSync('pnpm', ['run', 'db:validate'], { cwd: projectDir, stdio: 'inherit' });
}

const rel = relative(REPO_ROOT, projectDir);
console.log(JSON.stringify({
  ok: true,
  projectPath: rel.startsWith('..') ? projectPath : rel,
  slug,
  message: 'Local stack created. GitHub and deploy are separate — use github-bootstrap trigger.',
}, null, 2));
