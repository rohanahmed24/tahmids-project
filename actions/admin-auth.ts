"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_EMAIL = "admin@thewisdomia.com";

export async function loginAdmin(password: string) {
    try {
        // Find admin user in database
        const adminUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL }
        });

        if (!adminUser || !adminUser.password) {
            return { error: "Admin account not found" };
        }

        // Verify password using bcrypt
        const isValid = await bcrypt.compare(password, adminUser.password);

        if (!isValid) {
            return { error: "Invalid credentials" };
        }

        // Set HTTP-only session cookie
        (await cookies()).set(ADMIN_COOKIE_NAME, JSON.stringify({
            userId: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
            name: adminUser.name
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return { success: true };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "An error occurred during login" };
    }
}

export async function logoutAdmin() {
    (await cookies()).delete(ADMIN_COOKIE_NAME);
    redirect("/admin");
}

export async function verifyAdmin(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return false;
        }

        const session = JSON.parse(sessionCookie.value);
        return session.role === 'admin';
    } catch {
        return false;
    }
}

export async function getAdminSession() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

        if (!sessionCookie?.value) {
            return null;
        }

        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}
