import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function addIndexes() {
    console.log('Starting database index migration...');

    let connection;
    try {
        connection = await createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'project_1',
        });

        console.log('Connected to database.');

        // Add index on slug (if not exists)
        // Note: 'slug' might be UNIQUE already, which is an index. But we'll ensure it.
        // Usually slug is unique.

        // Add index on category
        try {
            await connection.query('CREATE INDEX idx_posts_category ON posts(category)');
            console.log('Added index on category.');
        } catch (err) {
            const e = err as { code?: string; message: string };
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('Index on category already exists.');
            } else {
                console.error('Failed to add index on category:', e.message);
            }
        }

        // Add index on published
        try {
            await connection.query('CREATE INDEX idx_posts_published ON posts(published)');
            console.log('Added index on published.');
        } catch (err) {
            const e = err as { code?: string; message: string };
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('Index on published already exists.');
            } else {
                console.error('Failed to add index on published:', e.message);
            }
        }

        // Add composite index for common query: category + published + date
        try {
            await connection.query('CREATE INDEX idx_posts_cat_pub_date ON posts(category, published, date)');
            console.log('Added composite index on (category, published, date).');
        } catch (err) {
            const e = err as { code?: string; message: string };
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('Composite index already exists.');
            } else {
                console.error('Failed to add composite index:', e.message);
            }
        }

        // Add index on featured (for filtering featured posts)
        try {
            await connection.query('CREATE INDEX idx_posts_featured ON posts(featured)');
            console.log('Added index on featured.');
        } catch (err) {
            const e = err as { code?: string; message: string };
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('Index on featured already exists.');
            } else {
                console.error('Failed to add index on featured:', e.message);
            }
        }

        console.log('Database indexing complete.');

    } catch (error) {
        console.error('Fatal error during migration:', error);
    } finally {
        if (connection) await connection.end();
    }
}

addIndexes();
