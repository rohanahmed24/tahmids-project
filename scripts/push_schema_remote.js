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
    console.log('Pushing database schema...');

    const commands = [
        'cd ~/tahmids-project',
        'export DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f 2- | tr -d \'"\')',
        'echo "Using DB URL: $DATABASE_URL"',
        'npx prisma db push --accept-data-loss'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('\nSchema Push Process :: close :: code: ' + code + ', signal: ' + signal);
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
