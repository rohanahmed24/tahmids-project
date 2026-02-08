const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('📁 Listing images...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== imgs folder root ==="',
        'find public/imgs -type f | head -10',
        'echo "=== imgs folder standalone ==="',
        'find .next/standalone/public/imgs -type f | head -10',
        'echo "=== Test a few images ==="',
        'for img in public/imgs/*.jpg public/imgs/*.png 2>/dev/null; do',
        '  [ -f "$img" ] || continue',
        '  rel="${img#public/}"',
        '  echo -n "/$rel: "; curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/$rel; echo',
        '  break',
        'done',
        'echo "=== Test next.svg ==="',
        'curl -s -o /dev/null -w "next.svg %{http_code}" http://localhost:3001/next.svg',
        'echo ""',
        'echo "=== Check if imgs folder is readable ==="',
        'ls -la .next/standalone/public/imgs/',
    ].join('\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Listing complete');
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