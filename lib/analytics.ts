import { prisma } from "@/lib/db";

export interface MonthlyGrowth {
    month: string;
    users: number;
    [key: string]: string | number | undefined;
}

export interface TopArticle {
    title: string;
    views: number;
}

export async function getUserGrowthOverTime(): Promise<MonthlyGrowth[]> {
    try {
        // Using raw query for efficient date grouping
        const rows = await prisma.$queryRaw<MonthlyGrowth[]>`
            SELECT 
                DATE_FORMAT(created_at, '%b %Y') as month,
                COUNT(*) as users
            FROM users
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), month
            ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC
            LIMIT 6
        `;

        // Prisma raw query returns BigInt for count in some environments, need to handle simple numbers
        return rows.map(row => ({
            ...row,
            users: Number(row.users)
        }));
    } catch (error) {
        console.error("Error fetching user growth:", error);
        return [];
    }
}

export async function getTopArticles(limit: number = 5): Promise<TopArticle[]> {
    try {
        const posts = await prisma.post.findMany({
            select: { title: true, views: true },
            orderBy: { views: 'desc' },
            take: limit
        });
        return posts;
    } catch (error) {
        console.error("Error fetching top articles:", error);
        return [];
    }
}
