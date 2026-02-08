const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('✅ SSH Connected');

    const commands = [
        'cd /root/tahmids-project',
        'echo "📁 Syncing public files to standalone build..."',
        // Copy public folder to standalone build
        'cp -r public .next/standalone/public || true',
        // Copy static files
        'cp -r .next/static .next/standalone/.next/static || true',
        'echo "✅ Public files synced!"',
        'echo "🔄 Restarting server..."',
        'pm2 restart wisdomia',
        'pm2 status'
    ].join(' && ');

    console.log('🚀 Syncing public files...\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('❌ Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('\n📊 Process finished with code:', code);
            if (code === 0) {
                console.log('✅ Public files synced successfully!');
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
