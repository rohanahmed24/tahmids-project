const { Client } = require('ssh2');
const crypto = require('crypto');

const conn = new Client();
const config = require('./connection-config');

const DB_USER = 'wisdomia_user';
const DB_NAME = 'project_1';
// Generate a secure password that doesn't contain special chars prone to shell escaping issues
const DB_PASS = crypto.randomBytes(16).toString('hex');

conn.on('ready', () => {
    console.log('Client :: ready');
    console.log(`Setting up PostgreSQL with User: ${DB_USER} and DB: ${DB_NAME}`);

    const commands = [
        'echo "--- 1. Installing PostgreSQL ---"',
        'apt-get update',
        'apt-get install -y postgresql postgresql-contrib',
        'systemctl start postgresql',
        'systemctl enable postgresql',

        'echo "--- 2. configuring Database ---"',
        // Drop if exists to ensure fresh start (as requested)
        `sudo -u postgres psql -c "DROP DATABASE IF EXISTS ${DB_NAME};"`,
        `sudo -u postgres psql -c "DROP USER IF EXISTS ${DB_USER};"`,
        `sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"`,
        `sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"`,
        `sudo -u postgres psql -c "ALTER USER ${DB_USER} CREATEDB;"`, // Giving rights just in case

        'echo "--- 3. Updating .env files ---"',
        // Update .env
        `sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"|' ~/tahmids-project/.env || echo ".env not found or sed failed"`,
        // Update .env.local if it exists
        `sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"|' ~/tahmids-project/.env.local || echo ".env.local not found or sed failed"`,

        // Ensure new env vars are appended if they didn't exist (less likely for DATABASE_URL but good practice)
        // Actually, sed replace is safer for now. 

        'echo "--- Verification ---"',
        'cat ~/tahmids-project/.env | grep DATABASE_URL',
        'sudo -u postgres psql -lqt | cut -d \\| -f 1 | grep -w ' + DB_NAME
    ].join(' && ');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('\nMigration Process :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            process.stdout.write(data);
        }).stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}).on('error', (err) => {
    console.error('Connection Error:', err);
}).connect(config);
