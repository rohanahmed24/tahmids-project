"use client";

import { motion } from "framer-motion";

export const DecorativeBackgrounds = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top Right Blob */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.4,
                    scale: 1,
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-background-blue blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-20"
            />

            {/* Bottom Left Blob */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: 0.3,
                    scale: 1.1,
                    x: [0, -30, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-purple-400 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-20"
            />

            {/* Center/Random Blob */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 0.2,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute top-[20%] right-[30%] w-[300px] h-[300px] bg-pink-300 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-screen opacity-10"
            />
        </div>
    );
};
