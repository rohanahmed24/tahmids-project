"use client";

import { useMemo } from "react";
import { TrendingUp, Eye, BarChart3, FileText, Users, ArrowUpRight } from "lucide-react";
import { Post } from "@/lib/posts";
import { motion } from "framer-motion";

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
    const maxViews = topPosts.length > 0 ? (topPosts[0].views || 1) : 100;

    const metrics = [
        {
            label: "Total Views",
            value: totalViews.toLocaleString(),
            icon: Eye,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20"
        },
        {
            label: "Total Articles",
            value: totalArticles.toLocaleString(),
            icon: FileText,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20"
        },
        {
            label: "Avg. Views",
            value: avgViews.toLocaleString(),
            icon: TrendingUp,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-500/20"
        }
    ];

    return (
        <div className="bg-bg-secondary rounded-xl sm:rounded-2xl border border-border-primary overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 sm:p-5 md:p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-accent-primary/10">
                            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-primary">
                                Content Performance
                            </h2>
                            <p className="text-[10px] sm:text-xs text-text-tertiary hidden sm:block">
                                Top performing articles by views
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                        <span className="hidden sm:inline">All time</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-500 font-medium">Live</span>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6 md:space-y-8">
                {/* Key Metrics - Horizontal scroll on mobile */}
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar
                    sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`min-w-[140px] sm:min-w-0 snap-start flex-1 ${metric.bgColor}
                                    rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${metric.borderColor}
                                    hover:scale-[1.02] transition-transform cursor-default`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-text-secondary text-[10px] sm:text-xs font-medium uppercase tracking-wide">
                                        {metric.label}
                                    </p>
                                    <Icon className={`w-4 h-4 ${metric.color}`} />
                                </div>
                                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                                    {metric.value}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Top Content Chart */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-text-primary">
                            Top 5 Trending Articles
                        </h3>
                        {topPosts.length > 0 && (
                            <span className="text-[10px] sm:text-xs text-text-tertiary">
                                Click to view
                            </span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {topPosts.map((post, index) => {
                            const widthPercent = Math.max(((post.views || 0) / maxViews) * 100, 3);
                            const barColors = [
                                "from-blue-500 to-blue-600",
                                "from-purple-500 to-purple-600",
                                "from-green-500 to-green-600",
                                "from-orange-500 to-orange-600",
                                "from-pink-500 to-pink-600"
                            ];

                            return (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="group cursor-pointer"
                                >
                                    <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-bg-tertiary
                                                flex items-center justify-center text-[10px] sm:text-xs font-bold text-text-secondary shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-text-primary font-medium truncate group-hover:text-accent-primary transition-colors">
                                                {post.title}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                            <span className="text-text-secondary font-medium">
                                                {(post.views || 0).toLocaleString()}
                                            </span>
                                            <ArrowUpRight className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <div className="h-2 sm:h-2.5 bg-bg-tertiary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${widthPercent}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                                            className={`h-full bg-gradient-to-r ${barColors[index]} rounded-full
                                                group-hover:shadow-lg transition-shadow`}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}

                        {topPosts.length === 0 && (
                            <div className="text-center py-8 sm:py-10">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-text-tertiary" />
                                </div>
                                <p className="text-text-secondary text-sm font-medium">No articles yet</p>
                                <p className="text-text-tertiary text-xs mt-1">Create your first article to see analytics</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audience Insights - Responsive Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-bg-tertiary/50 rounded-xl sm:rounded-2xl p-4 border border-border-primary/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Users className="w-4 h-4 text-accent-primary" />
                            <h4 className="font-medium text-text-primary text-sm">Audience Insights</h4>
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-xs sm:text-sm">Registered Users</span>
                                <span className="text-text-primary font-semibold text-sm sm:text-base">{userCount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-xs sm:text-sm">Conversion Rate</span>
                                <span className="text-text-primary font-semibold text-sm sm:text-base">
                                    {totalViews > 0 ? ((userCount / totalViews) * 100).toFixed(2) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary/50 rounded-xl sm:rounded-2xl p-4 border border-border-primary/50">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <h4 className="font-medium text-text-primary text-sm">Performance</h4>
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-xs sm:text-sm">Views per User</span>
                                <span className="text-text-primary font-semibold text-sm sm:text-base">
                                    {userCount > 0 ? (totalViews / userCount).toFixed(1) : 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-xs sm:text-sm">Content Health</span>
                                <span className="text-green-500 font-semibold text-sm sm:text-base flex items-center gap-1">
                                    Good
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}