"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Text color logic: 
    // Uses semantic primary text (Charcoal in Light, White in Dark)
    // This ensures visibility on all pages, including the home hero in both themes.
    const textColorClass = "text-main";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b bg-base md:bg-transparent ${isScrolled
                    ? 'md:bg-base/80 backdrop-blur-xl border-border py-4'
                    : 'border-transparent md:border-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center">
                    {/* Left: Menu & Search */}
                    <div className={`flex items-center gap-4 md:gap-6 w-24 md:w-40 ${textColorClass}`}>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="hidden md:block">Menu</span>
                        </button>
                        <button className="hidden md:block hover:opacity-60 transition-opacity">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className={`flex-1 flex items-center justify-center ${textColorClass}`}>
                        <Link href="/" className="block">
                            <h1 className="font-serif text-2xl md:text-4xl font-black tracking-tighter transition-colors">
                                WISDOMIA
                            </h1>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className={`flex items-center justify-end gap-5 md:gap-8 w-24 md:w-40 ${textColorClass}`}>
                        <Link href="/signin" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
                            Sign In
                        </Link>
                        <div className="hidden md:flex">
                            <ThemeToggle />
                        </div>
                        {/* Language/Region Selector */}
                        <div className="flex items-center gap-2">
                            <button
                                className="text-xl hover:scale-110 transition-transform"
                                title="English"
                            >
                                🇬🇧
                            </button>
                            <button
                                className="text-xl hover:scale-110 transition-transform"
                                title="বাংলা"
                            >
                                🇧🇩
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex flex-col bg-base text-main"
                    >
                        {/* Enforce solid background to ensure it overlays everything */}
                        <div className="absolute inset-0 bg-base -z-10" />

                        <div className="flex justify-between items-center p-6 md:p-12 border-b border-border">
                            <span className="text-xl font-serif font-black tracking-tighter text-main">WISDOMIA</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-main/5 rounded-full transition-colors text-main"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col md:flex-row gap-12 md:gap-24">
                            {/* Navigation Links */}
                            <div className="flex flex-col gap-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Navigation</span>
                                {[
                                    { name: "Home", href: "/" },
                                    { name: "Stories", href: "/stories" },
                                    { name: "Topics", href: "/topics" },
                                    { name: "Pricing", href: "/pricing" },
                                    { name: "About Us", href: "/about" },
                                    { name: "Contact", href: "/contact" },
                                ].map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-4xl md:text-6xl font-serif font-medium text-main hover:italic transition-all duration-300 w-fit"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Featured / Secondary */}
                            <div className="flex flex-col gap-6 pt-4 md:pt-14">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Featured Topics</span>
                                {[
                                    { name: "Technology & AI", slug: "technology-ai" },
                                    { name: "Design Culture", slug: "design-culture" },
                                    { name: "Minimalism", slug: "minimalism" },
                                    { name: "Future Tech", slug: "future-tech" },
                                    { name: "Psychology", slug: "psychology" },
                                ].map(topic => (
                                    <Link key={topic.slug} href={`/topics/${topic.slug}`} onClick={() => setIsMenuOpen(false)} className="text-lg md:text-xl font-sans font-medium text-secondary hover:text-main transition-colors">
                                        {topic.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 md:p-12 border-t border-border flex justify-between items-center text-main">
                            <div className="flex gap-6">
                                <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Twitter</a>
                                <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Instagram</a>
                                <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">LinkedIn</a>
                            </div>
                            <ThemeToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
