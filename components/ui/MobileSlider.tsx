"use client";

import { motion, useMotionValue, useSpring, PanInfo, animate } from "framer-motion";
import { useRef, useEffect, useState, ReactNode, useCallback } from "react";

interface MobileSliderProps {
    children: ReactNode[];
    autoplayInterval?: number; // ms, default 4000
    cardWidth?: number; // default 300
    gap?: number; // default 16
    className?: string;
    marquee?: boolean; // Enable continuous marquee mode
    marqueeSpeed?: number; // Pixels per second, default 30
}

export function MobileSlider({
    children,
    autoplayInterval = 4000,
    cardWidth = 300,
    gap = 16,
    className = "",
    marquee = false,
    marqueeSpeed = 30
}: MobileSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const x = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 300, damping: 30 });

    const totalWidth = children.length * (cardWidth + gap) - gap;
    const maxDrag = -(totalWidth - containerWidth + 24); // 24px padding

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

    // Scroll to specific index
    const scrollToIndex = useCallback((index: number) => {
        const targetX = -(index * (cardWidth + gap));
        const clampedX = Math.max(maxDrag, Math.min(0, targetX));
        x.set(clampedX);
        setCurrentIndex(index);
    }, [cardWidth, gap, maxDrag, x]);

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

    // Regular autoplay (when not in marquee mode)
    useEffect(() => {
        if (marquee || isPaused || children.length <= 1) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % children.length;
            scrollToIndex(nextIndex);
        }, autoplayInterval);

        return () => clearInterval(interval);
    }, [marquee, currentIndex, isPaused, autoplayInterval, children.length, scrollToIndex]);

    // Handle drag end
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        // Calculate which card to snap to based on velocity and offset
        let newIndex = currentIndex;

        if (Math.abs(velocity) > 500) {
            // Fast swipe - go to next/prev
            newIndex = velocity > 0 ? currentIndex - 1 : currentIndex + 1;
        } else if (Math.abs(offset) > cardWidth / 3) {
            // Slow drag past threshold
            newIndex = offset > 0 ? currentIndex - 1 : currentIndex + 1;
        }

        // Clamp index
        newIndex = Math.max(0, Math.min(children.length - 1, newIndex));
        scrollToIndex(newIndex);
    };

    // For marquee mode, duplicate children for seamless loop
    const displayChildren = marquee ? [...children, ...children] : children;

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
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
                dragElastic={0.1}
                onDragEnd={!marquee ? handleDragEnd : undefined}
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

