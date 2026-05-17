#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ ! -f .env.local ]]; then
  echo "Missing .env.local — copy from .env.example"
  exit 1
fi

pnpm --filter @superapp/data build
pnpm exec tsx scripts/db/validate.mts
