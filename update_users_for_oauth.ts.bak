
import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'project_1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function updateUsersForOAuth() {
    let connection;
    try {
        console.log("Connecting to MariaDB...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        // 1. Make password_hash nullable
        try {
            await connection.query("ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL");
            console.log("Modified 'password_hash' to be nullable.");
        } catch (e) {
            console.log("Error modifying 'password_hash':", e);
        }

        // 2. Add image column
        try {
            await connection.query("ALTER TABLE users ADD COLUMN image VARCHAR(255)");
            console.log("Added 'image' column to users.");
        } catch (e) {
             if ((e as { code?: string }).code === 'ER_DUP_FIELDNAME') {
                console.log("'image' column already exists in users.");
            } else {
                console.log("Error adding 'image' column:", e);
            }
        }

        // 3. Add provider column
        try {
            await connection.query("ALTER TABLE users ADD COLUMN provider VARCHAR(50)");
            console.log("Added 'provider' column to users.");
        } catch (e) {
             if ((e as { code?: string }).code === 'ER_DUP_FIELDNAME') {
                console.log("'provider' column already exists in users.");
            } else {
                console.log("Error adding 'provider' column:", e);
            }
        }

        // 4. Add provider_id column
        try {
             await connection.query("ALTER TABLE users ADD COLUMN provider_id VARCHAR(255)");
             console.log("Added 'provider_id' column to users.");
        } catch (e) {
             if ((e as { code?: string }).code === 'ER_DUP_FIELDNAME') {
                console.log("'provider_id' column already exists in users.");
            } else {
                console.log("Error adding 'provider_id' column:", e);
            }
        }

        console.log("Database updated for OAuth successfully.");

    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

updateUsersForOAuth();
