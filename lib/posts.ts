import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export type Post = {
    slug: string;
    title: string;
    subtitle?: string;
    date: string;
    author: string;
    category: string;
    content: string;
    coverImage?: string;
    videoUrl?: string;
    views?: number;
    featured?: boolean;
    topic_slug?: string;
    accent_color?: string;
};

export async function getAllPosts(): Promise<Post[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM posts ORDER BY date DESC"
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
            "SELECT * FROM posts WHERE slug = ?",
            [slug]
        );
        if (rows.length === 0) return null;
        return rows[0] as Post;
    } catch (error) {
        console.error("Error fetching post by slug:", error);
        return null;
    }
}

export async function getHotTopics(): Promise<Post[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM posts WHERE featured = 1 LIMIT 5"
        );
        return rows as Post[];
    } catch (error) {
        console.error("Error fetching hot topics:", error);
        return [];
    }
}

export async function getRecentPosts(limit: number = 10): Promise<Post[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM posts ORDER BY created_at DESC LIMIT ?",
            [limit]
        );
        return rows as Post[];
    } catch (error) {
        console.error("Error fetching recent posts:", error);
        return [];
    }
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM posts WHERE category = ? ORDER BY date DESC LIMIT 6",
            [category]
        );
        return rows as Post[];
    } catch (error) {
        console.error("Error fetching posts by category:", error);
        return [];
    }
}
