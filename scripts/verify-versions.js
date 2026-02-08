const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🔍 Verifying deployed versions...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "--- Package.json ---"',
        'cat package.json | grep -A2 -B2 "next\\|react"',
        'echo "--- Installed versions ---"',
        'npm list next react 2>/dev/null | head -20',
        'echo "--- Backlinks schema check ---"',
        'grep -n "backlinks" prisma/schema.prisma 2>/dev/null || echo "No backlinks field"',
        'echo "--- Server status ---"',
        'curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3001',
    ].join(' && ');
    
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