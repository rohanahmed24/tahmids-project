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
        'echo "📦 Stopping all PM2 processes..."',
        'pm2 stop all || true',
        'pm2 delete all || true',
        'echo "🔧 Setting PORT to 3001..."',
        'export PORT=3001',
        'echo "PORT=3001" > .env.production',
        'echo "🚀 Starting server on port 3001..."',
        'PORT=3001 pm2 start npm --name "wisdomia" -- start',
        'pm2 save',
        'echo "✅ Deployment complete on port 3001!"',
        'pm2 status',
        'echo "🌐 Website should be live at: http://76.13.5.200:3001"'
    ].join(' && ');

    console.log('🚀 Fixing port and restarting...\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('❌ Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('\n📊 Process finished with code:', code);
            if (code === 0) {
                console.log('✅ Server now running on port 3001!');
                console.log('🌐 Check: http://76.13.5.200:3001');
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
