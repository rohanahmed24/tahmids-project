import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { getAllUsers, getUserStats } from "@/lib/users";
import { getAllPostsForAdmin, getPostStats } from "@/lib/posts";
import { getRecentActivity } from "@/lib/activity";
import { getNewsletterSubscribers } from "@/lib/newsletter";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { PostsTable } from "@/components/admin/PostsTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { QuickActions } from "@/components/admin/QuickActions";
import { NewsletterAudiencePanel } from "@/components/admin/NewsletterAudiencePanel";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  const isAdmin = await verifyAdmin();

  if (!session || !isAdmin) {
    redirect("/signin");
  }

  // Fetch all data in parallel
  const [
    users,
    userStats,
    posts,
    postStats,
    activities,
    newsletterSubscribers,
  ] = await Promise.all([
    getAllUsers(),
    getUserStats(),
    getAllPostsForAdmin(),
    getPostStats(),
    getRecentActivity(),
    getNewsletterSubscribers(),
  ]);

  // Calculate growth (simple approximation)
  const previousUsers = userStats.totalUsers - userStats.recentUsers;
  const userGrowth =
    previousUsers > 0
      ? Math.round((userStats.recentUsers / previousUsers) * 100)
      : userStats.totalUsers > 0
        ? 100
        : 0;

  const newsletterAudience = new Set([
    ...users.map((user) => user.email.trim().toLowerCase()),
    ...newsletterSubscribers.map((subscriber) =>
      subscriber.email.trim().toLowerCase(),
    ),
  ]).size;

  const dashboardStats = {
    totalUsers: userStats.totalUsers,
    totalArticles: postStats.total,
    publishedArticles: postStats.published,
    draftArticles: postStats.drafts,
    totalViews: postStats.totalViews,
    monthlyGrowth: userGrowth,
    engagementRate: 0, // Placeholder as we don't track engagement yet
    newsletterAudience,
    newsletterSubscribers: newsletterSubscribers.length,
  };

  return (
    <div className="max-w-[1800px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <DashboardHeader user={session} />

      {/* Stats Overview */}
      <StatsCards stats={dashboardStats} />

      {/* Quick Actions */}
      <QuickActions />

      <NewsletterAudiencePanel
        subscribers={newsletterSubscribers}
        registeredUsers={users.map((user) => ({
          email: user.email,
          name: user.name,
          createdAt: user.created_at,
        }))}
      />

      {/* Main Content Grid - Responsive with intermediate breakpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Left Column - Posts & Analytics (spans 2 on xl) */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-1">
          {/* Analytics Chart */}
          <Suspense
            fallback={
              <div className="h-64 sm:h-80 md:h-96 bg-bg-secondary rounded-xl sm:rounded-2xl animate-pulse" />
            }
          >
            <AnalyticsChart posts={posts} userCount={userStats.totalUsers} />
          </Suspense>

          {/* Posts Management */}
          <div className="bg-bg-secondary rounded-xl sm:rounded-2xl border border-border-primary overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 md:p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2
                    className="text-lg sm:text-xl font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Content Management
                  </h2>
                  <p
                    className="mt-0.5 hidden text-xs sm:block sm:text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Manage all your articles and drafts
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: "var(--accent-main)",
                      color: "var(--text-inverse)",
                    }}
                  >
                    New Article
                  </button>
                </div>
              </div>
            </div>
            <PostsTable posts={posts} />
          </div>
        </div>

        {/* Right Column - Users & Activity */}
        <div className="lg:col-span-2 xl:col-span-1 space-y-4 sm:space-y-6 md:space-y-8 order-1 lg:order-2">
          {/* Recent Activity */}
          <RecentActivity activities={activities} />

          {/* Two-column grid on lg, single on xl */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-6 md:gap-8">
                        {/* Users Management */}
                        <div className="bg-bg-secondary rounded-xl sm:rounded-2xl border border-border-primary overflow-hidden shadow-sm">
                            <div className="p-4 sm:p-5 md:p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
                <h2
                  className="text-lg sm:text-xl font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  User Management
                </h2>
                <p
                  className="mt-0.5 hidden text-xs sm:block sm:text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  View and manage registered users
                </p>
                            </div>
                            <UsersTable users={users} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
}
