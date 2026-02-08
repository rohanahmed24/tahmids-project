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
    console.log('SSH connected');
    conn.exec('pm2 list', (err, stream) => {
        if (err) {
            console.error('Error:', err);
            conn.end();
            return;
        }
        stream.on('data', (data) => {
            console.log(data.toString());
        });
        stream.on('close', () => {
            conn.end();
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);