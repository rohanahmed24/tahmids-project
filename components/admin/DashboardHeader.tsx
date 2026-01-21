"use client";

import { Bell, Search, Settings, LogOut, Calendar, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { logoutAdmin } from "@/actions/admin-auth";
import { useState } from "react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Get current date formatted
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    });

    // Get greeting based on time
    const hour = today.getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    return (
        <header className="bg-bg-secondary border border-border-primary rounded-xl sm:rounded-2xl overflow-hidden shadow-sm">
            {/* Main Header Content */}
            <div className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
                    {/* Welcome Section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                            {/* Avatar - Larger on desktop */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent-primary to-purple-600
                                    rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-accent-primary/25 shrink-0"
                            >
                                <span className="text-white text-lg sm:text-xl font-bold">
                                    {user.name?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            </motion.div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary truncate">
                                        {greeting}, {user.name?.split(' ')[0] || 'Admin'}
                                    </h1>
                                    <span className="text-lg sm:text-xl hidden sm:inline">👋</span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-text-tertiary" />
                                    <p className="text-xs sm:text-sm text-text-secondary">
                                        {dateString}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search - Expandable on mobile */}
                    <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto order-last lg:order-none">
                        <motion.div
                            className={`relative flex-1 lg:flex-none transition-all duration-300 ${
                                isSearchFocused ? 'lg:w-80' : 'lg:w-64'
                            }`}
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search articles, users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-bg-primary border border-border-primary rounded-xl
                                    focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary
                                    text-sm placeholder:text-text-tertiary transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                                >
                                    ×
                                </button>
                            )}
                        </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        {/* Notifications */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="relative p-2.5 sm:p-2 text-text-secondary hover:text-text-primary
                                hover:bg-bg-tertiary rounded-xl transition-colors"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </motion.button>

                        {/* Settings */}
                        <Link
                            href="/admin/settings"
                            className="p-2.5 sm:p-2 text-text-secondary hover:text-text-primary
                                hover:bg-bg-tertiary rounded-xl transition-colors"
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </Link>

                        {/* Divider */}
                        <div className="w-px h-6 bg-border-primary mx-1 hidden sm:block" />

                        {/* Logout */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => logoutAdmin()}
                            className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-red-500
                                hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden md:inline">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Status Bar - Mobile friendly */}
            <div className="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 border-t border-border-primary bg-bg-tertiary/30
                flex items-center justify-between overflow-x-auto hide-scrollbar gap-4">
                <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm shrink-0">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-text-secondary whitespace-nowrap">System Online</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-text-tertiary">
                        <span>Last sync: Just now</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] sm:text-xs text-text-tertiary px-2 py-1 bg-bg-secondary rounded-full">
                        Admin Dashboard v1.0
                    </span>
                </div>
            </div>
        </header>
    );
}