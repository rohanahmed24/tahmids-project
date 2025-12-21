"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Assets } from "@/lib/assets";
import {
    BookOpen,
    Bookmark,
    Clock,
    Settings,
    LogOut,
    ChevronRight,
    Flame,
    TrendingUp,
    Bell,
    Moon,
    Sun,
    User,
    Mail,
    CreditCard,
    Shield,
    Trash2,
    Check
} from "lucide-react";
import { useTheme } from "next-themes";

// Mock user data
const userData = {
    name: "John Doe",
    email: "john@example.com",
    avatar: Assets.imgPlaceholderImage1,
    memberSince: "December 2024",
    plan: "Explorer",
};

const stats = [
    { id: 1, label: "Articles Read", value: 47, icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { id: 2, label: "Bookmarks", value: 12, icon: Bookmark, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    { id: 3, label: "Reading Streak", value: "7 days", icon: Flame, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { id: 4, label: "Hours Read", value: "24h", icon: Clock, color: "text-purple-500", bgColor: "bg-purple-500/10" },
];

const readingHistory = [
    { id: 1, title: "The Art of Digital Silence", category: "Technology", readAt: "2 hours ago", progress: 100, img: Assets.imgPlaceholderImage1, slug: "digital-silence" },
    { id: 2, title: "Building a Digital Garden", category: "Philosophy", readAt: "Yesterday", progress: 75, img: Assets.imgPlaceholderImage2, slug: "digital-garden" },
    { id: 3, title: "The Quiet Revolution of Slow Interfaces", category: "Design", readAt: "3 days ago", progress: 100, img: Assets.imgPlaceholderImage3, slug: "slow-interfaces" },
    { id: 4, title: "Why We Need Less Information", category: "Culture", readAt: "1 week ago", progress: 50, img: Assets.imgPlaceholderImage4, slug: "less-information" },
];

const bookmarks = [
    { id: 1, title: "The Art of Digital Silence", category: "Technology", savedAt: "Today", img: Assets.imgPlaceholderImage1, slug: "digital-silence" },
    { id: 2, title: "Building a Digital Garden", category: "Philosophy", savedAt: "Yesterday", img: Assets.imgPlaceholderImage2, slug: "digital-garden" },
    { id: 3, title: "Life on Mars: A Reality?", category: "Future", savedAt: "3 days ago", img: Assets.imgPlaceholderImage4, slug: "mars-reality" },
];

const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "history", label: "History", icon: Clock },
    { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [notifications, setNotifications] = useState(true);
    const [newsletter, setNewsletter] = useState(true);
    const { theme, setTheme } = useTheme();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent">
                            <Image
                                src={userData.avatar}
                                alt={userData.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif font-bold">{userData.name}</h1>
                            <p className="text-text-secondary text-sm">
                                {userData.plan} • Member since {userData.memberSince}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/pricing"
                            className="px-4 py-2 bg-accent text-white text-sm font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
                        >
                            Upgrade Plan
                        </Link>
                        <button className="p-2 border border-border-subtle rounded-full hover:bg-bg-secondary transition-colors">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2"
                >
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-accent text-white"
                                : "bg-bg-secondary border border-border-subtle hover:border-accent"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Stats Grid */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                            >
                                {stats.map((stat) => (
                                    <motion.div
                                        key={stat.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-bg-secondary border border-border-subtle rounded-2xl p-6"
                                    >
                                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <p className="text-3xl font-serif font-bold mb-1">{stat.value}</p>
                                        <p className="text-sm text-text-secondary">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Recent Activity */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Recent Reading */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-bg-secondary border border-border-subtle rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-serif font-bold">Continue Reading</h2>
                                        <button
                                            onClick={() => setActiveTab("history")}
                                            className="text-sm text-accent hover:underline"
                                        >
                                            View all
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {readingHistory.slice(0, 3).map((item, i) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.1 }}
                                            >
                                                <Link
                                                    href={`/article/${item.slug}`}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-primary transition-colors group"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image src={item.img} alt={item.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className="flex-1 h-1 bg-bg-primary rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-accent rounded-full"
                                                                    style={{ width: `${item.progress}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-text-muted">{item.progress}%</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Recent Bookmarks */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-bg-secondary border border-border-subtle rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-serif font-bold">Recent Bookmarks</h2>
                                        <button
                                            onClick={() => setActiveTab("bookmarks")}
                                            className="text-sm text-accent hover:underline"
                                        >
                                            View all
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {bookmarks.slice(0, 3).map((item, i) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.1 }}
                                            >
                                                <Link
                                                    href={`/article/${item.slug}`}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-primary transition-colors group"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image src={item.img} alt={item.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs text-text-muted">{item.savedAt}</p>
                                                    </div>
                                                    <Bookmark className="w-4 h-4 text-amber-500 fill-current" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "history" && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-serif font-bold mb-6">Reading History</h2>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {readingHistory.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        whileHover={{ x: 5 }}
                                    >
                                        <Link
                                            href={`/article/${item.slug}`}
                                            className="flex items-center gap-4 p-4 bg-bg-secondary border border-border-subtle rounded-2xl hover:border-accent transition-colors group"
                                        >
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image src={item.img} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                                                    {item.category}
                                                </span>
                                                <h3 className="font-serif font-bold text-lg mt-1 group-hover:text-accent transition-colors">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm text-text-muted">{item.readAt}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-accent rounded-full"
                                                                style={{ width: `${item.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-text-muted">{item.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === "bookmarks" && (
                        <motion.div
                            key="bookmarks"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-serif font-bold mb-6">Your Bookmarks</h2>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {bookmarks.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Link
                                            href={`/article/${item.slug}`}
                                            className="block bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden hover:border-accent transition-colors group"
                                        >
                                            <div className="relative w-full aspect-video">
                                                <Image src={item.img} alt={item.title} fill className="object-cover" />
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        // Remove bookmark logic
                                                    }}
                                                    className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-red-500 transition-colors"
                                                >
                                                    <Bookmark className="w-4 h-4 text-white fill-current" />
                                                </button>
                                            </div>
                                            <div className="p-4">
                                                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                                                    {item.category}
                                                </span>
                                                <h3 className="font-serif font-bold mt-1 group-hover:text-accent transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs text-text-muted mt-2">Saved {item.savedAt}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {activeTab === "settings" && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-2xl"
                        >
                            <h2 className="text-2xl font-serif font-bold mb-6">Settings</h2>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-6"
                            >
                                {/* Profile Section */}
                                <motion.div variants={itemVariants} className="bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5" /> Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm text-text-muted block mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                defaultValue={userData.name}
                                                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-text-muted block mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={userData.email}
                                                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Preferences */}
                                <motion.div variants={itemVariants} className="bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <Bell className="w-5 h-5" /> Preferences
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                                <span>Dark Mode</span>
                                            </div>
                                            <button
                                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${theme === "dark" ? "bg-accent" : "bg-bg-primary border border-border-subtle"
                                                    }`}
                                            >
                                                <motion.div
                                                    layout
                                                    className={`w-4 h-4 rounded-full bg-white shadow ${theme === "dark" ? "ml-auto" : ""
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Bell className="w-5 h-5" />
                                                <span>Push Notifications</span>
                                            </div>
                                            <button
                                                onClick={() => setNotifications(!notifications)}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${notifications ? "bg-accent" : "bg-bg-primary border border-border-subtle"
                                                    }`}
                                            >
                                                <motion.div
                                                    layout
                                                    className={`w-4 h-4 rounded-full bg-white shadow ${notifications ? "ml-auto" : ""
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-5 h-5" />
                                                <span>Weekly Newsletter</span>
                                            </div>
                                            <button
                                                onClick={() => setNewsletter(!newsletter)}
                                                className={`w-12 h-6 rounded-full p-1 transition-colors ${newsletter ? "bg-accent" : "bg-bg-primary border border-border-subtle"
                                                    }`}
                                            >
                                                <motion.div
                                                    layout
                                                    className={`w-4 h-4 rounded-full bg-white shadow ${newsletter ? "ml-auto" : ""
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Subscription */}
                                <motion.div variants={itemVariants} className="bg-bg-secondary border border-border-subtle rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" /> Subscription
                                    </h3>
                                    <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-xl">
                                        <div>
                                            <p className="font-bold text-accent">{userData.plan} Plan</p>
                                            <p className="text-sm text-text-muted">$12/month • Renews Jan 21, 2025</p>
                                        </div>
                                        <Link
                                            href="/pricing"
                                            className="px-4 py-2 bg-accent text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
                                        >
                                            Manage
                                        </Link>
                                    </div>
                                </motion.div>

                                {/* Danger Zone */}
                                <motion.div variants={itemVariants} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-red-500">
                                        <Shield className="w-5 h-5" /> Danger Zone
                                    </h3>
                                    <p className="text-sm text-text-muted mb-4">
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete Account
                                    </button>
                                </motion.div>

                                {/* Save Button */}
                                <motion.button
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-4 bg-accent text-white font-bold text-sm uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    Save Changes
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-primary border border-border-subtle rounded-3xl p-8 max-w-md w-full text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2">Delete Account?</h3>
                            <p className="text-text-secondary mb-6">
                                This action cannot be undone. All your reading history, bookmarks, and preferences will be permanently deleted.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 border border-border-subtle rounded-full font-bold text-sm hover:bg-bg-secondary transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 py-3 bg-red-500 text-white rounded-full font-bold text-sm hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
