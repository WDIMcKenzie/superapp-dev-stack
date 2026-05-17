#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

PROVIDER="${DATABASE_PROVIDER:-postgres}"

echo "Starting database for provider: $PROVIDER"

case "$PROVIDER" in
  supabase)
    if command -v supabase >/dev/null 2>&1; then
      supabase start
    else
      echo "Install Supabase CLI: https://supabase.com/docs/guides/cli"
      exit 1
    fi
    ;;
  postgres|neon|planetscale)
    docker compose -f docker-compose.optional.yml up -d
  ;;
  mongodb)
    if docker ps --format '{{.Names}}' | grep -q superapp-mongo; then
      echo "Mongo container already running"
    else
      docker run -d --name superapp-mongo -p 27017:27017 mongo:7
    fi
    ;;
  *)
    echo "Unknown DATABASE_PROVIDER=$PROVIDER"
    exit 1
    ;;
esac

echo "Run: pnpm run db:validate"
