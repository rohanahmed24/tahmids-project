const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
};

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    // Fetch last 50 lines of error log and output log
    const cmd = 'grep -C 5 "Error" ~/.pm2/logs/wisdomia-error.log | tail -n 50 && echo "---TAIL ERROR---" && tail -n 50 ~/.pm2/logs/wisdomia-error.log';

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
