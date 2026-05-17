#!/usr/bin/env bash
# Scan for strings that must not appear in the public SuperApp Dev Stack repo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

FAIL=0

scan() {
  local label="$1"
  shift
  if rg -n "$@" --glob '!.git' --glob '!node_modules' --glob '!pnpm-lock.yaml' . 2>/dev/null; then
    echo "FAIL: $label"
    FAIL=1
  fi
}

echo "Running leak scan in $ROOT ..."

# Org-specific blocklist (local patterns file)
scan "Org-specific hostnames" \
  '{{GCP_PROJECT}}|monocle\.welldoit|{{HOST_STAGING}}|{{ORG}}-unified-stack|{{ORG}}/{{REPO}}'

scan "Internal blueprint paths" \
  'docs/plans/YYYY-MM-DD|Blueprint REF-[0-9]+'

# Secrets patterns
scan "Likely API keys" \
  'sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}'

scan "Private email in content" \
  '{{PRIVATE_EMAIL_PATTERN}}'

# Real-looking connection strings (allow example placeholders)
scan "Committed DATABASE_URL with credentials" \
  'postgresql://[^:]+:[^@]+@|mongodb\+srv://[^:]+:[^@]+@'

if [[ "$FAIL" -eq 0 ]]; then
  echo "OK: leak scan passed."
  exit 0
fi

echo ""
echo "Fix findings before publishing. See docs/security/publication-checklist.md"
exit 1
