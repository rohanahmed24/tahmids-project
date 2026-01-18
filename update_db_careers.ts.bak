
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

async function updateDbCareers() {
    let connection;
    try {
        console.log("Connecting to MariaDB...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        // Create job_applications Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS job_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                job_id INT NOT NULL,
                job_title VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                linkedin VARCHAR(255),
                resume_path VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'job_applications' ready.");

    } catch (err) {
        console.error("Update failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

updateDbCareers();
