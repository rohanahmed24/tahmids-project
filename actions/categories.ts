"use server";

import { getPublicCategorySummaries } from "@/lib/posts";
import { getCurrentLocale } from "@/lib/locale";

export async function getMenuCategories() {
    try {
        const locale = await getCurrentLocale();
        const categories = await getPublicCategorySummaries(locale);
        const links = categories.map((category) => ({
            name: category.name,
            href: `/topics/${category.slug}`,
            count: category.count,
        }));

        return { success: true, links };
    } catch (error) {
        console.error("Failed to fetch menu categories:", error);
        return { success: false, error: "Failed to fetch categories", links: [] };
    }
}
