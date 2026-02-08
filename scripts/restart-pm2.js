const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🔄 Restarting PM2...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== Stopping any existing process ==="',
        'pm2 stop wisdomia 2>/dev/null || true',
        'pm2 delete wisdomia 2>/dev/null || true',
        'echo "=== Starting standalone server ==="',
        'PORT=3001 pm2 start .next/standalone/server.js --name wisdomia',
        'pm2 save',
        'sleep 2',
        'pm2 list | grep wisdomia',
        'echo "=== Checking if site responds ==="',
        'curl -s -o /dev/null -w "Site %{http_code}" http://localhost:3001',
        'echo ""',
        'echo "=== CSS test ==="',
        'CSS=$(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | head -1 | tr -d "\\\\\\\\")',
        'echo "CSS file: $CSS"',
        'curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001$CSS',
        'echo ""',
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Restart complete');
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data.toString());
        }).stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);