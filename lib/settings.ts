import { prisma } from "@/lib/db";

export type SiteSettings = {
    siteName: string;
    siteDescription: string;
};

export async function getSettings(): Promise<SiteSettings> {
    try {
        const rows = await prisma.setting.findMany({
            select: { keyName: true, value: true }
        });

        const settings: Record<string, string> = {};
        rows.forEach((row) => {
            settings[row.keyName] = row.value || "";
        });

        return {
            siteName: settings.site_name || "Wisdomia",
            siteDescription: settings.site_description || "A digital sanctuary for stories that matter.",
        };
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {
            siteName: "Wisdomia",
            siteDescription: "A digital sanctuary for stories that matter.",
        };
    }
}
