const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');

    // Check Status and Logs
    const commands = [
        'echo "--- PM2 Status ---"',
        'pm2 status',
        'echo "--- PM2 Logs (Last 50 lines) ---"',
        'pm2 logs --lines 50 --nostream',
        'echo "--- Memory Usage ---"',
        'free -h'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
