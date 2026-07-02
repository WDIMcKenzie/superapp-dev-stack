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

# --- Deploy-gate audit log + break-glass primitives ---------------------------
# These harden the staging/production operator gate against silent bypass.
# NOTE: this is local, fail-closed, defense-in-depth — loud, logged, time-boxed,
# and requiring a human at a terminal. It is NOT a cryptographic barrier against
# a determined holder of shell access; the authoritative operator enforcement is
# the cloud/CI gate (GitHub Actions `github.actor` match) per handbook §06.

# Max lifetime a break-glass token may claim (seconds). Enforces time-boxing.
SUPERAPP_BREAK_GLASS_MAX_TTL="${SUPERAPP_BREAK_GLASS_MAX_TTL:-3600}"

deploy_audit_log_path() {
  if [[ -n "${SUPERAPP_DEPLOY_AUDIT_LOG:-}" ]]; then
    echo "${SUPERAPP_DEPLOY_AUDIT_LOG}"
    return
  fi
  echo "$(curriculum_root)/scripts/ops/.audit/deploy-gate.log"
}

# Append a record of a deploy-gate decision. Append-only by convention; the
# authoritative WORM sink belongs in cloud logging outside operator control.
audit_record() {
  local path ts who gitemail
  path="$(deploy_audit_log_path)"
  mkdir -p "$(dirname "$path")" 2>/dev/null || true
  ts="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  who="$(id -un 2>/dev/null || echo unknown)"
  gitemail="$(git config --get user.email 2>/dev/null || echo none)"
  printf '%s\tuser=%s\tgit_email=%s\t%s\n' "$ts" "$who" "$gitemail" "$*" >> "$path" 2>/dev/null || true
}

# Mint a time-boxed break-glass token (operator runs this out of band):
#   SUPERAPP_BREAK_GLASS_TOKEN="$(bash scripts/ops/lib/common.sh mint-break-glass-token 900)"
mint_break_glass_token() {
  local ttl="${1:-900}"
  local now exp nonce
  now="$(date -u +%s)"
  exp="$(( now + ttl ))"
  nonce="$(head -c 8 /dev/urandom 2>/dev/null | od -An -tx1 | tr -d ' \n')"
  [[ -n "$nonce" ]] || nonce="$(date -u +%s)$$"
  echo "BG.${exp}.${nonce}"
}

# A break-glass token is valid only if well-formed, unexpired, AND within the
# max-TTL window (a token claiming a far-future expiry is rejected).
break_glass_token_valid() {
  local token="${1:-}"
  [[ "$token" =~ ^BG\.([0-9]+)\.[0-9a-zA-Z]+$ ]] || return 1
  local exp now
  exp="${BASH_REMATCH[1]}"
  now="$(date -u +%s)"
  (( exp > now )) || return 1                                   # not expired
  (( exp - now <= SUPERAPP_BREAK_GLASS_MAX_TTL )) || return 1   # not over-long
  return 0
}

# Staging/production deploy operator gate (see docs/handbook/06-user-branches-and-deploy-governance.md).
# FAIL-CLOSED: refuses unless the caller's git identity matches the configured
# operator, OR an explicit, justified, time-boxed, interactively-confirmed and
# audited break-glass is supplied. A bare env var can no longer bypass it.
guard_deploy_operator() {
  local allowed="${SUPERAPP_DEPLOY_OPERATOR_EMAIL:-${DEPLOY_OPERATOR_EMAIL:-}}"

  # --- Break-glass path: explicit + justified + time-boxed token + human-at-TTY + audited.
  if [[ "${SUPERAPP_BREAK_GLASS_DEPLOY:-}" == "1" ]]; then
    local reason="${SUPERAPP_BREAK_GLASS_REASON:-}"
    local token="${SUPERAPP_BREAK_GLASS_TOKEN:-}"

    if [[ -z "$reason" ]]; then
      log_fail "Break-glass deploy requested but SUPERAPP_BREAK_GLASS_REASON is empty — refusing."
      audit_record "BREAK_GLASS_DENIED reason=missing-justification"
      exit 1
    fi
    if ! break_glass_token_valid "$token"; then
      log_fail "Break-glass token missing, malformed, or expired — refusing."
      log_info "Mint one (operator, out of band): SUPERAPP_BREAK_GLASS_TOKEN=\$(bash scripts/ops/lib/common.sh mint-break-glass-token 900)"
      audit_record "BREAK_GLASS_DENIED reason=invalid-token"
      exit 1
    fi
    # Second, independent confirmation on the controlling terminal. Non-interactive
    # automation (agents/CI) has no controlling terminal here -> fail closed.
    if ! exec 3</dev/tty 2>/dev/null; then
      log_fail "Break-glass requires interactive confirmation on a terminal — none available. Refusing."
      audit_record "BREAK_GLASS_DENIED reason=no-controlling-tty"
      exit 1
    fi
    local phrase="BREAK-GLASS-DEPLOY" typed=""
    printf '%b' "${YELLOW}  ! Type '${phrase}' to authorize break-glass deploy (reason: ${reason}): ${NC}" > /dev/tty
    IFS= read -r typed <&3 || true
    exec 3<&- || true
    if [[ "$typed" != "$phrase" ]]; then
      log_fail "Break-glass confirmation phrase mismatch — refusing."
      audit_record "BREAK_GLASS_DENIED reason=confirmation-mismatch"
      exit 1
    fi
    log_warn "BREAK-GLASS deploy AUTHORIZED — reason: ${reason}"
    audit_record "BREAK_GLASS_AUTHORIZED reason=${reason} token=${token}"
    return 0
  fi

  # --- Normal path: operator email must be set AND match. Fail closed otherwise.
  if [[ -z "$allowed" ]]; then
    log_fail "SUPERAPP_DEPLOY_OPERATOR_EMAIL is not set — refusing deploy (fail closed)."
    log_info "Set the deploy operator email in your environment/.env, or use the audited break-glass path."
    audit_record "DEPLOY_DENIED reason=operator-email-unset"
    exit 1
  fi
  local current
  current="$(git config --get user.email 2>/dev/null || true)"
  if [[ -z "$current" ]]; then
    log_fail "git user.email not set; cannot authorize deploy."
    audit_record "DEPLOY_DENIED reason=git-email-unset"
    exit 1
  fi
  # Case-insensitive compare, portable to bash 3.2 (avoid ${var,,}).
  local current_lc allowed_lc
  current_lc="$(printf '%s' "$current" | tr '[:upper:]' '[:lower:]')"
  allowed_lc="$(printf '%s' "$allowed" | tr '[:upper:]' '[:lower:]')"
  if [[ "$current_lc" != "$allowed_lc" ]]; then
    log_fail "Deploy restricted to: ${allowed} (current: ${current})"
    log_info "Push user/<handle>/workspace to GitHub and open a PR instead."
    audit_record "DEPLOY_DENIED reason=email-mismatch current=${current}"
    exit 1
  fi
  audit_record "DEPLOY_AUTHORIZED operator=${current}"
}

# --- Tiny operator CLI when executed directly (not when sourced) --------------
if [[ "${BASH_SOURCE[0]:-}" == "${0:-}" ]]; then
  case "${1:-}" in
    mint-break-glass-token) mint_break_glass_token "${2:-900}" ;;
    *) echo "usage: common.sh mint-break-glass-token [ttl_seconds]" >&2; exit 64 ;;
  esac
fi
