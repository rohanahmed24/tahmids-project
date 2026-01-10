
import mysql from 'mysql2/promise';

const poolConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project_1'
};

async function check() {
    console.log("Checking database schema...");
    const connection = await mysql.createConnection(poolConfig);
    try {
        const [rows] = await connection.query("DESCRIBE users");
        console.table(rows);
    } catch (e) {
        console.error("Error describing table:", e);
    } finally {
        await connection.end();
    }
}

check();
