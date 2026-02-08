const { Client } = require('ssh2');

const config = require('./connection-config');

console.log('Checking for hosting provider firewall blocks...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');

    const commands = [
        'echo "=== Testing external connectivity to port 3001 ==="',
        'echo "Testing from server to itself via external IP..."',
        'curl -s -o /dev/null -w "External to external: %{http_code}" http://76.13.5.200:3001 && echo " SUCCESS" || echo " FAILED"',
        'echo "Testing from server to localhost..."',
        'curl -s -o /dev/null -w "Local to local: %{http_code}" http://localhost:3001 && echo " SUCCESS" || echo " FAILED"',
        'echo "=== Checking if port is reachable from outside ==="',
        'echo "Install telnet to test connectivity..."',
        'apt-get update && apt-get install -y telnet',
        'echo "Testing port 3001 connectivity from external..."',
        'timeout 5 bash -c "echo > /dev/tcp/76.13.5.200/3001" && echo "Port 3001 is reachable" || echo "Port 3001 is NOT reachable"',
        'echo "=== Check hosting provider control panel ==="',
        'echo "If this fails, check hosting provider firewall/security groups"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('Hosting firewall check completed with code', code);
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