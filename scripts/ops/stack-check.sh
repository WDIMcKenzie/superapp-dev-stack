#!/usr/bin/env bash
# Check curriculum tools + project health (db validate, optional test).
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

PROJECT=""
RUN_TESTS="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    --test) RUN_TESTS="1"; shift ;;
    -h|--help)
      echo "Usage: stack-check.sh [--project <path>] [--test]"
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

CURR="$(curriculum_root)"
log_section "Curriculum doctor"
node "$CURR/scripts/init/doctor.mjs" || true

if [[ -n "$PROJECT" ]] || [[ -f ".superapp/profile.json" ]]; then
  PROJECT_DIR="$(resolve_project_dir "$PROJECT")"
  cd "$PROJECT_DIR"
  log_section "Project: $(basename "$PROJECT_DIR")"
  require_cmd pnpm
  pnpm run db:validate
  log_ok "db:validate passed"
  if [[ "$RUN_TESTS" == "1" ]]; then
    pnpm test
    log_ok "tests passed"
  fi
else
  log_info "Skip project checks — pass --project or cd into app folder"
fi

log_ok "Stack check complete"
