"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Play } from "lucide-react";

interface MediaOptionsProps {
    slug: string;
    variant?: "default" | "compact" | "overlay" | "minimal";
    className?: string;
}

export function MediaOptions({ slug, variant = "default", className = "" }: MediaOptionsProps) {
    const options = [
        {
            id: "read",
            label: "Read",
            icon: BookOpen,
            href: `/article/${slug}`,
        },
        {
            id: "listen",
            label: "Listen",
            icon: Headphones,
            href: `/article/${slug}?mode=listen`,
        },
        {
            id: "watch",
            label: "Watch",
            icon: Play,
            href: `/article/${slug}?mode=watch`,
        },
    ];

    // Compact/Minimal variant - subtle icons with proper mobile touch targets
    if (variant === "minimal" || variant === "compact") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {options.map((option) => (
                    <Link
                        key={option.id}
                        href={option.href}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={option.label}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
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
            <div className={`flex flex-wrap items-center gap-3 ${className}`}>
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
                            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all min-h-[44px]"
                        >
                            <option.icon className="w-4 h-4" />
                            {option.label}
                        </motion.div>
                    </Link>
                ))}
            </div>
        );
    }

    // Default variant - subtle pills with mobile touch targets
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {options.map((option) => (
                <Link
                    key={option.id}
                    href={option.href}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={option.label}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-1.5 bg-bg-secondary hover:bg-bg-tertiary border border-border-subtle px-4 py-2 rounded-full text-text-secondary hover:text-text-primary text-xs font-medium transition-all min-h-[36px]"
                    >
                        <option.icon className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{option.label}</span>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}



