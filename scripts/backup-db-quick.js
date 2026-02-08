const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('SSH connected');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `/tmp/wisdomia-db-backup-${timestamp}.sql.gz`;

    // Extract DATABASE_URL from .env, set PGPASSWORD, run pg_dump
    const commands = [
        'cd /root/tahmids-project',
        'export DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f2- | tr -d \'"\' | tr -d " ")',
        'export PGPASSWORD=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/[^:]*:\\([^@]*\\)@.*/\\1/p")',
        'export DB_USER=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/\\([^:]*\\):.*/\\1/p")',
        'export DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\\([^:]*\\):.*/\\1/p")',
        'export DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*@[^:]*:\\([0-9]*\\)\\/.*/\\1/p")',
        'export DB_NAME=$(echo $DATABASE_URL | sed -n "s/.*\\/\\([^?]*\\)\\(?:\\?.*\\)?$/\\1/p")',
        'echo "Backing up $DB_NAME..."',
        'pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" | gzip > ' + backupFile,
        'echo "Backup created: ' + backupFile + '"',
        'ls -lh ' + backupFile
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