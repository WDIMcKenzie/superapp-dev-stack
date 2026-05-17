#!/usr/bin/env bash
# Print hosting setup checklist from playbooks (no deploy).
set -euo pipefail
source "$(dirname "$0")/lib/common.sh"

HOST=""
PROJECT=""
OPEN="0"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host) HOST="$2"; shift 2 ;;
    --project) PROJECT="$2"; shift 2 ;;
    --open) OPEN="1"; shift ;;
    -h|--help)
      cat <<'EOF'
Usage: hosting-setup.sh --host <gcp|aws|oracle|godaddy|bluehost|hostinger> [--project <path>] [--open]

Reads the matching playbook and prints a numbered checklist for AI/human follow-up.
Does not deploy or change cloud resources.
EOF
      exit 0
      ;;
    *) log_fail "Unknown: $1"; exit 1 ;;
  esac
done

[[ -n "$HOST" ]] || { log_fail "--host required"; exit 1; }

CURR="$(curriculum_root)"
PLAYBOOK="$CURR/playbooks/hosting/${HOST}/README.md"

if [[ ! -f "$PLAYBOOK" ]]; then
  log_fail "No playbook: playbooks/hosting/${HOST}/README.md"
  log_info "See playbooks/hosting/shared-hosting-comparison.md"
  exit 1
fi

if [[ -n "$PROJECT" ]]; then
  PROJECT_DIR="$(resolve_project_dir "$PROJECT")"
  if [[ -f "$PROJECT_DIR/.superapp/profile.json" ]]; then
    log_info "Project profile found — align secrets with playbook placeholders"
  fi
fi

log_section "Hosting setup: ${HOST}"
echo ""
sed -n '1,120p' "$PLAYBOOK"
echo ""
log_info "Full playbook: playbooks/hosting/${HOST}/README.md"
log_info "Pairing matrix: docs/hosting/database-host-pairing.md"
log_warn "This script does not deploy. Use deploy-staging.sh --confirm when explicitly ready."

if [[ "$OPEN" == "1" ]] && command -v open >/dev/null 2>&1; then
  open "$PLAYBOOK" 2>/dev/null || true
fi
