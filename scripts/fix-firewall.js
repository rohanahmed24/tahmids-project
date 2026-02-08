const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('Opening port 3001 in firewall...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');
    
    const commands = [
        'echo "Opening port 3001 in firewall..."',
        'ufw allow 3001/tcp',
        'echo "Firewall rules updated:"',
        'ufw status',
        'echo "Testing local connection..."',
        'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 && echo "Local connection: SUCCESS" || echo "Local connection: FAILED"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }
        
        stream.on('close', (code, signal) => {
            console.log('Firewall fix completed with code', code);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT:', data.toString());
        }).stderr.on('data', (data) => {
            console.log('STDERR:', data.toString());
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);