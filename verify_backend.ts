import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verifyBackend() {
    console.log("Starting Backend Verification...");

    // 1. Connection Test
    let connection;
    try {
        connection = await createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log("✅ Database Connection Successful");
    } catch (error) {
        console.error("❌ Database Connection Failed:", error);
        return;
    }

    try {
        // 2. Table Existence Check
        const [tables] = await connection.query('SHOW TABLES');
        const tableNames = (tables as Array<Record<string, unknown>>).map(r => Object.values(r)[0] as string);
        console.log("Found Tables:", tableNames);

        const expectedTables = ['posts', 'users', 'accounts'];
        const missingTables = expectedTables.filter(t => !tableNames.includes(t));

        if (missingTables.length > 0) {
            console.error("❌ Missing Tables:", missingTables);
        } else {
            console.log("✅ All Core Tables Present");
        }

        // 3. Schema Check: Posts Table
        if (tableNames.includes('posts')) {
            const [columns] = await connection.query('SHOW COLUMNS FROM posts');
            const colNames = (columns as Array<{ Field: string }>).map(c => c.Field);

            const expectedColumns = [
                'id', 'slug', 'title', 'subtitle', 'date', 'author', 'category',
                'content', 'excerpt', 'coverImage', 'videoUrl', 'views',
                'featured', 'published', 'topic_slug', 'accent_color',
                'created_at', 'updated_at'
            ];

            const missingCols = expectedColumns.filter(c => !colNames.includes(c));
            if (missingCols.length > 0) {
                console.error("❌ Missing Columns in 'posts':", missingCols);
            } else {
                console.log("✅ 'posts' Schema Verified (All Columns Present)");
            }
        }

        // 4. Schema Check: Accounts Table
        if (tableNames.includes('accounts')) {
            console.log("✅ 'accounts' table exists (OAuth ready)");
        }

    } catch (error) {
        console.error("❌ Verification Error:", error);
    } finally {
        await connection.end();
    }
}

verifyBackend();
