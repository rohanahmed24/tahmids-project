"use client";

import { motion, useMotionValue, animate, useAnimation, PanInfo } from "framer-motion";
import { useRef, useEffect, useState, ReactNode, useCallback } from "react";

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
    autoplayInterval = 4000,
    cardWidthPercent = 80,
    gap = 16,
    className = "",
    marquee = false,
    marqueeSpeed = 30
}: MobileSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const x = useMotionValue(0);
    const controls = useAnimation();

    // Calculate card width as percentage of container
    const cardWidth = (containerWidth * cardWidthPercent) / 100;
    const totalWidth = children.length * (cardWidth + gap) - gap;
    const maxDrag = Math.min(0, -(totalWidth - containerWidth + 24));

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

    // Scroll to specific index with smooth animation
    const scrollToIndex = useCallback((index: number) => {
        if (cardWidth === 0) return;
        const targetX = -(index * (cardWidth + gap));
        const clampedX = Math.max(maxDrag, Math.min(0, targetX));

        animate(x, clampedX, {
            type: "spring",
            stiffness: 300,
            damping: 30,
        });
        setCurrentIndex(index);
    }, [cardWidth, gap, maxDrag, x]);

    // Auto-slide effect (when not marquee mode)
    useEffect(() => {
        if (marquee || isPaused || children.length <= 1 || autoplayInterval === 0 || cardWidth === 0) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % children.length;
            scrollToIndex(nextIndex);
        }, autoplayInterval);

        return () => clearInterval(interval);
    }, [marquee, currentIndex, isPaused, autoplayInterval, children.length, scrollToIndex, cardWidth]);

    // Marquee continuous scroll effect
    useEffect(() => {
        if (!marquee || isPaused || children.length <= 1 || cardWidth === 0) return;

        const duration = (totalWidth / marqueeSpeed);

        const marqueeControls = animate(x, [0, -totalWidth], {
            duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
        });

        return () => marqueeControls.stop();
    }, [marquee, isPaused, marqueeSpeed, totalWidth, x, children.length, cardWidth]);

    // Handle drag end with smooth snapping
    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (marquee) return;

        const velocity = info.velocity.x;
        const offset = info.offset.x;
        const snapInterval = cardWidth + gap;

        let newIndex = currentIndex;

        // Fast swipe detection
        if (Math.abs(velocity) > 500) {
            newIndex = velocity > 0 ? currentIndex - 1 : currentIndex + 1;
        } else if (Math.abs(offset) > cardWidth / 4) {
            // Slow drag past threshold
            newIndex = offset > 0 ? currentIndex - 1 : currentIndex + 1;
        } else {
            // Snap back to current
            const currentX = x.get();
            newIndex = Math.round(-currentX / snapInterval);
        }

        // Clamp index
        newIndex = Math.max(0, Math.min(children.length - 1, newIndex));
        scrollToIndex(newIndex);
    };

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
            className={`relative overflow-hidden ${className}`}
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
                dragElastic={0.15}
                dragMomentum={false}
                onDragEnd={handleDragEnd}
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

            {/* Pagination dots */}
            {!marquee && children.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollToIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                    ? "bg-accent w-6"
                                    : "bg-white/30 hover:bg-white/50"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

