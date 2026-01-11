"use client";

import { Activity, FileText, User, Eye, Edit } from "lucide-react";

export function RecentActivity() {
    // This would come from a real activity log in production
    const activities = [
        {
            id: 1,
            type: "post_created",
            user: "Editorial Team",
            action: "created a new article",
            target: "Welcome to Wisdomia",
            time: "2 hours ago",
            icon: FileText,
            color: "text-green-500"
        },
        {
            id: 2,
            type: "user_registered",
            user: "Sarah Johnson",
            action: "registered as a new user",
            target: null,
            time: "4 hours ago",
            icon: User,
            color: "text-blue-500"
        },
        {
            id: 3,
            type: "post_viewed",
            user: "Anonymous",
            action: "viewed article",
            target: "Future of Digital Journalism",
            time: "6 hours ago",
            icon: Eye,
            color: "text-purple-500"
        },
        {
            id: 4,
            type: "post_edited",
            user: "Dr. Michael Chen",
            action: "updated article",
            target: "Ancient Civilizations",
            time: "1 day ago",
            icon: Edit,
            color: "text-orange-500"
        },
        {
            id: 5,
            type: "user_registered",
            user: "Robert Williams",
            action: "registered as a new user",
            target: null,
            time: "2 days ago",
            icon: User,
            color: "text-blue-500"
        }
    ];

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
                {activities.map((activity) => {
                    const Icon = activity.icon;
                    
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
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="p-4 border-t border-border-primary">
                <button className="w-full text-center text-accent-primary hover:text-accent-primary/80 text-sm font-medium">
                    View All Activity
                </button>
            </div>
        </div>
    );
}