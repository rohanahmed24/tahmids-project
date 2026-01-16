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

        // Migration: Add published column
        try {
            await connection.query("ALTER TABLE posts ADD COLUMN published BOOLEAN DEFAULT TRUE");
            console.log("Added 'published' column to posts table.");
        } catch (e) {
            const err = e as { code?: string; message: string };
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.log("Column 'published' already exists or other error:", err.message);
            } else {
                console.log("Column 'published' already exists.");
            }
        }

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

migrate();
