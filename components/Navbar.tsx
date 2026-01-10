"use client";

import Link from "next/link";
import { Search, Menu, X, Globe, User, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const isLoading = status === "loading";
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
        setIsUserMenuOpen(false);
    };

    return (
        <>
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b bg-base ${isScrolled
                    ? 'border-border py-4'
                    : 'border-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center gap-4">
                    {/* Left: Menu & Search */}
                    <div className={`flex items-center gap-4 md:gap-6 ${textColorClass}`}>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
                        >
                            <Menu className="w-5 h-5" />
                            <span className="hidden md:block">Menu</span>
                        </button>

                        <div className="relative group hidden md:block">
                            <form action="/search" className="relative flex items-center">
                                <label htmlFor="search-input" className="sr-only">Search</label>
                                <Search className="w-5 h-5 absolute left-0 pointer-events-none group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    id="search-input"
                                    name="q"
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-b border-transparent focus:border-purple-400 pl-8 pr-4 py-1 outline-none w-24 focus:w-48 transition-all duration-300 placeholder:text-transparent focus:placeholder:text-gray-500/50"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <div className={`flex items-center justify-center ${textColorClass} absolute left-1/2 -translate-x-1/2`}>
                        <Link href="/" className="block">
                            <h1 className="font-serif text-2xl md:text-3xl font-black tracking-tighter transition-colors flex items-center gap-2">
                                <span className="text-sm font-medium tracking-normal opacity-80">The</span>
                                WISDOMIA
                            </h1>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className={`flex items-center justify-end gap-3 md:gap-8 w-auto ${textColorClass}`}>
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                        ) : user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
                                >
                                    {user?.name?.split(' ')[0] || 'User'}
                                    <User className="w-4 h-4" />
                                </button>
                                {/* Mobile User Icon only if needed, but keeping hidden md:flex layout for consistency with previous buttons, though user might want access. Leaving user menu behavior as is for now unless requested, focusing on theme bar. */}
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="md:hidden flex items-center hover:opacity-60 transition-opacity"
                                >
                                    <User className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {isUserMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-4 w-48 bg-bg-secondary border border-border rounded-xl shadow-xl overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-border">
                                                <p className="font-bold text-sm truncate">{user.name}</p>
                                                <p className="text-xs text-text-muted truncate">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-bg-primary transition-colors flex items-center gap-2 text-red-500"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/signin" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity whitespace-nowrap">
                                Sign In
                            </Link>
                        )}


                        <div className="flex">
                            <ThemeToggle />
                        </div>
                        {/* Language/Region Selector */}
                        <div className="hidden md:flex items-center gap-1">
                            <Globe className="w-4 h-4 opacity-60" />
                            <button
                                className="px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-white/10 rounded transition-colors"
                                title="English"
                            >
                                EN
                            </button>
                            <span className="opacity-40">|</span>
                            <button
                                className="px-2 py-1 text-xs font-bold hover:bg-white/10 rounded transition-colors"
                                title="বাংলা"
                            >
                                বাংলা
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
                            <span className="text-xl font-serif font-black tracking-tighter text-main flex items-center gap-1">
                                <span className="text-sm font-medium tracking-normal opacity-80">The</span>
                                WISDOMIA
                            </span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-main/5 rounded-full transition-colors text-main"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 xl:p-12 flex flex-col md:flex-row gap-8 md:gap-12 xl:gap-24">
                            {/* Navigation Links */}
                            <div className="flex flex-col gap-4 md:gap-6">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted mb-2 md:mb-4">Navigation</span>
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
                                        className="text-3xl md:text-5xl xl:text-6xl font-serif font-medium text-main hover:italic transition-all duration-300 w-fit"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Featured / Secondary */}
                            <div className="flex flex-col gap-4 md:gap-6 pt-4 md:pt-10 xl:pt-14">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted mb-2 md:mb-4">Featured Topics</span>
                                {[
                                    { name: "Technology & AI", slug: "technology-ai" },
                                    { name: "Design Culture", slug: "design-culture" },
                                    { name: "Minimalism", slug: "minimalism" },
                                    { name: "Future Tech", slug: "future-tech" },
                                    { name: "Psychology", slug: "psychology" },
                                ].map(topic => (
                                    <Link key={topic.slug} href={`/topics/${topic.slug}`} onClick={() => setIsMenuOpen(false)} className="text-base md:text-lg xl:text-xl font-sans font-medium text-secondary hover:text-main transition-colors">
                                        {topic.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 md:p-8 xl:p-12 border-t border-border flex justify-between items-center text-main">
                            <div className="flex gap-6">
                                <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Twitter</a>
                                <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">Instagram</a>
                                <a href="#" className="opacity-50 hover:opacity-100 transition-opacity">LinkedIn</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-main">
                                    <Globe className="w-4 h-4 opacity-60" />
                                    <button className="px-2 py-1 text-xs font-bold uppercase tracking-wider hover:bg-main/10 rounded transition-colors">EN</button>
                                    <span className="opacity-40">|</span>
                                    <button className="px-2 py-1 text-xs font-bold hover:bg-main/10 rounded transition-colors">বাংলা</button>
                                </div>
                                <div className="hidden md:block">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
