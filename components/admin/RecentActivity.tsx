"use client";

import { Activity, FileText, UserPlus, Clock, ChevronRight } from "lucide-react";
import { ActivityItem } from "@/lib/activity";
import { motion } from "framer-motion";

interface RecentActivityProps {
    activities: ActivityItem[];
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const iconMap: Record<string, typeof FileText> = {
        "file-text": FileText,
        "user-plus": UserPlus
    };

    const getActivityColor = (iconName: string) => {
        switch (iconName) {
            case "file-text": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
            case "user-plus": return "bg-green-500/10 text-green-600 dark:text-green-400";
            default: return "bg-purple-500/10 text-purple-600 dark:text-purple-400";
        }
    };

    return (
        <div className="bg-bg-secondary rounded-xl sm:rounded-2xl border border-border-primary overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-4 sm:p-5 md:p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-accent-primary/10">
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-accent-primary" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-text-primary">
                                Recent Activity
                            </h2>
                            <p className="text-[10px] sm:text-xs text-text-tertiary hidden sm:block">
                                Latest updates across your site
                            </p>
                        </div>
                    </div>
                    {activities.length > 0 && (
                        <span className="px-2 py-1 bg-bg-tertiary rounded-full text-[10px] sm:text-xs text-text-secondary font-medium">
                            {activities.length} new
                        </span>
                    )}
                </div>
            </div>

            {/* Activity List */}
            <div className="divide-y divide-border-primary/50">
                {activities.length === 0 ? (
                    <div className="p-6 sm:p-8 text-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-text-tertiary" />
                        </div>
                        <p className="text-text-secondary text-sm font-medium">No recent activity</p>
                        <p className="text-text-tertiary text-xs mt-1">Activity will appear here when things happen</p>
                    </div>
                ) : (
                    activities.slice(0, 5).map((activity, index) => {
                        const Icon = iconMap[activity.iconName] || Activity;

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-start gap-3 p-3 sm:p-4 hover:bg-bg-tertiary/30 transition-colors cursor-pointer group"
                            >
                                {/* Icon */}
                                <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${getActivityColor(activity.iconName)}
                                    group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-text-primary leading-relaxed">
                                        <span className="font-semibold">{activity.user}</span>
                                        <span className="text-text-secondary"> {activity.action}</span>
                                        {activity.target && (
                                            <span className="font-medium text-accent-primary"> &quot;{activity.target}&quot;</span>
                                        )}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-text-tertiary mt-0.5 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {timeAgo(activity.time)}
                                    </p>
                                </div>

                                {/* Hover Indicator */}
                                <ChevronRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100
                                    transition-all transform translate-x-0 group-hover:translate-x-1 shrink-0 hidden sm:block" />
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            {activities.length > 0 && (
                <div className="p-3 sm:p-4 border-t border-border-primary bg-bg-tertiary/20">
                    <button className="w-full flex items-center justify-center gap-2 text-accent-primary
                        hover:text-accent-primary/80 text-xs sm:text-sm font-medium py-1.5 sm:py-2
                        rounded-lg hover:bg-accent-primary/5 transition-colors">
                        View All Activity
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}