"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import {
    getNewsletterSubscriberCount,
    getNewsletterSubscribers,
    normalizeNewsletterEmail,
    syncLegacyNewsletterSubscribers,
} from "@/lib/newsletter";

interface SubscribeToNewsletterOptions {
    source?: string;
    locale?: string;
}

export async function subscribeToNewsletter(
    email: string,
    options: SubscribeToNewsletterOptions = {},
) {
    const session = await auth();
    const fallbackEmail = session?.user?.email?.trim() || "";
    const inputEmail = email?.trim() || fallbackEmail;

    if (!inputEmail) {
        return { success: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail)) {
        return { success: false, error: "Please enter a valid email address" };
    }

    const normalizedEmail = normalizeNewsletterEmail(inputEmail);

    try {
        await syncLegacyNewsletterSubscribers();

        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingSubscriber) {
            return { success: false, error: "This email is already subscribed" };
        }

        const source = options.source?.trim().slice(0, 80) || "site";
        const locale = options.locale?.trim().slice(0, 10) || null;

        await prisma.newsletterSubscriber.create({
            data: {
                email: normalizedEmail,
                source,
                locale,
            },
        });

        if (session?.user?.email && normalizeNewsletterEmail(session.user.email) === normalizedEmail) {
            return {
                success: true,
                message: "You are subscribed. We will use your account email for future newsletters.",
            };
        }

        return { success: true, message: "Successfully subscribed to the newsletter!" };
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return { success: false, error: "Failed to subscribe. Please try again." };
    }
}

export async function getSubscriberCount() {
    try {
        return await getNewsletterSubscriberCount();
    } catch (error) {
        console.error("Error getting subscriber count:", error);
        return 0;
    }
}

export async function getAllSubscribers() {
    try {
        const subscribers = await getNewsletterSubscribers();

        return subscribers.map((subscriber) => ({
            id: subscriber.id,
            email: subscriber.email,
            source: subscriber.source,
            locale: subscriber.locale,
            subscribedAt: subscriber.createdAt,
        }));
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return [];
    }
}
