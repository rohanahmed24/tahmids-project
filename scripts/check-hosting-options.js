const { Client } = require('ssh2');

const config = require('./connection-config');

console.log('Checking hosting provider options and alternative ports...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');

    const commands = [
        'echo "=== Checking if we can use port 80 or 443 ==="',
        'echo "Current listening ports:"',
        'netstat -tlnp | grep -E "(:80|:443|:3001)"',
        'echo "=== Testing if we can bind to port 80 ==="',
        'timeout 2 bash -c "echo test > /dev/tcp/localhost/80" 2>/dev/null && echo "Port 80 available" || echo "Port 80 not available"',
        'echo "=== Checking for hosting control panel ==="',
        'echo "Look for control panel URLs or documentation:"',
        'find /usr/local -name "*cpanel*" -o -name "*plesk*" -o -name "*directadmin*" 2>/dev/null | head -5',
        'echo "=== Check if nginx/apache are running ==="',
        'ps aux | grep -E "(nginx|apache|httpd)" | grep -v grep',
        'echo "=== Alternative: Check if we can use reverse proxy ==="',
        'which nginx || which apache2 || echo "No web server found for reverse proxy"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('Hosting options check completed with code', code);
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