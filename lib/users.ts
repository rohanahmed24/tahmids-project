import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    plan?: string;
};

export async function getAllUsers(): Promise<User[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT id, name, email, role, created_at, plan FROM users ORDER BY created_at DESC"
        );
        return rows as User[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getUserStats() {
    const db = getDb();
    try {
        const [userRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM users");
        const [postRows] = await db.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM posts");

        let totalViews = 0;
        try {
             const [viewRows] = await db.query<RowDataPacket[]>("SELECT SUM(views) as total FROM posts");
             totalViews = viewRows[0].total || 0;
        } catch (e) {
            // views column might not exist yet
            console.warn("Could not fetch views sum, defaulting to 0");
        }

        return {
            totalUsers: userRows[0].count,
            totalArticles: postRows[0].count,
            totalViews: totalViews
        };
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { totalUsers: 0, totalArticles: 0, totalViews: 0 };
    }
}
