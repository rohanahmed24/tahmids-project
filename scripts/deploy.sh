#!/bin/bash

# deploy.sh
# Run this script from the project root on the server

echo "🚀 Starting Deployment..."

# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build application
echo "🏗️ Building application..."
npm run build

# 4. Migrate Database
echo "🗄️ Running database migrations..."
npx prisma generate
npx prisma db push

# 5. Restart PM2
echo "🔄 Restarting application..."
pm2 restart wisdomia

echo "✅ Deployment Complete!"
