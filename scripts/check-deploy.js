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

    // Commands to check status
    const commands = [
        'ls -d /root/*tahmid*', // Check directories trying to match "tahmids project"
        'pm2 describe wisdomia', // Get details of the running process
        'netstat -tulpn | grep 3001', // Check if 3001 is listening
        'cat /root/tahmids-project/package.json | grep start' // Check start script
    ].join('; echo "---NEXT---"; ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
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
