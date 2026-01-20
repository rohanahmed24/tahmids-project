const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

// 1. Read the fixed local seed file
const localSeedPath = path.join(__dirname, '../prisma/seed.js');
let seedContent = '';
try {
    seedContent = fs.readFileSync(localSeedPath, 'utf8');
} catch (e) {
    console.error('Failed to read local seed.js', e);
    process.exit(1);
}

// Escape single quotes for the echo/cat command
// A simple way to transfer file content safely via shell is using base64
const seedContentBase64 = Buffer.from(seedContent).toString('base64');

conn.on('ready', () => {
    console.log('Client :: ready');
    console.log('Deploying fixed seed script and running...');

    const commands = [
        'cd ~/tahmids-project',
        // 2. Decode and overwrite seed.js
        `echo "${seedContentBase64}" | base64 -d > prisma/seed.js`,
        'echo "Updated prisma/seed.js"',

        // 3. Run Seed
        'export DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f 2- | tr -d \'"\')',
        'echo "Using DB URL: $DATABASE_URL"',
        'node prisma/seed.js'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('\nSeed Process :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
