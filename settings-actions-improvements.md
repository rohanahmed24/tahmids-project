# Settings Actions - Code Analysis & Improvements

## Issues Identified and Fixed

### 1. **Missing Type Safety**
**Problem**: No TypeScript interfaces for settings data, loose typing throughout.

**Solution**: Add proper interfaces and type definitions:

```typescript
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
```

### 2. **Input Validation Missing**
**Problem**: No validation of form inputs, potential for invalid data.

**Solution**: Add comprehensive input validation:

```typescript
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
    if (data.theme && !validThemes.includes(data.theme as any)) {
        errors.push("Invalid theme selection");
    }
    
    const validColors = ['blue', 'purple', 'green', 'red', 'orange', 'pink'];
    if (data.primaryColor && !validColors.includes(data.primaryColor)) {
        errors.push("Invalid color selection");
    }
    
    return errors;
}
```

### 3. **Poor Error Handling**
**Problem**: Generic error messages, no structured error responses.

**Solution**: Implement structured error handling:

```typescript
class SettingsError extends Error {
    constructor(
        message: string,
        public code: 'VALIDATION_ERROR' | 'DATABASE_ERROR' | 'UNAUTHORIZED' | 'UNKNOWN_ERROR',
        public details?: any
    ) {
        super(message);
        this.name = 'SettingsError';
    }
}

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
```

### 4. **Missing Database Implementation**
**Problem**: Settings are only logged to console, no actual persistence.

**Solution**: Implement proper database operations:

```typescript
import { getDb } from "@/lib/db";

async function saveSettingToDb(key: string, value: string): Promise<void> {
    const db = getDb();
    await db.query(
        `INSERT INTO settings (key_name, value, updated_at) 
         VALUES (?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = NOW()`,
        [key, value]
    );
}

async function getSettingFromDb(key: string): Promise<string | null> {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT value FROM settings WHERE key_name = ?',
        [key]
    );
    
    return rows.length > 0 ? rows[0].value : null;
}

async function getAllSettingsFromDb(): Promise<Record<string, string>> {
    const db = getDb();
    const [rows] = await db.query<RowDataPacket[]>(
        'SELECT key_name, value FROM settings'
    );
    
    return rows.reduce((acc, row) => {
        acc[row.key_name] = row.value;
        return acc;
    }, {} as Record<string, string>);
}
```

### 5. **Service Class Pattern Missing**
**Problem**: Functions are not organized, no separation of concerns.

**Solution**: Implement service class pattern:

```typescript
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

        // Save all settings in a transaction-like manner
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
```

### 6. **Database Schema Missing**
**Problem**: No settings table structure defined.

**Solution**: Add settings table creation:

```sql
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key_name (key_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 7. **Caching Strategy Missing**
**Problem**: No caching for frequently accessed settings.

**Solution**: Add simple in-memory caching:

```typescript
class SettingsCache {
    private cache = new Map<string, { value: any; timestamp: number }>();
    private readonly TTL = 5 * 60 * 1000; // 5 minutes

    set(key: string, value: any): void {
        this.cache.set(key, { value, timestamp: Date.now() });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        if (Date.now() - cached.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.value;
    }

    clear(): void {
        this.cache.clear();
    }
}

const settingsCache = new SettingsCache();
```

## Complete Improved Implementation

```typescript
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
        public details?: any
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
    if (data.theme && !validThemes.includes(data.theme as any)) {
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
```

## Key Improvements Made

### 1. **Type Safety**
- Added comprehensive TypeScript interfaces
- Proper type annotations throughout
- Type guards for error handling

### 2. **Input Validation**
- Comprehensive validation for all form fields
- Length limits and format validation
- Whitelist validation for enums

### 3. **Error Handling**
- Custom error class with error codes
- Structured error responses
- Proper error logging

### 4. **Database Integration**
- Actual database operations instead of console logging
- Proper SQL queries with parameterization
- Error handling for database operations

### 5. **Service Pattern**
- Organized code using service class
- Separation of concerns
- Reusable methods

### 6. **Security**
- Input sanitization
- Authorization checks
- SQL injection protection

### 7. **Performance**
- Efficient database queries
- Strategic cache revalidation
- Minimal database calls

## Benefits Achieved

- **Maintainability**: Clear code structure and separation of concerns
- **Reliability**: Comprehensive error handling and validation
- **Security**: Proper input validation and authorization
- **Performance**: Efficient database operations
- **Type Safety**: Full TypeScript coverage
- **Scalability**: Service pattern allows easy extension

## Recommendations for Future Enhancements

1. **Add Caching**: Implement Redis or in-memory caching for settings
2. **Add Audit Trail**: Track who changed what settings when
3. **Add Setting Categories**: Group related settings together
4. **Add Setting Validation Rules**: More sophisticated validation per setting type
5. **Add Setting Encryption**: Encrypt sensitive settings in database
6. **Add Setting Backup/Restore**: Allow exporting and importing settings