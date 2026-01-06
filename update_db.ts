
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

async function updateDb() {
    let connection;
    try {
        console.log("Connecting to MariaDB...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        // Add views column to posts if not exists
        try {
            await connection.query("ALTER TABLE posts ADD COLUMN views INT DEFAULT 0");
            console.log("Added 'views' column to posts.");
        } catch (e: any) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("'views' column already exists in posts.");
            } else {
                throw e;
            }
        }

        // Add plan column to users if not exists
        try {
            await connection.query("ALTER TABLE users ADD COLUMN plan VARCHAR(50) DEFAULT 'Explorer'");
            console.log("Added 'plan' column to users.");
        } catch (e: any) {
             if (e.code === 'ER_DUP_FIELDNAME') {
                console.log("'plan' column already exists in users.");
            } else {
                throw e;
            }
        }

        // Create Settings Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                key_name VARCHAR(255) NOT NULL UNIQUE,
                value TEXT
            )
        `);
        console.log("Table 'settings' ready.");

        // Seed default settings
        await connection.query("INSERT IGNORE INTO settings (key_name, value) VALUES ('site_name', 'Wisdomia')");
        await connection.query("INSERT IGNORE INTO settings (key_name, value) VALUES ('site_description', 'A digital sanctuary for stories that matter.')");

        console.log("Database updated successfully.");

    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

updateDb();
