#!/bin/bash

# setup-vps.sh
# Usage: ./setup-vps.sh [domain_name]
# Example: ./setup-vps.sh wisdomia.com

# 1. Variables
DOMAIN=${1:-"localhost"}
APP_DIR="/var/www/wisdomia"
REPO_URL="https://github.com/rohanahmed24/tahmids-project.git"
DB_NAME="project_1"
DB_USER="wisdomia_user"
DB_PASS=$(openssl rand -base64 12)

echo "🚀 Starting VPS Setup for domain: $DOMAIN"
echo "📝 Database Password will be: $DB_PASS"
echo "⏳ This may take a few minutes..."

# 2. System Updates
export DEBIAN_FRONTEND=noninteractive
apt-get update && apt-get upgrade -y
apt-get install -y curl git unzip certbot python3-certbot-nginx build-essential

# 3. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

# 4. Install MariaDB
apt-get install -y mariadb-server
systemctl start mariadb
systemctl enable mariadb

# 5. Configure Database
echo "🔧 Configuring Database..."
mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# 6. Install Nginx
apt-get install -y nginx

# 7. Configure Nginx
echo "🔧 Configuring Nginx..."
cat > /etc/nginx/sites-available/wisdomia <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site and remove default
ln -sf /etc/nginx/sites-available/wisdomia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# 8. Setup App Directory
echo "📂 Cloning Repository..."
# Remove directory if exists (fresh start)
rm -rf $APP_DIR
git clone $REPO_URL $APP_DIR
chown -R $USER:$USER $APP_DIR

cd $APP_DIR

# 9. Create .env file
echo "📝 Creating .env.local file..."
cat > .env.local <<EOF
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_NAME=$DB_NAME
NEXTAUTH_URL=http://$DOMAIN
AUTH_SECRET=$(openssl rand -base64 32)
EOF

# 10. Install & Build
echo "📦 Installing Dependencies..."
npm install

echo "🗄️ Setting up Database Schema..."
npx tsx setup-production-db.ts

echo "🏗️ Building Next.js App..."
npm run build

# 11. Start PM2
echo "🔄 Starting Application..."
pm2 delete wisdomia || true
pm2 start npm --name "wisdomia" -- start
pm2 save
pm2 startup

echo "✅ Setup Complete!"
echo "------------------------------------------------"
echo "URL: http://$DOMAIN"
echo "DB Password: $DB_PASS"
echo "To enable SSL (HTTPS), run: certbot --nginx -d $DOMAIN"
echo "------------------------------------------------"
