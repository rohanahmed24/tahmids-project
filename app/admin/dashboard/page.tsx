"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import {
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    TrendingDown,
    Clock,
    BookOpen,
    Bookmark,
    DollarSign,
    Check,
    Shield,
    Bell,
    Moon,
    Sun
} from "lucide-react";
import { useTheme } from "next-themes";

// Mock data
const stats = [
    { id: 1, label: "Total Users", value: "2,847", change: "+12.5%", trend: "up", icon: Users, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { id: 2, label: "Articles", value: "156", change: "+8.2%", trend: "up", icon: FileText, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { id: 3, label: "Page Views", value: "45.2K", change: "+23.1%", trend: "up", icon: Eye, color: "text-green-500", bgColor: "bg-green-500/10" },
    { id: 4, label: "Revenue", value: "$12,450", change: "-2.4%", trend: "down", icon: DollarSign, color: "text-amber-500", bgColor: "bg-amber-500/10" },
];

const recentUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", avatar: Assets.imgPlaceholderImage1, plan: "Explorer", joinedAt: "2 hours ago" },
    { id: 2, name: "Michael Chen", email: "michael@example.com", avatar: Assets.imgPlaceholderImage2, plan: "Reader", joinedAt: "5 hours ago" },
    { id: 3, name: "Emily Davis", email: "emily@example.com", avatar: Assets.imgPlaceholderImage3, plan: "Visionary", joinedAt: "1 day ago" },
    { id: 4, name: "James Wilson", email: "james@example.com", avatar: Assets.imgPlaceholderImage4, plan: "Explorer", joinedAt: "2 days ago" },
];

const recentArticles = [
    { id: 1, title: "The Art of Digital Silence", author: "Sarah Jenkins", status: "published", views: 1234, img: Assets.imgPlaceholderImage1 },
    { id: 2, title: "Building a Digital Garden", author: "Michael Chen", status: "draft", views: 0, img: Assets.imgPlaceholderImage2 },
    { id: 3, title: "Slow Interfaces Revolution", author: "Emily Davis", status: "published", views: 856, img: Assets.imgPlaceholderImage3 },
    { id: 4, title: "Why We Need Less Info", author: "James Wilson", status: "review", views: 0, img: Assets.imgPlaceholderImage4 },
];

const allUsers = [
    { id: 1, name: "Sarah Johnson", email: "sarah@example.com", avatar: Assets.imgPlaceholderImage1, plan: "Explorer", status: "active", articles: 12, joined: "Dec 15, 2024" },
    { id: 2, name: "Michael Chen", email: "michael@example.com", avatar: Assets.imgPlaceholderImage2, plan: "Reader", status: "active", articles: 0, joined: "Dec 14, 2024" },
    { id: 3, name: "Emily Davis", email: "emily@example.com", avatar: Assets.imgPlaceholderImage3, plan: "Visionary", status: "active", articles: 28, joined: "Dec 10, 2024" },
    { id: 4, name: "James Wilson", email: "james@example.com", avatar: Assets.imgPlaceholderImage4, plan: "Explorer", status: "suspended", articles: 5, joined: "Dec 5, 2024" },
    { id: 5, name: "Anna Smith", email: "anna@example.com", avatar: Assets.imgPlaceholderImage1, plan: "Reader", status: "active", articles: 0, joined: "Dec 1, 2024" },
];

const allArticles = [
    { id: 1, title: "The Art of Digital Silence", author: "Sarah Jenkins", category: "Technology", status: "published", views: 1234, date: "Dec 20, 2024", img: Assets.imgPlaceholderImage1 },
    { id: 2, title: "Building a Digital Garden", author: "Michael Chen", category: "Philosophy", status: "draft", views: 0, date: "Dec 19, 2024", img: Assets.imgPlaceholderImage2 },
    { id: 3, title: "Slow Interfaces Revolution", author: "Emily Davis", category: "Design", status: "published", views: 856, date: "Dec 18, 2024", img: Assets.imgPlaceholderImage3 },
    { id: 4, title: "Why We Need Less Info", author: "James Wilson", category: "Culture", status: "review", views: 0, date: "Dec 17, 2024", img: Assets.imgPlaceholderImage4 },
    { id: 5, title: "Future of AI Ethics", author: "Sarah Jenkins", category: "Technology", status: "published", views: 2150, date: "Dec 15, 2024", img: Assets.imgPlaceholderImage1 },
];

const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        // Check admin authentication
        const auth = sessionStorage.getItem("adminAuth");
        if (auth !== "true") {
            router.push("/admin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem("adminAuth");
        router.push("/admin");
    };

    const handleDelete = (type: string, id: number, name: string) => {
        setDeleteTarget({ type, id, name });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // Handle delete logic here
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
                />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-40"
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Admin Panel</h1>
                            <p className="text-xs text-gray-500">Wisdomia</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={{ x: 5 }}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? "bg-gradient-to-r from-red-500/20 to-purple-500/20 text-white border border-purple-500/30"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </motion.button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 ml-64">
                {/* Top Bar */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800 px-8 py-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="relative w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users, articles..."
                                className="w-full pl-12 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm placeholder:text-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors"
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button className="relative p-2.5 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-purple-600 rounded-full flex items-center justify-center font-bold">
                                    A
                                </div>
                                <div>
                                    <p className="font-medium text-sm">Admin</p>
                                    <p className="text-xs text-gray-500">Super Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.header>

                {/* Page Content */}
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">Dashboard Overview</h1>
                                        <p className="text-gray-400 text-sm">Welcome back! Here's what's happening.</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-4 gap-6 mb-8"
                                >
                                    {stats.map((stat) => (
                                        <motion.div
                                            key={stat.id}
                                            variants={itemVariants}
                                            whileHover={{ y: -5 }}
                                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                                </div>
                                                <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                                    {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    {stat.change}
                                                </div>
                                            </div>
                                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                                            <p className="text-gray-400 text-sm">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Recent Activity */}
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Recent Users */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="font-bold">Recent Users</h2>
                                            <button
                                                onClick={() => setActiveTab("users")}
                                                className="text-sm text-purple-400 hover:text-purple-300"
                                            >
                                                View all →
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {recentUsers.map((user) => (
                                                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${user.plan === "Visionary" ? "bg-amber-500/20 text-amber-400" :
                                                        user.plan === "Explorer" ? "bg-blue-500/20 text-blue-400" :
                                                            "bg-gray-700 text-gray-400"
                                                        }`}>
                                                        {user.plan}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Recent Articles */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                                    >
                                        <div className="flex justify-between items-center mb-6">
                                            <h2 className="font-bold">Recent Articles</h2>
                                            <button
                                                onClick={() => setActiveTab("articles")}
                                                className="text-sm text-purple-400 hover:text-purple-300"
                                            >
                                                View all →
                                            </button>
                                        </div>
                                        <div className="space-y-4">
                                            {recentArticles.map((article) => (
                                                <div key={article.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image src={article.img} alt={article.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{article.title}</p>
                                                        <p className="text-xs text-gray-500">{article.author}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${article.status === "published" ? "bg-green-500/20 text-green-400" :
                                                        article.status === "draft" ? "bg-gray-700 text-gray-400" :
                                                            "bg-amber-500/20 text-amber-400"
                                                        }`}>
                                                        {article.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Users Tab */}
                        {activeTab === "users" && (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">User Management</h1>
                                        <p className="text-gray-400 text-sm">Manage all registered users</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                                        <Plus className="w-4 h-4" />
                                        Add User
                                    </button>
                                </div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                                >
                                    <table className="w-full">
                                        <thead className="bg-gray-800/50">
                                            <tr>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">User</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Plan</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Articles</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Joined</th>
                                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map((user) => (
                                                <motion.tr
                                                    key={user.id}
                                                    variants={itemVariants}
                                                    className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.plan === "Visionary" ? "bg-amber-500/20 text-amber-400" :
                                                            user.plan === "Explorer" ? "bg-blue-500/20 text-blue-400" :
                                                                "bg-gray-700 text-gray-400"
                                                            }`}>
                                                            {user.plan}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                                            }`}>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">{user.articles}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">{user.joined}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                                                                <Edit className="w-4 h-4 text-gray-400" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete("user", user.id, user.name)}
                                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-400" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Articles Tab */}
                        {activeTab === "articles" && (
                            <motion.div
                                key="articles"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">Content Management</h1>
                                        <p className="text-gray-400 text-sm">Manage all articles and content</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                                        <Plus className="w-4 h-4" />
                                        New Article
                                    </button>
                                </div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-4"
                                >
                                    {allArticles.map((article) => (
                                        <motion.div
                                            key={article.id}
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4"
                                        >
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image src={article.img} alt={article.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                                                        {article.category}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs ${article.status === "published" ? "bg-green-500/20 text-green-400" :
                                                        article.status === "draft" ? "bg-gray-700 text-gray-400" :
                                                            "bg-amber-500/20 text-amber-400"
                                                        }`}>
                                                        {article.status}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg truncate">{article.title}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span>{article.author}</span>
                                                    <span>•</span>
                                                    <span>{article.date}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" /> {article.views.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete("article", article.id, article.title)}
                                                    className="p-2.5 bg-gray-800 hover:bg-red-500/20 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === "analytics" && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold mb-1">Analytics</h1>
                                    <p className="text-gray-400 text-sm">Track performance and growth metrics</p>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    {/* Chart Placeholder 1 */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 h-80"
                                    >
                                        <h3 className="font-bold mb-4">Page Views Over Time</h3>
                                        <div className="h-56 flex items-end justify-between gap-2">
                                            {[65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80, 70].map((height, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${height}%` }}
                                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                                    className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                                                />
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Top Articles */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                                    >
                                        <h3 className="font-bold mb-4">Top Articles</h3>
                                        <div className="space-y-4">
                                            {[
                                                { title: "Future of AI Ethics", views: "2.1K" },
                                                { title: "Digital Silence", views: "1.2K" },
                                                { title: "Slow Interfaces", views: "856" },
                                                { title: "Digital Garden", views: "654" },
                                            ].map((article, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <span className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                                                        {i + 1}
                                                    </span>
                                                    <span className="flex-1 text-sm truncate">{article.title}</span>
                                                    <span className="text-sm text-gray-400">{article.views}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* More Stats */}
                                <div className="grid grid-cols-4 gap-6">
                                    {[
                                        { label: "Avg. Read Time", value: "4m 23s", icon: Clock },
                                        { label: "Articles Read", value: "12.4K", icon: BookOpen },
                                        { label: "Bookmarks", value: "3.2K", icon: Bookmark },
                                        { label: "Bounce Rate", value: "32%", icon: TrendingDown },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.05 }}
                                            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center"
                                        >
                                            <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                            <p className="text-sm text-gray-400">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === "settings" && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl"
                            >
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold mb-1">Settings</h1>
                                    <p className="text-gray-400 text-sm">Manage admin panel settings</p>
                                </div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-6"
                                >
                                    {/* Site Settings */}
                                    <motion.div variants={itemVariants} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                        <h3 className="font-bold mb-4">Site Settings</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">Site Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue="Wisdomia"
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">Site Description</label>
                                                <textarea
                                                    defaultValue="A digital sanctuary for stories that matter."
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Security */}
                                    <motion.div variants={itemVariants} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                                        <h3 className="font-bold mb-4">Security</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">New Admin Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter new password..."
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Confirm new password..."
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Save Button */}
                                    <motion.button
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Settings
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && deleteTarget && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Delete {deleteTarget.type}?</h3>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-3 border border-gray-700 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 bg-red-500 rounded-xl font-medium hover:bg-red-600 transition-colors"
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
