import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { getAllUsers, getUserStats } from "@/lib/users";
import { getAllPostsForAdmin, getPostStats } from "@/lib/posts";
import { getRecentActivity } from "@/lib/activity";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { PostsTable } from "@/components/admin/PostsTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { QuickActions } from "@/components/admin/QuickActions";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function AdminDashboard() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    // Fetch all data in parallel
    const [users, userStats, posts, postStats, activities] = await Promise.all([
        getAllUsers(),
        getUserStats(),
        getAllPostsForAdmin(),
        getPostStats(),
        getRecentActivity()
    ]);

    // Calculate growth (simple approximation)
    const previousUsers = userStats.totalUsers - userStats.recentUsers;
    const userGrowth = previousUsers > 0
        ? Math.round((userStats.recentUsers / previousUsers) * 100)
        : (userStats.totalUsers > 0 ? 100 : 0);

    const dashboardStats = {
        totalUsers: userStats.totalUsers,
        totalArticles: postStats.total,
        publishedArticles: postStats.published,
        draftArticles: postStats.drafts,
        totalViews: postStats.totalViews,
        monthlyGrowth: userGrowth,
        engagementRate: 0, // Placeholder as we don't track engagement yet
        avgReadTime: "N/A" // Placeholder
    };

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Header */}
                <DashboardHeader user={session} />

                {/* Stats Overview */}
                <StatsCards stats={dashboardStats} />

                {/* Quick Actions */}
                <QuickActions />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column - Posts & Analytics */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Analytics Chart */}
                        <Suspense fallback={<div className="h-96 bg-bg-secondary rounded-xl animate-pulse" />}>
                            <AnalyticsChart posts={posts} userCount={userStats.totalUsers} />
                        </Suspense>

                        {/* Posts Management */}
                        <div className="bg-bg-secondary rounded-xl border border-border-primary">
                            <div className="p-6 border-b border-border-primary">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-text-primary">
                                        Content Management
                                    </h2>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors">
                                            New Article
                                        </button>
                                        <button className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors">
                                            Import
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <PostsTable posts={posts} />
                        </div>
                    </div>

                    {/* Right Column - Users & Activity */}
                    <div className="space-y-8">
                        {/* Recent Activity */}
                        <RecentActivity activities={activities} />

                        {/* Users Management */}
                        <div className="bg-bg-secondary rounded-xl border border-border-primary">
                            <div className="p-6 border-b border-border-primary">
                                <h2 className="text-xl font-semibold text-text-primary">
                                    User Management
                                </h2>
                            </div>
                            <UsersTable users={users} />
                        </div>

                        {/* Media Library Preview */}
                        <MediaLibrary />
                    </div>
                </div>
            </div>
        </div>
    );
}