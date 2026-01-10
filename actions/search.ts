"use server";

import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { Post } from "@/lib/posts";

export async function searchPosts(query: string): Promise<Post[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const searchTerm = `%${query.trim()}%`;
    const db = getDb();

    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT * FROM posts 
             WHERE title LIKE ? 
             OR content LIKE ? 
             OR subtitle LIKE ? 
             OR category LIKE ? 
             ORDER BY date DESC`,
            [searchTerm, searchTerm, searchTerm, searchTerm]
        );
        return rows as Post[];
    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
