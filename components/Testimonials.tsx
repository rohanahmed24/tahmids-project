"use client";

import { motion } from "framer-motion";

const testimonials = [
    { text: "A masterpiece of digital storytelling.", author: "Design Weekly" },
    { text: "Finally, a platform that respects the reader.", author: "Sarah J." },
    { text: "The future of editorial content.", author: "Tech Insider" },
    { text: "Simple, elegant, and profound.", author: "Modern Arts" },
];

export function Testimonials() {
    return (
        <section className="w-full py-24 overflow-hidden bg-black text-white">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex gap-16 pr-16"
                >
                    {[...testimonials, ...testimonials, ...testimonials].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                            <span className="text-4xl md:text-6xl font-serif font-medium tracking-tight">
                                &quot;{item.text}&quot;
                            </span>
                            <span className="text-sm font-bold uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">
                                {item.author}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
