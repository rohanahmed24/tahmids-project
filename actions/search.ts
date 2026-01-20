"use server";

import { prisma } from "@/lib/db";
import { Post } from "@/lib/posts";

export async function searchPosts(query: string): Promise<Post[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const searchTerm = query.trim();

    try {
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm } },
                    { content: { contains: searchTerm } },
                    { subtitle: { contains: searchTerm } },
                    { category: { contains: searchTerm } }
                ],
                published: true
            },
            orderBy: { date: 'desc' }
        });

        // Map Prisma result to Post type where necessary
        return posts.map(post => ({
            ...post,
            date: post.date || new Date().toISOString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            // Ensure compatibility with existing Post type which expects specific field names
            created_at: post.createdAt.toISOString(),
            updated_at: post.updatedAt.toISOString()
        })) as unknown as Post[];

    } catch (error) {
        console.error("Search failed:", error);
        return [];
    }
}
