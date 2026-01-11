"use client";

import { useState } from "react";
import { Post } from "@/lib/posts";
import { Edit, Trash2, Eye, EyeOff, Calendar, User, FileText } from "lucide-react";
import { deletePost, togglePostStatus } from "@/actions/posts";
import Link from "next/link";
import Image from "next/image";

interface PostsTableProps {
    posts: Post[];
}

export function PostsTable({ posts }: PostsTableProps) {
    const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
    const [sortBy, setSortBy] = useState<"date" | "views" | "title">("date");

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
        <div className="space-y-4">
            {/* Filters and Controls */}
            <div className="flex items-center justify-between p-4 border-b border-border-primary">
                <div className="flex items-center gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as "all" | "published" | "draft")}
                        className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                        <option value="all">All Posts ({posts.length})</option>
                        <option value="published">Published ({posts.filter(p => p.published).length})</option>
                        <option value="draft">Drafts ({posts.filter(p => !p.published).length})</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "date" | "views" | "title")}
                        className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="views">Sort by Views</option>
                        <option value="title">Sort by Title</option>
                    </select>
                </div>

                <Link
                    href="/admin/write"
                    className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
                >
                    New Article
                </Link>
            </div>

            {/* Posts Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border-primary">
                            <th className="text-left p-4 text-text-secondary font-medium">Title</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Author</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Category</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Status</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Views</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Date</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPosts.map((post) => (
                            <tr key={post.slug} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {post.coverImage && (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                width={48}
                                                height={48}
                                                className="object-cover rounded-lg"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium text-text-primary line-clamp-1">
                                                {post.title}
                                            </h3>
                                            {post.subtitle && (
                                                <p className="text-sm text-text-secondary line-clamp-1">
                                                    {post.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-text-tertiary" />
                                        <span className="text-text-secondary">{post.author}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-bg-tertiary text-text-secondary rounded-md text-sm">
                                        {post.category}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${post.published ? "bg-green-500" : "bg-yellow-500"
                                            }`} />
                                        <span className={`text-sm ${post.published ? "text-green-600" : "text-yellow-600"
                                            }`}>
                                            {post.published ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-text-tertiary" />
                                        <span className="text-text-secondary">{post.views || 0}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-text-tertiary" />
                                        <span className="text-text-secondary">
                                            {new Date(post.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/edit/${post.slug}`}
                                            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleToggleStatus(post.slug, post.published || false)}
                                            className="p-2 text-text-secondary hover:text-blue-500 transition-colors"
                                            title={post.published ? "Unpublish" : "Publish"}
                                        >
                                            {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.slug)}
                                            className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sortedPosts.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No posts found</h3>
                    <p className="text-text-secondary mb-4">
                        {filter === "all" ? "Get started by creating your first article" : `No ${filter} posts found`}
                    </p>
                    <Link
                        href="/admin/write"
                        className="inline-flex items-center px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
                    >
                        Create New Article
                    </Link>
                </div>
            )}
        </div>
    );
}