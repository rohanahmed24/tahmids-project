const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

console.log('🔧 Fixing CSS serving...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "--- Current structure ---"',
        'ls -la .next/standalone/',
        'echo "--- Check static directory ---"',
        'ls -la .next/standalone/.next/ 2>/dev/null || echo ".next not found in standalone"',
        'echo "--- Copy static files if missing ---"',
        'if [ ! -d ".next/standalone/.next" ]; then',
        '  echo "Creating .next/standalone/.next and copying static..."',
        '  mkdir -p .next/standalone/.next',
        '  cp -r .next/static .next/standalone/.next/',
        'else',
        '  echo ".next/standalone/.next exists, checking static..."',
        '  if [ ! -d ".next/standalone/.next/static" ]; then',
        '    cp -r .next/static .next/standalone/.next/',
        '  fi',
        'fi',
        'echo "--- Ensure public folder is complete ---"',
        'if [ ! -f ".next/standalone/public/favicon.ico" ]; then',
        '  echo "Copying public files..."',
        '  cp -r public/* .next/standalone/public/ 2>/dev/null || echo "Some copies failed"',
        'fi',
        'echo "--- Verify CSS file exists ---"',
        'find .next/standalone/.next/static -name "*.css" 2>/dev/null | head -3',
        'echo "--- Restarting PM2 ---"',
        'pm2 stop wisdomia',
        'pm2 delete wisdomia',
        'cd .next/standalone && pm2 start server.js --name wisdomia',
        'pm2 save',
        'echo "--- Wait 3s for startup ---"',
        'sleep 3',
        'echo "--- Test CSS access ---"',
        'curl -s -o /dev/null -w "CSS %{http_code}" http://localhost:3001/_next/static/css/24a582c4c1344ecf.css',
    ].join('\n');
    
    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ CSS fix completed');
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data.toString());
        }).stderr.on('data', (data) => {
            process.stderr.write(data.toString());
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);