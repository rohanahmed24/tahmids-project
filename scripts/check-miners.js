const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('SSH connected');
    // Check for known miner processes
    conn.exec('ps aux | grep -E "(minerd|xmrig|cpuminer|nicehash|mining)" | grep -v grep', (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        let output = '';
        stream.on('close', (code, signal) => {
            if (output.trim()) {
                console.log('⚠️ Possible miner processes found:');
                console.log(output);
            } else {
                console.log('✅ No known miner processes running.');
            }
            // Check CPU load average
            conn.exec('uptime; echo "---"; top -bn1 | grep "Cpu(s)"', (err2, stream2) => {
                if (err2) {
                    console.error('Second exec error:', err2);
                    conn.end();
                    return;
                }
                let load = '';
                stream2.on('close', (code2, signal2) => {
                    console.log('System load:');
                    console.log(load);
                    conn.end();
                }).on('data', (data) => {
                    load += data.toString();
                });
            });
        }).on('data', (data) => {
            output += data.toString();
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);