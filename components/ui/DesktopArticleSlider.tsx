"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DesktopArticleSliderProps {
    topRowChildren: ReactNode[];
    bottomRowChildren: ReactNode[];
    className?: string;
}

export function DesktopArticleSlider({
    topRowChildren,
    bottomRowChildren,
    className = "",
}: DesktopArticleSliderProps) {
    // Animation variants for staggered children
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const topRowItemVariants = {
        hidden: {
            x: -60,
            opacity: 0
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.8,
            }
        },
    };

    const bottomRowItemVariants = {
        hidden: {
            x: 60,
            opacity: 0
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.8,
            }
        },
    };

    return (
        <div className={`space-y-12 ${className}`}>
            {/* Top Row - Slides from Left */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-4 gap-x-8"
            >
                {topRowChildren.map((child, index) => (
                    <motion.div key={index} variants={topRowItemVariants}>
                        {child}
                    </motion.div>
                ))}
            </motion.div>

            {/* Bottom Row - Slides from Right */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-4 gap-x-8"
            >
                {bottomRowChildren.map((child, index) => (
                    <motion.div key={index} variants={bottomRowItemVariants}>
                        {child}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
