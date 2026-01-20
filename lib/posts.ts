import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";
import { Post as PrismaPost } from "@prisma/client";

// Re-exporting the type compatible with the frontend
export type Post = {
    id: number;
    slug: string;
    title: string;
    subtitle?: string | null;
    date: string;
    author: string;
    authorId?: number | null;
    category: string;
    content?: string | null;
    excerpt?: string | null;
    coverImage?: string | null;
    videoUrl?: string | null;
    views: number;
    featured: boolean;
    published: boolean;
    topic_slug?: string | null;
    accent_color?: string | null;
    created_at: string;
    updated_at: string;
    authorImage?: string | null;
};

// Mapper function to convert Prisma result to frontend Post type
function mapPrismaPost(post: PrismaPost & { author?: { image: string | null } | null }): Post {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        date: post.date ? String(post.date) : new Date().toISOString(),
        author: post.authorName || "Anonymous",
        authorId: post.authorId,
        category: post.category || "Uncategorized",
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        videoUrl: post.videoUrl,
        views: post.views || 0,
        featured: post.featured || false,
        published: post.published || false,
        topic_slug: post.topicSlug,
        accent_color: post.accentColor,
        created_at: post.createdAt.toISOString(),
        updated_at: post.updatedAt.toISOString(),
        authorImage: post.author?.image
    };
}

// Fallback demo data


// --- Cached Functions ---

export const getHotTopics = unstable_cache(
    async (limit: number = 5): Promise<Post[]> => {
        try {
            const posts = await prisma.post.findMany({
                where: { featured: true, published: true },
                include: { author: { select: { image: true } } },
                orderBy: { views: 'desc' },
                take: limit
            });
            return posts.map(mapPrismaPost);
        } catch (error) {
            console.error("Failed to fetch hot topics:", error);
            return [];
        }
    },
    ['hot-topics'],
    { revalidate: 7200, tags: ['posts', 'hot-topics'] }
);

export const getRecentPosts = unstable_cache(
    async (limit: number = 10): Promise<Post[]> => {
        try {
            const posts = await prisma.post.findMany({
                where: { published: true },
                include: { author: { select: { image: true } } },
                orderBy: { createdAt: 'desc' },
                take: limit
            });
            return posts.map(mapPrismaPost);
        } catch (error) {
            console.error("Failed to fetch recent posts:", error);
            return [];
        }
    },
    ['recent-posts'],
    { revalidate: 300, tags: ['posts', 'recent'] }
);

export const getPostBySlug = unstable_cache(
    async (slug: string): Promise<Post | null> => {
        if (!slug?.trim()) return null;
        try {
            const post = await prisma.post.findUnique({
                where: { slug },
                include: { author: { select: { image: true } } }
            });

            if (!post || !post.published) return null;

            // Increment views asynchronously
            incrementViewCount(slug).catch(console.error);

            return mapPrismaPost(post);
        } catch (error) {
            console.error("Failed to fetch post by slug:", error);
            return null;
        }
    },
    ['post-by-slug'],
    { revalidate: 300, tags: ['posts'] }
);

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

export const getPostsByCategory = unstable_cache(
    async (category: string, limit: number = 6): Promise<Post[]> => {
        if (!category?.trim()) return [];
        try {
            const posts = await prisma.post.findMany({
                where: {
                    category: category.trim(),
                    published: true
                },
                include: { author: { select: { image: true } } },
                orderBy: { date: 'desc' },
                take: limit
            });
            // Ensure we verify mapped results
            return posts.map(mapPrismaPost);
        } catch (error) {
            console.error("Failed to fetch posts by category:", error);
            // Return empty array on error
            return [] as Post[];
        }
    },
    ['posts-by-category'],
    { revalidate: 300, tags: ['posts'] }
);

export async function searchPosts(query: string, limit: number = 10): Promise<Post[]> {
    if (!query?.trim()) return [];

    const searchTerm = query.trim();
    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                OR: [
                    { title: { contains: searchTerm } },
                    { content: { contains: searchTerm } },
                    { excerpt: { contains: searchTerm } }
                ]
            },
            orderBy: { date: 'desc' },
            take: limit
        });
        return posts.map(mapPrismaPost);
    } catch (error) {
        console.error("Search failed:", error);
        return [] as Post[];
    }
}

export const getFeaturedPosts = unstable_cache(
    async (limit: number = 3): Promise<Post[]> => {
        try {
            const posts = await prisma.post.findMany({
                where: { featured: true, published: true },
                include: { author: { select: { image: true } } },
                orderBy: { views: 'desc' },
                take: limit
            });
            return posts.map(mapPrismaPost);
        } catch (error) {
            console.error("Failed to fetch featured posts:", error);
            return [];
        }
    },
    ['featured-posts'],
    { revalidate: 7200, tags: ['posts', 'featured'] }
);

export async function getAllPosts(): Promise<Post[]> {
    return unstable_cache(
        async () => {
            try {
                const posts = await prisma.post.findMany({
                    where: { published: true },
                    include: { author: { select: { image: true } } },
                    orderBy: { date: 'desc' }
                });
                return posts.map(mapPrismaPost);
            } catch (error) {
                console.error("Failed to fetch all posts:", error);
                return [];
            }
        },
        ['all-posts'],
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
        return posts.map(mapPrismaPost);
    } catch (error) {
        console.error("Failed to fetch admin posts:", error);
        return [];
    }
}

export async function getPostsByCategories(
    categories: string[],
    limit: number = 6
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
                where: { category: cat, published: true },
                include: { author: { select: { image: true } } },
                orderBy: { date: 'desc' },
                take: limit
            })
        );

        const results = await Promise.all(promises);

        results.forEach((posts, index) => {
            const category = cleanCategories[index];
            result[category] = posts.map(mapPrismaPost);
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
    { revalidate: 300, tags: ['posts', 'stats'] }
);

export interface PostStats {
    total: number;
    published: number;
    drafts: number;
    totalViews: number;
}

export async function getRelatedPosts(category: string, currentSlug: string, limit: number = 4): Promise<Post[]> {
    if (!category?.trim()) return [];
    try {
        const posts = await prisma.post.findMany({
            where: {
                category: category.trim(),
                published: true,
                slug: { not: currentSlug }
            },
            include: { author: { select: { image: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
        return posts.map(mapPrismaPost);
    } catch (error) {
        console.error("Failed to fetch related posts:", error);
        return [];
    }
}