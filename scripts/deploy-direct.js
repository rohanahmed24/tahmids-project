const { Client } = require('ssh2');
const fs = require('fs');
const { exec } = require('child_process');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

const localTarPath = './deployment.tar.gz';
const remoteTarPath = '/tmp/deployment.tar.gz';

console.log('Creating tarball...');
// Including all source files. Exclude node_modules, .next, .git
// Using explicit list to be safe
const filesToTar = 'app components lib public prisma scripts next.config.ts postcss.config.mjs tsconfig.json package.json package-lock.json auth.ts middleware.ts eslint.config.mjs vitest.config.ts next-env.d.ts next-auth.d.ts';

exec(`tar -czf ${localTarPath} ${filesToTar}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Tar error: ${error.message}`);
        return;
    }
    console.log('Tarball created.');

    const conn = new Client();
    conn.on('ready', () => {
        console.log('Client :: ready');
        conn.sftp((err, sftp) => {
            if (err) {
                console.error("SFTP Error:", err);
                conn.end();
                return;
            }
            console.log('Uploading tarball...');
            sftp.fastPut(localTarPath, remoteTarPath, (err) => {
                if (err) {
                    console.error("Upload Error:", err);
                    conn.end();
                    return;
                }
                console.log('Upload successful.');

                const projectPath = '~/tahmids-project';

                // Commands to backup, extract, build, restart
                const commands = [
                    `cd ${projectPath}`,
                    'echo "Starting Direct Deployment..."',
                    // Backup uploads
                    'mkdir -p /tmp/uploads_backup',
                    'cp -r public/imgs/uploads/* /tmp/uploads_backup/ 2>/dev/null || true',
                    'cp -r .next/standalone/public/imgs/uploads/* /tmp/uploads_backup/ 2>/dev/null || true',

                    // Cleanup old build artifacts to force clean state
                    'rm -rf .next',

                    // Extract new code
                    `tar -xzf ${remoteTarPath} -C .`,
                    'echo "Code Extracted."',

                    // Restore uploads
                    'mkdir -p public/imgs/uploads',
                    'cp -r /tmp/uploads_backup/* public/imgs/uploads/  2>/dev/null || true',

                    // Install & Build
                    'npm install',
                    'npx prisma generate',
                    'npx prisma db push --skip-generate',
                    'npm run build',

                    // Restart PM2 with npm start (Standard Mode) to fix static file issues
                    'pm2 stop all || true',
                    'pm2 delete all || true',
                    'echo "Starting server in Standard Mode..."',
                    'PORT=3001 pm2 start npm --name "wisdomia" -- start',
                    'pm2 save',
                    'echo "Deployment Complete."'
                ].join(' && ');

                conn.exec(commands, (err, stream) => {
                    if (err) throw err;
                    stream.on('close', (code, signal) => {
                        console.log('Deployment closed with code ' + code);
                        conn.end();
                        try { fs.unlinkSync(localTarPath); } catch (e) { }
                    }).on('data', (data) => {
                        console.log('STDOUT: ' + data);
                    }).stderr.on('data', (data) => {
                        console.log('STDERR: ' + data);
                    });
                });
            });
        });
    }).on('error', (err) => {
        console.error('Connection Error:', err);
    }).connect(config);
});
