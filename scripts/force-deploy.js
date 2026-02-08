const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('✅ SSH Connected');

    const commands = [
        'cd /root/tahmids-project',
        'echo "🧹 Force cleaning..."',
        'git reset --hard HEAD',
        'git clean -fd',
        'rm -rf node_modules/.prisma',
        'rm -rf node_modules/@prisma',
        'rm -rf .next',
        'echo "📥 Pulling latest code..."',
        'git pull origin main',
        'echo "📦 Installing dependencies..."',
        'npm install',
        'echo "🔧 Generating Prisma client..."',
        'npx prisma generate',
        'echo "🗄️ Pushing database schema..."',
        'npx prisma db push --accept-data-loss || true',
        'echo "🏗️ Building application..."',
        'NODE_ENV=production npm run build',
        'echo "📁 Syncing public files..."',
        'cp -r public .next/standalone/public || true',
        'cp -r .next/static .next/standalone/.next/static || true',
        'echo "🔄 Restarting server..."',
        'pm2 stop all || true',
        'pm2 delete all || true',
        'cd .next/standalone && PORT=3001 pm2 start server.js --name "wisdomia"',
        'cd ../..',
        'pm2 save',
        'echo "✅ Deployment complete!"',
        'pm2 status'
    ].join(' && ');

    console.log('🚀 Force deploying...\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('❌ Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('\n📊 Process finished with code:', code);
            if (code === 0) {
                console.log('✅ Deployment successful!');
                console.log('🌐 Website: http://76.13.5.200:3001');
            } else {
                console.log('❌ Failed with code:', code);
            }
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data.toString());
        }).stderr.on('data', (data) => {
            process.stderr.write('⚠️  ' + data.toString());
        });
    });

}).on('error', (err) => {
    console.error('❌ Connection Error:', err);
}).connect(config);
