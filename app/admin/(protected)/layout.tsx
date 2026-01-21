"use client";

import { useState, useEffect } from "react";
import { AdminSidebar, NavItem } from "@/app/admin/components/AdminSidebar";
import { LayoutDashboard, PenTool, Image, Users, BarChart3, Settings, Upload, Menu, X, Bell, Search, Globe } from "lucide-react";
import { logoutAdmin } from "@/actions/admin-auth";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS: NavItem[] = [
    { id: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/admin/write", label: "Write", icon: PenTool },
    { id: "/admin/media", label: "Media", icon: Image },
    { id: "/admin/users", label: "Users", icon: Users },
    { id: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { id: "/admin/seo", label: "SEO", icon: Globe },
    { id: "/admin/import", label: "Import", icon: Upload },
    { id: "/admin/navbar", label: "Navbar", icon: Settings },
    { id: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll for header blur effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close sidebar on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsSidebarOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isSidebarOpen]);

    const handleLogout = async () => {
        await logoutAdmin();
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex">
            <AdminSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navItems={NAV_ITEMS}
                handleLogout={handleLogout}
                siteName="The Wisdomia"
            />

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
                {/* Enhanced Mobile Header */}
                <header className={`lg:hidden sticky top-0 z-30 transition-all duration-300 safe-top
                    ${isScrolled
                        ? "bg-bg-secondary/80 backdrop-blur-xl border-b border-border-primary shadow-sm"
                        : "bg-bg-secondary border-b border-border-primary"}`}
                >
                    <div className="flex items-center justify-between px-3 sm:px-4 h-14 sm:h-16">
                        {/* Left: Menu & Title */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsSidebarOpen(true)}
                                className="p-2 -ml-2 text-text-secondary hover:text-text-primary rounded-xl
                                    hover:bg-bg-tertiary active:bg-bg-tertiary/70 transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.button>
                            <div>
                                <h1 className="font-bold text-base sm:text-lg text-text-primary">Admin</h1>
                                <p className="text-[10px] text-text-tertiary hidden sm:block">Dashboard</p>
                            </div>
                        </div>

                        {/* Right: Quick Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-text-secondary hover:text-text-primary rounded-xl
                                    hover:bg-bg-tertiary transition-colors relative"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-text-secondary hover:text-text-primary rounded-xl
                                    hover:bg-bg-tertiary transition-colors relative"
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Mobile Search Bar - Expandable */}
                    <AnimatePresence>
                        {isScrolled && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-3 sm:px-4 pb-3 overflow-hidden"
                            >
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                                    <input
                                        type="text"
                                        placeholder="Quick search..."
                                        className="w-full pl-9 pr-4 py-2 bg-bg-tertiary/50 border border-border-primary
                                            rounded-xl text-sm placeholder:text-text-tertiary focus:outline-none
                                            focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary/50"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                {/* Page Content with safe areas */}
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>

                {/* Mobile Bottom Safe Area */}
                <div className="h-safe-bottom lg:hidden" />
            </div>
        </div>
    );
}
