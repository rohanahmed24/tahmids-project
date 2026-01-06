import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Assuming no password for local dev sandbox standard, or 'password'
  database: 'project_1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export function getDb() {
  return pool;
}
