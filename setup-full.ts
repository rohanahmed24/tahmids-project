
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Assets } from './lib/assets';

// Connect without database first
const poolConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const postsDirectory = path.join(process.cwd(), 'content/posts');

async function setup() {
    let connection;
    try {
        console.log("Connecting to MariaDB...");
        const pool = mysql.createPool(poolConfig);
        connection = await pool.getConnection();

        // Create Database
        await connection.query("CREATE DATABASE IF NOT EXISTS project_1");
        console.log("Database 'project_1' created or exists.");

        await connection.query("USE project_1");

        // Create Users Table (if missing)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'users' ready.");

        // Create Posts Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                date VARCHAR(255),
                author VARCHAR(255),
                category VARCHAR(255),
                content LONGTEXT,
                coverImage VARCHAR(255),
                videoUrl VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'posts' ready.");

        // Create Assets Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS assets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                url VARCHAR(255) NOT NULL,
                type VARCHAR(50) DEFAULT 'image'
            )
        `);
        console.log("Table 'assets' ready.");

        // Seed Assets
        console.log("Seeding assets...");
        for (const [key, value] of Object.entries(Assets)) {
            const [rows] = await connection.query<any[]>("SELECT id FROM assets WHERE name = ?", [key]);
            if (rows.length === 0) {
                await connection.query("INSERT INTO assets (name, url) VALUES (?, ?)", [key, value]);
            }
        }
        console.log("Assets seeded.");

        // Seed Posts from MDX
        console.log("Seeding posts from MDX...");
        if (fs.existsSync(postsDirectory)) {
            const fileNames = fs.readdirSync(postsDirectory);
            for (const fileName of fileNames) {
                if (!fileName.endsWith('.mdx')) continue;

                const slug = fileName.replace(/\.mdx$/, '');
                const fullPath = path.join(postsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const { data, content } = matter(fileContents);

                const [rows] = await connection.query<any[]>("SELECT id FROM posts WHERE slug = ?", [slug]);
                if (rows.length === 0) {
                    await connection.query(
                        "INSERT INTO posts (slug, title, date, author, category, content, coverImage, videoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        [
                            slug,
                            data.title || 'Untitled',
                            data.date || '',
                            data.author || 'Unknown',
                            data.category || 'General',
                            content,
                            data.coverImage || '',
                            data.videoUrl || ''
                        ]
                    );
                    console.log(`Seeded post: ${slug}`);
                }
            }
        }
        console.log("Setup complete.");

    } catch (err) {
        console.error("Setup failed:", err);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

setup();
