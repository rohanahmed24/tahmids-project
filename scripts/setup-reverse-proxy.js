const { Client } = require('ssh2');

const config = require('./connection-config');

console.log('Setting up reverse proxy from port 80 to 3001...');

const conn = new Client();
conn.on('ready', () => {
    console.log('SSH connection successful!');

    const commands = [
        'echo "=== Creating OpenLiteSpeed reverse proxy configuration ==="',
        'echo "Backing up current config..."',
        'cp /usr/local/lsws/conf/httpd_config.conf /usr/local/lsws/conf/httpd_config.conf.backup',
        'echo "Creating virtual host for reverse proxy..."',
        'cat > /usr/local/lsws/conf/vhosts/wisdomia.conf << \'EOF\'\n',
        'virtualHost wisdomia {\n',
        '  vhRoot                  /var/www/wisdomia/\n',
        '  configFile              /usr/local/lsws/conf/vhosts/wisdomia.conf\n',
        '  allowSymbolLink         1\n',
        '  enableScript            1\n',
        '  restrained              1\n',
        '  maxKeepAliveReq         1000\n',
        '  smartKeepAlive          1\n',
        '  \n',
        '  context / {\n',
        '    type                  proxy\n',
        '    handler               proxyHandler\n',
        '    addDefaultCharset     off\n',
        '    balancer              wisdomia_proxy\n',
        '  }\n',
        '  \n',
        '  balancer wisdomia_proxy {\n',
        '    member 127.0.0.1:3001 {\n',
        '      weight              100\n',
        '    }\n',
        '  }\n',
        '}\n',
        'EOF',
        'echo "Adding virtual host to main config..."',
        'echo "\ninclude /usr/local/lsws/conf/vhosts/wisdomia.conf" >> /usr/local/lsws/conf/httpd_config.conf',
        'echo "Restarting OpenLiteSpeed..."',
        '/usr/local/lsws/bin/lswsctrl restart',
        'echo "Waiting for restart..."',
        'sleep 5',
        'echo "Testing reverse proxy..."',
        'curl -s -o /dev/null -w "%{http_code}" http://localhost && echo "Reverse proxy SUCCESS" || echo "Reverse proxy FAILED"',
        'echo "=== Final test from external perspective ==="',
        'echo "Website should now be accessible via http://76.13.5.200 (port 80)"'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Execution error:', err);
            conn.end();
            return;
        }

        stream.on('close', (code, signal) => {
            console.log('Reverse proxy setup completed with code', code);
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