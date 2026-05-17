#!/usr/bin/env bash
# Push to GitHub only — never deploys cloud environments.
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

PROJECT=""
MESSAGE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    -m|--message) MESSAGE="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: git-push.sh [--project <path>] -m \"commit message\""
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

PROJECT_DIR="$(resolve_project_dir "$PROJECT")"
cd "$PROJECT_DIR"
require_cmd git

run_leak_scan

if [[ -n "$(git status --porcelain)" ]]; then
  [[ -n "$MESSAGE" ]] || { log_fail "Uncommitted changes — pass -m \"message\""; exit 1; }
  git add -A
  git commit -m "$MESSAGE"
fi

log_section "git push (GitHub only — no deploy)"
git push
log_ok "Pushed to origin"
log_info "Staging/production unchanged. Use deploy-staging with --confirm when ready."
