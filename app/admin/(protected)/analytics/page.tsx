import { Suspense } from "react";
import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { getAllPostsForAdmin, getPostStats } from "@/lib/posts";
import { getUserStats } from "@/lib/users";
import { TrendingUp, Users, Eye, FileText, PieChart } from "lucide-react";

export default async function AnalyticsPage() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    const [posts, postStats, userStats] = await Promise.all([
        getAllPostsForAdmin(),
        getPostStats(),
        getUserStats()
    ]);

    // Calculate category distribution
    const categoryCounts = posts.reduce((acc, post) => {
        const cat = post.category || "Uncategorized";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5 categories

    const totalCategoriesCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1600px] mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Analytics Dashboard</h1>
                        <p className="text-text-secondary mt-2">Track your content performance and audience insights</p>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Total Views</p>
                                <p className="text-3xl font-bold text-text-primary">{postStats.totalViews.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                <Eye className="w-6 h-6 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Total Users</p>
                                <p className="text-3xl font-bold text-text-primary">{userStats.totalUsers.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-purple-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Published Articles</p>
                                <p className="text-3xl font-bold text-text-primary">{postStats.published.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg">
                                <FileText className="w-6 h-6 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Active Users (7d)</p>
                                <p className="text-3xl font-bold text-text-primary">{userStats.activeUsers.toLocaleString()}</p>
                            </div>
                            <div className="p-3 bg-orange-500/10 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Analytics Chart */}
                <Suspense fallback={<div className="h-96 bg-bg-secondary rounded-xl animate-pulse" />}>
                    <AnalyticsChart posts={posts} userCount={userStats.totalUsers} />
                </Suspense>

                {/* Category Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <PieChart className="w-5 h-5 text-accent-primary" />
                            <h3 className="text-xl font-semibold text-text-primary">Content by Category</h3>
                        </div>
                        <div className="space-y-4">
                            {categories.map(([category, count]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-text-primary font-medium">{category}</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-1 justify-end">
                                        <div className="w-32 bg-bg-tertiary rounded-full h-2">
                                            <div
                                                className="bg-accent-primary h-2 rounded-full"
                                                style={{ width: `${(count / totalCategoriesCount) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-text-secondary text-sm w-12 text-right">{count}</span>
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-text-secondary text-center py-4">No content categories found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}