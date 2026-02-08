const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('SSH connected');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `/tmp/wisdomia-db-backup-${timestamp}.sql.gz`;

    // Extract DATABASE_URL, use it directly with pg_dump
    const commands = [
        'cd /root/tahmids-project',
        'export DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f2- | tr -d \'"\' | tr -d " ")',
        'echo "DATABASE_URL: $DATABASE_URL"',
        'pg_dump -d "$DATABASE_URL" --no-password | gzip > ' + backupFile,
        'echo "Backup created: ' + backupFile + '"',
        'ls -lh ' + backupFile,
        'echo "Checking backup size..."',
        'gunzip -c ' + backupFile + ' | wc -l'
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