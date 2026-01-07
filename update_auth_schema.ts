
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

async function updateSchema() {
    let connection;
    try {
        console.log("Connecting to MariaDB...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        console.log("Updating users table schema...");

        // 1. Modify password_hash to be nullable
        await connection.query(`
            ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL
        `);
        console.log("Made password_hash nullable.");

        // 2. Add auth_provider column if not exists
        // We use a safe check by trying to select it first or just catch error
        try {
            await connection.query(`
                ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'credentials'
            `);
            console.log("Added auth_provider column.");
        } catch (e) {
            if ((e as { code?: string }).code === 'ER_DUP_FIELDNAME') {
                console.log("auth_provider column already exists.");
            } else {
                throw e;
            }
        }

        // 3. Add image column if not exists
        try {
            await connection.query(`
                ALTER TABLE users ADD COLUMN image VARCHAR(255)
            `);
            console.log("Added image column.");
        } catch (e) {
             if ((e as { code?: string }).code === 'ER_DUP_FIELDNAME') {
                console.log("image column already exists.");
            } else {
                throw e;
            }
        }

        console.log("Schema update complete.");

    } catch (err) {
        console.error("Schema update failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

updateSchema();
