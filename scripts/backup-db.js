const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('Client :: ready');
    // First, find the project directory
    conn.exec('find ~ -maxdepth 2 -type d -name "tahmids-project" -o -name "project-1"', (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('close', (code, signal) => {
            const paths = output.trim().split('\n').filter(p => p);
            console.log('Found potential paths:', paths);

            let projectPath = paths[0]; // Default to first found

            if (!projectPath) {
                console.log('Could not find project directory automatically. using default ~/tahmids-project');
                projectPath = '~/tahmids-project';
            }

            console.log(`Backing up database from: ${projectPath}`);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = `/tmp/wisdomia-db-backup-${timestamp}.sql`;

            const commands = [
                `cd ${projectPath}`,
                // Extract DATABASE_URL from .env file
                'export DATABASE_URL=$(grep DATABASE_URL .env | cut -d "=" -f2- | tr -d \'"\' | tr -d " ")',
                // If DATABASE_URL not found, try .env.local
                'if [ -z "$DATABASE_URL" ]; then export DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d "=" -f2- | tr -d \'"\' | tr -d " "); fi',
                'echo "DATABASE_URL extracted: $DATABASE_URL"',
                // Parse DATABASE_URL components
                'export DB_USER=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/\\([^:]*\\):.*/\\1/p")',
                'export DB_PASS=$(echo $DATABASE_URL | sed -n "s/.*:\\/\\/[^:]*:\\([^@]*\\)@.*/\\1/p")',
                'export DB_HOST=$(echo $DATABASE_URL | sed -n "s/.*@\\([^:]*\\):.*/\\1/p")',
                'export DB_PORT=$(echo $DATABASE_URL | sed -n "s/.*@[^:]*:\\([0-9]*\\)\\/.*/\\1/p")',
                'export DB_NAME=$(echo $DATABASE_URL | sed -n "s/.*\\/\\([^?]*\\)\\(?:\\?.*\\)?$/\\1/p")',
                // Backup using pg_dump
                `pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME" > ${backupPath}`,
                // Compress backup
                `gzip -f ${backupPath}`,
                `echo "Database backup created: ${backupPath}.gz"`,
                `ls -lh ${backupPath}.gz`
            ].join(' && ');

            conn.exec(commands, (err, stream) => {
                if (err) {
                    console.error('Exec error:', err);
                    conn.end();
                    return;
                }
                stream.on('close', (code, signal) => {
                    console.log('Backup process :: close :: code: ' + code + ', signal: ' + signal);
                    if (code === 0) {
                        console.log('✅ Database backup successful.');
                    } else {
                        console.log('⚠️ Backup may have failed. Check logs.');
                    }
                    conn.end();
                }).on('data', (data) => {
                    console.log('STDOUT: ' + data);
                }).stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
            });
        });
        stream.on('data', (data) => {
            output += data.toString();
        }).stderr.on('data', (data) => {
            console.error('STDERR: ' + data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);