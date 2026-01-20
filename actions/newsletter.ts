"use server";

import { prisma } from "@/lib/db";

export async function subscribeToNewsletter(email: string) {
    if (!email || !email.trim()) {
        return { success: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { success: false, error: "Please enter a valid email address" };
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        // Use Settings model to store subscribers (as JSON list)
        const subscribersData = await prisma.setting.findUnique({
            where: { keyName: "newsletter_subscribers" }
        });

        let subscribers: string[] = [];
        if (subscribersData?.value) {
            try {
                subscribers = JSON.parse(subscribersData.value);
            } catch {
                subscribers = [];
            }
        }

        // Check if already subscribed
        if (subscribers.includes(normalizedEmail)) {
            return { success: false, error: "This email is already subscribed" };
        }

        // Add new subscriber
        subscribers.push(normalizedEmail);

        await prisma.setting.upsert({
            where: { keyName: "newsletter_subscribers" },
            update: { value: JSON.stringify(subscribers) },
            create: { keyName: "newsletter_subscribers", value: JSON.stringify(subscribers) }
        });

        return { success: true, message: "Successfully subscribed to the newsletter!" };
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return { success: false, error: "Failed to subscribe. Please try again." };
    }
}

export async function getSubscriberCount() {
    try {
        const subscribersData = await prisma.setting.findUnique({
            where: { keyName: "newsletter_subscribers" }
        });

        if (!subscribersData?.value) return 0;
        
        const subscribers = JSON.parse(subscribersData.value);
        return Array.isArray(subscribers) ? subscribers.length : 0;
    } catch (error) {
        console.error("Error getting subscriber count:", error);
        return 0;
    }
}

export async function getAllSubscribers() {
    try {
        const subscribersData = await prisma.setting.findUnique({
            where: { keyName: "newsletter_subscribers" }
        });

        if (!subscribersData?.value) return [];
        
        const emails = JSON.parse(subscribersData.value);
        if (!Array.isArray(emails)) return [];

        return emails.map((email: string, index: number) => ({
            id: index + 1,
            email,
            subscribedAt: new Date().toISOString()
        }));
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return [];
    }
}
