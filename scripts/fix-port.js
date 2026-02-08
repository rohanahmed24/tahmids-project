const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🔧 Fixing server port to 3001...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== Checking error logs ==="',
        'pm2 logs wisdomia --lines 10 --nostream 2>/dev/null | tail -10',
        'echo "=== Stopping PM2 ==="',
        'pm2 stop wisdomia',
        'pm2 delete wisdomia',
        'echo "=== Starting with PORT=3001 ==="',
        'cd .next/standalone && PORT=3001 pm2 start server.js --name wisdomia',
        'pm2 save',
        'echo "=== Waiting 5s for startup ==="',
        'sleep 5',
        'echo "=== PM2 status ==="',
        'pm2 list | grep wisdomia',
        'echo "=== Netstat check ==="',
        'netstat -tulpn | grep :3001',
        'echo "=== Test port 3001 ==="',
        'curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3001',
        'echo ""',
        'echo "=== Check HTML for CSS links ==="',
        'curl -s http://localhost:3001 | grep -o \'<link[^>]*stylesheet[^>]*>\' | head -3',
        'echo "=== Test CSS file ==="',
        'CSS_FILE=$(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | head -1)',
        'if [ -n "$CSS_FILE" ]; then',
        '  echo "Testing $CSS_FILE";',
        '  curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001$CSS_FILE;',
        '  echo "";',
        'else',
        '  echo "No CSS link found in HTML";',
        'fi',
        'echo "=== PM2 env check ==="',
        'pm2 env 0 | grep PORT',
    ].join('\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Port fix completed');
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