"use client";

import { useState } from "react";
import { Post } from "@/lib/posts";
import { Edit, Trash2, Eye, EyeOff, Calendar, User, FileText, Filter, ArrowUpDown, MoreVertical, ExternalLink } from "lucide-react";
import { deletePost, togglePostStatus } from "@/actions/posts";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface PostsTableProps {
    posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
    const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
    const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date");
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const filteredPosts = posts.filter(post => {
        if (filter === "published") return post.published;
        if (filter === "draft") return !post.published;
        return true;
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        switch (sortBy) {
            case "views":
                return (b.views || 0) - (a.views || 0);
            case "title":
                return a.title.localeCompare(b.title);
            case "date":
            default:
                return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });

    const handleDelete = async (slug: string) => {
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(slug);
            } catch {
                alert("Failed to delete post");
            }
        }
    };

    const handleToggleStatus = async (slug: string, currentStatus: boolean) => {
        try {
            await togglePostStatus(slug, !currentStatus);
        } catch {
            alert("Failed to update post status");
        }
    };

    return (
        <div className="space-y-0">
            {/* Enhanced Filters and Controls */}
            <div className="flex flex-col gap-3 p-3 sm:p-4 border-b border-border-primary bg-bg-tertiary/30">
                {/* Filter Pills - Mobile Scrollable */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 sm:pb-0">
                    {[
                        { value: "all", label: "All", count: posts.length },
                        { value: "published", label: "Published", count: posts.filter(p => p.published).length },
                        { value: "draft", label: "Drafts", count: posts.filter(p => !p.published).length }
                    ].map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setFilter(option.value as typeof filter)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all
                                ${filter === option.value
                                    ? "bg-accent-primary text-white shadow-sm"
                                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border-primary"}`}
                        >
                            <Filter className="w-3 h-3" />
                            {option.label}
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                                filter === option.value ? "bg-white/20" : "bg-bg-tertiary"
                            }`}>
                                {option.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Sort & New Article Row */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-text-tertiary hidden sm:block" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "date" | "views" | "title")}
                            className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-accent-primary/50 text-xs sm:text-sm
                                text-text-primary cursor-pointer"
                        >
                            <option value="date">Latest First</option>
                            <option value="views">Most Viewed</option>
                            <option value="title">Alphabetical</option>
                        </select>
                    </div>

                    <Link
                        href="/admin/write"
                        className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-accent-primary text-white
                            rounded-lg hover:bg-accent-primary/90 transition-all text-xs sm:text-sm font-medium
                            shadow-sm hover:shadow-md active:scale-95"
                    >
                        <span className="hidden sm:inline">New Article</span>
                        <span className="sm:hidden">New</span>
                    </Link>
                </div>
            </div>

            {/* Posts Table (Desktop & Tablet) */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border-primary bg-bg-tertiary/20">
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Title</th>
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Author</th>
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Category</th>
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Status</th>
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Views</th>
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Date</th>
                            <th className="text-left p-4 text-text-secondary font-medium text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPosts.map((post, index) => (
                            <motion.tr
                                key={post.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="border-b border-border-primary hover:bg-bg-tertiary/50 transition-colors group"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                width={56}
                                                height={56}
                                                className="object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-bg-tertiary rounded-lg flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-text-tertiary" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-text-primary line-clamp-1 group-hover:text-accent-primary transition-colors">
                                                {post.title}
                                            </h3>
                                            {post.subtitle && (
                                                <p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
                                                    {post.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-bg-tertiary rounded-full flex items-center justify-center">
                                            <User className="w-3 h-3 text-text-tertiary" />
                                        </div>
                                        <span className="text-text-secondary text-sm">{post.author}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2.5 py-1 bg-bg-tertiary text-text-secondary rounded-full text-xs font-medium">
                                        {post.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                        ${post.published
                                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${post.published ? "bg-green-500" : "bg-yellow-500"}`} />
                                        {post.published ? "Published" : "Draft"}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-text-secondary">
                                        <Eye className="w-4 h-4 text-text-tertiary" />
                                        <span className="text-sm font-medium">{(post.views || 0).toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1.5 text-text-secondary text-sm">
                                        <Calendar className="w-4 h-4 text-text-tertiary" />
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: '2-digit'
                                        })}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/admin/edit/${post.slug}`}
                                            className="p-2 text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-all"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(post.slug, post.published || false)}
                                            className="p-2 text-text-secondary hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                            title={post.published ? "Unpublish" : "Publish"}
                                        >
                                            {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tablet Card Grid View */}
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3 p-3">
                {sortedPosts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-bg-primary rounded-xl border border-border-primary p-4 hover:shadow-lg hover:border-accent-primary/30 transition-all group"
                    >
                        <div className="flex gap-3">
                            {post.coverImage ? (
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    width={80}
                                    height={80}
                                    className="object-cover rounded-lg shrink-0"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-bg-tertiary rounded-lg flex items-center justify-center shrink-0">
                                    <FileText className="w-8 h-8 text-text-tertiary" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-medium text-text-primary line-clamp-2 text-sm group-hover:text-accent-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${post.published ? "bg-green-500" : "bg-yellow-500"}`} />
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
                                    <span>{post.category}</span>
                                    <span>•</span>
                                    <span>{(post.views || 0).toLocaleString()} views</span>
                                </div>
                                <div className="text-xs text-text-tertiary mt-1">
                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-primary">
                            <div className="flex items-center gap-1 text-xs text-text-secondary">
                                <User className="w-3 h-3" />
                                <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <Link href={`/admin/edit/${post.slug}`} className="p-1.5 text-text-secondary hover:text-accent-primary rounded-lg transition-colors">
                                    <Edit className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleToggleStatus(post.slug, post.published || false)} className="p-1.5 text-text-secondary hover:text-blue-500 rounded-lg transition-colors">
                                    {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button onClick={() => handleDelete(post.slug)} className="p-1.5 text-text-secondary hover:text-red-500 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Mobile Card View - Enhanced */}
            <div className="sm:hidden divide-y divide-border-primary">
                <AnimatePresence>
                    {sortedPosts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="bg-bg-primary"
                        >
                            <div
                                className="flex items-center gap-3 p-3 active:bg-bg-tertiary/50 transition-colors cursor-pointer"
                                onClick={() => setExpandedCard(expandedCard === post.slug ? null : post.slug)}
                            >
                                {post.coverImage ? (
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        width={52}
                                        height={52}
                                        className="object-cover rounded-lg shrink-0"
                                    />
                                ) : (
                                    <div className="w-[52px] h-[52px] bg-bg-tertiary rounded-lg flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5 text-text-tertiary" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start gap-2">
                                        <h3 className="font-medium text-text-primary line-clamp-1 text-sm flex-1">
                                            {post.title}
                                        </h3>
                                        <div className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium
                                            ${post.published
                                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"}`}
                                        >
                                            {post.published ? "Live" : "Draft"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-text-tertiary">
                                        <span>{post.category}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-0.5">
                                            <Eye className="w-3 h-3" />
                                            {(post.views || 0).toLocaleString()}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                                <MoreVertical className="w-4 h-4 text-text-tertiary shrink-0" />
                            </div>

                            {/* Expanded Actions */}
                            <AnimatePresence>
                                {expandedCard === post.slug && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-center justify-around py-2 px-3 bg-bg-tertiary/30 border-t border-border-primary">
                                            <Link
                                                href={`/admin/edit/${post.slug}`}
                                                className="flex items-center gap-1.5 px-3 py-2 text-text-secondary hover:text-accent-primary text-xs font-medium rounded-lg hover:bg-bg-primary transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleToggleStatus(post.slug, post.published || false); }}
                                                className="flex items-center gap-1.5 px-3 py-2 text-text-secondary hover:text-blue-500 text-xs font-medium rounded-lg hover:bg-bg-primary transition-colors"
                                            >
                                                {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                {post.published ? "Unpublish" : "Publish"}
                                            </button>
                                            <Link
                                                href={`/${post.slug}`}
                                                target="_blank"
                                                className="flex items-center gap-1.5 px-3 py-2 text-text-secondary hover:text-green-500 text-xs font-medium rounded-lg hover:bg-bg-primary transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View
                                            </Link>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(post.slug); }}
                                                className="flex items-center gap-1.5 px-3 py-2 text-text-secondary hover:text-red-500 text-xs font-medium rounded-lg hover:bg-bg-primary transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {sortedPosts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 sm:py-16 px-4"
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-bg-tertiary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2">No posts found</h3>
                    <p className="text-text-secondary text-sm sm:text-base mb-6 max-w-sm mx-auto">
                        {filter === "all" ? "Get started by creating your first article" : `No ${filter} posts found`}
                    </p>
                    <Link
                        href="/admin/write"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-primary text-white rounded-xl
                            hover:bg-accent-primary/90 transition-all shadow-lg shadow-accent-primary/25 font-medium"
                    >
                        Create New Article
                    </Link>
                </motion.div>
            )}
        </div>
    );
}