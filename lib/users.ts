import { prisma } from "@/lib/db";
import { User as PrismaUser, Prisma } from "@prisma/client";

// Re-export type compatible with frontend
export type User = {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at?: string;
    image?: string | null;
    email_verified?: string | null;
    article_count?: number;
    title?: string | null;
    bio?: string | null;
    isFeatured?: boolean;
    featuredOrder?: number;
};

function normalizeImageUrl(url?: string | null): string | null | undefined {
    if (!url) return url;
    // Keep upload paths local so newly uploaded local files resolve correctly.
    // Missing local files are already handled by /api/uploads fallback logic.
    if (url.startsWith("/imgs/uploads/")) {
        return url;
    }
    if (url.startsWith("https://ui-avatars.com/") || url.startsWith("http://ui-avatars.com/")) {
        try {
            const parsed = new URL(url);
            if (!parsed.searchParams.get("format")) {
                parsed.searchParams.set("format", "png");
            }
            return parsed.toString();
        } catch {
            return url;
        }
    }
    return url;
}

function mapPrismaUser(user: PrismaUser & { _count?: { posts: number } }): User {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'user' | 'admin',
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
        image: normalizeImageUrl(user.image),
        email_verified: user.emailVerified?.toISOString() || null,
        article_count: user._count?.posts || 0,
        title: user.title,
        bio: user.bio,
        isFeatured: user.isFeatured,
        featuredOrder: user.featuredOrder
    };
}

export async function getAllUsers(): Promise<User[]> {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return users.map(mapPrismaUser);
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getFeaturedWriters(): Promise<User[]> {
    try {
        const users = await prisma.user.findMany({
            where: { isFeatured: true },
            orderBy: { featuredOrder: 'asc' },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return users.map(mapPrismaUser);
    } catch (error) {
        console.error("Error fetching featured writers:", error);
        return [];
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return user ? mapPrismaUser(user) : null;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
        return user ? mapPrismaUser(user) : null;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return null;
    }
}

export async function getUserStats() {
    try {
        const totalUsers = await prisma.user.count();
        const adminUsers = await prisma.user.count({ where: { role: 'admin' } });

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const recentUsers = await prisma.user.count({
            where: { createdAt: { gte: oneMonthAgo } }
        });

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const activeUsers = await prisma.user.count({
            where: { createdAt: { gte: oneWeekAgo } }
        });

        return {
            totalUsers,
            adminUsers,
            recentUsers,
            activeUsers
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
            totalUsers: 0,
            adminUsers: 0,
            recentUsers: 0,
            activeUsers: 0
        };
    }
}

export async function createUser(userData: {
    name: string;
    email: string;
    password?: string;
    role?: 'user' | 'admin';
    image?: string;
}): Promise<User | null> {
    try {
        const user = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'user',
                image: userData.image
            }
        });
        return mapPrismaUser(user);
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

export async function updateUser(id: number, updates: Partial<User>): Promise<User | null> {
    try {
        // Filter out fields that shouldn't be updated directly or map them
        const { id: _id, created_at, article_count, role, ...cleanUpdates } = updates;

        const data: Prisma.UserUpdateInput = { ...cleanUpdates };
        if (role) data.role = role; // allow role update if provided

        const user = await prisma.user.update({
            where: { id },
            data,
            include: {
                _count: { select: { posts: true } }
            }
        });
        return mapPrismaUser(user);
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
}

export async function deleteUser(id: number): Promise<boolean> {
    try {
        await prisma.user.delete({ where: { id } });
        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}
