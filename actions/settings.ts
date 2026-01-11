"use server";

import { verifyAdmin } from "@/actions/admin-auth";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // Extract settings from form data
        const siteName = formData.get("siteName") as string;
        const siteTagline = formData.get("siteTagline") as string;
        const siteDescription = formData.get("siteDescription") as string;
        const defaultLanguage = formData.get("defaultLanguage") as string;
        const timezone = formData.get("timezone") as string;
        const theme = formData.get("theme") as string;
        const primaryColor = formData.get("primaryColor") as string;

        // In a real implementation, you would save these to a settings table
        // For now, we'll just simulate success
        console.log("Settings updated:", {
            siteName,
            siteTagline,
            siteDescription,
            defaultLanguage,
            timezone,
            theme,
            primaryColor
        });

        revalidatePath("/admin/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update settings:", error);
        throw new Error("Failed to update settings");
    }
}

export async function getSettings() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // In a real implementation, you would fetch from a settings table
        // For now, return default settings
        return {
            success: true,
            settings: {
                siteName: "Wisdomia",
                siteTagline: "Your Digital Magazine",
                siteDescription: "A platform dedicated to storytelling and editorial content across politics, mystery, crime, history, news, and science.",
                defaultLanguage: "en",
                timezone: "UTC",
                theme: "dark",
                primaryColor: "blue"
            }
        };
    } catch (error) {
        console.error("Failed to get settings:", error);
        return { success: false, error: "Failed to get settings" };
    }
}