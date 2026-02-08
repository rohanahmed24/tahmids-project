const { Client } = require('ssh2');
const fs = require('fs');

const config = require('./connection-config');

console.log('Connecting to server to restart service...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');

    const commands = [
        'cd ~/tahmids-project',
        'echo "Restarting wisdomia service..."',
        'pm2 stop wisdomia || true',
        'pm2 delete wisdomia || true',
        'sleep 2',
        'PORT=3001 pm2 start npm --name "wisdomia" -- start',
        'pm2 save',
        'echo "Service restarted successfully!"',
        'pm2 status'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('Restart completed with code', code);
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