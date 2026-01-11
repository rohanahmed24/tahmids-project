"use server";

import { verifyAdmin } from "@/actions/admin-auth";

export async function getRecentActivity() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // In a real implementation, you would fetch from an activity_logs table
        // For now, return mock data
        const mockLogs = [
            {
                id: 1,
                action: "User Registration",
                description: "New user john.doe@example.com registered",
                timestamp: "2024-01-12T10:30:00Z",
                type: "user",
                severity: "info"
            },
            {
                id: 2,
                action: "Article Published",
                description: "Article 'Welcome to Wisdomia' was published",
                timestamp: "2024-01-12T09:15:00Z",
                type: "content",
                severity: "success"
            },
            {
                id: 3,
                action: "Login Attempt",
                description: "Failed login attempt from IP 192.168.1.100",
                timestamp: "2024-01-12T08:45:00Z",
                type: "security",
                severity: "warning"
            },
            {
                id: 4,
                action: "Settings Updated",
                description: "Site settings were modified by admin",
                timestamp: "2024-01-11T16:20:00Z",
                type: "system",
                severity: "info"
            },
            {
                id: 5,
                action: "Media Upload",
                description: "New image uploaded: welcome-banner.jpg",
                timestamp: "2024-01-11T14:10:00Z",
                type: "media",
                severity: "info"
            }
        ];

        return { success: true, logs: mockLogs };
    } catch (error) {
        console.error("Failed to get recent activity:", error);
        return { success: false, error: "Failed to get recent activity", logs: [] };
    }
}

export async function logActivity(action: string, description: string, type: string = "system", severity: string = "info") {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // In a real implementation, you would insert into activity_logs table
        console.log("Activity logged:", {
            action,
            description,
            type,
            severity,
            timestamp: new Date().toISOString()
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to log activity:", error);
        return { success: false, error: "Failed to log activity" };
    }
}