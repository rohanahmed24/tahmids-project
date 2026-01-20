import { prisma } from "@/lib/db";

export type ActivityItem = {
    id: string;
    type: "post_created" | "user_registered";
    user: string;
    action: string;
    target?: string | null;
    time: string; // ISO string
    iconName: "file-text" | "user-plus";
    color: string;
};

export async function getRecentActivity(): Promise<ActivityItem[]> {
    try {
        const [recentPosts, recentUsers] = await Promise.all([
            prisma.post.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { author: { select: { name: true } } }
            }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        const activities: ActivityItem[] = [];

        // Process Posts
        recentPosts.forEach(post => {
            activities.push({
                id: `post-${post.id}`,
                type: "post_created",
                user: post.author?.name || "Anonymous",
                action: "created a new article",
                target: post.title,
                time: post.createdAt.toISOString(),
                iconName: "file-text",
                color: "text-green-500"
            });
        });

        // Process Users
        recentUsers.forEach(user => {
            activities.push({
                id: `user-${user.id}`,
                type: "user_registered",
                user: user.name,
                action: "registered as a new user",
                target: null,
                time: user.createdAt.toISOString(),
                iconName: "user-plus",
                color: "text-blue-500"
            });
        });

        // Sort by time/date desc
        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 5); // Return top 5
    } catch (error) {
        console.error("Failed to fetch recent activity:", error);
        return [];
    }
}
