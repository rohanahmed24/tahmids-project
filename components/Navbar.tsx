"use client";

import Link from "next/link";
import { Search, Menu, X, LogOut, Loader2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useSession, signOut } from "next-auth/react";
import { getMenuCategories } from "@/actions/categories";
import { BASE_CATEGORIES, categoryToSlug } from "@/lib/categories";
import { useLocale } from "@/components/providers/LocaleProvider";
import { t } from "@/lib/translations";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { locale } = useLocale();
  const user = session?.user;
  const isLoading = status === "loading";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sectionLinks, setSectionLinks] = useState<
    { name: string; href: string }[]
  >([]);

  useEffect(() => {
    const fetchSections = async () => {
      const result = await getMenuCategories();
      if (result.success && result.links) {
        setSectionLinks(result.links);
      }
    };
    fetchSections();
  }, [locale]);

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
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b bg-base ${
          isScrolled ? "border-border py-4" : "border-transparent py-4 md:py-6"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center gap-4 relative">
          {/* Left: Menu Only */}
          <div
            className={`flex items-center justify-start flex-1 ${textColorClass}`}
          >
            <button
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity"
            >
              <Menu className="w-5 h-5" />
              <span className="hidden md:block">{t(locale, "menu")}</span>
            </button>
          </div>

          {/* Center: Logo (Absolute Centered) */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${textColorClass} text-center`}
          >
            <Link href="/" className="block">
              <h1 className="font-serif leading-none transition-colors">
                <span className="block text-[10px] md:text-xs font-medium tracking-widest uppercase opacity-60 mb-[-2px]">
                  The
                </span>
                <span className="block text-2xl md:text-3xl font-black tracking-tighter">
                  WISDOMIA
                </span>
              </h1>
            </Link>
          </div>

          {/* Right: Language Toggle Only */}
          <div
            className={`flex items-center justify-end flex-1 ${textColorClass}`}
          >
            <LanguageToggle />
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
              <div className="absolute inset-0 bg-bg-primary/90 backdrop-blur-3xl z-10" />{" "}
              {/* Subtle overlay to soften */}
              {/* Bubble 1 - CSS animation for better performance */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-500/30 rounded-full filter blur-3xl animate-[bubble1_15s_linear_infinite]" />
              {/* Bubble 2 */}
              <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-500/30 rounded-full filter blur-3xl animate-[bubble2_18s_linear_infinite_2s]" />
              {/* Bubble 3 */}
              <div className="absolute -bottom-40 left-1/3 w-64 h-64 bg-pink-500/30 rounded-full filter blur-3xl animate-[bubble3_20s_linear_infinite_4s]" />
            </div>

            {/* Content Wrapper - Scrollable */}
            <div className="flex-1 overflow-y-auto relative z-20">
              {/* Top Bar: Close (Left) | Auth & Theme (Right) */}
              <div className="flex justify-between items-center px-6 py-6 border-b border-border">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                >
                  <X className="w-8 h-8 font-light" />
                </button>

                <div className="flex items-center gap-4">
                  <ThemeToggle />
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                  ) : user ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold uppercase tracking-widest">
                        {user.name?.split(" ")[0]}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="text-text-secondary hover:text-red-500 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest  text-black dark:text-white px-4 py-2   "
                    >
                      <User className="w-4 h-4" />
                      {t(locale, "signIn")}
                    </Link>
                  )}
                </div>
              </div>

              {/* Secondary Bar: Search (Left) | Quick Links (Right) */}
              <div className="flex justify-between items-center px-4 py-4 border-b border-border">
                <div className="text-text-primary">
                  <Search className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-4 text-sm font-sans text-text-secondary">
                  <Link
                    href="/popular"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-text-primary"
                  >
                    {t(locale, "popular")}
                  </Link>
                  <Link
                    href="/latest"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-text-primary"
                  >
                    {t(locale, "latest")}
                  </Link>
                  <Link
                    href="/newsletters"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-text-primary"
                  >
                    {t(locale, "newsletters")}
                  </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-8">
                <div className="mb-6">
                  <span className="text-accent font-bold uppercase tracking-wider text-sm">
                    {t(locale, "sections")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {sectionLinks.length > 0
                    ? sectionLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-lg font-sans text-text-primary hover:text-accent transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))
                    : BASE_CATEGORIES.map((name) => ({
                        name,
                        href: `/topics/${categoryToSlug(name)}`,
                      })).map((item) => (
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

              {/* Footer Utility */}
              <div className="mt-auto p-6 border-t border-border flex justify-between items-center text-text-muted">
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
