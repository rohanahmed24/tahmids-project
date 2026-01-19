"use client";

import { Bell, Search, Settings, LogOut } from "lucide-react";
import { logoutAdmin } from "@/actions/admin-auth";
import { useState } from "react";

interface DashboardHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <header className="bg-bg-secondary border border-border-primary rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-text-secondary mt-1">
                        Here's what's happening with your content today
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search articles, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent w-64"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Settings */}
                    <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                                {user.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <button
                            onClick={() => logoutAdmin()}
                            className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}