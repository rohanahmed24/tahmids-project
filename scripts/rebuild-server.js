const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('Rebuilding project on server to fix Prisma issues...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');
    
    const commands = [
        'cd ~/tahmids-project',
        'echo "Stopping service..."',
        'pm2 stop wisdomia || true',
        'pm2 delete wisdomia || true',
        'sleep 2',
        'echo "Cleaning up old builds..."',
        'rm -rf .next node_modules',
        'echo "Installing dependencies..."',
        'npm install',
        'echo "Generating Prisma client..."',
        'npx prisma generate',
        'echo "Building project..."',
        'npm run build',
        'echo "Starting service with standalone server..."',
        'PORT=3001 pm2 start .next/standalone/server.js --name "wisdomia"',
        'pm2 save',
        'echo "Complete rebuild completed!"',
        'pm2 status'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }
        
        stream.on('close', (code, signal) => {
            console.log('Rebuild completed with code', code);
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