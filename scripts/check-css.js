const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🔍 Checking CSS issue...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "--- PM2 status ---"',
        'pm2 list | grep wisdomia',
        'echo "--- Public directory ---"',
        'ls -la public/ | head -10',
        'echo "--- Static CSS files ---"',
        'find .next/static -name "*.css" 2>/dev/null | head -5',
        'echo "--- Check CSS in HTML ---"',
        'curl -s http://localhost:3001 | grep -o \'<link[^>]*stylesheet[^>]*>\' | head -5',
        'echo "--- Check if CSS files are accessible ---"',
        'curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001/_next/static/css/app/layout.css?dpl=* 2>&1 | head -1',
        'echo "--- PM2 logs (last 5 lines) ---"',
        'pm2 logs wisdomia --lines 5 --nostream 2>/dev/null || echo "No logs"',
        'echo "--- Check standalone public symlink ---"',
        'ls -la .next/standalone/public/ 2>/dev/null | head -5 || echo "No standalone public"',
        'echo "--- Check .next/server directory ---"',
        'ls -la .next/server/ 2>/dev/null | head -5',
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Diagnostic complete');
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