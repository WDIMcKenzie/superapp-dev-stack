import { execSync, spawnSync } from 'node:child_process';
import { platform } from 'node:os';

const IS_MAC = platform() === 'darwin';
const IS_WIN = platform() === 'win32';

function tryExec(cmd) {
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    return { ok: true, version: out.trim().split('\n')[0] };
  } catch {
    return { ok: false };
  }
}

export const TOOL_DEFS = [
  {
    id: 'git',
    label: 'Git',
    required: true,
    check: () => tryExec('git --version'),
    installUrl: 'https://git-scm.com/downloads',
    installHint: IS_MAC
      ? 'brew install git  OR  Xcode Command Line Tools'
      : 'Download installer from git-scm.com',
  },
  {
    id: 'node',
    label: 'Node.js 20+',
    required: true,
    check: () => {
      const r = tryExec('node --version');
      if (!r.ok) return r;
      const major = Number.parseInt(r.version.replace('v', ''), 10);
      return { ok: major >= 20, version: r.version, major };
    },
    installUrl: 'https://volta.sh',
    installHint: 'Install Volta, then: volta install node@20',
  },
  {
    id: 'pnpm',
    label: 'pnpm',
    required: true,
    check: () => tryExec('pnpm --version'),
    installUrl: 'https://pnpm.io/installation',
    installHint: 'volta install pnpm@9  OR  npm install -g pnpm',
  },
  {
    id: 'docker',
    label: 'Docker Desktop',
    required: false,
    check: () => tryExec('docker --version'),
    installUrl: IS_MAC
      ? 'https://docs.docker.com/desktop/setup/install/mac-install/'
      : 'https://docs.docker.com/desktop/',
    installHint: 'Required for local Postgres/Mongo via containers',
  },
  {
    id: 'gh',
    label: 'GitHub CLI (gh)',
    required: false,
    check: () => tryExec('gh --version'),
    installUrl: 'https://cli.github.com/',
    installHint: 'Optional — PRs and repo create from terminal',
  },
  {
    id: 'supabase',
    label: 'Supabase CLI',
    required: false,
    check: () => tryExec('supabase --version'),
    installUrl: 'https://supabase.com/docs/guides/cli/getting-started',
    installHint: 'Only if you chose Supabase as database',
  },
];

export function runPreflight(requiredOnly = false) {
  const results = [];
  for (const tool of TOOL_DEFS) {
    if (requiredOnly && !tool.required) continue;
    const result = tool.check();
    results.push({ ...tool, ...result });
  }
  return results;
}

export function dockerRunning() {
  const r = spawnSync('docker', ['info'], { encoding: 'utf8' });
  return r.status === 0;
}

export function openUrl(url) {
  if (IS_MAC) {
    spawnSync('open', [url], { stdio: 'ignore' });
  } else if (IS_WIN) {
    spawnSync('cmd', ['/c', 'start', '', url], { stdio: 'ignore' });
  } else {
    spawnSync('xdg-open', [url], { stdio: 'ignore' });
  }
}

export function gitConfigOk() {
  const name = tryExec('git config --global user.name');
  const email = tryExec('git config --global user.email');
  return {
    name: name.ok ? name.version : null,
    email: email.ok ? email.version : null,
    ok: name.ok && email.ok,
  };
}
