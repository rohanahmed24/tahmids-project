"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getPublicCategorySummaries } from "@/lib/posts";
import { getCurrentLocale } from "@/lib/locale";
import { canonicalizeCategoryName, categoryToSlug } from "@/lib/categories";
import { verifyAdmin } from "./admin-auth";
import { revalidateTag } from "@/lib/cache";

const MANAGED_CATEGORIES_KEY = "managed_categories";

export type ManagedCategory = {
    name: string;
    nameBn?: string;
};

function parseManagedCategories(raw: string | null | undefined): ManagedCategory[] {
    if (!raw?.trim()) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        const seen = new Set<string>();
        const categories: ManagedCategory[] = [];

        for (const item of parsed) {
            if (!item || typeof item !== "object") continue;
            const normalizedName = canonicalizeCategoryName(String((item as { name?: unknown }).name || ""));
            if (!normalizedName) continue;

            const key = normalizedName.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);

            const rawNameBn = String((item as { nameBn?: unknown }).nameBn || "").trim();
            categories.push({
                name: normalizedName,
                nameBn: rawNameBn || undefined,
            });
        }

        return categories;
    } catch (error) {
        console.error("Failed to parse managed categories:", error);
        return [];
    }
}

async function readManagedCategories(): Promise<ManagedCategory[]> {
    const row = await prisma.setting.findUnique({
        where: { keyName: MANAGED_CATEGORIES_KEY },
        select: { value: true },
    });
    return parseManagedCategories(row?.value);
}

async function writeManagedCategories(categories: ManagedCategory[]): Promise<void> {
    await prisma.setting.upsert({
        where: { keyName: MANAGED_CATEGORIES_KEY },
        update: { value: JSON.stringify(categories) },
        create: { keyName: MANAGED_CATEGORIES_KEY, value: JSON.stringify(categories) },
    });
}

function sortManagedCategories(categories: ManagedCategory[]): ManagedCategory[] {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
}

function revalidateCategorySurfaces() {
    revalidateTag("categories");
    revalidateTag("posts");
    revalidatePath("/");
    revalidatePath("/topics");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/write");
}

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

export async function getAdminCategories() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: "Unauthorized", categories: [] as ManagedCategory[] };
    }

    try {
        const categories = await readManagedCategories();
        return { success: true, categories: sortManagedCategories(categories) };
    } catch (error) {
        console.error("Failed to fetch admin categories:", error);
        return { success: false, error: "Failed to fetch categories", categories: [] as ManagedCategory[] };
    }
}

export async function addAdminCategory(input: { name: string; nameBn?: string }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: "Unauthorized", categories: [] as ManagedCategory[] };
    }

    const normalizedName = canonicalizeCategoryName(input.name || "");
    if (!normalizedName) {
        return { success: false, error: "Category name is required", categories: [] as ManagedCategory[] };
    }

    const normalizedNameBn = input.nameBn?.trim() || undefined;

    try {
        const categories = await readManagedCategories();
        const exists = categories.some((category) => category.name.toLowerCase() === normalizedName.toLowerCase());
        if (exists) {
            return { success: false, error: "Category already exists", categories: sortManagedCategories(categories) };
        }

        categories.push({ name: normalizedName, nameBn: normalizedNameBn });
        const sorted = sortManagedCategories(categories);
        await writeManagedCategories(sorted);
        revalidateCategorySurfaces();

        return { success: true, categories: sorted };
    } catch (error) {
        console.error("Failed to add admin category:", error);
        return { success: false, error: "Failed to add category", categories: [] as ManagedCategory[] };
    }
}

export async function updateAdminCategory(input: { previousName: string; name: string; nameBn?: string }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: "Unauthorized", categories: [] as ManagedCategory[] };
    }

    const previousName = canonicalizeCategoryName(input.previousName || "");
    const nextName = canonicalizeCategoryName(input.name || "");
    if (!previousName || !nextName) {
        return { success: false, error: "Invalid category name", categories: [] as ManagedCategory[] };
    }

    const nextNameBn = input.nameBn?.trim() || undefined;

    try {
        const categories = await readManagedCategories();
        const existingIndex = categories.findIndex((category) => category.name.toLowerCase() === previousName.toLowerCase());
        if (existingIndex === -1) {
            return { success: false, error: "Category not found", categories: sortManagedCategories(categories) };
        }

        const duplicateIndex = categories.findIndex((category) => category.name.toLowerCase() === nextName.toLowerCase());
        if (duplicateIndex !== -1 && duplicateIndex !== existingIndex) {
            return { success: false, error: "Another category already uses this name", categories: sortManagedCategories(categories) };
        }

        categories[existingIndex] = { name: nextName, nameBn: nextNameBn };
        const sorted = sortManagedCategories(categories);
        await writeManagedCategories(sorted);

        await prisma.post.updateMany({
            where: {
                category: {
                    equals: previousName,
                    mode: "insensitive",
                },
            },
            data: {
                category: nextName,
                topicSlug: categoryToSlug(nextName) || null,
                ...(nextNameBn ? { categoryBn: nextNameBn } : {}),
            },
        });

        revalidateCategorySurfaces();
        return { success: true, categories: sorted };
    } catch (error) {
        console.error("Failed to update admin category:", error);
        return { success: false, error: "Failed to update category", categories: [] as ManagedCategory[] };
    }
}

export async function deleteAdminCategory(input: { name: string }) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        return { success: false, error: "Unauthorized", categories: [] as ManagedCategory[] };
    }

    const normalizedName = canonicalizeCategoryName(input.name || "");
    if (!normalizedName) {
        return { success: false, error: "Invalid category", categories: [] as ManagedCategory[] };
    }

    try {
        const categories = await readManagedCategories();
        const nextCategories = categories.filter((category) => category.name.toLowerCase() !== normalizedName.toLowerCase());

        if (nextCategories.length === categories.length) {
            return { success: false, error: "Category not found", categories: sortManagedCategories(categories) };
        }

        await writeManagedCategories(sortManagedCategories(nextCategories));

        await prisma.post.updateMany({
            where: {
                category: {
                    equals: normalizedName,
                    mode: "insensitive",
                },
            },
            data: {
                category: "Uncategorized",
                categoryBn: null,
                topicSlug: "uncategorized",
            },
        });

        revalidateCategorySurfaces();
        return { success: true, categories: sortManagedCategories(nextCategories) };
    } catch (error) {
        console.error("Failed to delete admin category:", error);
        return { success: false, error: "Failed to delete category", categories: [] as ManagedCategory[] };
    }
}
