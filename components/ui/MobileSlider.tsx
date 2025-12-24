"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useRef, useEffect, useState, ReactNode } from "react";

interface MobileSliderProps {
    children: ReactNode[];
    autoplayInterval?: number; // ms, 0 to disable
    cardWidthPercent?: number; // percentage of container width, default 80
    gap?: number; // default 16
    className?: string;
    marquee?: boolean; // Enable continuous marquee mode
    marqueeSpeed?: number; // Pixels per second, default 30
}

export function MobileSlider({
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autoplayInterval = 0,
    cardWidthPercent = 80,
    gap = 16,
    className = "",
    marquee = false,
    marqueeSpeed = 30
}: MobileSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const x = useMotionValue(0);

    // Calculate card width as percentage of container
    const cardWidth = (containerWidth * cardWidthPercent) / 100;
    const totalWidth = children.length * (cardWidth + gap) - gap;
    const maxDrag = Math.min(0, -(totalWidth - containerWidth + 24)); // 24px padding

    // Update container width on resize
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    // Marquee continuous scroll effect
    useEffect(() => {
        if (!marquee || isPaused || children.length <= 1 || cardWidth === 0) return;

        const duration = (totalWidth / marqueeSpeed);

        const controls = animate(x, [0, -totalWidth], {
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
        });

        return () => controls.stop();
    }, [marquee, isPaused, marqueeSpeed, totalWidth, x, children.length, cardWidth]);

    // For marquee mode, duplicate children for seamless loop
    const displayChildren = marquee ? [...children, ...children] : children;

    // Don't render cards until we have container width
    if (containerWidth === 0) {
        return (
            <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
                <div className="flex" style={{ gap }}>
                    {children.map((child, index) => (
                        <div key={index} className="flex-shrink-0 w-4/5">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden touch-none ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
            <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                style={{ x, gap }}
                drag={!marquee ? "x" : false}
                dragConstraints={{ left: maxDrag, right: 0 }}
                dragElastic={0.1}
                dragMomentum={true}
                dragTransition={{
                    power: 0.3,
                    timeConstant: 400,
                    bounceDamping: 20,
                    bounceStiffness: 300,
                    modifyTarget: (target) => {
                        // Snap to card positions for smoother feel
                        const snapInterval = cardWidth + gap;
                        const snappedTarget = Math.round(target / snapInterval) * snapInterval;
                        return Math.max(maxDrag, Math.min(0, snappedTarget));
                    }
                }}
            >
                {displayChildren.map((child, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0"
                        style={{ width: cardWidth }}
                    >
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
