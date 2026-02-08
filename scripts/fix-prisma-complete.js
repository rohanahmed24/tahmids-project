const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('Fixing Prisma completely - regenerating in standalone directory...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');
    
    const commands = [
        'cd ~/tahmids-project',
        'echo "Stopping service..."',
        'pm2 stop wisdomia || true',
        'pm2 delete wisdomia || true',
        'sleep 2',
        'echo "Regenerating Prisma client in project directory..."',
        'npx prisma generate',
        'echo "Copying Prisma client to standalone directory..."',
        'cp -r node_modules/.prisma .next/standalone/node_modules/',
        'cp -r node_modules/@prisma .next/standalone/node_modules/',
        'echo "Restarting service..."',
        'PORT=3001 pm2 start .next/standalone/server.js --name "wisdomia"',
        'pm2 save',
        'echo "Complete Prisma fix applied!"',
        'pm2 status'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }
        
        stream.on('close', (code, signal) => {
            console.log('Complete Prisma fix completed with code', code);
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