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
        <header className="bg-bg-secondary border border-border-primary rounded-xl p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-auto">
                    <h1 className="text-xl md:text-2xl font-bold text-text-primary">
                        Welcome back, {user.name}
                    </h1>
                    <p className="text-sm md:text-base text-text-secondary mt-1">
                        Here's what's happening with your content today
                    </p>
                </div>

                <div className="flex flex-col-reverse md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search articles, users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent w-full md:w-64"
                        />
                    </div>

                </div>

                <div className="flex items-center justify-end w-full md:w-auto gap-4 md:gap-2 border-b md:border-0 border-border-primary pb-4 md:pb-0">
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