import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'project_1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

export function getDb() {
  return pool;
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}