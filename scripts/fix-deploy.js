const { Client } = require('ssh2');

const config = require('./connection-config');

console.log('Fixing deployment with correct startup command...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');

    const commands = [
        'cd ~/tahmids-project',
        'echo "Stopping current service..."',
        'pm2 stop wisdomia || true',
        'pm2 delete wisdomia || true',
        'sleep 2',
        'echo "Starting with correct standalone command..."',
        'PORT=3001 pm2 start .next/standalone/server.js --name "wisdomia"',
        'pm2 save',
        'echo "Service restarted with correct command!"',
        'pm2 status'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('Fix completed with code', code);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT:', data.toString());
        }).stderr.on('data', (data) => {
            console.log('STDERR:', data.toString());
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);