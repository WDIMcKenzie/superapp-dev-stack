#!/usr/bin/env bash
# Colocated tests for scripts/ops/lib/common.sh — deploy-operator gate hardening.
# Run: bash scripts/ops/lib/common.test.sh
#
# These assert the gate FAILS CLOSED. The headline assertion (per the security
# fix) is: a bare `SUPERAPP_BREAK_GLASS_DEPLOY=1` must NOT authorize a deploy.
# The break-glass *success* path requires a human typing a phrase at a real TTY
# and is intentionally not auto-tested (it cannot complete non-interactively —
# which is the whole point). All refusal cases below fail closed BEFORE the TTY
# read, so this test never blocks.

set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PASS=0
FAIL=0
ok()  { PASS=$((PASS + 1)); echo "  ok   - $1"; }
bad() { FAIL=$((FAIL + 1)); echo "  FAIL - $1"; }

TMP_AUDIT="$(mktemp -t deploy-gate-audit.XXXXXX)"
trap 'rm -f "$TMP_AUDIT"' EXIT

# Run guard_deploy_operator in a fresh, isolated shell with the given env, stdin
# detached. Echoes the exit code. (Fresh `bash -c` so each case is independent.)
guard_rc() {
  env "$@" SUPERAPP_DEPLOY_AUDIT_LOG="$TMP_AUDIT" \
    bash -c 'source "'"$HERE"'/common.sh"; guard_deploy_operator' \
    </dev/null >/dev/null 2>&1
  echo $?
}

assert_refused() {
  local label="$1"; shift
  local rc; rc="$(guard_rc "$@")"
  if [[ "$rc" -ne 0 ]]; then ok "$label (refused, rc=$rc)"; else bad "$label (ALLOWED — must refuse)"; fi
}

assert_allowed() {
  local label="$1"; shift
  local rc; rc="$(guard_rc "$@")"
  if [[ "$rc" -eq 0 ]]; then ok "$label (allowed)"; else bad "$label (rc=$rc — must allow)"; fi
}

echo "== deploy-operator gate: fail-closed assertions =="

# 1. THE headline assertion: break-glass env var alone does not authorize a deploy.
assert_refused "break-glass=1 alone is refused" \
  SUPERAPP_DEPLOY_OPERATOR_EMAIL= SUPERAPP_BREAK_GLASS_DEPLOY=1 \
  SUPERAPP_BREAK_GLASS_REASON= SUPERAPP_BREAK_GLASS_TOKEN=

# 2. break-glass with a justification but no/invalid token is refused (before TTY).
assert_refused "break-glass + reason, no token, is refused" \
  SUPERAPP_DEPLOY_OPERATOR_EMAIL= SUPERAPP_BREAK_GLASS_DEPLOY=1 \
  SUPERAPP_BREAK_GLASS_REASON="prod hotfix" SUPERAPP_BREAK_GLASS_TOKEN=

# 3. break-glass with an expired token is refused (before TTY).
assert_refused "break-glass + expired token is refused" \
  SUPERAPP_DEPLOY_OPERATOR_EMAIL= SUPERAPP_BREAK_GLASS_DEPLOY=1 \
  SUPERAPP_BREAK_GLASS_REASON="prod hotfix" \
  SUPERAPP_BREAK_GLASS_TOKEN="BG.1000000000.deadbeef"

# 4. Normal path with the operator email UNSET fails closed (no silent skip).
assert_refused "unset operator email fails closed" \
  SUPERAPP_DEPLOY_OPERATOR_EMAIL= SUPERAPP_BREAK_GLASS_DEPLOY=

# 5. Normal path with a non-matching git identity is refused.
assert_refused "mismatched operator email is refused" \
  SUPERAPP_DEPLOY_OPERATOR_EMAIL="not-the-operator@example.test" SUPERAPP_BREAK_GLASS_DEPLOY=

echo ""
echo "== break_glass_token_valid unit checks =="
# These run in-process against the sourced function.
# shellcheck source=/dev/null
source "$HERE/common.sh"
set +e
NOW="$(date -u +%s)"
break_glass_token_valid "BG.$((NOW + 300)).abc123"   && ok "valid token accepted"       || bad "valid token rejected"
break_glass_token_valid "BG.$((NOW - 10)).abc123"    && bad "expired token accepted"     || ok "expired token rejected"
break_glass_token_valid "BG.$((NOW + 999999)).abc"   && bad "over-long token accepted"   || ok "over-long token rejected"
break_glass_token_valid "garbage"                    && bad "malformed token accepted"   || ok "malformed token rejected"
break_glass_token_valid ""                           && bad "empty token accepted"       || ok "empty token rejected"

echo ""
echo "== happy path: matching operator identity is allowed (deterministic) =="
# Isolate a git identity in a temp HOME and run outside any repo so only that
# global config resolves, then make the operator email match it.
if command -v git >/dev/null 2>&1; then
  TMP_HOME="$(mktemp -d)"
  HOME="$TMP_HOME" git config --global user.email "operator@example.test" >/dev/null 2>&1
  rc="$(cd "$TMP_HOME" && env HOME="$TMP_HOME" \
        SUPERAPP_DEPLOY_AUDIT_LOG="$TMP_AUDIT" \
        SUPERAPP_DEPLOY_OPERATOR_EMAIL="operator@example.test" \
        SUPERAPP_BREAK_GLASS_DEPLOY= \
        bash -c 'source "'"$HERE"'/common.sh"; guard_deploy_operator' </dev/null >/dev/null 2>&1; echo $?)"
  rm -rf "$TMP_HOME"
  if [[ "$rc" -eq 0 ]]; then ok "matching operator identity allowed"; else bad "matching operator identity rejected (rc=$rc)"; fi
else
  echo "  skip - git not available"
fi

echo ""
echo "== audit log records denials =="
if grep -q "BREAK_GLASS_DENIED\|DEPLOY_DENIED" "$TMP_AUDIT" 2>/dev/null; then
  ok "denied attempts were written to the audit log"
else
  bad "audit log has no denial records"
fi

echo ""
echo "Passed: $PASS   Failed: $FAIL"
[[ "$FAIL" -eq 0 ]]
