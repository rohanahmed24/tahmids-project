"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Play } from "lucide-react";

interface MediaOptionsProps {
    slug: string;
    variant?: "default" | "compact" | "overlay";
    className?: string;
}

export function MediaOptions({ slug, variant = "default", className = "" }: MediaOptionsProps) {
    const options = [
        {
            id: "read",
            label: "Read",
            icon: BookOpen,
            href: `/article/${slug}`,
            color: "bg-blue-500 hover:bg-blue-600",
            hoverColor: "group-hover:text-blue-400",
        },
        {
            id: "listen",
            label: "Listen",
            icon: Headphones,
            href: `/article/${slug}?mode=listen`,
            color: "bg-purple-500 hover:bg-purple-600",
            hoverColor: "group-hover:text-purple-400",
        },
        {
            id: "watch",
            label: "Watch",
            icon: Play,
            href: `/article/${slug}?mode=watch`,
            color: "bg-red-500 hover:bg-red-600",
            hoverColor: "group-hover:text-red-400",
        },
    ];

    if (variant === "compact") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {options.map((option) => (
                    <Link
                        key={option.id}
                        href={option.href}
                        onClick={(e) => e.stopPropagation()}
                        className="group"
                        aria-label={option.label}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full ${option.color} flex items-center justify-center text-white shadow-lg transition-colors`}
                            title={option.label}
                        >
                            <option.icon className="w-4 h-4" />
                        </motion.div>
                    </Link>
                ))}
            </div>
        );
    }

    if (variant === "overlay") {
        return (
            <div className={`flex flex-wrap items-center gap-2 md:gap-3 ${className}`}>
                {options.map((option) => (
                    <Link
                        key={option.id}
                        href={option.href}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={option.label}
                    >
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 md:px-5 md:py-3 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all min-w-[80px] justify-center"
                        >
                            <option.icon className="w-4 h-4" />
                            <span className="hidden xs:inline">{option.label}</span>
                        </motion.div>
                    </Link>
                ))}
            </div>
        );
    }

    // Default variant
    return (
        <div className={`flex flex-wrap items-center gap-2 ${className}`}>
            {options.map((option) => (
                <Link
                    key={option.id}
                    href={option.href}
                    onClick={(e) => e.stopPropagation()}
                    className="group"
                    aria-label={option.label}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 ${option.color} px-4 py-2.5 rounded-full text-white text-sm font-medium transition-colors shadow-sm min-h-[44px]`}
                    >
                        <option.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{option.label}</span>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}

