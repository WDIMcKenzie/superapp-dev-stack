#!/usr/bin/env bash
# Staging deploy gate — requires --confirm. Never runs without explicit human/AI approval.
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
      cat <<'EOF'
Usage: deploy-staging.sh --project <path> --host <gcp|aws|...> --confirm

Human gate: must pass --confirm.
Prints staging checklist from playbook; does not auto-push live traffic without your CI/CD wiring.
EOF
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

require_confirm "${CONFIRM}" "Staging deploy requires --confirm (explicit approval)"
guard_deploy_operator
PROJECT_DIR="$(resolve_project_dir "$PROJECT")"

if [[ -z "$HOST" && -f "$PROJECT_DIR/.superapp/profile.json" ]]; then
  HOST="$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PROJECT_DIR/.superapp/profile.json','utf8')).host?.id||'')")"
fi
[[ -n "$HOST" ]] || { log_fail "Pass --host or set host in .superapp/profile.json"; exit 1; }

run_leak_scan
cd "$PROJECT_DIR"

log_section "STAGING deploy checklist (approval received)"
bash "$(dirname "$0")/hosting-setup.sh" --host "$HOST" --project "$PROJECT_DIR"

log_warn "Automated cloud deploy is project-specific."
log_info "Wire your host CI in .github/workflows/ or run your provider CLI per playbook."
log_info "WordPress track: copy scripts/hosting/push-staging.sh from template and fill placeholders."

if [[ -f "$PROJECT_DIR/scripts/hosting/push-staging.sh" ]]; then
  log_info "Found scripts/hosting/push-staging.sh — run manually after reviewing:"
  log_info "  cd ${PROJECT_DIR} && bash scripts/hosting/push-staging.sh"
else
  log_info "Template: scripts/hosting/push-staging.sh.template → push-staging.sh"
fi

log_ok "Staging gate complete — execute provider commands from playbook when ready"
