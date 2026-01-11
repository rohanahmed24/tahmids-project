import { getDb } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export type Post = {
    id?: number;
    slug: string;
    title: string;
    subtitle?: string;
    date: string;
    author: string;
    category: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    videoUrl?: string;
    views?: number;
    featured?: boolean;
    published?: boolean;
    topic_slug?: string;
    accent_color?: string;
    created_at?: string;
    updated_at?: string;
};

// Simple in-memory cache for frequently accessed data
class PostCache {
    private static cache = new Map<string, { data: unknown; timestamp: number }>();
    private static readonly TTL = 5 * 60 * 1000; // 5 minutes

    static get<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.TTL) {
            return cached.data as T;
        }
        this.cache.delete(key);
        return null;
    }

    static set<T>(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    static clear(): void {
        this.cache.clear();
    }

    static invalidatePattern(pattern: string): void {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
}

// Constants for better maintainability
const BASE_SELECT_FIELDS = `
    id, slug, title, subtitle, date, author, category, content, excerpt,
    cover_image as coverImage, video_url as videoUrl, views, featured, 
    published, topic_slug, accent_color, created_at, updated_at
`;

const BASE_QUERY = `SELECT ${BASE_SELECT_FIELDS} FROM posts`;

// Centralized data transformation
function transformPostRow(row: RowDataPacket): Post {
    return {
        ...row,
        featured: Boolean(row.featured),
        published: Boolean(row.published)
    } as Post;
}

// Centralized query execution with error handling and performance monitoring
async function executePostQuery(
    query: string,
    params: (string | number | boolean | null)[] = [],
    fallbackData: Post[] = []
): Promise<Post[]> {
    // Input validation
    if (!query?.trim()) {
        console.warn("Empty query provided to executePostQuery");
        return fallbackData;
    }

    const startTime = Date.now();
    try {
        const db = getDb();
        const [rows] = await db.query<RowDataPacket[]>(query, params);
        const executionTime = Date.now() - startTime;

        // Log slow queries for optimization
        if (executionTime > 1000) {
            console.warn(`Slow query detected (${executionTime}ms):`, {
                query: query.substring(0, 100) + "...",
                paramCount: params.length
            });
        }

        return rows.map(transformPostRow);
    } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error("Database query failed:", {
            query: query.substring(0, 100) + "...", // Truncate for logging
            paramCount: params.length,
            executionTime,
            error: error instanceof Error ? error.message : String(error)
        });
        return fallbackData;
    }
}

// Single post query with better error handling
async function executePostQuerySingle(
    query: string,
    params: (string | number | boolean | null)[] = []
): Promise<Post | null> {
    // Input validation
    if (!query?.trim()) {
        console.warn("Empty query provided to executePostQuerySingle");
        return null;
    }

    try {
        const db = getDb();
        const [rows] = await db.query<RowDataPacket[]>(query, params);
        return rows.length > 0 ? transformPostRow(rows[0]) : null;
    } catch (error) {
        console.error("Database query failed:", {
            query: query.substring(0, 100) + "...",
            paramCount: params.length,
            error: error instanceof Error ? error.message : String(error)
        });
        return null;
    }
}

// Fallback demo data for when database is unavailable
function getFallbackPosts(): Post[] {
    return [
        {
            slug: "welcome-to-wisdomia",
            title: "Welcome to Wisdomia - Your Digital Magazine",
            subtitle: "Exploring stories that matter in our interconnected world",
            date: "2024-01-12",
            author: "Editorial Team",
            category: "News",
            content: "Welcome to Wisdomia, a platform dedicated to storytelling and editorial content. We bring you carefully curated articles across politics, mystery, crime, history, news, and science. Our mission is to provide thoughtful, well-researched content that informs and inspires our readers.",
            excerpt: "Welcome to Wisdomia, a platform dedicated to storytelling and editorial content.",
            coverImage: "/imgs/Chernobyl.png",
            views: 1250,
            featured: true,
            published: true,
            accent_color: "from-blue-600/80 to-purple-600/80"
        },
        {
            slug: "future-of-digital-journalism",
            title: "The Future of Digital Journalism",
            subtitle: "How technology is reshaping news and storytelling",
            date: "2024-01-11",
            author: "Sarah Johnson",
            category: "News",
            content: "Digital journalism continues to evolve with new technologies and changing reader habits. This article explores the trends shaping the future of news, from AI-assisted reporting to immersive storytelling techniques.",
            excerpt: "Digital journalism continues to evolve with new technologies and changing reader habits.",
            coverImage: "/imgs/Arab Spring.png",
            views: 890,
            featured: true,
            published: true,
            accent_color: "from-emerald-600/80 to-teal-600/80"
        },
        {
            slug: "mysteries-of-ancient-civilizations",
            title: "Mysteries of Ancient Civilizations",
            subtitle: "Uncovering secrets from our distant past",
            date: "2024-01-10",
            author: "Dr. Michael Chen",
            category: "History",
            content: "Archaeological discoveries continue to reveal fascinating insights about ancient civilizations and their sophisticated societies. From the pyramids of Egypt to the lost cities of the Maya, we explore the enduring mysteries that captivate researchers and the public alike.",
            excerpt: "Archaeological discoveries continue to reveal fascinating insights about ancient civilizations.",
            coverImage: "/imgs/Great Wall of China.jpeg",
            views: 1456,
            featured: true,
            published: true,
            accent_color: "from-amber-600/80 to-orange-600/80"
        },
        {
            slug: "climate-science-breakthrough",
            title: "Climate Science Breakthrough",
            subtitle: "New research offers hope for environmental solutions",
            date: "2024-01-09",
            author: "Dr. Emily Rodriguez",
            category: "Science",
            content: "Recent scientific breakthroughs in climate research are providing new pathways for addressing environmental challenges. From carbon capture technologies to renewable energy innovations, scientists are making remarkable progress.",
            excerpt: "Recent scientific breakthroughs in climate research are providing new pathways for addressing environmental challenges.",
            coverImage: "/imgs/Genetic Memory.png",
            views: 2103,
            featured: true,
            published: true,
            accent_color: "from-green-600/80 to-emerald-600/80"
        },
        {
            slug: "political-landscape-2024",
            title: "Political Landscape 2024",
            subtitle: "Analyzing current political trends and their implications",
            date: "2024-01-08",
            author: "Robert Williams",
            category: "Politics",
            content: "An in-depth analysis of the current political climate and its potential impact on society and governance. We examine key policy debates and their implications for the future.",
            excerpt: "An in-depth analysis of the current political climate and its potential impact on society and governance.",
            coverImage: "/imgs/North Korea.png",
            views: 1789,
            featured: true,
            published: true,
            accent_color: "from-red-600/80 to-pink-600/80"
        },
        {
            slug: "unsolved-mystery-cases",
            title: "Unsolved Mystery Cases",
            subtitle: "Exploring enigmas that continue to puzzle investigators",
            date: "2024-01-07",
            author: "Detective Lisa Park",
            category: "Mystery",
            content: "A look at some of the most intriguing unsolved cases that continue to captivate public attention and challenge investigators. From cold cases to modern mysteries, we explore the unknown.",
            excerpt: "A look at some of the most intriguing unsolved cases that continue to captivate public attention and challenge investigators.",
            coverImage: "/imgs/Jack the Ripper.jpeg",
            views: 1334,
            featured: true,
            published: true,
            accent_color: "from-purple-600/80 to-indigo-600/80"
        },
        {
            slug: "true-crime-investigation",
            title: "The Art of Criminal Investigation",
            subtitle: "Modern forensics meets classic detective work",
            date: "2024-01-06",
            author: "Detective Sarah Mills",
            category: "Crime",
            content: "A deep dive into how modern criminal investigations combine cutting-edge forensic science with traditional detective work to solve complex cases.",
            excerpt: "A deep dive into how modern criminal investigations combine cutting-edge forensic science with traditional detective work.",
            coverImage: "/imgs/Luis Garavito.png",
            views: 987,
            featured: false,
            published: true,
            accent_color: "from-gray-600/80 to-slate-600/80"
        },
        {
            slug: "genetic-memory-science",
            title: "The Science of Genetic Memory",
            subtitle: "How our ancestors' experiences shape us today",
            date: "2024-01-05",
            author: "Dr. Maria Santos",
            category: "Science",
            content: "Exploring the fascinating field of epigenetics and how traumatic experiences can be passed down through generations via genetic markers.",
            excerpt: "Exploring the fascinating field of epigenetics and how traumatic experiences can be passed down through generations.",
            coverImage: "/imgs/Deja Vu.png",
            views: 1543,
            featured: false,
            published: true,
            accent_color: "from-teal-600/80 to-cyan-600/80"
        }
    ];
}

export async function getAllPosts(): Promise<Post[]> {
    return executePostQuery(
        `${BASE_QUERY} WHERE published = 1 ORDER BY date DESC`,
        [],
        getFallbackPosts()
    );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    // Input validation
    if (!slug?.trim()) {
        console.warn("Invalid slug provided to getPostBySlug");
        return null;
    }

    const cleanSlug = slug.trim();
    const post = await executePostQuerySingle(
        `${BASE_QUERY} WHERE slug = ? AND published = 1`,
        [cleanSlug]
    );

    if (!post) {
        // Fallback to demo data
        const fallbackPosts = getFallbackPosts();
        return fallbackPosts.find(p => p.slug === cleanSlug) || null;
    }

    // Increment view count asynchronously (don't block the response)
    incrementViewCount(cleanSlug).catch(error =>
        console.warn('Failed to increment view count:', error)
    );

    return post;
}

// Separate function for view count increment
async function incrementViewCount(slug: string): Promise<void> {
    try {
        const db = getDb();
        await db.query('UPDATE posts SET views = views + 1 WHERE slug = ?', [slug]);
    } catch (error) {
        throw error; // Let the caller handle logging
    }
}

export async function getHotTopics(limit: number = 5): Promise<Post[]> {
    const validLimit = Math.max(1, Math.min(limit, 20)); // Limit between 1-20
    const cacheKey = `hot-topics-${validLimit}`;

    // Check cache first
    const cached = PostCache.get<Post[]>(cacheKey);
    if (cached) {
        return cached;
    }

    const fallbackData = getFallbackPosts().filter(post => post.featured).slice(0, validLimit);
    const result = await executePostQuery(
        `${BASE_QUERY} WHERE featured = 1 AND published = 1 ORDER BY views DESC LIMIT ?`,
        [validLimit],
        fallbackData
    );

    // Cache the result
    PostCache.set(cacheKey, result);
    return result;
}

export async function getRecentPosts(limit: number = 10): Promise<Post[]> {
    const validLimit = Math.max(1, Math.min(limit, 50)); // Limit between 1-50
    const fallbackData = getFallbackPosts().slice(0, validLimit);
    return executePostQuery(
        `${BASE_QUERY} WHERE published = 1 ORDER BY created_at DESC LIMIT ?`,
        [validLimit],
        fallbackData
    );
}

export async function getPostsByCategory(category: string, limit: number = 6): Promise<Post[]> {
    // Input validation
    if (!category?.trim()) {
        console.warn("Invalid category provided to getPostsByCategory");
        return [];
    }

    const validLimit = Math.max(1, Math.min(limit, 50)); // Limit between 1-50
    const cleanCategory = category.trim();

    const fallbackData = getFallbackPosts()
        .filter(post => post.category.toLowerCase() === cleanCategory.toLowerCase())
        .slice(0, validLimit);

    // If no fallback data matches, return some posts anyway for demo
    if (fallbackData.length === 0) {
        return getFallbackPosts().slice(0, validLimit);
    }

    return executePostQuery(
        `${BASE_QUERY} WHERE category = ? AND published = 1 ORDER BY date DESC LIMIT ?`,
        [cleanCategory, validLimit],
        fallbackData
    );
}

export async function searchPosts(query: string, limit: number = 10): Promise<Post[]> {
    // Input validation
    if (!query?.trim()) return [];

    const searchQuery = query.trim();
    const validLimit = Math.max(1, Math.min(limit, 50)); // Limit between 1-50

    const fallbackData = getFallbackPosts().filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, validLimit);

    return executePostQuery(
        `SELECT ${BASE_SELECT_FIELDS},
         MATCH(title, content, excerpt) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
         FROM posts 
         WHERE published = 1 AND MATCH(title, content, excerpt) AGAINST(? IN NATURAL LANGUAGE MODE)
         ORDER BY relevance DESC, date DESC 
         LIMIT ?`,
        [searchQuery, searchQuery, validLimit],
        fallbackData
    );
}

export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
    const validLimit = Math.max(1, Math.min(limit, 10)); // Limit between 1-10
    const fallbackData = getFallbackPosts().filter(post => post.featured).slice(0, validLimit);
    return executePostQuery(
        `${BASE_QUERY} WHERE featured = 1 AND published = 1 ORDER BY views DESC LIMIT ?`,
        [validLimit],
        fallbackData
    );
}

// Admin functions for dashboard
export async function getAllPostsForAdmin(): Promise<Post[]> {
    return executePostQuery(
        `${BASE_QUERY} ORDER BY created_at DESC`,
        [],
        getFallbackPosts()
    );
}

export async function getPostsByCategories(
    categories: string[],
    limit: number = 6
): Promise<Record<string, Post[]>> {
    // Input validation
    if (!categories?.length) {
        console.warn("No categories provided to getPostsByCategories");
        return {};
    }

    const validLimit = Math.max(1, Math.min(limit, 20)); // Limit between 1-20
    const cleanCategories = categories.filter(cat => cat?.trim()).map(cat => cat.trim());

    if (cleanCategories.length === 0) {
        return {};
    }

    try {
        const db = getDb();

        // Single optimized query with window functions for better performance
        const placeholders = cleanCategories.map(() => '?').join(',');
        const query = `
            SELECT 
                ${BASE_SELECT_FIELDS},
                ROW_NUMBER() OVER (PARTITION BY category ORDER BY date DESC) as rn
            FROM posts 
            WHERE category IN (${placeholders}) AND published = 1
            HAVING rn <= ?
            ORDER BY category, date DESC
        `;

        const [rows] = await db.query<RowDataPacket[]>(
            query,
            [...cleanCategories, validLimit]
        );

        // Group results by category with fallback data
        const result: Record<string, Post[]> = {};
        cleanCategories.forEach(category => {
            result[category] = [];
        });

        rows.forEach(row => {
            const post = transformPostRow(row);
            if (result[post.category]) {
                result[post.category].push(post);
            }
        });

        // Add fallback data for empty categories
        const fallbackPosts = getFallbackPosts();
        cleanCategories.forEach(category => {
            if (result[category].length === 0) {
                const categoryFallback = fallbackPosts
                    .filter(post => post.category.toLowerCase() === category.toLowerCase())
                    .slice(0, validLimit);
                if (categoryFallback.length > 0) {
                    result[category] = categoryFallback;
                }
            }
        });

        return result;

    } catch (error) {
        console.error("Database query failed for categories:", {
            categories: cleanCategories,
            error: error instanceof Error ? error.message : String(error)
        });

        // Fallback: return demo data grouped by category
        const fallback: Record<string, Post[]> = {};
        const fallbackPosts = getFallbackPosts();

        cleanCategories.forEach(category => {
            const categoryPosts = fallbackPosts
                .filter(post => post.category.toLowerCase() === category.toLowerCase())
                .slice(0, validLimit);
            fallback[category] = categoryPosts.length > 0 ? categoryPosts : fallbackPosts.slice(0, validLimit);
        });

        return fallback;
    }
}

// Type for post statistics
export interface PostStats {
    total: number;
    published: number;
    drafts: number;
    totalViews: number;
}

export async function getPostStats(): Promise<PostStats> {
    const db = getDb();
    try {
        // Single optimized query instead of 4 separate queries
        const [rows] = await db.query<RowDataPacket[]>(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN published = 1 THEN 1 ELSE 0 END) as published,
                SUM(CASE WHEN published = 0 THEN 1 ELSE 0 END) as drafts,
                COALESCE(SUM(CASE WHEN published = 1 THEN views ELSE 0 END), 0) as totalViews
            FROM posts
        `);

        const stats = rows[0];
        return {
            total: Number(stats?.total) || 0,
            published: Number(stats?.published) || 0,
            drafts: Number(stats?.drafts) || 0,
            totalViews: Number(stats?.totalViews) || 0
        };
    } catch (error) {
        console.error("Error fetching post stats:", error);
        return { total: 6, published: 6, drafts: 0, totalViews: 8832 };
    }
}