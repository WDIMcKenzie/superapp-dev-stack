#!/usr/bin/env bash
# Create GitHub repo and push code. Does NOT deploy to staging or production.
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: github-bootstrap.sh --project <path> --org <github-org-or-user> --repo <repo-name> [--private] [--confirm]

Creates remote repo (via gh), initial commit, and push to GitHub only.
No Cloud Run, no staging URL, no production traffic.

Requires: git, gh (authenticated)
EOF
}

PROJECT=""
ORG=""
REPO=""
PRIVATE="--public"
CONFIRM=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    --org) ORG="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --private) PRIVATE="--private"; shift ;;
    --confirm) CONFIRM="1"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) log_fail "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

require_confirm "${CONFIRM}" "GitHub bootstrap requires explicit --confirm"
[[ -n "$PROJECT" && -n "$ORG" && -n "$REPO" ]] || { usage; exit 1; }

require_cmd git
require_cmd gh

PROJECT_DIR="$(resolve_project_dir "$PROJECT")"
cd "$PROJECT_DIR"

log_section "Leak scan before GitHub push"
run_leak_scan

log_section "Git + GitHub (no deploy)"
if [[ ! -d .git ]]; then
  git init -b main
  log_ok "git init (main)"
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create "${ORG}/${REPO}" ${PRIVATE} --source=. --remote=origin --description "SuperApp project: ${REPO}"
  log_ok "Created ${ORG}/${REPO} on GitHub"
else
  log_warn "origin remote already exists — skipping gh repo create"
fi

if [[ -z "$(git status --porcelain)" ]] && git rev-parse HEAD >/dev/null 2>&1; then
  log_ok "Working tree clean — pushing existing commits"
else
  git add -A
  git commit -m "chore: initial SuperApp project bootstrap" || true
fi

git push -u origin main
log_ok "Pushed to github.com/${ORG}/${REPO}"

echo ""
log_info "NOT deployed to staging or production."
log_info "Next: use deploy-staging trigger only when you explicitly want cloud traffic."
