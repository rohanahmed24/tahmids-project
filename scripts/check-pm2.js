const { Client } = require('ssh2');
const config = require('./connection-config');

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