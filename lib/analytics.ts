import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export interface MonthlyGrowth {
    month: string;
    users: number;
    [key: string]: string | number | undefined;
}

export interface TopArticle {
    title: string;
    views: number;
}

export async function getUserGrowthOverTime(): Promise<MonthlyGrowth[]> {
    const db = getDb();
    try {
        // Group users by Month-Year (e.g., "Jan 2024")
        // MySQL format: %b %Y
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT 
                DATE_FORMAT(created_at, '%b %Y') as month,
                COUNT(*) as users
             FROM users
             GROUP BY DATE_FORMAT(created_at, '%Y-%m'), month
             ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC
             LIMIT 6`
        );
        return rows as MonthlyGrowth[];
    } catch (error) {
        console.error("Error fetching user growth:", error);
        return [];
    }
}

export async function getTopArticles(limit: number = 5): Promise<TopArticle[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT title, views 
             FROM posts 
             ORDER BY views DESC 
             LIMIT ?`,
            [limit]
        );
        return rows as TopArticle[];
    } catch (error) {
        console.error("Error fetching top articles:", error);
        return [];
    }
}
