const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('Checking firewall and network configuration...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');
    
    const commands = [
        'echo "=== Firewall Status ==="',
        'ufw status || iptables -L -n || echo "No ufw/iptables found"',
        'echo "=== Listening Ports ==="',
        'netstat -tlnp | grep :3001',
        'echo "=== Local Connection Test ==="',
        'curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "Local curl failed"',
        'echo "=== External IP Check ==="',
        'curl -s ifconfig.me',
        'echo "=== Network Interfaces ==="',
        'ip addr show',
        'echo "=== Test from server to external ==="',
        'curl -s -o /dev/null -w "%{http_code}" http://google.com && echo "External connectivity OK" || echo "External connectivity failed"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }
        
        stream.on('close', (code, signal) => {
            console.log('Firewall check completed with code', code);
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