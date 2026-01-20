import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/signin");
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
        }
    });

    if (!user) {
        redirect("/signin");
    }

    // Get user's posts if they're an author/admin
    const userPosts = user.role === "admin" ? await prisma.post.findMany({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
            id: true,
            title: true,
            slug: true,
            category: true,
            views: true,
            published: true,
            createdAt: true,
            coverImage: true,
        }
    }) : [];

    // Calculate stats
    const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    const publishedCount = userPosts.filter(p => p.published).length;

    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        memberSince: user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };

    const stats = {
        articlesWritten: userPosts.length,
        publishedArticles: publishedCount,
        totalViews,
        memberSince: userData.memberSince,
    };

    async function handleSignOut() {
        "use server";
        await signOut({ redirectTo: "/" });
    }

    return (
        <DashboardClient
            user={userData}
            stats={stats}
            recentPosts={userPosts}
            signOutAction={handleSignOut}
        />
    );
}
