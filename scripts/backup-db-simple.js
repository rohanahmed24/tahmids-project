const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

console.log('💾 Simple database backup...');

conn.on('ready', () => {
    console.log('✅ SSH connected');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `/tmp/wisdomia-db-backup-${timestamp}.sql.gz`;

    const commands = [
        'cd /root/tahmids-project',
        'echo "=== CPU before ==="',
        'top -bn1 | head -3',
        'echo "=== Extract DATABASE_URL ==="',
        'DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f2- | tr -d \'"\' | tr -d " ")',
        'echo "DATABASE_URL: $DATABASE_URL"',
        'echo "=== Run pg_dump with DATABASE_URL ==="',
        'pg_dump -d "$DATABASE_URL" | gzip > ' + backupFile,
        'BACKUP_SIZE=$(wc -c < ' + backupFile + ')',
        'echo "Backup created: ' + backupFile + ' ($BACKUP_SIZE bytes)"',
        'ls -lh ' + backupFile,
        'echo "=== CPU after ==="',
        'top -bn1 | head -3',
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) {
            console.error('Exec error:', err);
            conn.end();
            return;
        }
        stream.on('close', (code, signal) => {
            console.log('Exit code:', code);
            if (code === 0) {
                console.log('✅ Database backup successful');
            } else {
                console.log('⚠️ Backup failed');
            }
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