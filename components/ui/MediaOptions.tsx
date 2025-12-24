"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Play } from "lucide-react";

interface MediaOptionsProps {
    slug: string;
    variant?: "default" | "compact" | "overlay" | "minimal" | "prominent";
    className?: string;
}

export function MediaOptions({ slug, variant = "default", className = "" }: MediaOptionsProps) {
    const router = useRouter();

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

    const handleClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(href);
    };

    // Prominent variant - Labeled icons for mobile hero/sliders
    if (variant === "prominent") {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                {options.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={(e) => handleClick(e, option.href)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium text-xs transition-all"
                        aria-label={option.label}
                    >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                    </motion.button>
                ))}
            </div>
        );
    }

    // Compact/Minimal variant - Subtle icons for grid cards
    if (variant === "minimal" || variant === "compact") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {options.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={(e) => handleClick(e, option.href)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white/50 hover:text-white border border-white/10 transition-all"
                        aria-label={option.label}
                        title={option.label}
                    >
                        <option.icon className="w-3.5 h-3.5" />
                    </motion.button>
                ))}
            </div>
        );
    }

    if (variant === "overlay") {
        return (
            <div className={`flex flex-wrap items-center gap-3 ${className}`}>
                {options.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={(e) => handleClick(e, option.href)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all min-h-[44px]"
                        aria-label={option.label}
                    >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                    </motion.button>
                ))}
            </div>
        );
    }

    // Default variant - subtle pills with mobile touch targets
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {options.map((option) => (
                <motion.button
                    key={option.id}
                    onClick={(e) => handleClick(e, option.href)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 bg-bg-secondary hover:bg-bg-tertiary border border-border-subtle px-4 py-2 rounded-full text-text-secondary hover:text-text-primary text-xs font-medium transition-all min-h-[36px]"
                    aria-label={option.label}
                >
                    <option.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{option.label}</span>
                </motion.button>
            ))}
        </div>
    );
}




