"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, LogOut, X, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
    id: string; // Used as href now
    label: string;
    icon: LucideIcon;
}

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    navItems: NavItem[];
    handleLogout: () => void;
    siteName: string;
}

export function AdminSidebar({
    isOpen,
    onClose,
    navItems,
    handleLogout,
    siteName
}: AdminSidebarProps) {

    return (
        <>
            {/* Desktop Sidebar - Fixed */}
            <aside className="hidden lg:flex w-72 bg-bg-secondary border-r border-border-primary flex-col fixed inset-y-0 z-40">
                <SidebarContent
                    navItems={navItems}
                    handleLogout={handleLogout}
                    siteName={siteName}
                    onClose={onClose}
                />
            </aside>

            {/* Mobile Sidebar - Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-bg-secondary border-r border-border-primary shadow-2xl h-full flex flex-col"
                        >
                            {/* Close Button Mobile */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary bg-bg-primary rounded-lg z-50"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <SidebarContent
                                navItems={navItems}
                                handleLogout={handleLogout}
                                siteName={siteName}
                                onClose={onClose}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

interface SidebarContentProps {
    navItems: NavItem[];
    handleLogout: () => void;
    siteName: string;
    onClose: () => void;
}

function SidebarContent({ navItems, handleLogout, siteName, onClose }: SidebarContentProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full text-text-primary">
            {/* Logo */}
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/20">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Admin Panel</h1>
                        <p className="text-xs text-text-secondary truncate max-w-[140px]">{siteName}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto hide-scrollbar">
                {navItems.map((item) => {
                    // Check active state: exact match or starts with (for nested routes)
                    // Excluding exact match for Dashboard to avoid highlighting everything
                    const isActive = item.id === '/admin/dashboard'
                        ? pathname === item.id
                        : pathname.startsWith(item.id);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            href={item.id}
                            onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-accent-main/10 text-accent-main font-medium"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-6 bg-accent-main rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                            <Icon className={`w-5 h-5 ${isActive ? "text-accent-main" : "text-text-muted group-hover:text-text-primary"}`} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border-primary bg-bg-secondary/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}

