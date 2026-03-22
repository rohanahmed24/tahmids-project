import { prisma } from "@/lib/db";

const LEGACY_SUBSCRIBERS_KEY = "newsletter_subscribers";
const LEGACY_MIGRATION_KEY = "newsletter_subscribers_legacy_migrated";

export interface NewsletterSubscriberRecord {
    id: number;
    email: string;
    source: string | null;
    locale: string | null;
    createdAt: string;
    updatedAt: string;
}

export function normalizeNewsletterEmail(email: string) {
    return email.trim().toLowerCase();
}

function coerceLegacyEmails(rawValue: string | null | undefined) {
    if (!rawValue) return [];

    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) return [];

        return parsed
            .map((entry) => {
                if (typeof entry === "string") {
                    return normalizeNewsletterEmail(entry);
                }

                if (
                    entry &&
                    typeof entry === "object" &&
                    "email" in entry &&
                    typeof entry.email === "string"
                ) {
                    return normalizeNewsletterEmail(entry.email);
                }

                return null;
            })
            .filter((email): email is string => Boolean(email));
    } catch {
        return [];
    }
}

export async function syncLegacyNewsletterSubscribers() {
    const [legacySetting, migrationSetting] = await Promise.all([
        prisma.setting.findUnique({
            where: { keyName: LEGACY_SUBSCRIBERS_KEY },
            select: { value: true },
        }),
        prisma.setting.findUnique({
            where: { keyName: LEGACY_MIGRATION_KEY },
            select: { id: true },
        }),
    ]);

    if (!legacySetting?.value || migrationSetting?.id) {
        return;
    }

    const emails = Array.from(new Set(coerceLegacyEmails(legacySetting.value)));

    if (emails.length > 0) {
        await prisma.newsletterSubscriber.createMany({
            data: emails.map((email) => ({
                email,
                source: "legacy-import",
            })),
            skipDuplicates: true,
        });
    }

    await prisma.setting.upsert({
        where: { keyName: LEGACY_MIGRATION_KEY },
        update: { value: new Date().toISOString() },
        create: {
            keyName: LEGACY_MIGRATION_KEY,
            value: new Date().toISOString(),
        },
    });
}

export async function getNewsletterSubscribers() {
    await syncLegacyNewsletterSubscribers();

    const subscribers = await prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: "desc" },
    });

    return subscribers.map<NewsletterSubscriberRecord>((subscriber) => ({
        id: subscriber.id,
        email: subscriber.email,
        source: subscriber.source,
        locale: subscriber.locale,
        createdAt: subscriber.createdAt.toISOString(),
        updatedAt: subscriber.updatedAt.toISOString(),
    }));
}

export async function getNewsletterSubscriberCount() {
    await syncLegacyNewsletterSubscribers();
    return prisma.newsletterSubscriber.count();
}
