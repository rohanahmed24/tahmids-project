"use client";

import { PlusCircle, Upload, Settings, BarChart3, Users, Image, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function QuickActions() {
    const actions = [
        {
            title: "New Article",
            description: "Create a new blog post",
            icon: PlusCircle,
            href: "/admin/write",
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
            hoverColor: "group-hover:from-blue-600 group-hover:to-blue-700",
            shadowColor: "shadow-blue-500/25 group-hover:shadow-blue-500/40"
        },
        {
            title: "Media Library",
            description: "Manage images and files",
            icon: Image,
            href: "/admin/media",
            color: "bg-gradient-to-br from-emerald-500 to-green-600",
            hoverColor: "group-hover:from-emerald-600 group-hover:to-green-700",
            shadowColor: "shadow-green-500/25 group-hover:shadow-green-500/40"
        },
        {
            title: "Analytics",
            description: "View detailed statistics",
            icon: BarChart3,
            href: "/admin/analytics",
            color: "bg-gradient-to-br from-purple-500 to-violet-600",
            hoverColor: "group-hover:from-purple-600 group-hover:to-violet-700",
            shadowColor: "shadow-purple-500/25 group-hover:shadow-purple-500/40"
        },
        {
            title: "User Management",
            description: "Manage user accounts",
            icon: Users,
            href: "/admin/users",
            color: "bg-gradient-to-br from-orange-500 to-amber-600",
            hoverColor: "group-hover:from-orange-600 group-hover:to-amber-700",
            shadowColor: "shadow-orange-500/25 group-hover:shadow-orange-500/40"
        },
        {
            title: "Import Content",
            description: "Bulk import articles",
            icon: Upload,
            href: "/admin/import",
            color: "bg-gradient-to-br from-indigo-500 to-blue-600",
            hoverColor: "group-hover:from-indigo-600 group-hover:to-blue-700",
            shadowColor: "shadow-indigo-500/25 group-hover:shadow-indigo-500/40"
        },
        {
            title: "Settings",
            description: "Configure your site",
            icon: Settings,
            href: "/admin/settings",
            color: "bg-gradient-to-br from-slate-500 to-gray-600",
            hoverColor: "group-hover:from-slate-600 group-hover:to-gray-700",
            shadowColor: "shadow-slate-500/25 group-hover:shadow-slate-500/40"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-bg-secondary border border-border-primary rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Quick Actions</h2>
                <span className="text-xs text-text-tertiary hidden sm:block">Navigate to any section</span>
            </div>

            {/* Mobile: Horizontal Scroll | Tablet: 3 cols | Desktop: 6 cols */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar
                    sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible sm:pb-0
                    lg:grid-cols-6 lg:gap-4"
            >
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <motion.div key={index} variants={itemVariants} className="snap-start">
                            <Link
                                href={action.href}
                                className={`group flex flex-col items-center min-w-[100px] sm:min-w-0
                                    p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-border-primary
                                    hover:border-transparent transition-all duration-300
                                    hover:shadow-lg ${action.shadowColor}
                                    bg-bg-primary/50 hover:bg-bg-primary
                                    active:scale-95 sm:active:scale-100`}
                            >
                                <div className={`p-2.5 sm:p-3 rounded-xl text-white transition-all duration-300
                                    ${action.color} ${action.hoverColor} shadow-lg ${action.shadowColor}
                                    group-hover:scale-110 group-hover:-translate-y-0.5`}>
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>

                                <h3 className="font-medium text-text-primary text-xs sm:text-sm text-center mt-2.5 sm:mt-3 mb-0.5 sm:mb-1
                                    group-hover:text-accent-primary transition-colors line-clamp-1">
                                    {action.title}
                                </h3>

                                <p className="text-[10px] sm:text-xs text-text-secondary text-center line-clamp-2 leading-tight hidden sm:block">
                                    {action.description}
                                </p>

                                {/* Hover Arrow Indicator - Desktop Only */}
                                <div className="hidden lg:flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100
                                    transform translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                                    <ChevronRight className="w-4 h-4 text-accent-primary" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Mobile Scroll Indicator */}
            <div className="flex justify-center gap-1.5 mt-3 sm:hidden">
                {actions.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-border-primary" />
                ))}
            </div>
        </div>
    );
}