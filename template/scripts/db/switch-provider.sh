#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

echo "Select DATABASE_PROVIDER:"
echo "  1) postgres (Docker)"
echo "  2) supabase (CLI)"
echo "  3) mongodb (Docker)"
read -r -p "Choice [1-3]: " choice

case "$choice" in
  1) PROVIDER=postgres ;;
  2) PROVIDER=supabase ;;
  3) PROVIDER=mongodb ;;
  *) echo "Invalid"; exit 1 ;;
esac

cp .env.example .env.local.tmp
if [[ "$PROVIDER" == "mongodb" ]]; then
  cat >> .env.local.tmp <<'EOF'
DATABASE_PROVIDER=mongodb
DATABASE_MIGRATE_MODE=manual
DATABASE_URL=mongodb://127.0.0.1:27017/superapp
EOF
else
  sed -i.bak "s/^DATABASE_PROVIDER=.*/DATABASE_PROVIDER=$PROVIDER/" .env.local.tmp 2>/dev/null || \
    sed -i '' "s/^DATABASE_PROVIDER=.*/DATABASE_PROVIDER=$PROVIDER/" .env.local.tmp
fi

mv .env.local.tmp .env.local
rm -f .env.local.bak
echo "Updated .env.local for $PROVIDER — run pnpm run db:up && pnpm run db:validate"
