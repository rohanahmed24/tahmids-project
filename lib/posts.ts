import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export type Post = {
    slug: string;
    title: string;
    date: string;
    author: string;
    category: string;
    content: string;
    coverImage?: string;
    videoUrl?: string;
    views?: number;
};

export async function getAllPosts(): Promise<Post[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT slug, title, date, author, category, content, coverImage, videoUrl FROM posts ORDER BY date DESC"
        );
        return rows as Post[];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT slug, title, date, author, category, content, coverImage, videoUrl FROM posts WHERE slug = ?",
            [slug]
        );
        if (rows.length === 0) return null;
        return rows[0] as Post;
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}
