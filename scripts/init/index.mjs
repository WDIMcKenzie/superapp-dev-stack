#!/usr/bin/env node
/**
 * SuperApp Dev Stack — interactive setup wizard
 * Run: pnpm run init   OR   node scripts/init/index.mjs
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { banner, section, ok, warn, fail, info, box } from './ui.mjs';
import {
  runPreflight,
  openUrl,
  gitConfigOk,
  dockerRunning,
  TOOL_DEFS,
} from './checks.mjs';
import {
  createPrompter,
  ask,
  askYesNo,
  pickOne,
  pickMany,
} from './prompts.mjs';
import { REPO_ROOT, writeProfile } from './profile.mjs';
import { writeEnvLocal } from './env-writer.mjs';
import { writeIdeBundle } from './ide-setup.mjs';
import {
  WORKSPACE_OPTIONS,
  slugify,
  projectDirFor,
  displayPath,
  formatProjectTree,
} from './paths.mjs';

const DATABASE_OPTIONS = [
  {
    id: 'postgres',
    label: 'Local Postgres (Docker) — simplest',
    hint: 'Tier S · docker compose',
    playbook: 'local-postgres',
  },
  {
    id: 'supabase',
    label: 'Supabase local (CLI + Docker)',
    hint: 'Tier S · best for AI agents (MCP)',
    playbook: 'supabase',
  },
  {
    id: 'mongodb',
    label: 'MongoDB (Docker)',
    hint: 'Tier A · document database',
    playbook: 'mongodb',
  },
];

const HOST_OPTIONS = [
  { id: 'local-only', label: 'Local dev only (decide host later)', hint: '' },
  { id: 'gcp', label: 'Google Cloud', hint: 'Cloud Run + Cloud SQL' },
  { id: 'aws', label: 'Amazon Web Services', hint: 'ECS/Lambda + RDS' },
  { id: 'oracle', label: 'Oracle Cloud', hint: 'OCI + Autonomous DB' },
  { id: 'godaddy', label: 'GoDaddy (WordPress + split stack)', hint: 'WP on host, app on cloud' },
  { id: 'bluehost', label: 'Bluehost', hint: 'Managed WordPress' },
  { id: 'hostinger', label: 'Hostinger', hint: 'Managed WordPress' },
];

const AI_TOOL_OPTIONS = [
  { id: 'cursor', label: 'Cursor (Engineer)', hint: 'Recommended for code' },
  { id: 'claude', label: 'Claude (Orchestrator)', hint: 'Plans and routing' },
  { id: 'chatgpt', label: 'ChatGPT', hint: 'Copy/planning' },
  { id: 'codex', label: 'Codex / CI agent', hint: 'Automation' },
  { id: 'gemini', label: 'Gemini', hint: 'Research' },
];

async function preflightLoop(rl) {
  section('Step 1 — Check required tools');

  let allRequiredOk = false;
  while (!allRequiredOk) {
    const results = runPreflight(false);
    const missing = results.filter((r) => !r.ok);
    const requiredMissing = missing.filter((r) => r.required);

    for (const r of results) {
      if (r.ok) ok(`${r.label}: ${r.version ?? 'found'}`);
      else if (r.required) fail(`${r.label}: not found`);
      else warn(`${r.label}: not found (optional)`);
    }

    if (requiredMissing.length === 0) {
      allRequiredOk = true;
      break;
    }

    section('Install missing required tools');
    for (const m of requiredMissing) {
      info(`${m.label}: ${m.installHint}`);
      info(`Download: ${m.installUrl}`);
      if (await askYesNo(rl, `Open ${m.label} install page in browser?`, true)) {
        openUrl(m.installUrl);
      }
    }

    if (!(await askYesNo(rl, 'Re-run checks now?', true))) {
      fail('Cannot continue without required tools.');
      process.exit(1);
    }
  }

  const docker = TOOL_DEFS.find((t) => t.id === 'docker');
  if (docker?.check().ok && !dockerRunning()) {
    warn('Docker is installed but not running — start Docker Desktop');
    if (await askYesNo(rl, 'Open Docker Desktop download/help?', false)) {
      openUrl(docker.installUrl);
    }
  }
}

async function gitSetup(rl) {
  section('Step 2 — Git identity');
  const git = gitConfigOk();
  if (git.ok) {
    ok(`git user.name: ${git.name}`);
    ok(`git user.email: ${git.email}`);
    return;
  }

  warn('Git user.name or user.email not set globally');
  if (await askYesNo(rl, 'Configure git now?', true)) {
    const name = await ask(rl, 'Your name');
    const email = await ask(rl, 'Your email');
    if (name) spawnSync('git', ['config', '--global', 'user.name', name], { stdio: 'inherit' });
    if (email) spawnSync('git', ['config', '--global', 'user.email', email], { stdio: 'inherit' });
    ok('Git config updated');
  }

  if (await askYesNo(rl, 'Open GitHub signup (if needed)?', false)) {
    openUrl('https://github.com/signup');
  }
  if (await askYesNo(rl, 'Open GitHub 2FA settings?', false)) {
    openUrl('https://github.com/settings/security');
  }
}

async function ghAuth(rl) {
  const gh = TOOL_DEFS.find((t) => t.id === 'gh');
  if (!gh?.check().ok) return;

  section('Step 3 — GitHub CLI (optional)');
  const status = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' });
  if (status.status === 0) {
    ok('gh is authenticated');
    return;
  }

  warn('gh not logged in');
  if (await askYesNo(rl, 'Run gh auth login now?', false)) {
    spawnSync('gh', ['auth', 'login'], { stdio: 'inherit' });
  }
}

function copyTemplate(dest) {
  const src = join(REPO_ROOT, 'template');
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, {
    recursive: true,
    filter: (path) => {
      const rel = path.replace(src, '');
      if (rel.includes('node_modules')) return false;
      if (rel.includes('.turbo')) return false;
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
  cpSync(join(REPO_ROOT, 'scripts', 'ops'), join(dest, 'scripts', 'ops'), {
    recursive: true,
  });
}

function runCmd(cmd, args, cwd) {
  info(`Running: ${cmd} ${args.join(' ')}`);
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  return r.status === 0;
}

async function main() {
  banner();
  const rl = createPrompter();

  try {
    await preflightLoop(rl);
    await gitSetup(rl);
    await ghAuth(rl);

    section('Step 4 — Workspace & project');
    const workspaceChoice = await pickOne(
      rl,
      'Where should new projects live?',
      WORKSPACE_OPTIONS,
    );
    let workspaceRoot;
    if (workspaceChoice.id === 'custom') {
      info('Enter a folder that will contain one subfolder per app.');
      workspaceRoot = resolve(
        await ask(rl, 'Workspace folder path', ''),
      );
      if (!workspaceRoot) {
        fail('Workspace path is required.');
        process.exit(1);
      }
    } else {
      workspaceRoot = workspaceChoice.resolveRoot();
    }
    mkdirSync(workspaceRoot, { recursive: true });
    const wsLabel = relative(REPO_ROOT, workspaceRoot);
    ok(
      wsLabel.startsWith('..')
        ? 'Workspace: custom folder (one subfolder per app)'
        : `Workspace: ${wsLabel.replace(/\\/g, '/')}/`,
    );

    const appName = await ask(rl, 'App / project name', 'my-superapp');
    const slug = slugify(appName);
    const projectDir = projectDirFor(workspaceRoot, slug);
    info('Folder layout:');
    console.log(formatProjectTree(workspaceRoot, slug)
      .split('\n')
      .map((line) => `    ${line}`)
      .join('\n'));

    if (existsSync(projectDir) && !(await askYesNo(rl, 'Folder exists — overwrite template files?', false))) {
      fail('Pick an empty folder or allow overwrite.');
      process.exit(1);
    }

    const database = await pickOne(rl, 'Step 5 — Database (local dev)', DATABASE_OPTIONS);
    const host = await pickOne(rl, 'Step 6 — Target host (for playbooks)', HOST_OPTIONS);
    const aiTools = await pickMany(rl, 'Step 7 — AI tools you will use', AI_TOOL_OPTIONS);

    if (database.id === 'supabase') {
      const supa = TOOL_DEFS.find((t) => t.id === 'supabase');
      if (!supa?.check().ok) {
        warn('Supabase CLI not installed');
        if (await askYesNo(rl, 'Open Supabase CLI install docs?', true)) {
          openUrl(supa.installUrl);
        }
      }
    }

    section('Step 8 — Create project');
    copyTemplate(projectDir);
    ok(`Template copied to ${projectDir}`);

    writeEnvLocal(projectDir, { databaseId: database.id, appName });

    const projectPath = displayPath(workspaceRoot, projectDir);
    const profile = writeProfile(projectDir, {
      appName,
      projectSlug: slug,
      projectPath,
      workspaceRoot,
      database,
      host,
      aiTools: aiTools.map((t) => ({ id: t.id, label: t.label })),
    });

    if (!(await askYesNo(rl, 'Run pnpm install now? (recommended)', true))) {
      warn('Skipped install — run manually: cd project && pnpm install');
    } else if (!runCmd('pnpm', ['install'], projectDir)) {
      warn('pnpm install failed — fix errors and re-run');
    } else {
      ok('Dependencies installed');
    }

    section('Step 9 — Database');
    if (await askYesNo(rl, 'Start local database now?', true)) {
      if (!runCmd('pnpm', ['run', 'db:up'], projectDir)) {
        warn('db:up failed — see playbooks/databases/');
      } else {
        ok('Database started');
        if (runCmd('pnpm', ['run', 'db:validate'], projectDir)) {
          ok('db:validate passed');
        } else {
          warn('db:validate failed — check .env.local and Docker');
        }
      }
    }

    section('Step 10 — AI & IDE setup');
    const aiDir = writeIdeBundle(projectDir, profile);
    ok(`AI prompts written to ${aiDir}`);
    ok(`Quick start: ${join(projectDir, 'AI-START-HERE.md')}`);

    if (await askYesNo(rl, 'Open project folder in your file manager?', false)) {
      if (process.platform === 'darwin') spawnSync('open', [projectDir]);
      else if (process.platform === 'win32') spawnSync('explorer', [projectDir]);
    }

    section('Done');
    box([
      `Project folder: ${projectPath}/`,
      `Database: ${database.label}`,
      `Next: cd ${projectPath} && pnpm dev`,
      `AI: open AI-START-HERE.md and paste ADAPTER-PROMPT`,
      `Doctor: pnpm run doctor (from curriculum repo root)`,
    ]);

    if (await askYesNo(rl, 'Start dev servers now?', false)) {
      info('Starting pnpm dev — Ctrl+C to stop');
      spawnSync('pnpm', ['dev'], { cwd: projectDir, stdio: 'inherit' });
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
