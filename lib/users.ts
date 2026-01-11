import { getDb } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export type User = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at?: string;
    image?: string;
    email_verified?: string | null;
    article_count?: number;
};

export async function getAllUsers(): Promise<User[]> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.image,
                u.email_verified,
                u.created_at, 
                u.updated_at,
                COALESCE((SELECT COUNT(*) FROM posts p WHERE p.author = u.name), 0) as article_count
             FROM users u 
             ORDER BY u.created_at DESC`
        );
        return rows.map(row => ({
            ...row,
            article_count: Number(row.article_count) || 0
        })) as User[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getUserById(id: number): Promise<User | null> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.image,
                u.email_verified,
                u.created_at, 
                u.updated_at,
                COALESCE((SELECT COUNT(*) FROM posts p WHERE p.author = u.name), 0) as article_count
             FROM users u 
             WHERE u.id = ?`,
            [id]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        return {
            ...user,
            article_count: Number(user.article_count) || 0
        } as User;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            `SELECT 
                u.id, 
                u.name, 
                u.email, 
                u.role, 
                u.image,
                u.email_verified,
                u.created_at, 
                u.updated_at,
                COALESCE((SELECT COUNT(*) FROM posts p WHERE p.author = u.name), 0) as article_count
             FROM users u 
             WHERE u.email = ?`,
            [email]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        return {
            ...user,
            article_count: Number(user.article_count) || 0
        } as User;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}

export async function getUserStats() {
    const db = getDb();
    try {
        // Single optimized query to get all stats
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                COUNT(*) as totalUsers,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as adminUsers,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN 1 ELSE 0 END) as recentUsers,
                SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN 1 ELSE 0 END) as activeUsers
            FROM users
        `);

        const stats = rows[0];
        return {
            totalUsers: Number(stats?.totalUsers) || 0,
            adminUsers: Number(stats?.adminUsers) || 0,
            recentUsers: Number(stats?.recentUsers) || 0,
            activeUsers: Number(stats?.activeUsers) || 0
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
            totalUsers: 0,
            adminUsers: 0,
            recentUsers: 0,
            activeUsers: 0
        };
    }
}

export async function createUser(userData: {
    name: string;
    email: string;
    password?: string;
    role?: 'user' | 'admin';
    image?: string;
}): Promise<User | null> {
    const db = getDb();
    try {
        const [result] = await db.query(
            `INSERT INTO users (name, email, password, role, image) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                userData.name,
                userData.email,
                userData.password || null,
                userData.role || 'user',
                userData.image || null
            ]
        );

        const insertId = (result as ResultSetHeader).insertId;
        return await getUserById(insertId);
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    const db = getDb();
    try {
        const setClause = Object.keys(updates)
            .filter(key => key !== 'id' && key !== 'created_at' && key !== 'article_count')
            .map(key => `${key} = ?`)
            .join(', ');

        const values = Object.entries(updates)
            .filter(([key]) => key !== 'id' && key !== 'created_at' && key !== 'article_count')
            .map(([, value]) => value);

        if (setClause) {
            await db.query(
                `UPDATE users SET ${setClause} WHERE id = ?`,
                [...values, id]
            );
        }

        return await getUserById(id);
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
}

export async function deleteUser(id: number): Promise<boolean> {
    const db = getDb();
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}
