#!/bin/bash
# SSH into server and check backlinks in database


# Source secrets
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/.secrets.env" ]; then
    source "$SCRIPT_DIR/.secrets.env"
fi

SERVER="$SSH_USER@$SSH_HOST"
PASSWORD="$SSH_PASS"
DB_URL="postgresql://wisdomia_user:$PG_PASS@localhost:5432/project_1"


sshpass -p "$PASSWORD" ssh "$SERVER" "PGPASSWORD='$PG_PASS' psql -h localhost -U wisdomia_user -d project_1 -c \"SELECT slug, title, backlinks, published FROM posts ORDER BY created_at DESC LIMIT 5;\""
