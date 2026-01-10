"use server";

import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { auth } from "@/auth";

export async function logActivity(action: string, details: string) {
    const session = await auth();
    if (!session?.user?.id) return; // Only log authenticated actvity

    const db = getDb();
    await db.query(
        "INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)",
        [session.user.id, action, details]
    );
}

export async function getRecentActivity(limit: number = 5) {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>(`
        SELECT l.*, u.name as user_name, u.avatar as user_avatar 
        FROM activity_logs l
        JOIN users u ON l.user_id = u.id
        ORDER BY l.created_at DESC
        LIMIT ?
    `, [limit]);

    return rows;
}
