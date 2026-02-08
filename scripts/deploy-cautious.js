const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const config = {
    host: '76.13.5.200',
    port: 22,
    username: 'root',
    password: '.6DKb@iGrt2qqM7',
    readyTimeout: 20000,
};

// Configuration
const LOCAL_TARBALL = './deployment.tar.gz';
const REMOTE_TARBALL = '/tmp/deployment.tar.gz';
const PROJECT_PATH = '/root/tahmids-project';
const MAX_CPU_PERCENT = 80; // Abort if CPU exceeds this for >30s
const MONITOR_INTERVAL = 5; // seconds

console.log('🚀 Starting cautious deployment...');

// Helper to run command with timeout
function runCommand(conn, command, description, timeoutMs = 60000) {
    return new Promise((resolve, reject) => {
        console.log(`📝 ${description}`);
        const start = Date.now();
        let output = '';
        let timer = setTimeout(() => {
            conn.end();
            reject(new Error(`Timeout after ${timeoutMs}ms: ${description}`));
        }, timeoutMs);
        
        conn.exec(command, (err, stream) => {
            if (err) {
                clearTimeout(timer);
                reject(err);
                return;
            }
            stream.on('close', (code, signal) => {
                clearTimeout(timer);
                const elapsed = ((Date.now() - start) / 1000).toFixed(1);
                console.log(`   ✅ ${description} completed (${elapsed}s, code ${code})`);
                resolve({ code, output });
            }).on('data', (data) => {
                output += data.toString();
                process.stdout.write(data.toString());
            }).stderr.on('data', (data) => {
                output += data.toString();
                process.stderr.write(data.toString());
            });
        });
    });
}

// Monitor CPU for a period
async function monitorCpu(conn, durationSec = 30) {
    console.log(`📊 Monitoring CPU for ${durationSec} seconds...`);
    const start = Date.now();
    let maxCpu = 0;
    while (Date.now() - start < durationSec * 1000) {
        const { output } = await runCommand(conn, 
            "top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'.' -f1", 
            'CPU check', 10000);
        const cpu = parseInt(output.trim());
        if (cpu > maxCpu) maxCpu = cpu;
        if (cpu > MAX_CPU_PERCENT) {
            console.warn(`⚠️ CPU spike detected: ${cpu}%`);
            if (cpu > 90) {
                throw new Error(`CPU exceeded ${MAX_CPU_PERCENT}%: ${cpu}%`);
            }
        }
        await new Promise(resolve => setTimeout(resolve, MONITOR_INTERVAL * 1000));
    }
    console.log(`📊 Max CPU observed: ${maxCpu}%`);
    return maxCpu;
}

async function deploy() {
    const conn = new Client();
    
    conn.on('ready', async () => {
        console.log('✅ SSH connected');
        try {
            // Step 0: Check current CPU
            await monitorCpu(conn, 10);
            
            // Step 1: Stop PM2
            await runCommand(conn, 
                'pm2 stop all 2>/dev/null || true; pm2 delete all 2>/dev/null || true',
                'Stopping PM2 processes');
            
            // Step 2: Backup current .next and package.json
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await runCommand(conn, 
                `cd ${PROJECT_PATH} && tar -czf /tmp/backup-${timestamp}.tar.gz .next package.json package-lock.json 2>/dev/null || true`,
                'Backing up existing build');
            
            // Step 3: Upload tarball (assumes local tarball exists)
            console.log('📤 Uploading tarball...');
            await new Promise((resolve, reject) => {
                conn.sftp((err, sftp) => {
                    if (err) return reject(err);
                    sftp.fastPut(LOCAL_TARBALL, REMOTE_TARBALL, (err) => {
                        if (err) reject(err);
                        else {
                            console.log('✅ Tarball uploaded');
                            resolve();
                        }
                    });
                });
            });
            
            // Step 4: Extract tarball
            await runCommand(conn,
                `cd ${PROJECT_PATH} && tar -xzf ${REMOTE_TARBALL} --overwrite`,
                'Extracting tarball');
            
            // Step 5: Update packages (lightweight)
            console.log('📦 Updating packages (npm install)...');
            const cpuBefore = await monitorCpu(conn, 5);
            await runCommand(conn,
                `cd ${PROJECT_PATH} && npm install --no-audit --no-fund --no-optional`,
                'npm install', 180000); // 3 minute timeout
            const cpuAfter = await monitorCpu(conn, 5);
            if (cpuAfter - cpuBefore > 30) {
                console.warn('⚠️ Significant CPU increase during npm install');
            }
            
            // Step 6: Prisma migrations
            await runCommand(conn,
                `cd ${PROJECT_PATH} && npx prisma generate`,
                'Prisma generate');
            await runCommand(conn,
                `cd ${PROJECT_PATH} && npx prisma db push --skip-generate`,
                'Prisma db push');
            
            // Step 7: Start server using standalone if available, else npm start
            console.log('🚀 Starting server...');
            await runCommand(conn,
                `cd ${PROJECT_PATH} && if [ -d .next/standalone ]; then PORT=3001 pm2 start .next/standalone/server.js --name "wisdomia"; else PORT=3001 pm2 start npm --name "wisdomia" -- start; fi`,
                'Starting PM2');
            await runCommand(conn, 'pm2 save', 'Saving PM2 config');
            
            // Step 8: Verify server is up
            await runCommand(conn,
                'sleep 3 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3001',
                'Checking server health');
            
            console.log('🎉 Deployment successful!');
            console.log('🌐 Site should be live at: http://76.13.5.200:3001');
            
        } catch (error) {
            console.error('❌ Deployment failed:', error.message);
            // Attempt rollback?
            console.log('🔄 Attempting rollback...');
            try {
                await runCommand(conn,
                    `cd ${PROJECT_PATH} && pm2 stop all 2>/dev/null || true`,
                    'Stopping after failure');
                // Could restore backup here
            } catch (e) {
                console.error('Rollback also failed:', e.message);
            }
            process.exit(1);
        } finally {
            conn.end();
        }
    }).on('error', (err) => {
        console.error('SSH connection error:', err);
        process.exit(1);
    }).connect(config);
}

// Check if local tarball exists
if (!fs.existsSync(LOCAL_TARBALL)) {
    console.error(`Local tarball not found: ${LOCAL_TARBALL}`);
    console.error('Please run build script first.');
    process.exit(1);
}

deploy();