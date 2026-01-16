"use client";

import Link from "next/link";
import { Search, Menu, X, User, LogOut, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
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
                    <div className={`flex items-center justify-center ${textColorClass} absolute left-[40%] -translate-x-1/2`}>
                        <Link href="/" className="block">
                            <h1 className="font-serif text-center leading-none transition-colors">
                                <span className="block text-[10px] md:text-xs font-medium tracking-widest uppercase opacity-60 mb-[-2px]">The</span>
                                <span className="block text-2xl md:text-3xl font-black tracking-tighter">WISDOMIA</span>
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



                        {/* Language/Region Selector */}
                        <div className="flex items-center">
                            <LanguageToggle />
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
                        className="fixed inset-0 z-[10000] flex flex-col bg-bg-primary text-text-primary overflow-hidden"
                    >
                        {/* Background Layer with Floating Bubbles */}
                        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-3xl z-10" /> {/* Subtle overlay to soften */}

                            {/* Bubble 1 */}
                            <motion.div
                                animate={{
                                    x: [0, 50, 0],
                                    y: [0, -30, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                                className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/30 rounded-full filter blur-3xl"
                            />

                            {/* Bubble 2 */}
                            <motion.div
                                animate={{
                                    x: [0, -50, 0],
                                    y: [0, 40, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 18,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: 2
                                }}
                                className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-500/30 rounded-full filter blur-3xl"
                            />

                            {/* Bubble 3 */}
                            <motion.div
                                animate={{
                                    x: [0, 30, 0],
                                    y: [0, 30, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: 4
                                }}
                                className="absolute -bottom-40 left-1/3 w-64 h-64 bg-pink-500/30 rounded-full filter blur-3xl"
                            />
                        </div>

                        {/* Content Wrapper - Scrollable */}
                        <div className="flex-1 overflow-y-auto relative z-20">


                            {/* Top Bar: Close (Left) | Sign In, Subscribe (Right) */}
                            <div className="flex justify-between items-center px-4 py-4 border-b border-border">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    <X className="w-8 h-8 font-light" />
                                </button>

                                <div className="flex items-center gap-6">
                                    <Link
                                        href="/signin"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-base font-sans text-text-primary hover:text-accent transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/subscribe"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-base font-sans text-accent font-medium hover:opacity-70"
                                    >
                                        Subscribe
                                    </Link>
                                </div>
                            </div>

                            {/* Secondary Bar: Search (Left) | Quick Links (Right) */}
                            <div className="flex justify-between items-center px-4 py-4 border-b border-border">
                                <div className="text-text-primary">
                                    <Search className="w-6 h-6" />
                                </div>

                                <div className="flex items-center gap-4 text-sm font-sans text-text-secondary">
                                    <Link href="/popular" onClick={() => setIsMenuOpen(false)} className="hover:text-text-primary">Popular</Link>
                                    <Link href="/latest" onClick={() => setIsMenuOpen(false)} className="hover:text-text-primary">Latest</Link>
                                    <Link href="/newsletters" onClick={() => setIsMenuOpen(false)} className="hover:text-text-primary">Newsletters</Link>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <span className="text-accent font-bold uppercase tracking-wider text-sm">
                                        SECTIONS
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    {/* Combining standard nav and topics for the 2-col layout */}
                                    {[
                                        { name: "Politics", href: "/topics/politics" },
                                        { name: "Ideas", href: "/topics/ideas" },
                                        { name: "Fiction", href: "/topics/fiction" },
                                        { name: "Technology", href: "/topics/technology" },
                                        { name: "Science", href: "/topics/science" },
                                        { name: "Photo", href: "/topics/photo" },
                                        { name: "Economy", href: "/topics/economy" },
                                        { name: "Culture", href: "/topics/culture" },
                                        { name: "Planet", href: "/topics/planet" },
                                        { name: "Global", href: "/topics/global" },
                                        { name: "Books", href: "/topics/books" },
                                        { name: "AI Watchdog", href: "/topics/ai-watchdog" },
                                        { name: "Health", href: "/topics/health" },
                                        { name: "Education", href: "/topics/education" },
                                        { name: "Projects", href: "/projects" },
                                        { name: "Features", href: "/features" },
                                        { name: "Family", href: "/topics/family" },
                                        { name: "Events", href: "/events" },
                                        // Fallbacks to existing routes if needed, but trying to match density
                                        { name: "Home", href: "/" },
                                        { name: "About", href: "/about" },
                                    ].map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-lg font-sans text-text-primary hover:text-accent transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Utility (Optional, kept at bottom) */}
                            <div className="mt-auto p-6 border-t border-border flex justify-between items-center text-text-muted">
                                <ThemeToggle />
                                <div className="text-xs">
                                    &copy; {new Date().getFullYear()} Wisdomia
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
