
import mysql, { RowDataPacket } from 'mysql2/promise';
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
                plan VARCHAR(50) DEFAULT 'Explorer',
                status VARCHAR(50) DEFAULT 'active',
                bio TEXT,
                avatar VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Table 'users' ready.");

        // Migration: Add plan column if it doesn't exist
        try {
            await connection.query("ALTER TABLE users ADD COLUMN plan VARCHAR(50) DEFAULT 'Explorer'");
            console.log("Added 'plan' column to users table.");
        } catch (e: unknown) {
            const err = e as { code?: string; message: string };
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.log("Column 'plan' already exists or other error:", err.message);
            }
        }

        // Migration: Add status column if it doesn't exist
        try {
            await connection.query("ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active'");
            console.log("Added 'status' column to users table.");
        } catch (e: unknown) {
            const err = e as { code?: string; message: string };
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.log("Column 'status' already exists or other error:", err.message);
            }
        }

        // Migration: Add bio column if it doesn't exist
        try {
            await connection.query("ALTER TABLE users ADD COLUMN bio TEXT");
            console.log("Added 'bio' column to users table.");
        } catch (e: unknown) {
            const err = e as { code?: string; message: string };
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.log("Column 'bio' already exists or other error:", err.message);
            }
        }

        // Migration: Add avatar column if it doesn't exist
        try {
            await connection.query("ALTER TABLE users ADD COLUMN avatar VARCHAR(255)");
            console.log("Added 'avatar' column to users table.");
        } catch (e: unknown) {
            const err = e as { code?: string; message: string };
            if (err.code !== 'ER_DUP_FIELDNAME') {
                console.log("Column 'avatar' already exists or other error:", err.message);
            }
        }

        // Create Posts Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255),
                date VARCHAR(255),
                author VARCHAR(255),
                category VARCHAR(255),
                content LONGTEXT,
                coverImage VARCHAR(255),
                videoUrl VARCHAR(255),
                views INT DEFAULT 0,
                featured BOOLEAN DEFAULT FALSE,
                topic_slug VARCHAR(255),
                accent_color VARCHAR(255),
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

        // Create Settings Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                key_name VARCHAR(255) NOT NULL UNIQUE,
                value TEXT
            )
        `);
        console.log("Table 'settings' ready.");

        // Seed Settings
        const defaultSettings = {
            site_name: "Wisdomia",
            site_description: "Where every tale comes alive",
            contact_email: "contact@wisdomia.com",
            maintenance_mode: "false"
        };

        for (const [key, value] of Object.entries(defaultSettings)) {
            await connection.query(
                "INSERT IGNORE INTO settings (key_name, value) VALUES (?, ?)",
                [key, value]
            );
        }
        console.log("Settings seeded.");

        // Seed Assets
        console.log("Seeding assets...");
        for (const [key, value] of Object.entries(Assets)) {
            const [rows] = await connection.query<RowDataPacket[]>("SELECT id FROM assets WHERE name = ?", [key]);
            if (rows.length === 0) {
                await connection.query("INSERT INTO assets (name, url) VALUES (?, ?)", [key, value]);
            }
        }
        console.log("Assets seeded.");

        // Seed Posts from MDX (Optional, but prioritizing seeded data from mock-data.ts logic for now to ensure consistency)
        // We will seed the specific hot topics and articles from mock-data structure manually here to ensure the site looks correct immediately.
        console.log("Seeding initial data...");

        const initialPosts = [
            {
                slug: "slow-interfaces",
                title: "The Art of Digital Silence",
                subtitle: "Exploring minimalism in the age of noise",
                category: "Technology",
                coverImage: Assets.imgPlaceholderImage7,
                accent_color: "from-purple-600/80 to-blue-600/80",
                author: "Sarah Jenkins",
                date: "Dec 24",
                featured: true,
                views: 1205
            },
            {
                slug: "digital-garden",
                title: "Building a Digital Garden",
                subtitle: "Creating spaces for thought to grow",
                category: "Philosophy",
                coverImage: Assets.imgPlaceholderImage5,
                accent_color: "from-emerald-600/80 to-teal-600/80",
                author: "John Smith",
                date: "Dec 23",
                featured: true,
                views: 980
            },
            {
                slug: "ai-ethics",
                title: "The Ethics of AI",
                subtitle: "Navigating the moral landscape of intelligence",
                category: "AI & Future",
                coverImage: Assets.imgArticleAiEthics,
                accent_color: "from-red-600/80 to-orange-600/80",
                author: "David Miller",
                date: "Dec 15",
                featured: true,
                views: 1540
            },
            {
                slug: "future-cities",
                title: "Cities of Tomorrow",
                subtitle: "Architecture reimagined for the future",
                category: "Future Tech",
                coverImage: Assets.imgArticleFutureCities,
                accent_color: "from-cyan-600/80 to-blue-600/80",
                author: "James L.",
                date: "Dec 14",
                featured: true,
                views: 890
            },
            {
                slug: "mindful-living",
                title: "Mindful Living",
                subtitle: "The psychology of presence",
                category: "Psychology",
                coverImage: Assets.imgStoryScience,
                accent_color: "from-amber-600/80 to-yellow-600/80",
                author: "Emily Rose",
                date: "Dec 13",
                featured: true,
                views: 750
            },
            // Additional Articles from mock-data 'articles' array
            { slug: "less-information", title: "Why we need less information, not more", author: "David Miller", date: "Dec 23", coverImage: Assets.imgStoryHistory, category: "Tech", subtitle: "Information overload is a real problem.", featured: false, views: 450 },
            { slug: "creative-process", title: "The Creative Process Unveiled", author: "Sarah Jenkins", date: "Dec 12", coverImage: Assets.imgStoryArt, category: "Design", subtitle: "Unlocking your inner creative.", featured: false, views: 320 },
            { slug: "remote-work", title: "The Remote Work Revolution", author: "David Miller", date: "Dec 11", coverImage: Assets.imgStoryCulture, category: "Culture", subtitle: "How work is changing.", featured: false, views: 560 },
            { slug: "modern-architecture", title: "Understanding Modern Architecture", author: "Sarah Jenkins", date: "Dec 10", coverImage: Assets.imgArticleBreakout, category: "Design", subtitle: "A look at modern structures.", featured: false, views: 290 },
            { slug: "future-work", title: "The Future of Work and Automation", author: "David Miller", date: "Dec 9", coverImage: Assets.imgStoryHistory, category: "Tech", subtitle: "Will robots take our jobs?", featured: false, views: 670 },
            { slug: "meditation", title: "Meditation and Mental Health", author: "Emily Rose", date: "Dec 8", coverImage: Assets.imgStoryScience, category: "Psychology", subtitle: "Benefits of silence.", featured: false, views: 410 },
            { slug: "sustainable-living", title: "Sustainable Living in Urban Spaces", author: "James L.", date: "Dec 7", coverImage: Assets.imgArticleFutureCities, category: "Lifestyle", subtitle: "Green living in the city.", featured: false, views: 340 }
        ];

        for (const post of initialPosts) {
            const [rows] = await connection.query<RowDataPacket[]>("SELECT id FROM posts WHERE slug = ?", [post.slug]);
            if (rows.length === 0) {
                await connection.query(
                    "INSERT INTO posts (slug, title, subtitle, date, author, category, coverImage, accent_color, featured, views, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        post.slug,
                        post.title,
                        post.subtitle || '',
                        post.date,
                        post.author,
                        post.category,
                        post.coverImage,
                        post.accent_color || null,
                        post.featured || false,
                        post.views || 0,
                        "Lorem ipsum dolor sit amet..." // Default content
                    ]
                );
                console.log(`Seeded post: ${post.slug}`);
            } else {
                // Update existing to ensure new fields are populated if they were missing or null
                await connection.query(
                    "UPDATE posts SET subtitle = ?, featured = ?, views = ?, accent_color = ?, coverImage = ? WHERE slug = ?",
                    [post.subtitle || '', post.featured || false, post.views || 0, post.accent_color || null, post.coverImage, post.slug]
                );
                console.log(`Updated post: ${post.slug}`);
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
