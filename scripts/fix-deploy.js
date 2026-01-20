const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 30000,
};

conn.on('ready', () => {
    console.log('✅ SSH Connected');
    
    const commands = [
        'cd /root/tahmids-project',
        'echo "📦 Stopping PM2 processes..."',
        'pm2 stop all || true',
        'pm2 delete all || true',
        'echo "🧹 Cleaning old build..."',
        'rm -rf .next',
        'rm -rf node_modules/.cache',
        'echo "�� Pulling latest code..."',
        'git reset --hard',
        'git pull',
        'echo "📦 Installing dependencies..."',
        'npm install',
        'echo "🗄️ Setting up database..."',
        'npx prisma generate',
        'npx prisma db push --accept-data-loss || true',
        'echo "🏗️ Building application..."',
        'NODE_ENV=production npm run build',
        'echo "🚀 Starting server on port 3001..."',
        'PORT=3001 pm2 start npm --name "wisdomia" -- start',
        'pm2 save',
        'echo "✅ Deployment complete!"',
        'pm2 status'
    ].join(' && ');

    console.log('🚀 Starting deployment...\n');

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
                console.log('🌐 Website should be live at: http://76.13.5.200:3000');
            } else {
                console.log('❌ Deployment failed with code:', code);
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
