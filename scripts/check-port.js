const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🔍 Checking server port and environment...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== PM2 env wisdomia ==="',
        'pm2 env 0',
        'echo "=== Netstat listening ports ==="',
        'netstat -tulpn | grep -E ":3000|:3001"',
        'echo "=== Check process listening on 3001 ==="',
        'lsof -i :3001 2>/dev/null || ss -tulpn | grep :3001',
        'echo "=== Check process listening on 3000 ==="',
        'lsof -i :3000 2>/dev/null || ss -tulpn | grep :3000',
        'echo "=== Server.js first 30 lines ==="',
        'head -30 .next/standalone/server.js | grep -n "port\\|PORT"',
        'echo "=== Test port 3000 ==="',
        'curl -s -o /dev/null -w "Port 3000: %{http_code}" http://localhost:3000',
        'echo ""',
        'echo "=== Test port 3001 ==="',
        'curl -s -o /dev/null -w "Port 3001: %{http_code}" http://localhost:3001',
        'echo ""',
        'echo "=== Get HTML snippet from 3001 ==="',
        'curl -s http://localhost:3001 | head -5',
        'echo "=== Check if HTML contains Next.js error ==="',
        'curl -s http://localhost:3001 | grep -o "<title>[^<]*</title>"',
        'echo "=== Check server.js PORT env ==="',
        'grep -n "process.env.PORT" .next/standalone/server.js',
    ].join('\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Port check complete');
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