"use server";

import { verifyAdmin } from "@/actions/admin-auth";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Types
interface SettingsFormData {
    siteName: string;
    siteTagline: string;
    siteDescription: string;
    defaultLanguage: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
}

interface SettingsResponse {
    success: boolean;
    settings?: SettingsFormData;
    error?: string;
}

interface UpdateSettingsResponse {
    success: boolean;
    error?: string;
}

// Custom Error Class
class SettingsError extends Error {
    constructor(
        message: string,
        public code: 'VALIDATION_ERROR' | 'DATABASE_ERROR' | 'UNAUTHORIZED' | 'UNKNOWN_ERROR',
        public details?: unknown
    ) {
        super(message);
        this.name = 'SettingsError';
    }
}

// Validation
function validateSettingsData(data: Partial<SettingsFormData>): string[] {
    const errors: string[] = [];

    if (!data.siteName?.trim()) {
        errors.push("Site name is required");
    } else if (data.siteName.trim().length < 2) {
        errors.push("Site name must be at least 2 characters");
    } else if (data.siteName.trim().length > 100) {
        errors.push("Site name must be less than 100 characters");
    }

    if (!data.siteTagline?.trim()) {
        errors.push("Site tagline is required");
    } else if (data.siteTagline.trim().length > 200) {
        errors.push("Site tagline must be less than 200 characters");
    }

    if (!data.siteDescription?.trim()) {
        errors.push("Site description is required");
    } else if (data.siteDescription.trim().length > 500) {
        errors.push("Site description must be less than 500 characters");
    }

    const validLanguages = ['en', 'bn'];
    if (data.defaultLanguage && !validLanguages.includes(data.defaultLanguage)) {
        errors.push("Invalid language selection");
    }

    const validThemes = ['light', 'dark', 'auto'];
    if (data.theme && !validThemes.includes(data.theme)) {
        errors.push("Invalid theme selection");
    }

    const validColors = ['blue', 'purple', 'green', 'red', 'orange', 'pink'];
    if (data.primaryColor && !validColors.includes(data.primaryColor)) {
        errors.push("Invalid color selection");
    }

    return errors;
}

// Database Operations
async function saveSettingToDb(key: string, value: string): Promise<void> {
    const db = getDb();
    await db.query(
        `INSERT INTO settings (key_name, value, updated_at) 
         VALUES (?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
        [key, value]
    );
}

async function getAllSettingsFromDb(): Promise<Record<string, string>> {
    const db = getDb();
    try {
        const [rows] = await db.query<RowDataPacket[]>(
            'SELECT key_name, value FROM settings'
        );

        return rows.reduce((acc, row) => {
            acc[row.key_name] = row.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error("Failed to fetch settings from database:", error);
        return {};
    }
}

// Error Handler
function handleSettingsError(error: unknown): never {
    if (error instanceof SettingsError) {
        throw error;
    }

    if (error instanceof Error) {
        console.error("Settings operation failed:", {
            message: error.message,
            stack: error.stack
        });

        if (error.message.includes('Duplicate entry')) {
            throw new SettingsError("Setting already exists", 'DATABASE_ERROR');
        }

        throw new SettingsError(error.message, 'DATABASE_ERROR');
    }

    console.error("Unknown settings error:", error);
    throw new SettingsError("An unexpected error occurred", 'UNKNOWN_ERROR');
}

// Service Class
export class SettingsService {
    private async validateAuthentication(): Promise<void> {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            throw new SettingsError("Unauthorized access", 'UNAUTHORIZED');
        }
    }

    private extractFormData(formData: FormData): SettingsFormData {
        return {
            siteName: (formData.get("siteName") as string)?.trim() || "",
            siteTagline: (formData.get("siteTagline") as string)?.trim() || "",
            siteDescription: (formData.get("siteDescription") as string)?.trim() || "",
            defaultLanguage: (formData.get("defaultLanguage") as string)?.trim() || "en",
            timezone: (formData.get("timezone") as string)?.trim() || "UTC",
            theme: (formData.get("theme") as string)?.trim() as 'light' | 'dark' | 'auto' || "dark",
            primaryColor: (formData.get("primaryColor") as string)?.trim() || "blue"
        };
    }

    private async saveSettings(settings: SettingsFormData): Promise<void> {
        const settingsMap = {
            'site_name': settings.siteName,
            'site_tagline': settings.siteTagline,
            'site_description': settings.siteDescription,
            'default_language': settings.defaultLanguage,
            'timezone': settings.timezone,
            'theme': settings.theme,
            'primary_color': settings.primaryColor
        };

        // Save all settings
        for (const [key, value] of Object.entries(settingsMap)) {
            await saveSettingToDb(key, value);
        }
    }

    async updateSettings(formData: FormData): Promise<UpdateSettingsResponse> {
        try {
            await this.validateAuthentication();

            const settings = this.extractFormData(formData);
            const validationErrors = validateSettingsData(settings);

            if (validationErrors.length > 0) {
                throw new SettingsError(
                    `Validation failed: ${validationErrors.join(", ")}`,
                    'VALIDATION_ERROR',
                    { errors: validationErrors }
                );
            }

            await this.saveSettings(settings);

            revalidatePath("/admin/settings");
            revalidatePath("/admin/dashboard");

            return { success: true };
        } catch (error) {
            handleSettingsError(error);
        }
    }

    async getSettings(): Promise<SettingsResponse> {
        try {
            await this.validateAuthentication();

            const dbSettings = await getAllSettingsFromDb();

            const settings: SettingsFormData = {
                siteName: dbSettings.site_name || "Wisdomia",
                siteTagline: dbSettings.site_tagline || "Your Digital Magazine",
                siteDescription: dbSettings.site_description || "A platform dedicated to storytelling and editorial content across politics, mystery, crime, history, news, and science.",
                defaultLanguage: dbSettings.default_language || "en",
                timezone: dbSettings.timezone || "UTC",
                theme: (dbSettings.theme as 'light' | 'dark' | 'auto') || "dark",
                primaryColor: dbSettings.primary_color || "blue"
            };

            return { success: true, settings };
        } catch (error) {
            console.error("Failed to get settings:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to get settings"
            };
        }
    }
}

// Export functions for backward compatibility
const settingsService = new SettingsService();

export async function updateSettings(formData: FormData): Promise<UpdateSettingsResponse> {
    return settingsService.updateSettings(formData);
}

export async function getSettings(): Promise<SettingsResponse> {
    return settingsService.getSettings();
}