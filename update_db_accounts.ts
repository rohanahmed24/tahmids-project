import mysql from 'mysql2/promise';

const poolConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function migrate() {
    let connection;
    try {
        console.log("Connecting to Database...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        // Create Accounts Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(255) NOT NULL,
                provider VARCHAR(255) NOT NULL,
                provider_account_id VARCHAR(255) NOT NULL,
                refresh_token TEXT,
                access_token TEXT,
                expires_at INT,
                token_type VARCHAR(255),
                scope VARCHAR(255),
                id_token TEXT,
                session_state VARCHAR(255),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE KEY provider_unique (provider, provider_account_id)
            )
        `);
        console.log("Table 'accounts' ready.");

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

migrate();
