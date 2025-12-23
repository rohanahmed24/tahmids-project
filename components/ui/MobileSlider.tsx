"use client";

import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useEffect, useState, ReactNode } from "react";

interface MobileSliderProps {
    children: ReactNode[];
    autoplayInterval?: number; // ms, 0 to disable
    cardWidth?: number; // default 300
    gap?: number; // default 16
    className?: string;
    marquee?: boolean; // Enable continuous marquee mode
    marqueeSpeed?: number; // Pixels per second, default 30
}

export function MobileSlider({
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autoplayInterval = 0,
    cardWidth = 300,
    gap = 16,
    className = "",
    marquee = false,
    marqueeSpeed = 30
}: MobileSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const x = useMotionValue(0);
    // Smoother spring with lower stiffness and higher damping
    const springX = useSpring(x, { stiffness: 100, damping: 25, mass: 0.5 });

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
        if (!marquee || isPaused || children.length <= 1) return;

        const duration = (totalWidth / marqueeSpeed);

        const controls = animate(x, [0, -totalWidth], {
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
        });

        return () => controls.stop();
    }, [marquee, isPaused, marqueeSpeed, totalWidth, x, children.length]);

    // For marquee mode, duplicate children for seamless loop
    const displayChildren = marquee ? [...children, ...children] : children;

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden touch-pan-y ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setTimeout(() => setIsPaused(false), 3000)}
        >
            <motion.div
                className="flex cursor-grab active:cursor-grabbing"
                style={{ x: marquee ? x : springX, gap }}
                drag={!marquee ? "x" : false}
                dragConstraints={{ left: maxDrag, right: 0 }}
                dragElastic={0.05}
                dragTransition={{
                    bounceStiffness: 100,
                    bounceDamping: 20,
                    power: 0.3,
                    timeConstant: 200
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

