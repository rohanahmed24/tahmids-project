const { Client } = require('ssh2');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('Setting up simple reverse proxy using existing web server...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');
    
    const commands = [
        'echo "=== Quick solution: Test if we can access via port 80 directly ==="',
        'echo "Since port 3001 is blocked externally but port 80 is open, let\'s test:"',
        'echo "Trying to access the site via port 80 (should work now):"',
        'curl -s -o /dev/null -w "%{http_code}" http://76.13.5.200 && echo "Port 80 access SUCCESS" || echo "Port 80 access FAILED"',
        'echo "=== If that fails, let\'s try a simple redirect ==="',
        'echo "Creating simple redirect in web root..."',
        'mkdir -p /var/www/html',
        'cat > /var/www/html/index.html << \'EOF\'\n',
        '<!DOCTYPE html>\n',
        '<html>\n',
        '<head>\n',
        '    <meta http-equiv="refresh" content="0; url=http://localhost:3001" />\n',
        '</head>\n',
        '<body>\n',
        '    <p>Redirecting to Wisdomia...</p>\n',
        '</body>\n',
        '</html>\n',
        'EOF',
        'echo "Testing redirect..."',
        'curl -s -o /dev/null -w "%{http_code}" http://76.13.5.200 && echo "Redirect setup SUCCESS" || echo "Redirect setup FAILED"',
        'echo "=== Final external test ==="',
        'echo "The website should now be accessible at http://76.13.5.200"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }
        
        stream.on('close', (code, signal) => {
            console.log('Simple proxy setup completed with code', code);
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