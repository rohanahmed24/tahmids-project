"use client";

import { PlusCircle, Upload, Settings, BarChart3, Users, Image } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    const actions = [
        {
            title: "New Article",
            description: "Create a new blog post",
            icon: PlusCircle,
            href: "/admin/write",
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            title: "Media Library",
            description: "Manage images and files",
            icon: Image,
            href: "/admin/media",
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            title: "Analytics",
            description: "View detailed statistics",
            icon: BarChart3,
            href: "/admin/analytics",
            color: "bg-purple-500 hover:bg-purple-600"
        },
        {
            title: "User Management",
            description: "Manage user accounts",
            icon: Users,
            href: "/admin/users",
            color: "bg-orange-500 hover:bg-orange-600"
        },
        {
            title: "Import Content",
            description: "Bulk import articles",
            icon: Upload,
            href: "/admin/import",
            color: "bg-indigo-500 hover:bg-indigo-600"
        },
        {
            title: "Settings",
            description: "Configure your site",
            icon: Settings,
            href: "/admin/settings",
            color: "bg-gray-500 hover:bg-gray-600"
        }
    ];

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-6">Quick Actions</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={index}
                            href={action.href}
                            className="group flex flex-col items-center p-4 rounded-lg border border-border-primary hover:border-accent-primary/50 transition-all duration-200 hover:shadow-md"
                        >
                            <div className={`p-3 rounded-lg text-white transition-colors ${action.color} mb-3`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-medium text-text-primary text-sm text-center mb-1 group-hover:text-accent-primary transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-xs text-text-secondary text-center">
                                {action.description}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}