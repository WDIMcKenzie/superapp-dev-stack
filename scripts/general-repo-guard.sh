#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "${ROOT}" ]; then
  echo "❌ Not inside a git repository."
  exit 1
fi

if [[ "$ROOT" == *"/_REVIEW_TRASH/"* ]]; then
  echo "❌ Refusing action from review trash path:"
  echo "   $ROOT"
  exit 1
fi

ORIGIN_URL="$(git remote get-url origin 2>/dev/null || true)"
if [ -z "$ORIGIN_URL" ]; then
  echo "❌ No origin remote configured."
  exit 1
fi

if [[ "$ORIGIN_URL" == *"@github.com"* ]]; then
  echo "❌ origin URL appears credential-embedded:"
  echo "   $ORIGIN_URL"
  exit 1
fi

if [[ "$ORIGIN_URL" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
else
  echo "❌ Could not parse GitHub owner/repo from origin:"
  echo "   $ORIGIN_URL"
  exit 1
fi

ALLOWED_OWNERS="${ALLOWED_GITHUB_OWNERS:-WDIMcKenzie,welldoitsolutions}"
OWNER_OK=0
IFS=',' read -r -a OWNERS <<<"$ALLOWED_OWNERS"
for item in "${OWNERS[@]}"; do
  if [ "$OWNER" = "$item" ]; then
    OWNER_OK=1
    break
  fi
done
if [ "$OWNER_OK" -ne 1 ]; then
  echo "❌ owner '$OWNER' is outside allowed owners: $ALLOWED_OWNERS"
  exit 1
fi

echo "✅ General repo guard passed for ${OWNER}/${REPO}."
