import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export type SiteSettings = {
    siteName: string;
    siteDescription: string;
};

export async function getSettings(): Promise<SiteSettings> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT key_name, value FROM settings");
        const settings: any = {};
        rows.forEach((row: any) => {
            settings[row.key_name] = row.value;
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
