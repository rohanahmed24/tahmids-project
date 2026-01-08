import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

export async function authorizeUser(credentials: Partial<Record<"email" | "password", unknown>>) {
    if (!credentials?.email || !credentials?.password) {
        return null;
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
        );

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0];

        const isValid = await bcrypt.compare(credentials.password as string, user.password_hash);

        if (!isValid) return null;

        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || null,
            role: user.role
        };
    } catch (error) {
        console.error("Auth error:", error);
        return null;
    }
}
