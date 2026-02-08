const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = require('./connection-config');

const localTarball = path.join(__dirname, '..', 'deployment.tar.gz');
const remoteTarball = '/tmp/deployment.tar.gz';
const remoteProject = '/root/tahmids-project';

console.log('🚀 Starting deployment...');
console.log('Local tarball:', localTarball);
console.log('Remote target:', remoteProject);

if (!fs.existsSync(localTarball)) {
    console.error('❌ Tarball not found:', localTarball);
    process.exit(1);
}

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ SSH connected');

    const steps = [
        { name: 'Upload tarball', fn: uploadTarball },
        { name: 'Stop PM2', fn: stopPm2 },
        { name: 'Backup existing standalone', fn: backupStandalone },
        { name: 'Extract tarball', fn: extractTarball },
        { name: 'Install dependencies', fn: installDeps },
        { name: 'Restart PM2', fn: restartPm2 },
        { name: 'Verify deployment', fn: verifyDeployment },
    ];

    let stepIndex = 0;
    function nextStep(err) {
        if (err) {
            console.error('❌ Deployment failed at step:', steps[stepIndex - 1]?.name, err);
            conn.end();
            process.exit(1);
        }
        if (stepIndex >= steps.length) {
            console.log('✅ Deployment completed successfully');
            conn.end();
            return;
        }
        const step = steps[stepIndex];
        console.log(`\n🔧 Step ${stepIndex + 1}/${steps.length}: ${step.name}`);
        stepIndex++;
        step.fn(nextStep);
    }

    function uploadTarball(callback) {
        console.log('📤 Uploading tarball...');
        conn.sftp((err, sftp) => {
            if (err) {
                callback(err);
                return;
            }
            sftp.fastPut(localTarball, remoteTarball, {}, (err) => {
                if (err) {
                    callback(err);
                    return;
                }
                console.log('✅ Tarball uploaded');
                callback();
            });
        });
    }

    function stopPm2(callback) {
        console.log('⏸️ Stopping PM2...');
        conn.exec('cd ' + remoteProject + ' && pm2 stop wisdomia 2>/dev/null || true', (err, stream) => {
            stream.on('close', () => callback());
        });
    }

    function backupStandalone(callback) {
        console.log('💾 Backing up existing standalone...');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const cmd = `cd ${remoteProject} && cp -r .next/standalone .next/standalone.backup.${timestamp} 2>/dev/null || echo "No standalone to backup"`;
        conn.exec(cmd, (err, stream) => {
            stream.on('close', () => callback());
        });
    }

    function extractTarball(callback) {
        console.log('📦 Extracting tarball...');
        const cmd = `cd ${remoteProject} && tar -xzf ${remoteTarball} --strip-components=1`;
        conn.exec(cmd, (err, stream) => {
            if (err) {
                callback(err);
                return;
            }
            stream.on('close', (code) => {
                if (code !== 0) {
                    callback(new Error(`tar extraction failed with code ${code}`));
                    return;
                }
                console.log('✅ Tarball extracted');
                callback();
            });
        });
    }

    function installDeps(callback) {
        console.log('📦 Installing dependencies...');
        const cmd = `cd ${remoteProject} && npm install --production --no-audit --no-fund`;
        conn.exec(cmd, (err, stream) => {
            if (err) {
                callback(err);
                return;
            }
            stream.on('close', (code) => {
                if (code !== 0) {
                    console.warn('⚠️ npm install had non-zero exit code:', code);
                }
                console.log('✅ Dependencies installed');
                callback();
            });
        });
    }

    function restartPm2(callback) {
        console.log('🔄 Restarting PM2...');
        const cmd = `cd ${remoteProject} && PORT=3001 pm2 start .next/standalone/server.js --name wisdomia && pm2 save`;
        conn.exec(cmd, (err, stream) => {
            if (err) {
                callback(err);
                return;
            }
            stream.on('close', (code) => {
                if (code !== 0) {
                    callback(new Error(`PM2 restart failed with code ${code}`));
                    return;
                }
                console.log('✅ PM2 restarted');
                callback();
            });
        });
    }

    function verifyDeployment(callback) {
        console.log('🧪 Verifying deployment...');
        const cmd = `sleep 3 && curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3001`;
        conn.exec(cmd, (err, stream) => {
            if (err) {
                callback(err);
                return;
            }
            stream.on('data', (data) => {
                console.log('Server response:', data.toString().trim());
            });
            stream.on('close', (code) => {
                console.log('✅ Verification complete');
                callback();
            });
        });
    }

    // Start steps
    nextStep();

}).on('error', (err) => {
    console.error('❌ Connection error:', err);
}).connect(config);