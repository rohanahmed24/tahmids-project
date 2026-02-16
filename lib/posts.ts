import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Post as PrismaPost } from "@prisma/client";
import {
    canonicalizeCategoryName,
    categoryToSlug,
    normalizeCategoryName,
} from "@/lib/categories";
import type { Locale } from "@/lib/locale";

// Re-exporting the type compatible with the frontend
export type Post = {
    id: number;
    slug: string;
    title: string;
    titleBn?: string | null;
    subtitle?: string | null;
    subtitleBn?: string | null;
    date: string;
    author: string;
    authorName?: string | null;
    authorNameBn?: string | null;
    translatorName?: string | null;
    translatorNameBn?: string | null;
    editorName?: string | null;
    editorNameBn?: string | null;
    authorId?: number | null;
    category: string;
    categoryEn: string;
    categoryBn?: string | null;
    content?: string | null;
    contentBn?: string | null;
    excerpt?: string | null;
    excerptBn?: string | null;
    coverImage?: string | null;
    videoUrl?: string | null;
    audioUrl?: string | null;
    views: number;
    featured: boolean;
    published: boolean;
    topic_slug?: string | null;
    accent_color?: string | null;
    created_at: string;
    updated_at: string;
    authorImage?: string | null;
    metaDescription?: string | null;
    metaDescriptionBn?: string | null;
    backlinks?: string[] | null;
};

export type CategorySummary = {
    name: string;
    canonicalName: string;
    slug: string;
    count: number;
};

// Helper function to format date nicely (date only, no time)
function formatDate(dateInput: Date | string | null, locale: Locale = "en"): string {
    const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
    if (!dateInput) return new Date().toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' });
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' });
}

function normalizeImageUrl(url?: string | null): string | null | undefined {
    if (!url) return url;
    const trimmed = url.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;

    // Keep upload paths local so newly uploaded local files resolve correctly.
    // Missing local files are already handled by /api/uploads fallback logic.
    if (trimmed.startsWith("/imgs/uploads/")) {
        return trimmed;
    }
    if (trimmed.startsWith("/")) {
        return trimmed;
    }

    if (trimmed.startsWith("https://ui-avatars.com/") || trimmed.startsWith("http://ui-avatars.com/")) {
        try {
            const parsed = new URL(trimmed);
            if (!parsed.searchParams.get("format")) {
                parsed.searchParams.set("format", "png");
            }
            return parsed.toString();
        } catch {
            return null;
        }
    }

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        try {
            const parsed = new URL(trimmed);

            // Fix bad local absolute URLs saved from dev (e.g., http://localhost:3000/imgs/uploads/...)
            if (
                (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") &&
                parsed.pathname.startsWith("/")
            ) {
                return parsed.pathname;
            }

            return parsed.toString();
        } catch {
            return null;
        }
    }

    return null;
}

// Mapper function to convert Prisma result to frontend Post type
function mapPrismaPost(
    post: PrismaPost & { author?: { image: string | null } | null },
    locale: Locale = "en"
): Post {
    // Properly handle backlinks JSON field - handle both array and string formats
    let backlinks: string[] | null = null;
    if (post.backlinks !== null && post.backlinks !== undefined) {
        if (Array.isArray(post.backlinks)) {
            // Already an array - ensure all elements are strings
            backlinks = post.backlinks.map(item => String(item));
        } else if (typeof post.backlinks === 'string') {
            // String containing JSON - parse it
            try {
                const parsed = JSON.parse(post.backlinks);
                if (Array.isArray(parsed)) {
                    backlinks = parsed.map(item => String(item));
                }
            } catch (e) {
                console.error('Failed to parse backlinks JSON:', post.backlinks, e);
                backlinks = null;
            }
        }
    }

    const normalizedCategory = canonicalizeCategoryName(post.category || "") || "Uncategorized";
    const localizedCategory =
        locale === "bn"
            ? (post.categoryBn?.trim() || normalizedCategory)
            : normalizedCategory;

    const localizedTitle =
        locale === "bn" ? (post.titleBn || post.title) : post.title;
    const localizedSubtitle =
        locale === "bn" ? (post.subtitleBn || post.subtitle) : post.subtitle;
    const localizedAuthorName =
        locale === "bn" ? (post.authorNameBn || post.authorName) : post.authorName;
    const localizedTranslatorName =
        locale === "bn" ? (post.translatorNameBn || post.translatorName) : post.translatorName;
    const localizedEditorName =
        locale === "bn" ? (post.editorNameBn || post.editorName) : post.editorName;
    const localizedContent =
        locale === "bn" ? (post.contentBn || post.content) : post.content;
    const localizedExcerpt =
        locale === "bn" ? (post.excerptBn || post.excerpt) : post.excerpt;
    const localizedMetaDescription =
        locale === "bn"
            ? (post.metaDescriptionBn || post.metaDescription)
            : post.metaDescription;

    return {
        id: post.id,
        slug: post.slug,
        title: localizedTitle,
        titleBn: post.titleBn,
        subtitle: localizedSubtitle,
        subtitleBn: post.subtitleBn,
        date: formatDate(post.date, locale),
        author: localizedAuthorName || "Anonymous",
        authorName: localizedAuthorName,
        authorNameBn: post.authorNameBn,
        translatorName: localizedTranslatorName,
        translatorNameBn: post.translatorNameBn,
        editorName: localizedEditorName,
        editorNameBn: post.editorNameBn,
        authorId: post.authorId,
        category: localizedCategory,
        categoryEn: normalizedCategory,
        categoryBn: post.categoryBn,
        content: localizedContent,
        contentBn: post.contentBn,
        excerpt: localizedExcerpt,
        excerptBn: post.excerptBn,
        coverImage: normalizeImageUrl(post.coverImage),
        videoUrl: post.videoUrl,
        audioUrl: post.audioUrl,
        views: post.views || 0,
        featured: post.featured || false,
        published: post.published || false,
        topic_slug: post.topicSlug || (normalizedCategory !== "Uncategorized" ? categoryToSlug(normalizedCategory) : null),
        accent_color: post.accentColor,
        created_at: post.createdAt.toISOString(),
        updated_at: post.updatedAt.toISOString(),
        authorImage: normalizeImageUrl(post.author?.image || undefined),
        backlinks: backlinks,
        metaDescription: localizedMetaDescription,
        metaDescriptionBn: post.metaDescriptionBn
    };
}

type CategoryGroupRow = {
    category: string | null;
    _count: { _all: number };
};

type ManagedCategory = {
    name: string;
    nameBn?: string;
};

function parseManagedCategories(raw: string | null | undefined): ManagedCategory[] {
    if (!raw?.trim()) return [];

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        const uniqueBySlug = new Map<string, ManagedCategory>();
        for (const item of parsed) {
            if (!item || typeof item !== "object") continue;

            const name = canonicalizeCategoryName(String((item as { name?: unknown }).name || ""));
            if (!name) continue;

            const slug = categoryToSlug(name);
            if (!slug || uniqueBySlug.has(slug)) continue;

            const nameBn = String((item as { nameBn?: unknown }).nameBn || "").trim() || undefined;
            uniqueBySlug.set(slug, { name, nameBn });
        }

        return [...uniqueBySlug.values()];
    } catch (error) {
        console.warn("Failed to parse managed_categories setting:", error);
        return [];
    }
}

async function readManagedCategories(): Promise<ManagedCategory[]> {
    const row = await prisma.setting.findUnique({
        where: { keyName: "managed_categories" },
        select: { value: true },
    });

    return parseManagedCategories(row?.value);
}

function buildCategorySummaries(
    rows: CategoryGroupRow[],
    managedCategories: ManagedCategory[],
    locale: Locale,
    localizedNamesBySlug: Map<string, string>
): CategorySummary[] {
    const summariesBySlug = new Map<string, CategorySummary>();

    for (const category of managedCategories) {
        const slug = categoryToSlug(category.name);
        if (!slug || summariesBySlug.has(slug)) continue;

        summariesBySlug.set(slug, {
            name: locale === "bn" ? (category.nameBn || category.name) : category.name,
            canonicalName: category.name,
            slug,
            count: 0,
        });
    }

    for (const row of rows) {
        const rawCategory = row.category ? normalizeCategoryName(row.category) : "";
        if (!rawCategory) continue;

        const slug = categoryToSlug(rawCategory);
        if (!slug) continue;

        const canonicalName = canonicalizeCategoryName(rawCategory);
        const existing = summariesBySlug.get(slug);
        const localizedName = locale === "bn"
            ? (localizedNamesBySlug.get(slug) || existing?.name || canonicalName)
            : (existing?.canonicalName || canonicalName);

        if (existing) {
            existing.count += row._count._all;
            existing.name = localizedName;
            existing.canonicalName = canonicalName;
            continue;
        }

        summariesBySlug.set(slug, {
            name: localizedName,
            canonicalName,
            slug,
            count: row._count._all,
        });
    }

    return [...summariesBySlug.values()]
        .sort((a, b) => {
            if (a.count === 0 && b.count > 0) return 1;
            if (b.count === 0 && a.count > 0) return -1;
            return a.name.localeCompare(b.name);
        });
}

export async function getPublicCategorySummaries(locale: Locale = "en"): Promise<CategorySummary[]> {
    return unstable_cache(
        async (): Promise<CategorySummary[]> => {
            try {
                const grouped = await prisma.post.groupBy({
                    by: ["category"],
                    where: {
                        published: true,
                        category: { not: null },
                    },
                    _count: { _all: true },
                });

                const managedCategories = await readManagedCategories();
                const localizedNamesBySlug = new Map<string, string>();
                if (locale === "bn") {
                    for (const category of managedCategories) {
                        if (!category.nameBn) continue;
                        const slug = categoryToSlug(category.name);
                        if (!slug || localizedNamesBySlug.has(slug)) continue;
                        localizedNamesBySlug.set(slug, category.nameBn);
                    }

                    const localizedRows = await prisma.post.findMany({
                        where: {
                            published: true,
                            category: { not: null },
                            categoryBn: { not: null },
                        },
                        select: { category: true, categoryBn: true },
                        orderBy: { createdAt: "desc" },
                    });

                    for (const row of localizedRows) {
                        if (!row.category || !row.categoryBn) continue;
                        const slug = categoryToSlug(row.category);
                        if (!slug || localizedNamesBySlug.has(slug)) continue;
                        localizedNamesBySlug.set(slug, row.categoryBn);
                    }
                }

                return buildCategorySummaries(
                    grouped as CategoryGroupRow[],
                    managedCategories,
                    locale,
                    localizedNamesBySlug
                );
            } catch {
                console.warn("Failed to fetch public categories.");
                return [];
            }
        },
        ["public-category-summaries", locale],
        { revalidate: 300, tags: ["posts", "categories"] }
    )();
}

export const getCategoryOptions = unstable_cache(
    async (): Promise<string[]> => {
        try {
            const grouped = await prisma.post.groupBy({
                by: ["category"],
                where: {
                    category: { not: null },
                },
                _count: { _all: true },
            });

            const managedCategories = await readManagedCategories();
            const uniqueBySlug = new Map<string, string>();

            for (const category of managedCategories) {
                const slug = categoryToSlug(category.name);
                if (!slug || uniqueBySlug.has(slug)) continue;
                uniqueBySlug.set(slug, category.name);
            }

            for (const row of grouped as CategoryGroupRow[]) {
                const canonicalName = canonicalizeCategoryName(row.category || "");
                if (!canonicalName) continue;
                const slug = categoryToSlug(canonicalName);
                if (!slug || uniqueBySlug.has(slug)) continue;
                uniqueBySlug.set(slug, canonicalName);
            }

            return [...uniqueBySlug.values()];
        } catch {
            console.warn("Failed to fetch category options.");
            return [];
        }
    },
    ["category-options"],
    { revalidate: 300, tags: ["posts", "categories"] }
);

// Fallback demo data


// --- Cached Functions ---

export async function getHotTopics(limit: number = 5, locale: Locale = "en"): Promise<Post[]> {
    return unstable_cache(
        async (): Promise<Post[]> => {
            try {
                const posts = await prisma.post.findMany({
                    where: { featured: true, published: true },
                    include: { author: { select: { image: true } } },
                    orderBy: { views: 'desc' },
                    take: limit
                });
                return posts.map((post) => mapPrismaPost(post, locale));
            } catch (error) {
                console.error("Failed to fetch hot topics:", error);
                return [];
            }
        },
        ['hot-topics', locale, String(limit)],
        { revalidate: 60, tags: ['posts', 'hot-topics'] }
    )();
}

export async function getRecentPosts(limit: number = 10, locale: Locale = "en"): Promise<Post[]> {
    return unstable_cache(
        async (): Promise<Post[]> => {
            try {
                const posts = await prisma.post.findMany({
                    where: { published: true },
                    include: { author: { select: { image: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: limit
                });
                return posts.map((post) => mapPrismaPost(post, locale));
            } catch (error) {
                console.error("Failed to fetch recent posts:", error);
                return [];
            }
        },
        ['recent-posts', locale, String(limit)],
        { revalidate: 300, tags: ['posts', 'recent'] }
    )();
}

export async function getPostBySlug(
    slug: string,
    locale: Locale = "en",
    includeUnpublished: boolean = false
): Promise<Post | null> {
    if (!slug?.trim()) return null;

    return unstable_cache(
        async (): Promise<Post | null> => {
            try {
                const post = await prisma.post.findUnique({
                    where: { slug },
                    include: { author: { select: { image: true } } }
                });

                if (!post || (!includeUnpublished && !post.published)) return null;

                // Increment views asynchronously
                if (!includeUnpublished && post.published) {
                    incrementViewCount(slug).catch(console.error);
                }

                return mapPrismaPost(post, locale);
            } catch (error) {
                console.error("Failed to fetch post by slug:", error);
                return null;
            }
        },
        ['post-by-slug', slug, locale, String(includeUnpublished)],
        { revalidate: 300, tags: ['posts'] }
    )();
}

async function incrementViewCount(slug: string): Promise<void> {
    try {
        await prisma.post.update({
            where: { slug },
            data: { views: { increment: 1 } }
        });
    } catch {
        // limit logging
    }
}

export async function getPostsByCategory(
    category: string,
    limit: number = 6,
    locale: Locale = "en"
): Promise<Post[]> {
    if (!category?.trim()) return [];

    const normalizedCategory = category.trim();

    return unstable_cache(
        async (): Promise<Post[]> => {
            try {
                const posts = await prisma.post.findMany({
                    where: {
                        category: {
                            equals: normalizedCategory,
                            mode: "insensitive",
                        },
                        published: true
                    },
                    include: { author: { select: { image: true } } },
                    orderBy: { date: 'desc' },
                    take: limit
                });
                // Ensure we verify mapped results
                return posts.map((post) => mapPrismaPost(post, locale));
            } catch (error) {
                console.error("Failed to fetch posts by category:", error);
                // Return empty array on error
                return [] as Post[];
            }
        },
        ['posts-by-category', normalizedCategory, locale, String(limit)],
        { revalidate: 300, tags: ['posts'] }
    )();
}

export async function searchPosts(
    query: string,
    limit: number = 10,
    locale: Locale = "en"
): Promise<Post[]> {
    if (!query?.trim()) return [];

    const searchTerm = query.trim();
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                OR: [
                    { title: { contains: searchTerm } },
                    { titleBn: { contains: searchTerm } },
                    { content: { contains: searchTerm } },
                    { contentBn: { contains: searchTerm } },
                    { excerpt: { contains: searchTerm } },
                    { excerptBn: { contains: searchTerm } }
                ]
            },
            orderBy: { date: 'desc' },
            take: limit
        });
        return posts.map((post) => mapPrismaPost(post, locale));
    } catch (error) {
        console.error("Search failed:", error);
        return [] as Post[];
    }
}

export async function getFeaturedPosts(limit: number = 3, locale: Locale = "en"): Promise<Post[]> {
    return unstable_cache(
        async (): Promise<Post[]> => {
            try {
                const posts = await prisma.post.findMany({
                    where: { featured: true, published: true },
                    include: { author: { select: { image: true } } },
                    orderBy: { views: 'desc' },
                    take: limit
                });
                return posts.map((post) => mapPrismaPost(post, locale));
            } catch (error) {
                console.error("Failed to fetch featured posts:", error);
                return [];
            }
        },
        ['featured-posts', locale, String(limit)],
        { revalidate: 7200, tags: ['posts', 'featured'] }
    )();
}

export async function getAllPosts(locale: Locale = "en"): Promise<Post[]> {
    return unstable_cache(
        async (): Promise<Post[]> => {
            try {
                const posts = await prisma.post.findMany({
                    where: { published: true },
                    include: { author: { select: { image: true } } },
                    orderBy: { date: 'desc' }
                });
                return posts.map((post) => mapPrismaPost(post, locale));
            } catch (error) {
                console.error("Failed to fetch all posts:", error);
                return [];
            }
        },
        ['all-posts', locale],
        { revalidate: 600, tags: ['posts'] }
    )();
}

// Admin functions
export async function getAllPostsForAdmin(): Promise<Post[]> {
    try {
        const posts = await prisma.post.findMany({
            include: { author: { select: { image: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return posts.map((post) => mapPrismaPost(post, "en"));
    } catch (error) {
        console.error("Failed to fetch admin posts:", error);
        return [];
    }
}

export async function getPostsByCategories(
    categories: string[],
    limit: number = 6,
    locale: Locale = "en"
): Promise<Record<string, Post[]>> {
    if (!categories?.length) return {};

    // Clean categories
    const cleanCategories = categories.filter(c => c?.trim()).map(c => c.trim());
    if (cleanCategories.length === 0) return {};

    const result: Record<string, Post[]> = {};

    // Initialize empty arrays
    cleanCategories.forEach(cat => result[cat] = []);

    // Fetch posts for each category (Prisma doesn't support complex window functions easily in one go)
    // We will do parallel requests
    try {
        const promises = cleanCategories.map(cat =>
            prisma.post.findMany({
                where: {
                    category: {
                        equals: cat,
                        mode: "insensitive",
                    },
                    published: true
                },
                include: { author: { select: { image: true } } },
                orderBy: { date: 'desc' },
                take: limit
            })
        );

        const results = await Promise.all(promises);

        results.forEach((posts, index) => {
            const category = cleanCategories[index];
            result[category] = posts.map((post) => mapPrismaPost(post, locale));
        });

        return result;
    } catch (error) {
        console.error("Failed to fetch posts by categories:", error);
        return result;
    }
}

export const getPostStats = unstable_cache(
    async (): Promise<PostStats> => {
        try {
            const total = await prisma.post.count();
            const published = await prisma.post.count({ where: { published: true } });
            const drafts = await prisma.post.count({ where: { published: false } });
            const viewsAggregate = await prisma.post.aggregate({
                _sum: { views: true },
                where: { published: true }
            });

            return {
                total,
                published,
                drafts,
                totalViews: viewsAggregate._sum.views || 0
            };
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            return { total: 0, published: 0, drafts: 0, totalViews: 0 };
        }
    },
    ['post-stats'],
    { revalidate: 60, tags: ['posts', 'stats'] }
);

export interface PostStats {
    total: number;
    published: number;
    drafts: number;
    totalViews: number;
}

export async function getRelatedPosts(
    category: string,
    currentSlug: string,
    limit: number = 4,
    locale: Locale = "en"
): Promise<Post[]> {
    if (!category?.trim()) return [];
    try {
        const posts = await prisma.post.findMany({
            where: {
                category: {
                    equals: category.trim(),
                    mode: "insensitive",
                },
                published: true,
                slug: { not: currentSlug }
            },
            include: { author: { select: { image: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return posts.map((post) => mapPrismaPost(post, locale));
    } catch (error) {
        console.error("Failed to fetch related posts:", error);
        return [];
    }
}
