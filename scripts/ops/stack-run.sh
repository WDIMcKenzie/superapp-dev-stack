#!/usr/bin/env bash
# Start local dev servers (web + API).
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

PROJECT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: stack-run.sh [--project <path>]"
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

PROJECT_DIR="$(resolve_project_dir "$PROJECT")"
cd "$PROJECT_DIR"
require_cmd pnpm

log_section "Starting dev stack (Ctrl+C to stop)"
log_info "Web: http://localhost:4000 · API: http://localhost:8080"
pnpm dev
