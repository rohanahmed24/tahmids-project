"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Use environment variable for secret, fallback for dev
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "wisdomia2024";
const ADMIN_COOKIE_NAME = "admin_session";

export async function loginAdmin(password: string) {
    if (password === ADMIN_PASSWORD) {
        // Set HTTP-only cookie
        (await cookies()).set(ADMIN_COOKIE_NAME, "true", {
            httpOnly: true,
            secure: false, // process.env.NODE_ENV === "production", // Disable secure flag for localhost testing
            sameSite: "lax", // 'strict' might block if navigating from elsewhere, 'lax' is better for form posts
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });
        return { success: true };
    }

    return { error: "Invalid password" };
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
