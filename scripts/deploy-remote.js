const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

conn.on('ready', () => {
    console.log('Client :: ready');
    // First, find the project directory
    conn.exec('find ~ -maxdepth 2 -type d -name "tahmids-project" -o -name "project-1"', (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('close', (code, signal) => {
            const paths = output.trim().split('\n').filter(p => p);
            console.log('Found potential paths:', paths);

            let projectPath = paths[0]; // Default to first found

            if (!projectPath) {
                console.log('Could not find project directory automatically. using default ~/tahmids-project');
                projectPath = '~/tahmids-project';
            }

            console.log(`Deploying to: ${projectPath}`);

            const commands = [
                `cd ${projectPath}`,
                // Backup uploads before reset
                'mkdir -p /tmp/uploads_backup',
                'cp -r public/imgs/uploads/* /tmp/uploads_backup/ 2>/dev/null || true',
                'rm -rf .next node_modules', // Force clean build and reinstall
                'fuser -k 3001/tcp || true', // Kill existing server on port 3001
                'git reset --hard', // Safety: discard local changes on server
                'git pull',
                // Restore uploads after pull
                'mkdir -p public/imgs/uploads',
                'cp -r /tmp/uploads_backup/* public/imgs/uploads/ 2>/dev/null || true',
                'npm install', // Fresh install
                'node scripts/cleanup-mocks.js', // Execute cleanup on remote
                'npx prisma generate',
                'npx prisma db push --skip-generate',
                'npm run build',
                // Sync public files to standalone build
                'cp -r public .next/standalone/public || true',
                'cp -r .next/static .next/standalone/.next/static || true',
                'pm2 stop all || true',
                'pm2 delete all || true',
                // Start standalone server with PORT=3001
                'cd .next/standalone && PORT=3001 pm2 start server.js --name "wisdomia"',
                'cd ../..',
                'pm2 save'
            ].join(' && ');

            console.log('Executing deployment commands...');

            conn.exec(commands, (err, stream) => {
                if (err) throw err;
                stream.on('close', (code, signal) => {
                    console.log('Deployment Process :: close :: code: ' + code + ', signal: ' + signal);
                    conn.end();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });

        }).on('data', (data) => {
            output += data;
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
