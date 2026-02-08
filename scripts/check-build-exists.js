const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('SSH connected');
    const commands = [
        'echo "=== .next directory ==="',
        'ls -la /root/tahmids-project/.next 2>/dev/null || echo "No .next directory"',
        'echo ""; echo "=== node_modules directory ==="',
        'ls -la /root/tahmids-project/node_modules 2>/dev/null || echo "No node_modules directory"',
        'echo ""; echo "=== standalone directory ==="',
        'ls -la /root/tahmids-project/.next/standalone 2>/dev/null || echo "No standalone directory"',
        'echo ""; echo "=== package.json ==="',
        'cat /root/tahmids-project/package.json | grep -E "next|react" || echo "Cannot read package.json"'
    ].join('; ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('Exit code:', code);
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