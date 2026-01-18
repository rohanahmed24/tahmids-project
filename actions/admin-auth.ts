"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Use environment variable for secret, as backup
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "wisdomia2024";
const ADMIN_COOKIE_NAME = "admin_session";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function loginAdmin(password: string) {
    // 1. Check strict Admin User in DB
    const adminUser = await prisma.user.findFirst({
        where: { role: 'admin' }
    });

    let isValid = false;

    if (adminUser && adminUser.password) {
        // Verify against DB hash
        isValid = await bcrypt.compare(password, adminUser.password);
    } else {
        // Fallback for initial setup if no DB user or no hash (legacy support)
        // This ensures you don't get locked out before seeding
        isValid = password === DEFAULT_ADMIN_PASS;
    }

    if (isValid) {
        // Set HTTP-only cookie
        (await cookies()).set(ADMIN_COOKIE_NAME, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });
        return { success: true };
    }

    return { error: "Invalid credentials" };
}

export async function logoutAdmin() {
    (await cookies()).delete(ADMIN_COOKIE_NAME);
    redirect("/admin");
}

export async function verifyAdmin() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get(ADMIN_COOKIE_NAME)?.value === "true";
    return isAdmin;
}
