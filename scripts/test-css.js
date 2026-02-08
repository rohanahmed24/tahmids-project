const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🧪 Testing CSS after upload...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== List CSS files in standalone ==="',
        'ls -la .next/standalone/.next/static/css/',
        'echo "=== Get HTML CSS links ==="',
        'curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | uniq',
        'echo "=== Test each ==="',
        'for css in $(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | uniq); do',
        '  echo -n "$css: "; curl -s -o /dev/null -w "%{http_code}" http://localhost:3001$css; echo',
        'done',
        'echo "=== Quick CPU check ==="',
        'top -bn1 | head -3 | tail -2',
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