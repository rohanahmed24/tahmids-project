"use client";

import { useState } from "react";
import { TrendingUp, Users, Eye, BarChart3 } from "lucide-react";

interface AnalyticsData {
    date: string;
    views: number;
    users: number;
    articles: number;
}

export function AnalyticsChart() {
    const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

    // Mock analytics data - in real app this would come from database
    const analyticsData: AnalyticsData[] = [
        { date: "2024-01-01", views: 1200, users: 340, articles: 2 },
        { date: "2024-01-02", views: 1450, users: 380, articles: 1 },
        { date: "2024-01-03", views: 1100, users: 320, articles: 3 },
        { date: "2024-01-04", views: 1680, users: 420, articles: 1 },
        { date: "2024-01-05", views: 1890, users: 480, articles: 2 },
        { date: "2024-01-06", views: 2100, users: 520, articles: 4 },
        { date: "2024-01-07", views: 1950, users: 490, articles: 1 },
    ];

    const totalViews = analyticsData.reduce((sum, day) => sum + day.views, 0);
    const totalUsers = analyticsData.reduce((sum, day) => sum + day.users, 0);
    const avgViews = Math.round(totalViews / analyticsData.length);
    const viewsGrowth = 12.5; // Mock growth percentage

    const maxViews = Math.max(...analyticsData.map(d => d.views));

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary">
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Analytics Overview
                        </h2>
                        <p className="text-text-secondary mt-1">Track your content performance</p>
                    </div>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as "7d" | "30d" | "90d")}
                        className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
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
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">+{viewsGrowth}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Unique Visitors</p>
                                <p className="text-2xl font-bold text-text-primary">{totalUsers.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 text-blue-500">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-medium">+8.2%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-text-secondary text-sm">Avg. Daily Views</p>
                                <p className="text-2xl font-bold text-text-primary">{avgViews.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-1 text-purple-500">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-medium">+15.3%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-text-primary">Daily Views Trend</h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {analyticsData.map((day) => {
                            const height = (day.views / maxViews) * 100;
                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="relative group">
                                        <div
                                            className="bg-gradient-to-t from-accent-primary to-accent-primary/60 rounded-t-md transition-all duration-300 hover:from-accent-primary/80 hover:to-accent-primary/40 cursor-pointer"
                                            style={{ height: `${height}%`, minHeight: '8px' }}
                                        />
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {day.views} views
                                        </div>
                                    </div>
                                    <span className="text-xs text-text-tertiary">
                                        {new Date(day.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Additional Insights */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <h4 className="font-medium text-text-primary mb-3">Top Performing Content</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Welcome to Wisdomia</span>
                                <span className="text-text-primary font-medium">1,250 views</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Future of Digital Journalism</span>
                                <span className="text-text-primary font-medium">890 views</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Ancient Civilizations</span>
                                <span className="text-text-primary font-medium">1,456 views</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-bg-tertiary rounded-lg p-4">
                        <h4 className="font-medium text-text-primary mb-3">Traffic Sources</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Direct</span>
                                <span className="text-text-primary font-medium">45%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Search Engines</span>
                                <span className="text-text-primary font-medium">32%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-sm">Social Media</span>
                                <span className="text-text-primary font-medium">23%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}