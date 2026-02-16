#!/usr/bin/env bash

set -Eeuo pipefail

# app/scripts/deploy_release.sh

APP_DIR="${APP_DIR:-$HOME/tahmids-project}"
APP_NAME="${APP_NAME:-wisdomia}"
APP_PORT="${APP_PORT:-3001}"
BRANCH="${BRANCH:-release}"
BACKUP_DB="${BACKUP_DB:-0}"
FORCE_MIGRATIONS="${FORCE_MIGRATIONS:-0}"
SKIP_MIGRATIONS="${SKIP_MIGRATIONS:-0}"

log() {
  printf '[deploy] %s\n' "$1"
}

cd "$APP_DIR"

# Prevent overlapping deploys.
exec 9>/tmp/"$APP_NAME"-deploy.lock
if ! flock -n 9; then
  log "Another deploy is already running. Exiting."
  exit 1
fi

log "Switching to branch $BRANCH"
OLD_HEAD="$(git rev-parse HEAD)"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
NEW_HEAD="$(git rev-parse HEAD)"

run_migrations=0
migration_reason="No Prisma changes detected"

if [[ "$SKIP_MIGRATIONS" == "1" ]]; then
  run_migrations=0
  migration_reason="SKIP_MIGRATIONS=1"
elif [[ "$FORCE_MIGRATIONS" == "1" ]]; then
  run_migrations=1
  migration_reason="FORCE_MIGRATIONS=1"
elif [[ "$OLD_HEAD" != "$NEW_HEAD" ]] && git diff --name-only "$OLD_HEAD" "$NEW_HEAD" | grep -Eq '^prisma/(schema\.prisma|migrations/)'; then
  run_migrations=1
  migration_reason="Prisma schema/migrations changed"
fi

log "Migration decision: $migration_reason"

log "Installing dependencies"
npm ci

if [[ "$run_migrations" == "1" ]]; then
  if [[ "$BACKUP_DB" == "1" ]] && command -v pg_dump >/dev/null 2>&1; then
    if [[ -f ".env" ]]; then
      DB_URL="$(grep '^DATABASE_URL=' .env | cut -d '=' -f2- | tr -d '"')"
      if [[ -n "${DB_URL:-}" ]]; then
        mkdir -p "$HOME/db-backups"
        backup_file="$HOME/db-backups/pre_deploy_$(date +%F_%H%M).sql"
        log "Creating DB backup: $backup_file"
        pg_dump "$DB_URL" >"$backup_file"
      fi
    fi
  fi

  log "Applying migrations"
  npx prisma migrate deploy
else
  log "Skipping migrations"
fi

log "Generating Prisma client"
npx prisma generate

log "Building app"
npm run build

log "Copying static assets for standalone output"
mkdir -p .next/standalone/public .next/standalone/.next/static
cp -a public/. .next/standalone/public/
cp -a .next/static/. .next/standalone/.next/static/

log "Restarting PM2 app: $APP_NAME"
pm2 restart "$APP_NAME" --update-env

log "Running health check"
curl -fsS "http://127.0.0.1:${APP_PORT}/" >/dev/null

log "Deploy successful"
