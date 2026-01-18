
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

async function updateDbMedia() {
    let connection;
    try {
        console.log("Connecting to MariaDB...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        // Create Assets Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS assets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                url VARCHAR(255) NOT NULL,
                type VARCHAR(50) DEFAULT 'image',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'assets' ready.");

        console.log("Database updated for Media successfully.");

    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

updateDbMedia();
