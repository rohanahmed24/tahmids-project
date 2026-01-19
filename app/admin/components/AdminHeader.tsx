"use client";

import { motion } from "framer-motion";
import { Search, Sun, Moon, Bell, Menu } from "lucide-react";
import { useTheme } from "next-themes";

interface AdminHeaderProps {
    onMenuClick: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    user?: {
        name?: string;
        email?: string;
        image?: string;
    };
}

export function AdminHeader({ onMenuClick, searchQuery, setSearchQuery, user }: AdminHeaderProps) {
    const { theme, setTheme } = useTheme();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-30 bg-bg-primary/80 backdrop-blur-xl border-b border-border-primary px-4 lg:px-8 py-4"
        >
            <div className="flex items-center justify-between gap-4">
                {/* Mobile Menu Trigger & Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="relative w-full max-w-md hidden sm:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search users, articles..."
                            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-accent-main focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 bg-bg-secondary border border-border-primary rounded-xl hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button className="relative p-2 bg-bg-secondary border border-border-primary rounded-xl hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-secondary" />
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-border-primary">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="hidden sm:block">
                            <p className="font-medium text-sm text-text-primary">{user?.name || "Admin"}</p>
                            <p className="text-xs text-text-secondary">Super Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search - Visible only on mobile below header */}
            <div className="mt-4 sm:hidden">
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-primary rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-accent-main focus:outline-none transition-colors"
                    />
                </div>
            </div>
        </motion.header>
    );
}
