"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/actions/admin-auth";

export async function deleteUser(userId: number) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const db = getDb();
    try {
        await db.query("DELETE FROM users WHERE id = ?", [userId]);
        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw new Error("Failed to delete user");
    }
}

export async function updateUserPlan(userId: number, newPlan: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const db = getDb();
    try {
        await db.query("UPDATE users SET plan = ? WHERE id = ?", [newPlan, userId]);
        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Failed to update user plan:", error);
        throw new Error("Failed to update user plan");
    }
}

export async function updateUserRole(userId: number, newRole: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const db = getDb();
    try {
        await db.query("UPDATE users SET role = ? WHERE id = ?", [newRole, userId]);
        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Failed to update user role:", error);
        throw new Error("Failed to update user role");
    }
}
