"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "./admin-auth";

export async function updateSettings(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const settings = Array.from(formData.entries());

        for (const [key, value] of settings) {
            // Skip Next.js internal fields if any
            if (key.startsWith('$')) continue;

            await prisma.setting.upsert({
                where: { keyName: key },
                update: { value: value as string },
                create: { keyName: key, value: value as string }
            });
        }

        revalidatePath("/admin/settings");
        return { success: true, message: "Settings updated successfully" };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, message: "Failed to update settings" };
    }
}

export async function getSettings() {
    try {
        const settings = await prisma.setting.findMany();
        return settings.reduce((acc, setting) => {
            acc[setting.keyName] = setting.value || "";
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return {};
    }
}