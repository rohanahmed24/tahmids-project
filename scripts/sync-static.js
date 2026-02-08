const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🔄 Syncing static assets...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== CPU before ===="',
        'top -bn1 | head -5',
        'echo "=== Check BUILD_ID ==="',
        'echo "Root BUILD_ID: $(cat .next/BUILD_ID 2>/dev/null || echo missing)"',
        'echo "Standalone BUILD_ID: $(cat .next/standalone/.next/BUILD_ID 2>/dev/null || echo missing)"',
        'echo "=== Copy static if mismatch ==="',
        'if [ -d ".next/static" ] && [ -d ".next/standalone/.next" ]; then',
        '  echo "Copying .next/static to standalone..."',
        '  cp -r .next/static/* .next/standalone/.next/static/ 2>/dev/null || echo "Copy failed"',
        '  echo "Copying public folder..."',
        '  cp -r public/* .next/standalone/public/ 2>/dev/null || echo "Some public copies failed"',
        'fi',
        'echo "=== Verify CSS files ==="',
        'echo "Root CSS:"; ls .next/static/css/*.css 2>/dev/null | xargs -I {} basename {}',
        'echo "Standalone CSS:"; ls .next/standalone/.next/static/css/*.css 2>/dev/null | xargs -I {} basename {}',
        'echo "=== Restart PM2 ==="',
        'pm2 stop wisdomia',
        'pm2 delete wisdomia',
        'cd .next/standalone && PORT=3001 pm2 start server.js --name wisdomia',
        'pm2 save',
        'sleep 3',
        'echo "=== Test CSS ==="',
        'CSS_FILE=$(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | head -1)',
        'if [ -n "$CSS_FILE" ]; then',
        '  echo "Testing $CSS_FILE";',
        '  curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001$CSS_FILE;',
        '  echo "";',
        'fi',
        'echo "=== CPU after ===="',
        'top -bn1 | head -5',
        'echo "=== Done ==="',
    ].join('\n');
    
    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Sync completed');
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