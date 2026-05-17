#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

PROJECT=""
BRANCH=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: git-pull.sh [--project <path>] [--branch <name>]"
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

PROJECT_DIR="$(resolve_project_dir "$PROJECT")"
cd "$PROJECT_DIR"
require_cmd git

if [[ -n "$BRANCH" ]]; then
  git checkout "$BRANCH"
fi

log_section "git pull"
git pull --rebase
log_ok "Up to date with remote"
