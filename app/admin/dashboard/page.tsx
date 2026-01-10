import { auth } from "@/auth";
import DashboardClient from "./DashboardClient";
import { verifyAdmin } from "@/actions/admin-auth";

import { getAllPosts } from "@/lib/posts";
import { getAllUsers, getUserStats } from "@/lib/users";
import { getSettings } from "@/lib/settings";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();
    const currentUser = session?.user;

    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        redirect("/admin");
    }

    const posts = await getAllPosts();
    const users = await getAllUsers();
    const stats = await getUserStats();
    const settings = await getSettings();

    const mappedPosts = posts.map((post, index) => ({
        id: index + 1, // temporary ID
        title: post.title,
        author: post.author,
        category: post.category,
        status: post.featured ? "Featured" : "Published",
        views: post.views || 0,
        date: post.date,
        img: post.coverImage || "/imgs/Chernobyl.png",
        slug: post.slug
    }));

    const mappedUsers = users.map(user => ({
        id: user.id || 0,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "/imgs/Alaxandria.jpeg", // Placeholder for now
        plan: user.plan || "Explorer",
        status: user.status || "active",
        articles: user.article_count || 0,
        joined: new Date(user.created_at).toLocaleDateString()
    }));

    const dashboardStats = [
        { id: 1, label: "Total Users", value: stats.totalUsers.toLocaleString(), change: "+0%", trend: "up", iconName: "Users", color: "text-blue-500", bgColor: "bg-blue-500/10" },
        { id: 2, label: "Articles", value: stats.totalArticles.toLocaleString(), change: "+0%", trend: "up", iconName: "FileText", color: "text-purple-500", bgColor: "bg-purple-500/10" },
        { id: 3, label: "Page Views", value: stats.totalViews.toLocaleString(), change: "+0%", trend: "up", iconName: "Eye", color: "text-green-500", bgColor: "bg-green-500/10" },
        { id: 4, label: "Revenue", value: "$0", change: "0%", trend: "down", iconName: "DollarSign", color: "text-amber-500", bgColor: "bg-amber-500/10" },
    ];

    return <DashboardClient
        initialArticles={mappedPosts}
        initialUsers={mappedUsers}
        initialStats={dashboardStats}
        initialSettings={settings}
        currentUser={currentUser}
    />;
}
