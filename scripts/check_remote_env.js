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
    // Check for Postgres and .env content
    const commands = [
        'echo "--- Checking Node Version ---"',
        'node -v',
        'echo "--- Checking Database Processes ---"',
        'ps aux | grep -E "postgres|mysql|mariadb"',
        'echo "--- Checking Project Directory ---"',
        'cat ~/tahmids-project/.env.local || cat ~/tahmids-project/.env || echo "No .env file found"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('\nCheck Complete');
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
