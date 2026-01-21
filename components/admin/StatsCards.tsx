"use client";

import { TrendingUp, TrendingDown, Users, FileText, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
            change: stats.monthlyGrowth > 0 ? `+${stats.monthlyGrowth}%` : "No change",
            trend: stats.monthlyGrowth > 0 ? "up" : "neutral",
            icon: Users,
            color: "blue",
            gradient: "from-blue-500/20 via-blue-400/10 to-transparent"
        },
        {
            title: "Published Articles",
            value: stats.publishedArticles.toLocaleString(),
            change: `${stats.draftArticles} drafts`,
            trend: "neutral",
            icon: FileText,
            color: "green",
            gradient: "from-green-500/20 via-green-400/10 to-transparent"
        },
        {
            title: "Total Views",
            value: stats.totalViews.toLocaleString(),
            change: stats.engagementRate > 0 ? `+${stats.engagementRate}% engagement` : "No engagement data",
            trend: stats.engagementRate > 0 ? "up" : "neutral",
            icon: Eye,
            color: "purple",
            gradient: "from-purple-500/20 via-purple-400/10 to-transparent"
        },
        {
            title: "Avg. Read Time",
            value: stats.avgReadTime,
            change: "Based on word count",
            trend: "neutral",
            icon: Clock,
            color: "orange",
            gradient: "from-orange-500/20 via-orange-400/10 to-transparent"
        }
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 shadow-blue-500/10",
            green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 shadow-green-500/10",
            purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 shadow-purple-500/10",
            orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 shadow-orange-500/10"
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    const getAccentColor = (color: string) => {
        const accents = {
            blue: "group-hover:shadow-blue-500/20",
            green: "group-hover:shadow-green-500/20",
            purple: "group-hover:shadow-purple-500/20",
            orange: "group-hover:shadow-orange-500/20"
        };
        return accents[color as keyof typeof accents] || accents.blue;
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                const TrendIcon = card.trend === "up" ? TrendingUp :
                    card.trend === "down" ? TrendingDown : null;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`group relative bg-bg-secondary border border-border-primary rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6
                            hover:shadow-xl transition-all duration-300 overflow-hidden cursor-default
                            hover:border-border-primary/80 hover:-translate-y-0.5 ${getAccentColor(card.color)}`}
                    >
                        {/* Gradient Background Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Header Row - Icon & Trend */}
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <div className={`p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border shadow-sm ${getColorClasses(card.color)}
                                    group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                </div>
                                {TrendIcon && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                            ${card.trend === "up"
                                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
                                    >
                                        <TrendIcon className="w-3 h-3" />
                                        <span className="hidden sm:inline">{card.trend}</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Stats Content */}
                            <div className="space-y-1">
                                <h3 className="text-text-secondary text-[11px] sm:text-xs md:text-sm font-medium uppercase tracking-wide">
                                    {card.title}
                                </h3>
                                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary tracking-tight">
                                    {card.value}
                                </p>
                                <p className={`text-[10px] sm:text-xs md:text-sm truncate ${
                                    card.trend === "up" ? "text-green-600 dark:text-green-400" :
                                    card.trend === "down" ? "text-red-600 dark:text-red-400" :
                                    "text-text-tertiary"
                                }`}>
                                    {card.change}
                                </p>
                            </div>
                        </div>

                        {/* Decorative Corner Accent */}
                        <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-5
                            ${card.color === 'blue' ? 'bg-blue-500' :
                              card.color === 'green' ? 'bg-green-500' :
                              card.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'}
                            group-hover:opacity-10 transition-opacity duration-500`}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}