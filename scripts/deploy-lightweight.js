// Lightweight Deployment - Build locally, deploy only built files
const { Client } = require('ssh2');
const { exec } = require('child_process');
const path = require('path');

const config = require('./connection-config');

console.log('🚀 Starting Lightweight Deployment...');
console.log('');

// Step 1: Build locally (no server CPU pressure)
console.log('Step 1: Building locally...');
exec('npm run build', (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Build failed: ${error.message}`);
        console.error(stderr);
        return;
    }
    console.log('✅ Build complete.');
    console.log('');

    const localBuildPath = './.next';
    const remoteTarPath = '/tmp/lightweight-deploy.tar.gz';
    const projectPath = '~/tahmids-project';

    // Step 2: Create tarball of build only
    console.log('Step 2: Creating tarball of build...');
    exec(`tar -czf ${remoteTarPath} -C ${localBuildPath} .`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Tar failed: ${error.message}`);
            return;
        }

        const conn = new Client();
        conn.on('ready', () => {
            console.log('✅ Connected to server.');
            console.log('');

            conn.sftp((err, sftp) => {
                if (err) {
                    console.error('❌ SFTP Error:', err);
                    conn.end();
                    return;
                }

                // Step 3: Upload tarball
                console.log('Step 3: Uploading build to server...');
                sftp.fastPut(remoteTarPath, remoteTarPath, (err) => {
                    if (err) {
                        console.error('❌ Upload Error:', err);
                        conn.end();
                        return;
                    }
                    console.log('✅ Upload complete.');
                    console.log('');

                    // Step 4: Deploy on server (lightweight - no build)
                    console.log('Step 4: Deploying on server (lightweight)...');

                    const commands = [
                        `cd ${projectPath}`,
                        'echo "Backup current build..."',
                        'cp -r .next/standalone/.next /tmp/.next.backup 2>/dev/null || true',
                        'rm -rf .next',

                        'echo "Extracting new build..."',
                        `tar -xzf ${remoteTarPath} -C .`,

                        'echo "Syncing static files..."',
                        'mkdir -p public/imgs/uploads',
                        'rm -rf public/imgs/uploads/*',
                        'mkdir -p .next/standalone/public',
                        'cp -r public/* .next/standalone/public/ 2>/dev/null || true',
                        'cp -r .next/static .next/standalone/.next/static 2>/dev/null || true',

                        'echo "Restarting PM2 (using pre-built code)...',
                        'pm2 stop wisdomia || true',
                        'pm2 delete wisdomia || true',
                        'PORT=3001 pm2 start node .next/standalone/server.js --name wisdomia',
                        'pm2 save',

                        'echo "Cleaning up..."',
                        `rm -f ${remoteTarPath}`,
                        'echo "✅ Deployment complete!"'
                    ].join(' && ');

                    conn.exec(commands, (err, stream) => {
                        if (err) throw err;
                        stream.on('close', (code, signal) => {
                            console.log(`Deployment closed with code ${code}.`);
                            conn.end();
                        });
                        stream.on('data', (data) => {
                            console.log('STDOUT:', data.toString().trim());
                        });
                        stream.stderr.on('data', (data) => {
                            console.log('STDERR:', data.toString().trim());
                        });
                    });
                });
            });
        }).on('error', (err) => {
            console.error('❌ Connection Error:', err);
        }).connect(config);
    });
});
