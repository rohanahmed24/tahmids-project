const { Client } = require('ssh2');

const conn = new Client();
const config = require('./connection-config');

conn.on('ready', () => {
    console.log('Client :: ready');

    // Write script to project dir, then execute from there
    const commands = `
cd /root/tahmids-project

cat > reset-password-temp.js << 'SCRIPT_END'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();
    const email = 'tahmid@wisdomia.com';
    const password = 'wisdomia2024';
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
        await prisma.user.update({
            where: { email },
            data: { password: passwordHash, role: 'admin' }
        });
        console.log('Password updated for:', email);
    } else {
        await prisma.user.create({
            data: { name: 'Tahmid', email, password: passwordHash, role: 'admin' }
        });
        console.log('Admin user created:', email);
    }
    
    await prisma.$disconnect();
    console.log('Done!');
}

main().catch(console.error);
SCRIPT_END

node reset-password-temp.js
rm reset-password-temp.js
`;

    console.log('Running password reset...');

    conn.exec(commands, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Process :: close :: code: ' + code + ', signal: ' + signal);
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
