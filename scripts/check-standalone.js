const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('🔍 Inspecting standalone deployment...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const commands = [
        'cd /root/tahmids-project',
        'echo "=== BUILD_IDs ==="',
        'echo "Root .next/BUILD_ID:"; cat .next/BUILD_ID 2>/dev/null || echo "none"',
        'echo "Standalone .next/BUILD_ID:"; cat .next/standalone/.next/BUILD_ID 2>/dev/null || echo "none"',
        'echo "=== Timestamps ==="',
        'ls -la .next/standalone/.next/BUILD_ID .next/BUILD_ID 2>/dev/null | head -2',
        'echo "=== Next.js version in standalone node_modules ==="',
        'grep -r "version" .next/standalone/node_modules/next/package.json 2>/dev/null | head -1',
        'echo "=== React version in standalone node_modules ==="',
        'grep -r "version" .next/standalone/node_modules/react/package.json 2>/dev/null | head -1',
        'echo "=== Check backlinks API route ==="',
        'find .next/standalone -name "*backlink*" -type f 2>/dev/null | head -5',
        'echo "=== Check if backlinks table exists in DB ==="',
        'DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f2- | tr -d \'"\' | tr -d " ")',
        'PGPASSWORD=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/[^:]*:\\([^@]*\\)@.*/\\1/p")',
        'psql -d "$DATABASE_URL" -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = \\"backlinks\\");" 2>/dev/null | grep -A1 exists',
        'echo "=== Tarball extraction check ==="',
        'ls -la /tmp/deployment.tar.gz 2>/dev/null | head -1',
        'echo "=== Package.json next version ==="',
        'grep \'"next"\' package.json',
        'echo "=== CPU load ==="',
        'top -bn1 | head -3',
    ].join('\n');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('\n✅ Inspection complete');
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