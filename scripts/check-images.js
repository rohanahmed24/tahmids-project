const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🖼️ Checking image serving...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== Public directory root ==="',
        'ls -la public/',
        'echo "=== Public directory standalone ==="',
        'ls -la .next/standalone/public/',
        'echo "=== Test favicon ==="',
        'curl -s -o /dev/null -w "favicon.ico %{http_code}" http://localhost:3001/favicon.ico',
        'echo ""',
        'echo "=== Test an image from imgs/ ==="',
        'IMG=$(find public/imgs -name "*.jpg" -o -name "*.png" -o -name "*.svg" 2>/dev/null | head -1)',
        'if [ -n "$IMG" ]; then',
        '  REL="${IMG#public/}"',
        '  echo "Testing /$REL";',
        '  curl -s -o /dev/null -w "  %{http_code}" http://localhost:3001/$REL;',
        '  echo "";',
        'else',
        '  echo "No images found in public/imgs";',
        'fi',
        'echo "=== Check rewrite logs ==="',
        'grep -i "imgs" .next/standalone/server.js | head -2',
        'echo "=== PM2 logs (errors) ==="',
        'pm2 logs wisdomia --lines 3 --nostream 2>/dev/null | tail -3',
    ].join('\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Image check complete');
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