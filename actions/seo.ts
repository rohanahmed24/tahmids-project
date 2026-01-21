"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "./admin-auth";

export interface SEOSettings {
    googleVerificationTag: string;
    googleVerificationStatus: "verified" | "pending" | "not_verified";
    lastVerificationCheck: string | null;
}

export async function getSEOSettings(): Promise<SEOSettings> {
    try {
        const settings = await prisma.setting.findMany({
            where: {
                keyName: {
                    in: ["googleVerificationTag", "googleVerificationStatus", "lastVerificationCheck"]
                }
            }
        });

        const settingsMap = settings.reduce((acc, setting) => {
            acc[setting.keyName] = setting.value || "";
            return acc;
        }, {} as Record<string, string>);

        return {
            googleVerificationTag: settingsMap.googleVerificationTag || "",
            googleVerificationStatus: (settingsMap.googleVerificationStatus as SEOSettings["googleVerificationStatus"]) || "not_verified",
            lastVerificationCheck: settingsMap.lastVerificationCheck || null
        };
    } catch (error) {
        console.error("Failed to fetch SEO settings:", error);
        return {
            googleVerificationTag: "",
            googleVerificationStatus: "not_verified",
            lastVerificationCheck: null
        };
    }
}

export async function updateSEOSettings(data: { googleVerificationTag: string }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: "Unauthorized. Only admins can update SEO settings." };
    }

    try {
        // Validate tag format - allow empty string to remove tag
        if (data.googleVerificationTag) {
            const tagPattern = /^[a-zA-Z0-9_-]+$/;
            if (!tagPattern.test(data.googleVerificationTag)) {
                return {
                    success: false,
                    error: "Invalid verification tag format. Only letters, numbers, underscores, and hyphens are allowed."
                };
            }

            // Check for reasonable length
            if (data.googleVerificationTag.length > 100) {
                return {
                    success: false,
                    error: "Verification tag is too long. Please check the tag and try again."
                };
            }
        }

        // Update verification tag
        await prisma.setting.upsert({
            where: { keyName: "googleVerificationTag" },
            update: { value: data.googleVerificationTag },
            create: { keyName: "googleVerificationTag", value: data.googleVerificationTag }
        });

        // Set status to pending if tag is provided, not_verified if empty
        const newStatus = data.googleVerificationTag ? "pending" : "not_verified";
        await prisma.setting.upsert({
            where: { keyName: "googleVerificationStatus" },
            update: { value: newStatus },
            create: { keyName: "googleVerificationStatus", value: newStatus }
        });

        // Update last check timestamp
        await prisma.setting.upsert({
            where: { keyName: "lastVerificationCheck" },
            update: { value: new Date().toISOString() },
            create: { keyName: "lastVerificationCheck", value: new Date().toISOString() }
        });

        revalidatePath("/admin/seo");
        revalidatePath("/"); // Revalidate root for meta tag update

        return { success: true };
    } catch (error) {
        console.error("Failed to update SEO settings:", error);
        return { success: false, error: "Failed to save settings. Please try again." };
    }
}

// Function to get verification tag for metadata
export async function getGoogleVerificationTag(): Promise<string | null> {
    try {
        const setting = await prisma.setting.findUnique({
            where: { keyName: "googleVerificationTag" }
        });
        return setting?.value || null;
    } catch (error) {
        console.error("Failed to fetch Google verification tag:", error);
        return null;
    }
}
