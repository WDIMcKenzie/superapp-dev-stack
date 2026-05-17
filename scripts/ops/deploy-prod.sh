#!/usr/bin/env bash
# Production deploy gate — stricter than staging.
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

PROJECT=""
CONFIRM=""
HOST=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    --host) HOST="$2"; shift 2 ;;
    --confirm) CONFIRM="1"; shift ;;
    -h|--help)
      echo "Usage: deploy-prod.sh --project <path> --host <id> --confirm"
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

require_confirm "${CONFIRM}" "PRODUCTION deploy requires --confirm"
PROJECT_DIR="$(resolve_project_dir "$PROJECT")"

if [[ -z "$HOST" && -f "$PROJECT_DIR/.superapp/profile.json" ]]; then
  HOST="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PROJECT_DIR/.superapp/profile.json','utf8')).host?.id||'')")"
fi

run_leak_scan
cd "$PROJECT_DIR"

log_section "PRODUCTION deploy — human approved"
log_fail "STOP: Verify staging smoke tests passed before any prod command."
bash "$(dirname "$0")/hosting-setup.sh" --host "$HOST" --project "$PROJECT_DIR"
log_info "Execute production steps from playbook only after explicit project-owner sign-off."
log_ok "Prod gate script finished (no automatic deploy executed)"
