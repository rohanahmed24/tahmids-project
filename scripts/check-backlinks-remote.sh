#!/bin/bash
# SSH into server and check backlinks in database

SERVER="root@76.13.5.200"
PASSWORD=".6DKb@iGrt2qqM7"
DB_URL="postgresql://wisdomia_user:d293a896455842b86f4a0bb3a20128c3@localhost:5432/project_1"

sshpass -p "$PASSWORD" ssh "$SERVER" "PGPASSWORD='d293a896455842b86f4a0bb3a20128c3' psql -h localhost -U wisdomia_user -d project_1 -c \"SELECT slug, title, backlinks, published FROM posts ORDER BY created_at DESC LIMIT 5;\""
