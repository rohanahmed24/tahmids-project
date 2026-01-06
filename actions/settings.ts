"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/actions/admin-auth";

export async function updateSettings(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const siteName = formData.get("siteName") as string;
    const siteDescription = formData.get("siteDescription") as string;

    const db = getDb();
    try {
        await db.query("INSERT INTO settings (key_name, value) VALUES ('site_name', ?) ON DUPLICATE KEY UPDATE value = ?", [siteName, siteName]);
        await db.query("INSERT INTO settings (key_name, value) VALUES ('site_description', ?) ON DUPLICATE KEY UPDATE value = ?", [siteDescription, siteDescription]);

        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Failed to update settings:", error);
        throw new Error("Failed to update settings");
    }
}
