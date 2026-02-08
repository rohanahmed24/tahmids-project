const { Client } = require('ssh2');

const config = require('./connection-config');

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    const cmd = 'cat ~/tahmids-project/components/ui/CustomAudioPlayer.tsx';

    conn.exec(cmd, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            conn.end();
        }).on('data', (data) => {
            console.log(data.toString());
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
