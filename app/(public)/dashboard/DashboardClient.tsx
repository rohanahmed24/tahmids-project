"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    BookOpen,
    Bookmark,
    Settings,
    LogOut,
    ChevronRight,
    TrendingUp,
    Bell,
    Moon,
    Sun,
    User,
    Mail,
    Shield,
    Trash2,
    Check,
    Eye,
    PenSquare,
    FileText,
    Crown
} from "lucide-react";
import { useTheme } from "next-themes";

interface DashboardClientProps {
    user: {
        id: number;
        name: string;
        email: string;
        image: string | null;
        role: string;
        memberSince: string;
    };
    stats: {
        articlesWritten: number;
        publishedArticles: number;
        totalViews: number;
        memberSince: string;
    };
    recentPosts: {
        id: number;
        title: string;
        slug: string;
        category: string | null;
        views: number | null;
        published: boolean | null;
        createdAt: Date;
        coverImage: string | null;
    }[];
    signOutAction: () => Promise<void>;
}

const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "articles", label: "My Articles", icon: FileText },
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

export default function DashboardClient({ user, stats, recentPosts, signOutAction }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [notifications, setNotifications] = useState(true);
    const [newsletter, setNewsletter] = useState(true);
    const { theme, setTheme } = useTheme();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isAdmin = user.role === "admin";

    const statCards = [
        { id: 1, label: "Articles Written", value: stats.articlesWritten, icon: BookOpen, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        { id: 2, label: "Published", value: stats.publishedArticles, icon: FileText, color: "text-green-500", bgColor: "bg-green-500/10" },
        { id: 3, label: "Total Views", value: stats.totalViews.toLocaleString(), icon: Eye, color: "text-purple-500", bgColor: "bg-purple-500/10" },
        { id: 4, label: "Member Since", value: stats.memberSince.split(" ")[0], icon: Bookmark, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    ];

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
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent bg-bg-secondary">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-text-muted">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-serif font-bold">{user.name}</h1>
                                {isAdmin && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs font-bold rounded-full">
                                        <Crown className="w-3 h-3" /> Admin
                                    </span>
                                )}
                            </div>
                            <p className="text-text-secondary text-sm">
                                {user.email} • Member since {user.memberSince}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isAdmin && (
                            <Link
                                href="/admin/dashboard"
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold uppercase tracking-widest rounded-full hover:opacity-90 transition-opacity"
                            >
                                Admin Panel
                            </Link>
                        )}
                        <form action={signOutAction}>
                            <button
                                type="submit"
                                className="p-2 border border-border-subtle rounded-full hover:bg-bg-secondary transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </form>
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
                                {statCards.map((stat) => (
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

                            {/* Quick Actions */}
                            {isAdmin && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-bg-secondary border border-border-subtle rounded-2xl p-6 mb-8"
                                >
                                    <h2 className="text-lg font-serif font-bold mb-4">Quick Actions</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Link
                                            href="/admin/write"
                                            className="flex items-center gap-3 p-4 bg-bg-primary border border-border-subtle rounded-xl hover:border-accent transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                                <PenSquare className="w-5 h-5 text-purple-500" />
                                            </div>
                                            <span className="font-medium group-hover:text-accent transition-colors">New Article</span>
                                        </Link>
                                        <Link
                                            href="/admin/dashboard"
                                            className="flex items-center gap-3 p-4 bg-bg-primary border border-border-subtle rounded-xl hover:border-accent transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <span className="font-medium group-hover:text-accent transition-colors">Analytics</span>
                                        </Link>
                                        <Link
                                            href="/admin/media"
                                            className="flex items-center gap-3 p-4 bg-bg-primary border border-border-subtle rounded-xl hover:border-accent transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-green-500" />
                                            </div>
                                            <span className="font-medium group-hover:text-accent transition-colors">Media</span>
                                        </Link>
                                        <Link
                                            href="/admin/settings"
                                            className="flex items-center gap-3 p-4 bg-bg-primary border border-border-subtle rounded-xl hover:border-accent transition-colors group"
                                        >
                                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                                <Settings className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <span className="font-medium group-hover:text-accent transition-colors">Settings</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Recent Articles */}
                            {recentPosts.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-bg-secondary border border-border-subtle rounded-2xl p-6"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-lg font-serif font-bold">Recent Articles</h2>
                                        <button
                                            onClick={() => setActiveTab("articles")}
                                            className="text-sm text-accent hover:underline"
                                        >
                                            View all
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {recentPosts.slice(0, 3).map((post, i) => (
                                            <motion.div
                                                key={post.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + i * 0.1 }}
                                            >
                                                <Link
                                                    href={`/admin/edit/${post.slug}`}
                                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-bg-primary transition-colors group"
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-bg-primary">
                                                        {post.coverImage ? (
                                                            <Image src={post.coverImage} alt={post.title} fill sizes="48px" className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FileText className="w-5 h-5 text-text-muted" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                                                            {post.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                                                            <span className={post.published ? "text-green-500" : "text-yellow-500"}>
                                                                {post.published ? "Published" : "Draft"}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{post.views || 0} views</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {!isAdmin && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 text-center"
                                >
                                    <h2 className="text-2xl font-serif font-bold mb-2">Welcome to Wisdomia!</h2>
                                    <p className="text-text-secondary mb-6">
                                        Start exploring our premium content and discover thought-provoking articles.
                                    </p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        Explore Articles
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "articles" && (
                        <motion.div
                            key="articles"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold">My Articles</h2>
                                {isAdmin && (
                                    <Link
                                        href="/admin/write"
                                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                                    >
                                        <PenSquare className="w-4 h-4" />
                                        New Article
                                    </Link>
                                )}
                            </div>

                            {recentPosts.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-4"
                                >
                                    {recentPosts.map((post) => (
                                        <motion.div
                                            key={post.id}
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                        >
                                            <Link
                                                href={`/admin/edit/${post.slug}`}
                                                className="flex items-center gap-4 p-4 bg-bg-secondary border border-border-subtle rounded-2xl hover:border-accent transition-colors group"
                                            >
                                                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-bg-primary">
                                                    {post.coverImage ? (
                                                        <Image src={post.coverImage} alt={post.title} fill sizes="80px" className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FileText className="w-8 h-8 text-text-muted" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold uppercase tracking-widest text-accent">
                                                            {post.category || "Uncategorized"}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${post.published ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}`}>
                                                            {post.published ? "Published" : "Draft"}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-serif font-bold text-lg group-hover:text-accent transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-text-muted">
                                                        <span className="flex items-center gap-1">
                                                            <Eye className="w-4 h-4" />
                                                            {post.views || 0} views
                                                        </span>
                                                        <span>
                                                            {new Date(post.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-12 text-center">
                                    <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
                                    <h3 className="text-xl font-serif font-bold mb-2">No Articles Yet</h3>
                                    <p className="text-text-secondary mb-6">
                                        {isAdmin ? "Start writing your first article to see it here." : "You haven't written any articles yet."}
                                    </p>
                                    {isAdmin && (
                                        <Link
                                            href="/admin/write"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                                        >
                                            <PenSquare className="w-5 h-5" />
                                            Write Your First Article
                                        </Link>
                                    )}
                                </div>
                            )}
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
                                                defaultValue={user.name}
                                                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-text-muted block mb-2">Email</label>
                                            <input
                                                type="email"
                                                defaultValue={user.email}
                                                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl focus:border-accent focus:outline-none transition-colors"
                                                readOnly
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
                                This action cannot be undone. All your data will be permanently deleted.
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
