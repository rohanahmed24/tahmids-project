const { Client } = require('ssh2');

const conn = new Client();
const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

conn.on('ready', () => {
    console.log('Client :: ready');
    console.log('🔍 Starting security cleanup on server...');

    const commands = [
        // 1. Check high CPU processes (top 5)
        'echo "=== High CPU Processes ==="',
        'ps aux --sort=-%cpu | head -6',
        // 2. Check for unknown cron jobs
        'echo "=== Cron jobs for root ==="',
        'crontab -l 2>/dev/null || echo "No cron jobs for root"',
        'echo "=== Cron jobs for all users ==="',
        'for user in $(cut -f1 -d: /etc/passwd); do echo "User: $user"; crontab -u $user -l 2>/dev/null | grep -v "^#" | grep -v "^$" || true; done',
        // 3. Check for suspicious files in /tmp and /dev/shm
        'echo "=== Suspicious files in /tmp (executables) ==="',
        'find /tmp -type f -executable -name "*.sh" -o -name "*.py" -o -name "*.js" 2>/dev/null | head -10',
        'echo "=== Suspicious files in /dev/shm ==="',
        'find /dev/shm -type f 2>/dev/null | head -10',
        // 4. Check for unknown services
        'echo "=== Unknown services listening on ports ==="',
        'netstat -tulpn | grep -E "(LISTEN|ESTABLISHED)" | grep -v ":22\\|:80\\|:443\\|:3000\\|:3001\\|:5432"',
        // 5. Kill processes listening on suspicious ports (optional)
        // 'for port in $(netstat -tulpn | grep LISTEN | awk \'{print $4}\' | cut -d: -f2 | sort -u); do if [[ $port -gt 30000 ]]; then echo "Killing process on high port $port"; fuser -k $port/tcp; fi; done',
        // 6. Clear npm cache and remove global suspicious packages
        'echo "=== NPM global packages ==="',
        'npm list -g --depth=0',
        // 7. Remove suspicious npm packages (if any)
        // 'npm list -g | grep -E "(crypto-miner|hack|malicious)" && echo "Found suspicious npm packages" || true',
        // 8. Clean npm cache
        'echo "=== Cleaning npm cache ==="',
        'npm cache clean --force',
        // 9. Remove any leftover node_modules in home directory (optional)
        'echo "=== Cleaning leftover node_modules in /root ==="',
        'find /root -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true',
        // 10. Check for modified system binaries (simplified)
        'echo "=== Checking for unusual setuid files ==="',
        'find / -type f -perm /4000 -ls 2>/dev/null | head -20',
        // 11. Update system packages (security updates)
        'echo "=== Updating system packages ==="',
        'apt-get update && apt-get upgrade -y --allow-downgrades',
        // 12. Install/update security tools
        'echo "=== Installing security tools ==="',
        'which clamav || apt-get install -y clamav',
        'which rkhunter || apt-get install -y rkhunter',
        // 13. Run ClamAV scan on /tmp and /home (quick)
        'echo "=== Running ClamAV quick scan ==="',
        'clamscan --recursive --infected --no-summary /tmp /home 2>/dev/null | head -20 || echo "ClamAV not installed or error"',
        // 14. Final message
        'echo "✅ Security cleanup steps completed."'
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('Cleanup process :: close :: code: ' + code + ', signal: ' + signal);
            console.log('⚠️ Note: This script only reports issues. Manual review required for any detected anomalies.');
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);