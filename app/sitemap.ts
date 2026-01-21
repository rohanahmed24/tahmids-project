import { getAllPosts } from "@/lib/posts";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://thewisdomia.com";

    // Get all published posts
    const posts = await getAllPosts();

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/latest`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/popular`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/topics`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/stories`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/subscribe`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.3,
        },
    ];

    // Dynamic article pages
    const articlePages = posts.map((post) => ({
        url: `${baseUrl}/article/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    return [...staticPages, ...articlePages];
}
