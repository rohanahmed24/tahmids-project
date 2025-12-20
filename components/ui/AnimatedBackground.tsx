"use client"

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Abstract Polygon Shape 1 */}
            <motion.div
                className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-background-blue/10 to-transparent backdrop-blur-3xl"
                style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Abstract Polygon Shape 2 */}
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-tl from-yellow-500/10 to-transparent backdrop-blur-3xl"
                style={{ clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)" }}
                animate={{
                    rotate: [360, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Floating Triangle */}
            <motion.div
                className="absolute top-[20%] right-[15%] w-24 h-24 bg-gradient-to-r from-background-blue/5 to-purple-500/5 backdrop-blur-md"
                style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                animate={{
                    y: [0, -40, 0],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Floating Hexagon */}
            <motion.div
                className="absolute bottom-[30%] left-[10%] w-20 h-20 bg-gradient-to-br from-yellow-500/5 to-red-500/5 backdrop-blur-md"
                style={{ clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" }}
                animate={{
                    y: [0, 50, 0],
                    rotate: [-45, 45, -45],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}
