import { join, relative, resolve } from 'node:path';
import { REPO_ROOT } from './profile.mjs';

/** Standard folders inside every generated project (monorepo layout). */
export const PROJECT_TREE = {
  root: '.',
  apps: 'apps/web-local',
  api: 'services/api',
  core: 'packages/core',
  data: 'packages/data',
  ui: 'packages/ui',
  wordpress: 'sites/wordpress-site',
  team: 'team',
  scripts: 'scripts',
  superapp: '.superapp',
  env: '.env.local',
  aiStart: 'AI-START-HERE.md',
};

export const WORKSPACE_OPTIONS = [
  {
    id: 'curriculum-projects',
    label: 'projects/ in this curriculum repo (recommended)',
    hint: 'Keeps learning apps next to template and playbooks',
    resolveRoot: () => join(REPO_ROOT, 'projects'),
  },
  {
    id: 'sibling-projects',
    label: 'projects/ next to this repo (sibling folder)',
    hint: 'For a dedicated dev folder outside the clone',
    resolveRoot: () => join(REPO_ROOT, '..', 'superapp-projects'),
  },
  {
    id: 'custom',
    label: 'Custom workspace folder',
    hint: 'You choose any path — one folder per app inside it',
  },
];

export function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'my-app';
}

export function projectDirFor(workspaceRoot, slug) {
  return resolve(workspaceRoot, slug);
}

/** Path for docs and AI prompts — no machine-specific home paths. */
export function displayPath(workspaceRoot, projectDir) {
  const slug = relative(workspaceRoot, projectDir);
  const wsFromRepo = relative(REPO_ROOT, workspaceRoot);
  if (!wsFromRepo.startsWith('..')) {
    const combined = join(wsFromRepo, slug).replace(/\\/g, '/');
    return combined;
  }
  return `<workspace>/${slug.replace(/\\/g, '/')}`;
}

export function formatProjectTree(workspaceRoot, slug) {
  const base = displayPath(workspaceRoot, join(workspaceRoot, slug));
  return [
    `${base}/`,
    `├── apps/web-local/     # Next.js (port 4000)`,
    `├── services/api/       # API (port 8080)`,
    `├── packages/core/`,
    `├── packages/data/      # DB adapters`,
    `├── packages/ui/`,
    `├── sites/wordpress-site/`,
    `├── team/               # Agent STATE + HANDOFF`,
    `├── scripts/            # db:up, validate`,
    `├── .superapp/          # Your init profile + AI prompts`,
    `├── .env.local          # Secrets (gitignored)`,
    `└── AI-START-HERE.md`,
  ].join('\n');
}
