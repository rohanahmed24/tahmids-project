"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { logoutAdmin } from "@/actions/admin-auth";
import { deletePost } from "@/actions/posts";
import { deleteUser, updateUserPlan } from "@/actions/users";
import { updateSettings } from "@/actions/settings";
import { getApplications, updateApplicationStatus } from "@/actions/careers";
import { getImages, uploadImage, deleteImage } from "@/actions/media";
import { RowDataPacket } from "mysql2";
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
    DollarSign,
    Check,
    Shield,
    Bell,
    Moon,
    Sun,
    X,
    UserPlus,
    Briefcase,
    ImageIcon,
    Upload,
    Loader2,
    type LucideIcon
} from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "media", label: "Media", icon: ImageIcon },
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

interface Article {
    id: number;
    title: string;
    author: string;
    category: string;
    status: string;
    views: number;
    date: string;
    img: string;
    slug: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string;
    plan: string;
    status: string;
    articles: number;
    joined: string;
}

interface Stat {
    id: number;
    label: string;
    value: string;
    change: string;
    trend: string;
    iconName: string;
    color: string;
    bgColor: string;
}

interface SiteSettings {
    siteName: string;
    siteDescription: string;
}

interface DashboardClientProps {
    initialArticles: Article[];
    initialUsers: User[];
    initialStats: Stat[];
    initialSettings: SiteSettings;
}

const icons: Record<string, LucideIcon> = {
    Users,
    FileText,
    Eye,
    DollarSign
};

export default function DashboardClient({ initialArticles, initialUsers, initialStats, initialSettings }: DashboardClientProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string; extra?: string } | null>(null);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    // Data states
    const [articles, setArticles] = useState(initialArticles);
    const [users, setUsers] = useState(initialUsers);
    const [stats] = useState(initialStats);
    const [settings] = useState(initialSettings);

    // New Data States
    const [applications, setApplications] = useState<RowDataPacket[]>([]);
    const [mediaItems, setMediaItems] = useState<RowDataPacket[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Filtered Data
    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const router = useRouter();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const auth = sessionStorage.getItem("adminAuth");
        if (auth !== "true") {
             router.push("/admin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Fetch new data when tab changes
    useEffect(() => {
        if (activeTab === "careers") {
            getApplications().then(setApplications);
        } else if (activeTab === "media") {
            getImages().then(setMediaItems);
        }
    }, [activeTab]);

    const handleLogout = async () => {
        sessionStorage.removeItem("adminAuth");
        await logoutAdmin();
    };

    const handleDelete = (type: string, id: number, name: string, extra?: string) => {
        setDeleteTarget({ type, id, name, extra });
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteTarget) {
            try {
                if (deleteTarget.type === "article") {
                    await deletePost(deleteTarget.name); // passing slug
                    setArticles(articles.filter(a => a.slug !== deleteTarget.name));
                } else if (deleteTarget.type === "user") {
                    await deleteUser(deleteTarget.id);
                    setUsers(users.filter(u => u.id !== deleteTarget.id));
                } else if (deleteTarget.type === "media") {
                    if (deleteTarget.extra) {
                         await deleteImage(deleteTarget.id, deleteTarget.extra);
                         setMediaItems(mediaItems.filter(m => m.id !== deleteTarget.id));
                    }
                }
            } catch (error) {
                console.error("Failed to delete", error);
                alert(`Failed to delete ${deleteTarget.type}`);
            }
        }
        setShowDeleteModal(false);
        setDeleteTarget(null);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setShowEditUserModal(true);
    };

    const saveUserChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            try {
                const form = e.target as HTMLFormElement;
                const newPlan = (form.elements.namedItem("plan") as HTMLSelectElement).value;

                await updateUserPlan(editingUser.id, newPlan);

                setUsers(users.map(u => u.id === editingUser.id ? { ...u, plan: newPlan } : u));
                setShowEditUserModal(false);
                setEditingUser(null);
            } catch (error) {
                console.error("Failed to update user", error);
                alert("Failed to update user plan");
            }
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        alert("User creation is not fully implemented yet (requires Auth integration).");
        setShowAddUserModal(false);
    };

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        try {
            await updateSettings(formData);
            alert("Settings saved successfully!");
        } catch (error) {
             console.error("Failed to save settings", error);
             alert("Failed to save settings");
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        await updateApplicationStatus(id, newStatus);
        setApplications(applications.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", e.target.files[0]);

            try {
                const result = await uploadImage(formData);
                if (result.success) {
                    getImages().then(setMediaItems); // Refresh
                } else {
                    alert("Upload failed");
                }
            } catch (err) {
                console.error(err);
                alert("Upload failed");
            } finally {
                setIsUploading(false);
            }
        }
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
                            <p className="text-xs text-gray-500">{settings.siteName}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                                    {stats.map((stat) => {
                                        const Icon = icons[stat.iconName] || Users;
                                        return (
                                            <motion.div
                                                key={stat.id}
                                                variants={itemVariants}
                                                whileHover={{ y: -5 }}
                                                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                                    </div>
                                                    <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                                        {stat.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                        {stat.change}
                                                    </div>
                                                </div>
                                                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                                                <p className="text-gray-400 text-sm">{stat.label}</p>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>

                                {/* Recent Activity - Still using slice(0,4) of full lists for overview */}
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
                                            {users.slice(0, 4).map((user) => (
                                                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors">
                                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                        <Image src={user.avatar} alt={user.name} fill sizes="40px" className="object-cover" />
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
                                            {users.length === 0 && <p className="text-gray-500 text-sm">No users found.</p>}
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
                                            {articles.slice(0, 4).map((article) => (
                                                <div key={article.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image src={article.img} alt={article.title} fill sizes="48px" className="object-cover" />
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
                                            {articles.length === 0 && <p className="text-gray-500 text-sm">No articles found.</p>}
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
                                    <button
                                        onClick={() => setShowAddUserModal(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
                                    >
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
                                            {filteredUsers.map((user) => (
                                                <motion.tr
                                                    key={user.id}
                                                    variants={itemVariants}
                                                    className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                                <Image src={user.avatar} alt={user.name} fill sizes="40px" className="object-cover" />
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
                                                            <button
                                                                onClick={() => handleEditUser(user)}
                                                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                                            >
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
                                            {filteredUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                        No users found matching "{searchQuery}".
                                                    </td>
                                                </tr>
                                            )}
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
                                    <Link href="/admin/write" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity">
                                        <Plus className="w-4 h-4" />
                                        New Article
                                    </Link>
                                </div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-4"
                                >
                                    {filteredArticles.map((article) => (
                                        <motion.div
                                            key={article.id}
                                            variants={itemVariants}
                                            whileHover={{ x: 5 }}
                                            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4"
                                        >
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image src={article.img} alt={article.title} fill sizes="80px" className="object-cover" />
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
                                                <Link href={`/article/${article.slug}`} className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link href={`/admin/edit/${article.slug}`} className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete("article", article.id, article.slug)}
                                                    className="p-2.5 bg-gray-800 hover:bg-red-500/20 rounded-xl transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {filteredArticles.length === 0 && (
                                         <p className="text-gray-500 text-sm p-4 text-center">No articles found matching "{searchQuery}".</p>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Careers Tab */}
                        {activeTab === "careers" && (
                            <motion.div
                                key="careers"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold mb-1">Job Applications</h1>
                                    <p className="text-gray-400 text-sm">Manage recruitment pipeline</p>
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
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Applicant</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Role</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                                                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                                                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((app) => (
                                                <motion.tr
                                                    key={app.id}
                                                    variants={itemVariants}
                                                    className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-sm">{app.applicant_name}</p>
                                                            <p className="text-xs text-gray-500">{app.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-300">{app.job_title}</td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={app.status}
                                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                                            className="bg-gray-800 border border-gray-700 text-xs rounded-lg px-2 py-1 focus:outline-none"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="reviewing">Reviewing</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(app.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <a
                                                            href={app.resume_path}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-purple-400 hover:underline text-sm"
                                                        >
                                                            View Resume
                                                        </a>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                            {applications.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                        No applications found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Media Tab */}
                        {activeTab === "media" && (
                             <motion.div
                                key="media"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-1">Media Library</h1>
                                        <p className="text-gray-400 text-sm">Manage uploaded assets</p>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="media-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                        />
                                        <label
                                            htmlFor="media-upload"
                                            className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                            Upload Image
                                        </label>
                                    </div>
                                </div>

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                                >
                                    {mediaItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            variants={itemVariants}
                                            className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-square"
                                        >
                                            <Image
                                                src={item.url}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                 <button
                                                    onClick={() => window.open(item.url, '_blank')}
                                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete("media", item.id, item.name, item.url)}
                                                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-xs truncate text-gray-300">
                                                {item.name}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {mediaItems.length === 0 && (
                                         <p className="col-span-full text-gray-500 text-sm py-8 text-center">No media found.</p>
                                    )}
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

                                <motion.form
                                    onSubmit={handleSaveSettings}
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
                                                    name="siteName"
                                                    defaultValue={settings.siteName}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-400 block mb-2">Site Description</label>
                                                <textarea
                                                    name="siteDescription"
                                                    defaultValue={settings.siteDescription}
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Security - Mock for now */}
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
                                        type="submit"
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Settings
                                    </motion.button>
                                </motion.form>
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

             {/* Edit User Modal */}
            <AnimatePresence>
                {showEditUserModal && editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowEditUserModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full"
                        >
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Edit User</h3>
                                <button onClick={() => setShowEditUserModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={saveUserChanges} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Name</label>
                                    <input
                                        type="text"
                                        defaultValue={editingUser.name}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                 <div>
                                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={editingUser.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Plan / Role</label>
                                    <select
                                        name="plan"
                                        defaultValue={editingUser.plan}
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                    >
                                        <option value="Explorer">Explorer</option>
                                        <option value="Reader">Reader</option>
                                        <option value="Visionary">Visionary</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity mt-4"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

             {/* Add User Modal */}
            <AnimatePresence>
                {showAddUserModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowAddUserModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full"
                        >
                             <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add New User</h3>
                                <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                 <div>
                                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Plan</label>
                                    <select
                                        name="plan"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                    >
                                        <option value="Explorer">Explorer</option>
                                        <option value="Reader">Reader</option>
                                        <option value="Visionary">Visionary</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Create User
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
