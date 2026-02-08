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

console.log('📤 Uploading missing CSS files...');

const localCssDir = path.join(__dirname, '..', '.next', 'static', 'css');
const remoteCssDir = '/root/tahmids-project/.next/standalone/.next/static/css';

// Get local CSS files
const localFiles = fs.readdirSync(localCssDir).filter(f => f.endsWith('.css'));
console.log('Local CSS files:', localFiles);

const conn = new Client();

conn.on('ready', () => {
    console.log('✅ SSH connected');
    conn.sftp((err, sftp) => {
        if (err) {
            console.error('SFTP error:', err);
            conn.end();
            return;
        }
        
        let uploaded = 0;
        const uploadNext = (index) => {
            if (index >= localFiles.length) {
                console.log(`✅ Uploaded ${uploaded} CSS files`);
                // Restart PM2
                conn.exec('cd /root/tahmids-project && pm2 restart wisdomia', (err, stream) => {
                    if (err) console.error('Restart error:', err);
                    else stream.on('close', () => {
                        console.log('🔄 PM2 restarted');
                        conn.end();
                    });
                });
                return;
            }
            
            const filename = localFiles[index];
            const localPath = path.join(localCssDir, filename);
            const remotePath = path.join(remoteCssDir, filename).replace(/\\/g, '/');
            
            console.log(`Uploading ${filename}...`);
            sftp.fastPut(localPath, remotePath, {}, (err) => {
                if (err) {
                    console.error(`  Failed to upload ${filename}:`, err.message);
                } else {
                    uploaded++;
                    console.log(`  ✅ ${filename} uploaded`);
                }
                uploadNext(index + 1);
            });
        };
        
        // Ensure remote directory exists
        conn.exec(`mkdir -p ${remoteCssDir}`, (err) => {
            if (err) console.error('mkdir error:', err);
            uploadNext(0);
        });
    });
}).on('error', (err) => {
    console.error('Connection error:', err);
}).connect(config);