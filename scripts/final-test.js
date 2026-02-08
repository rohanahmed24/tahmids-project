const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🧪 Final site test...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== Homepage ==="',
        'curl -s -o /dev/null -w "Homepage %{http_code}" http://localhost:3001',
        'echo ""',
        'echo "=== CSS ==="',
        'CSS=$(curl -s http://localhost:3001 | grep -o \'/_next/static/css/[^"]*\' | head -1 | tr -d "\\\\\\\\")',
        'curl -s -o /dev/null -w "CSS $CSS %{http_code}" http://localhost:3001$CSS',
        'echo ""',
        'echo "=== Image with spaces ==="',
        'curl -s -o /dev/null -w "Image %{http_code}" "http://localhost:3001/imgs/Lock%20ness%20monster%20image_.jpg"',
        'echo ""',
        'echo "=== Admin page (should redirect to login) ==="',
        'curl -s -o /dev/null -w "Admin %{http_code}" http://localhost:3001/admin',
        'echo ""',
        'echo "=== API health (if exists) ==="',
        'curl -s http://localhost:3001/api/health 2>/dev/null | head -1',
        'echo "=== Next.js version from runtime ==="',
        'echo "Check via process: node -e \\"console.log(require(\\".next/standalone/node_modules/next/package.json\\").version)\\" 2>/dev/null"',
        'node -e "console.log(require(\\".next/standalone/node_modules/next/package.json\\").version)" 2>/dev/null',
        'echo "=== React version from runtime ==="',
        'node -e "console.log(require(\\".next/standalone/node_modules/react/package.json\\").version)" 2>/dev/null',
        'echo "=== PM2 status ==="',
        'pm2 list | grep wisdomia',
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
            console.log('\n✅ Final test complete');
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