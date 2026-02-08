const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🔍 Verifying deployment...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== PM2 status ==="',
        'pm2 list | grep wisdomia',
        'echo "=== Next.js version (package.json) ==="',
        'grep -A2 -B2 "next" package.json',
        'echo "=== React version ==="',
        'grep -A2 -B2 "react" package.json',
        'echo "=== BUILD_ID standalone ==="',
        'cat .next/standalone/.next/BUILD_ID 2>/dev/null || echo "No BUILD_ID"',
        'echo "=== CSS test ==="',
        'CSS=$(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | head -1 | tr -d "\\\\\\\\")',
        'echo "CSS file: $CSS"',
        'curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001$CSS',
        'echo ""',
        'echo "=== Site version (from /api/health) ==="',
        'curl -s http://localhost:3001/api/health || echo "No health endpoint"',
        'echo "=== CPU load ==="',
        'top -bn1 | head -3',
    ].join('\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Verification complete');
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