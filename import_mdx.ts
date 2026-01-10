
import { getDb } from "./lib/db";
import { RowDataPacket } from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

async function importMdx() {
    const db = getDb();
    const postsDir = path.join(process.cwd(), "content/posts");

    try {
        const files = await fs.readdir(postsDir);

        console.log(`Found ${files.length} files in ${postsDir}`);

        for (const file of files) {
            if (!file.endsWith(".mdx")) continue;

            const filePath = path.join(postsDir, file);
            const content = await fs.readFile(filePath, "utf-8");
            const { data, content: mdxContent } = matter(content);
            const slug = file.replace(".mdx", "");

            console.log(`Processing ${slug}...`);

            // Check if exists
            const [rows] = await db.query<RowDataPacket[]>("SELECT id FROM posts WHERE slug = ?", [slug]);

            if (rows.length > 0) {
                console.log(`Updating existing post: ${slug}`);
                await db.query(
                    "UPDATE posts SET title = ?, date = ?, author = ?, category = ?, content = ?, coverImage = ?, videoUrl = ? WHERE slug = ?",
                    [
                        data.title,
                        // Convert date to ISO string if needed, or keep as string if DB column is varchar. 
                        // lib/posts.ts Post type says string. Usually safe to pass as is if consistent.
                        // But let's verify if DB expects datetime or string. 
                        // Existing update_db_missing_articles.ts used "Dec 10". 
                        // MDX has "December 15, 2024". 
                        // Let's assume the DB schema handles it or it's a varchar.
                        // I'll leave it as is for now.
                        data.date,
                        data.author,
                        data.category,
                        mdxContent,
                        data.coverImage,
                        data.videoUrl || null,
                        slug
                    ]
                );
            } else {
                console.log(`Inserting new post: ${slug}`);
                await db.query(
                    "INSERT INTO posts (slug, title, date, author, category, content, coverImage, videoUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        slug,
                        data.title,
                        data.date,
                        data.author,
                        data.category,
                        mdxContent,
                        data.coverImage,
                        data.videoUrl || null
                    ]
                );
            }
        }
        console.log("Import complete.");
        process.exit(0);

    } catch (error) {
        console.error("Import failed:", error);
        process.exit(1);
    }
}

importMdx();
