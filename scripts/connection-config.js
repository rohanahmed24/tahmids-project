const fs = require('fs');
const path = require('path');

const secretsPath = path.join(__dirname, 'secrets.js');

let config = {
    host: process.env.SSH_HOST,
    port: parseInt(process.env.SSH_PORT || '22'),
    username: process.env.SSH_USER,
    password: process.env.SSH_PASS,
    readyTimeout: 20000
};

if (fs.existsSync(secretsPath)) {
    try {
        const localSecrets = require('./secrets');
        config = { ...config, ...localSecrets };
    } catch (e) {
        console.warn('Could not load local secrets:', e.message);
    }
}

// Ensure critical fields are present before returning
if (!config.host || !config.username || !config.password) {
    if (process.env.NODE_ENV !== 'test') {
        console.warn('Warning: Missing SSH configuration. Ensure scripts/secrets.js exists or environment variables are set.');
    }
}

module.exports = config;
