#!/usr/bin/env bash
# Shared helpers for SuperApp ops scripts. Source: source "$(dirname "$0")/lib/common.sh"
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m'

ops_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
}

curriculum_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd
}

log_ok() { echo -e "  ${GREEN}✓${NC} $*"; }
log_warn() { echo -e "  ${YELLOW}!${NC} $*"; }
log_fail() { echo -e "  ${RED}✗${NC} $*" >&2; }
log_info() { echo -e "  ${DIM}→${NC} $*"; }
log_section() { echo -e "\n${CYAN}── $* ──${NC}\n"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    log_fail "Required command not found: $1"
    exit 1
  fi
}

# Resolve project directory: --project path | SUPERAPP_PROJECT | cwd if profile exists
resolve_project_dir() {
  local arg_project="${1:-}"
  if [[ -n "$arg_project" ]]; then
    echo "$(cd "$arg_project" && pwd)"
    return
  fi
  if [[ -n "${SUPERAPP_PROJECT:-}" ]]; then
    echo "$(cd "$SUPERAPP_PROJECT" && pwd)"
    return
  fi
  if [[ -f ".superapp/profile.json" ]]; then
    pwd
    return
  fi
  log_fail "No project folder. Use: --project projects/<app-slug> or cd into your app."
  exit 1
}

require_confirm() {
  local flag="$1"
  local message="$2"
  if [[ "${flag}" != "1" && "${flag}" != "true" && "${flag}" != "yes" ]]; then
    log_fail "$message"
    log_info "Re-run with --confirm to proceed (human gate)."
    exit 2
  fi
}

run_leak_scan() {
  local root
  root="$(curriculum_root)"
  if [[ -x "$root/scripts/leak-scan.sh" ]]; then
    log_section "Leak scan"
    bash "$root/scripts/leak-scan.sh"
  else
    log_warn "leak-scan.sh not found — skip"
  fi
}

# Staging/production deploy operator gate (see docs/handbook/06-user-branches-and-deploy-governance.md)
guard_deploy_operator() {
  local allowed="${SUPERAPP_DEPLOY_OPERATOR_EMAIL:-${DEPLOY_OPERATOR_EMAIL:-}}"
  if [[ -z "$allowed" ]]; then
    log_warn "SUPERAPP_DEPLOY_OPERATOR_EMAIL not set — skipping email gate (set in .env for teams)"
    return 0
  fi
  if [[ "${SUPERAPP_BREAK_GLASS_DEPLOY:-}" == "1" ]]; then
    log_warn "SUPERAPP_BREAK_GLASS_DEPLOY=1 — operator guard bypassed"
    return 0
  fi
  local current
  current="$(git config --get user.email 2>/dev/null || true)"
  if [[ -z "$current" ]]; then
    log_fail "git user.email not set; cannot authorize deploy"
    exit 1
  fi
  if [[ "${current,,}" != "${allowed,,}" ]]; then
    log_fail "Deploy restricted to: ${allowed} (current: ${current})"
    log_info "Push user/<handle>/integrate to GitHub and open a PR instead."
    exit 1
  fi
}
