"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, LogOut, X, LucideIcon, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
    id: string;
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
                    isMobile={false}
                />
            </aside>

            {/* Mobile Sidebar - Drawer with gestures */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop with blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "-100%", opacity: 0.5 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0.5 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={{ left: 0.2, right: 0 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -100 || info.velocity.x < -500) {
                                    onClose();
                                }
                            }}
                            className="lg:hidden fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[300px] bg-bg-secondary
                                border-r border-border-primary shadow-2xl shadow-black/50 h-full flex flex-col
                                rounded-r-2xl overflow-hidden"
                        >
                            {/* Drag Handle Indicator */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-border-primary rounded-full opacity-30" />

                            {/* Close Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2.5 text-text-secondary hover:text-text-primary
                                    bg-bg-tertiary/80 rounded-xl z-50 backdrop-blur-sm"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>

                            <SidebarContent
                                navItems={navItems}
                                handleLogout={handleLogout}
                                siteName={siteName}
                                onClose={onClose}
                                isMobile={true}
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
    isMobile: boolean;
}

function SidebarContent({ navItems, handleLogout, siteName, onClose, isMobile }: SidebarContentProps) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full text-text-primary">
            {/* Logo Header */}
            <div className={`${isMobile ? 'p-5 pt-6' : 'p-6'} border-b border-border-primary bg-gradient-to-br from-bg-secondary to-bg-tertiary/30`}>
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-11 h-11 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500
                            rounded-xl flex items-center justify-center flex-shrink-0
                            shadow-lg shadow-purple-500/30"
                    >
                        <Shield className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-lg text-text-primary">Admin Panel</h1>
                        <p className="text-xs text-text-tertiary truncate">{siteName}</p>
                    </div>
                </div>

                {/* Quick Stats Banner - Mobile Only */}
                {isMobile && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 p-3 bg-accent-primary/10 rounded-xl border border-accent-primary/20"
                    >
                        <div className="flex items-center gap-2 text-xs text-accent-primary">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium">All systems operational</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className={`flex-1 ${isMobile ? 'p-3' : 'p-4'} space-y-1 overflow-y-auto hide-scrollbar`}>
                {navItems.map((item, index) => {
                    const isActive = item.id === '/admin/dashboard'
                        ? pathname === item.id
                        : pathname.startsWith(item.id);
                    const Icon = item.icon;

                    return (
                        <motion.div
                            key={item.id}
                            initial={isMobile ? { opacity: 0, x: -20 } : false}
                            animate={isMobile ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: isMobile ? 0.1 + index * 0.03 : 0 }}
                        >
                            <Link
                                href={item.id}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-200 group relative active:scale-[0.98]
                                    ${isActive
                                        ? "bg-accent-main/10 text-accent-main font-medium shadow-sm"
                                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"}`}
                            >
                                <div className="flex items-center gap-3">
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1 h-6 bg-accent-main rounded-r-full"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    )}
                                    <div className={`p-1.5 rounded-lg transition-colors
                                        ${isActive ? "bg-accent-main/20" : "group-hover:bg-bg-tertiary"}`}>
                                        <Icon className={`w-4 h-4 ${isActive ? "text-accent-main" : "text-text-muted group-hover:text-text-primary"}`} />
                                    </div>
                                    <span className="relative z-10">{item.label}</span>
                                </div>

                                {/* Arrow indicator */}
                                <ChevronRight className={`w-4 h-4 transition-all duration-200
                                    ${isActive
                                        ? "text-accent-main opacity-100"
                                        : "text-text-tertiary opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1"}`}
                                />
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className={`${isMobile ? 'p-3 pb-safe-bottom' : 'p-4'} border-t border-border-primary bg-bg-tertiary/30`}>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-text-secondary
                        hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="font-medium">Logout</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>

                {/* Version Badge */}
                <div className="mt-3 px-4 text-center">
                    <span className="text-[10px] text-text-tertiary">v1.0.0 • Admin Dashboard</span>
                </div>
            </div>
        </div>
    );
}

