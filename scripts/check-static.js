const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🔍 Detailed static file check...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== CSS files in root .next/static ==="',
        'find .next/static/css -name "*.css" 2>/dev/null | xargs -I {} basename {}',
        'echo "=== CSS files in standalone .next/static ==="',
        'find .next/standalone/.next/static/css -name "*.css" 2>/dev/null | xargs -I {} basename {}',
        'echo "=== Build manifest CSS entries ==="',
        'grep -o \'"css":\\[[^]]*\\]\' .next/build-manifest.json 2>/dev/null | head -2',
        'echo "=== Check server.js static serving ==="',
        'head -30 .next/standalone/server.js | grep -n "static"',
        'echo "=== Check if static middleware is used ==="',
        'grep -c "serve-static" .next/standalone/server.js',
        'echo "=== Current HTML CSS links ==="',
        'curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | uniq',
        'echo "=== Test access to each CSS ==="',
        'for css in $(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | uniq); do',
        '  echo -n "$css: "; curl -s -o /dev/null -w "%{http_code}" http://localhost:3001$css; echo',
        'done',
        'echo "=== Check .next/static/css directory contents ==="',
        'ls -la .next/static/css/',
        'echo "=== PM2 logs error ==="',
        'pm2 logs wisdomia --lines 3 --nostream 2>/dev/null | tail -3',
    ].join('\n');
    
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