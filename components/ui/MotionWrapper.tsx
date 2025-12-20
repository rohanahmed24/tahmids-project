'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

type AnimationType = 'fade-in' | 'slide-up' | 'scale-in' | 'stagger-container' | 'reveal-text';

interface MotionWrapperProps {
    children: ReactNode;
    type?: AnimationType;
    delay?: number;
    duration?: number;
    className?: string;
    viewport?: { once?: boolean; amount?: number };
}

export const MotionWrapper = ({
    children,
    type = 'fade-in',
    delay = 0,
    duration = 0.5,
    className,
    viewport = { once: true, amount: 0.2 },
}: MotionWrapperProps) => {

    const variants: Record<AnimationType, Variants> = {
        'fade-in': {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration, delay, ease: 'easeOut' } },
        },
        'slide-up': {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration, delay, ease: 'easeOut' } },
        },
        'scale-in': {
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration, delay, ease: 'easeOut' } },
        },
        'stagger-container': {
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: delay } },
        },
        'reveal-text': {
            hidden: { opacity: 0, y: '100%' },
            visible: { opacity: 1, y: 0, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] } }, // Custom ease
        }
    };

    if (type === 'stagger-container') {
        return (
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={variants['stagger-container']}
                className={className}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={variants[type]}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const MotionItem = ({ children, className }: { children: ReactNode; className?: string }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };
    return <motion.div variants={itemVariants} className={className}>{children}</motion.div>;
};
