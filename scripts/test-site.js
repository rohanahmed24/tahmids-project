const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🧪 Testing site before deployment...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== CPU load ==="',
        'top -bn1 | head -5',
        'echo "=== PM2 status ==="',
        'pm2 list | grep wisdomia',
        'echo "=== CSS test ==="',
        'CSS_FILE=$(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | head -1 | tr -d "\\\\\\\\")',
        'echo "CSS file: $CSS_FILE"',
        'curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001$CSS_FILE',
        'echo ""',
        'echo "=== Image test (next.svg) ==="',
        'curl -s -o /dev/null -w "next.svg %{http_code}" http://localhost:3001/next.svg',
        'echo ""',
        'echo "=== Image with spaces test (raw) ==="',
        'IMG="imgs/Lock ness monster image_.jpg"',
        'echo "Testing /$IMG"',
        'curl -s -o /dev/null -w "  %{http_code}" "http://localhost:3001/$IMG"',
        'echo ""',
        'echo "=== Image with spaces test (encoded) ==="',
        'ENCODED=$(echo "$IMG" | sed "s/ /%20/g")',
        'echo "Testing /$ENCODED"',
        'curl -s -o /dev/null -w "  %{http_code}" http://localhost:3001/$ENCODED',
        'echo ""',
        'echo "=== Deployment status ==="',
        'ls -la /tmp/deployment.tar.gz 2>/dev/null | head -1 || echo "No deployment tarball yet"',
        'echo "=== Current standalone BUILD_ID ==="',
        'cat .next/standalone/.next/BUILD_ID 2>/dev/null || echo "No BUILD_ID"',
    ].join('\n');
    
    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Test complete');
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