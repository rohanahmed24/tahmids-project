const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('Checking application logs...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');
    
    const commands = [
        'cd ~/tahmids-project',
        'echo "=== PM2 Status ==="',
        'pm2 status',
        'echo "=== Application Logs (last 20 lines) ==="',
        'pm2 logs wisdomia --lines 20 --nostream',
        'echo "=== Check if port 3001 is listening ==="',
        'netstat -tlnp | grep :3001 || ss -tlnp | grep :3001',
        'echo "=== Check process ==="',
        'ps aux | grep node'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }
        
        stream.on('close', (code, signal) => {
            console.log('Log check completed with code', code);
            conn.end();
        }).on('data', (data) => {
            console.log(data.toString());
        }).stderr.on('data', (data) => {
            console.log('STDERR:', data.toString());
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);