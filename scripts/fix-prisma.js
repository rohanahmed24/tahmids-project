const { Client } = require('ssh2');

const config = require('./connection-config');

console.log('Fixing Prisma binary target issue...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');

    const commands = [
        'cd ~/tahmids-project',
        'echo "Stopping service..."',
        'pm2 stop wisdomia || true',
        'pm2 delete wisdomia || true',
        'sleep 2',
        'echo "Updating Prisma schema with correct binary targets..."',
        'sed -i \'/generator client {/a\\  binaryTargets = ["native", "debian-openssl-3.0.x"]\' prisma/schema.prisma',
        'echo "Regenerating Prisma client..."',
        'npx prisma generate',
        'echo "Restarting service..."',
        'PORT=3001 pm2 start .next/standalone/server.js --name "wisdomia"',
        'pm2 save',
        'echo "Prisma fix completed!"',
        'pm2 status'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('Prisma fix completed with code', code);
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