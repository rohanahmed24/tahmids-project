"use client";

import { TrendingUp, TrendingDown, Users, FileText, Eye, Clock } from "lucide-react";

interface StatsCardsProps {
    stats: {
        totalUsers: number;
        totalArticles: number;
        publishedArticles: number;
        draftArticles: number;
        totalViews: number;
        monthlyGrowth: number;
        engagementRate: number;
        avgReadTime: string;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            change: `+${stats.monthlyGrowth}%`,
            trend: "up",
            icon: Users,
            color: "blue"
        },
        {
            title: "Published Articles",
            value: stats.publishedArticles.toLocaleString(),
            change: `${stats.draftArticles} drafts`,
            trend: "neutral",
            icon: FileText,
            color: "green"
        },
        {
            title: "Total Views",
            value: stats.totalViews.toLocaleString(),
            change: `+${stats.engagementRate}% engagement`,
            trend: "up",
            icon: Eye,
            color: "purple"
        },
        {
            title: "Avg. Read Time",
            value: stats.avgReadTime,
            change: "+0.3 min from last month",
            trend: "up",
            icon: Clock,
            color: "orange"
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            green: "bg-green-500/10 text-green-600 border-green-500/20",
            purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
            orange: "bg-orange-500/10 text-orange-600 border-orange-500/20"
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                const TrendIcon = card.trend === "up" ? TrendingUp : 
                                card.trend === "down" ? TrendingDown : null;

                return (
                    <div
                        key={index}
                        className="bg-bg-secondary border border-border-primary rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg border ${getColorClasses(card.color)}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            {TrendIcon && (
                                <TrendIcon className={`w-4 h-4 ${
                                    card.trend === "up" ? "text-green-500" : "text-red-500"
                                }`} />
                            )}
                        </div>

                        <div>
                            <h3 className="text-text-secondary text-sm font-medium mb-1">
                                {card.title}
                            </h3>
                            <p className="text-2xl font-bold text-text-primary mb-1">
                                {card.value}
                            </p>
                            <p className={`text-sm ${
                                card.trend === "up" ? "text-green-600" :
                                card.trend === "down" ? "text-red-600" :
                                "text-text-tertiary"
                            }`}>
                                {card.change}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}