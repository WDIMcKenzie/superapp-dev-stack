#!/usr/bin/env bash
set -euo pipefail

echo "🚦 Agent start checklist (General/Public Stack)"
echo

echo "1) Guard check"
bash scripts/general-repo-guard.sh

echo
echo "2) Branch and remote snapshot"
git rev-parse --abbrev-ref HEAD
git remote -v

echo
echo "3) Dirty working tree summary"
git status --short | sed -n '1,20p'

echo
echo "✅ Agent start checklist complete."
