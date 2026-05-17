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

# Generic secret and credential patterns (safe for any public repo)
scan "Likely API keys" \
  'sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}'

scan "Committed DATABASE_URL with credentials" \
  'postgresql://[^:]+:[^@]+@|mongodb\+srv://[^:]+:[^@]+@'

# Optional org-specific patterns (not committed — copy from example)
PATTERNS_FILE="$ROOT/scripts/leak-scan.patterns"
if [[ -f "$PATTERNS_FILE" ]]; then
  echo "Loading custom patterns from scripts/leak-scan.patterns"
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="$(echo "$line" | xargs)"
    [[ -z "$line" ]] && continue
    scan "Custom pattern" "$line"
  done < "$PATTERNS_FILE"
else
  echo "Tip: copy scripts/leak-scan.patterns.example → scripts/leak-scan.patterns for org-specific checks (gitignored)."
fi

if [[ "$FAIL" -eq 0 ]]; then
  echo "OK: leak scan passed."
  exit 0
fi

echo ""
echo "Fix findings before publishing. See docs/security/publication-checklist.md"
exit 1
