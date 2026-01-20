"use client";

import { Activity, FileText, UserPlus } from "lucide-react";
import { ActivityItem } from "@/lib/activity";

interface RecentActivityProps {
    activities: ActivityItem[];
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

export function RecentActivity({ activities }: RecentActivityProps) {
    const iconMap = {
        "file-text": FileText,
        "user-plus": UserPlus
    };

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary">
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-accent-primary" />
                    <h2 className="text-xl font-semibold text-text-primary">
                        Recent Activity
                    </h2>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {activities.length === 0 ? (
                    <p className="text-text-secondary text-sm text-center py-4">No recent activity found.</p>
                ) : (
                    activities.map((activity) => {
                        const Icon = iconMap[activity.iconName] || Activity;

                        return (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-bg-tertiary ${activity.color}`}>
                                    <Icon className="w-4 h-4" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-text-primary">
                                        <span className="font-medium">{activity.user}</span>
                                        {" "}{activity.action}
                                        {activity.target && (
                                            <>
                                                {" "}<span className="font-medium">"{activity.target}"</span>
                                            </>
                                        )}
                                    </p>
                                    <p className="text-xs text-text-tertiary mt-1">
                                        {timeAgo(activity.time)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="p-4 border-t border-border-primary">
                <button className="w-full text-center text-accent-primary hover:text-accent-primary/80 text-sm font-medium">
                    View All Activity
                </button>
            </div>
        </div>
    );
}