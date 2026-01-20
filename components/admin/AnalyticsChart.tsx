"use client";

import { useMemo } from "react";
import { TrendingUp, Eye, BarChart3, FileText } from "lucide-react";
import { Post } from "@/lib/posts";

interface AnalyticsChartProps {
    posts: Post[];
    userCount: number;
}

export function AnalyticsChart({ posts, userCount }: AnalyticsChartProps) {

    // Calculate real stats
    const totalViews = useMemo(() => posts.reduce((sum, post) => sum + (post.views || 0), 0), [posts]);
    const totalArticles = posts.length;
    const avgViews = totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0;

    // Top 5 posts by views
    const topPosts = useMemo(() => {
        return [...posts]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
    }, [posts]);

    // Calculate max views for bar scale
    const maxViews = topPosts.length > 0 ? topPosts[0].views : 100;

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary">
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Content Performance
                        </h2>
                        <p className="text-text-secondary mt-1">Top performing articles by views</p>
                    </div>
                    {/* Time range selector hidden as we don't have historical data yet */}
                </div>
            </div>

            <div className="p-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Total Views</p>
                                <p className="text-2xl font-bold text-text-primary">{totalViews.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 text-green-500">
                                <Eye className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Total Articles</p>
                                <p className="text-2xl font-bold text-text-primary">{totalArticles.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 text-blue-500">
                                <FileText className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Avg. Views per Article</p>
                                <p className="text-2xl font-bold text-text-primary">{avgViews.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 text-purple-500">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Content Chart */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-text-primary">Top 5 Trending Articles</h3>
                    <div className="space-y-4">
                        {topPosts.map((post) => {
                            const widthPercent = Math.max((post.views / maxViews) * 100, 1);
                            return (
                                <div key={post.id} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-primary font-medium truncate max-w-[70%]">{post.title}</span>
                                        <span className="text-text-secondary">{post.views.toLocaleString()} views</span>
                                    </div>
                                    <div className="h-3 bg-bg-tertiary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent-primary rounded-full transition-all duration-500"
                                            style={{ width: `${widthPercent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        {topPosts.length === 0 && (
                            <div className="text-center py-8 text-text-secondary">
                                No published articles yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Additional Insights */}
                <div className="mt-8 grid grid-cols-1 gap-6">
                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <h4 className="font-medium text-text-primary mb-3">Audience Insights</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Registered Users</span>
                                <span className="text-text-primary font-medium">{userCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Conversion Rate</span>
                                <span className="text-text-primary font-medium">
                                    {totalViews > 0 ? ((userCount / totalViews) * 100).toFixed(2) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}