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
                'git reset --hard', // Safety: discard local changes on server to ensure pull works
                'git pull',
                'npm install',
                'npx prisma generate',
                'npm run build',
                // Check if pm2 ecosystem exists, otherwise just restart valid process
                'pm2 restart all || npm run start &'
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
