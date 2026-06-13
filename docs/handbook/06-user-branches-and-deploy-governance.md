# User branches and deploy governance

| Field | Value |
| --- | --- |
| Status | **Locked** |
| Applies to | All humans and AI agents (Cursor, Claude, Codex, Gemini, etc.) |
| Deploy operator | The single person allowed to deploy — set `SUPERAPP_DEPLOY_OPERATOR_EMAIL` (profile `deployOperatorEmail`) |
| Cloud today | Two cloud targets (staging + production) in one cloud project; add more staging slots as budget allows |

## Vocabulary (locked)

| Term | Meaning |
| --- | --- |
| **integrations** | Third-party connectors only (Stripe, plugins, MCP, etc.) — your API's integrations folder. |
| **workspace** | Personal git branch `user/<handle>/workspace` — your in-progress snapshot before the team line. |
| **team line** | Shared branch `develop` — where reviewed work lands; staging builds from here. The repository default branch. |
| **production line** | Branch `main` — promoted after staging sign-off. |
| **PR merge** | Merging a pull request on `[github]` (not the same as `git merge` locally). |
| **gitlink** | The parent repo's recorded commit SHA for a submodule folder. |

Do **not** use *integrate* or *integration* for combining branches or daily git workflow. Use `/workspace`.

## Goal

One predictable loop:

1. **[local-tree]** Build and test the **full product** on your **workspace** branch locally.
2. **[local-repo → github]** Push that snapshot to **`user/<handle>/workspace`** (backup + review).
3. **[github]** Open a PR → **merge into `develop`** (team line).
4. **[-staging env]** **Only** the deploy operator deploys staging; the team validates.
5. **[-prod env]** **Only** the deploy operator deploys production after staging sign-off.

Avoid many parallel `feature/*` names on GitHub unless someone **explicitly** wants a narrow feature branch.

## Branch model (by person)

### Personal workspace branch (default)

Each developer has **one primary branch** — their **workspace** — that holds their **full, in-progress** product work before it lands on `develop`:

```text
user/<github-handle>/workspace
```

Examples: `user/alice/workspace`, `user/bob/workspace`.

**AI default:** commit session work → keep `user/<handle>/workspace` current → push **that** branch to `[github]`. Do **not** create new `feature/...` names unless the human explicitly asks.

### Optional feature branches (explicit only)

Use only when the human **clearly** says they want an isolated feature line (narrow PR, experiment, or partial push):

```text
user/<github-handle>/feature/<short-description>
```

**AI:** do not create or push these without explicit instruction. When pushing a feature branch, confirm scope in chat (“pushing **only** `user/alice/feature/foo`, not full workspace”).

### Shared team and production lines

| Branch | Role |
| --- | --- |
| `develop` | **Team line** — reviewed work; **staging deploys build from here**. Set as the **repository default branch** so PRs and new AI/IDE worktrees base off the team line by default. |
| `main` | **Production line** — after staging sign-off. Protected release line; promote from `develop`, never the default branch. |
| `apps/<web-app>` (submodule, optional) | If your web app is a separate git repo tracked as a submodule — see below. |

**Deploy operator:** when your team enforces operator-only merges, this is the one person who merges into `develop` (and `develop` → `main`) and runs deploys.

## Submodule (optional) — why two commits?

If your web app lives in its own git repo tracked as a **submodule**, the monorepo is the **parent** and `apps/<web-app>/` is a **child repo** (`{{ORG}}/{{WEB_APP}}`).

The parent does **not** store the child's files directly. It stores a **pointer** (one commit SHA) — the **gitlink** — that says “use the web app at commit `4b6f9f8`.”

When you change the web app in the child:

1. **[local-repo]** Commit inside `apps/<web-app>/` (child).
2. **[local-repo]** In the **parent**, commit the updated pointer on `apps/<web-app>` (one-line SHA change in `git status`).

If you only commit the parent without step 1, teammates (and staging) still see the **old** web code. If you only commit the child, the parent still points at the old SHA until step 2.

## What may be pushed where

| Action | Who | Target | Notes |
| --- | --- | --- | --- |
| Backup / review push | Any authorized dev | `user/<handle>/workspace` (default) or explicit `user/<handle>/feature/...` | push only — **no** cloud deploy |
| Land on team line | Reviewed PR | `develop` (+ submodule pointer when web changed) | Does not deploy by itself |
| **Staging deploy** | **Deploy operator only** | `<app>-web-staging`, `<app>-api-staging` | `bash scripts/ops/deploy-staging.sh --confirm` |
| **Production deploy** | **Deploy operator only** | `<app>-web-prod`, `<app>-api-prod` | `bash scripts/ops/deploy-prod.sh --confirm` |

Others must not run deploy scripts, even if the cloud CLI is configured on their machine. Enforcement:

- **Local:** `guard_deploy_operator` in `scripts/ops/lib/common.sh` (`git config user.email` must equal `SUPERAPP_DEPLOY_OPERATOR_EMAIL`).
- **GitHub Actions:** keep deploy workflows **manual `workflow_dispatch` only** (no auto-deploy on `develop` merge). Set repo variable `DEPLOY_OPERATOR_GITHUB`; authorize deploy jobs only when `github.actor` matches.

## Partial vs full deploy / push

| Mode | When | Requirement |
| --- | --- | --- |
| **Full** (default) | Normal release | Current `develop` with reviewed workspace work; web **and** API when both changed |
| **Partial** | Single service, single feature, or hotfix slice | Human must **explicitly** say “partial deploy” or “deploy only X” **before** any agent runs deploy. Set `DEPLOY_SCOPE=partial` and `DEPLOY_PARTIAL_ACK=1` for that run only. |

**AI:** never infer partial deploy from context. Default is always **full product snapshot** on workspace → **PR merge to `develop`** → operator staging.

## Local session workflow (AI + operator)

```text
[local-tree]   work on user/<handle>/workspace (or worktree)
[local-tree]   merge/rebase from develop when starting a block of work
[local-tree]   build / test locally ([-local env])
[local-repo]   if web app is a submodule and changed: commit in apps/<web-app>, then parent gitlink
[local-repo]   other parent commits (API, packages, docs)
[local-repo → github]  git push origin user/<handle>/workspace
[github]       PR → develop → review (required for non-operator)
[-staging env] operator: deploy staging → QA
[-prod env]    operator: prod deploy after sign-off
```

End each session with a **clean** `git status`.

## Review before staging

No contributor's `user/*/workspace` (or feature branch) should be deployed to `[-staging env]` until:

1. PR is opened against `develop`.
2. Reviewer(s) approve.
3. `develop` contains the merged change set.
4. The deploy operator runs staging deploy.

This prevents one agent or developer from overwriting the shared staging URL with an unreviewed slice.

## AI agent rules (summary)

1. **Local first** — build and test locally on your workspace branch; do not deploy in a normal feature loop.
2. **Workspace branch** — default push target; no ad-hoc `feature/*` on GitHub.
3. **Explicit partial** — feature-only branch or partial deploy only when the human states it.
4. **Deploy gate** — refuse to run staging/prod deploy unless `git config user.email` equals `SUPERAPP_DEPLOY_OPERATOR_EMAIL` (or the deploy operator explicitly orders it).
5. **Submodule order** — commit inside the child app, then bump the gitlink in the parent.

## Related docs

- `02-git-github-workflow.md` — daily commands
- `03-dual-agent-workflow.md` — orchestrator + specialists
- `04-environment-policy.md` — environments and deploy
- `05-location-tags-and-vocabulary.md` — location tags and vocabulary
- `.cursor/rules/user-branch-deploy-governance.mdc` — agent enforcement
