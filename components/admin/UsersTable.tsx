"use client";

import { User } from "@/lib/users";
import { Shield, Sparkles, Edit2, X, Users, FileText, MoreVertical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { updateUserProfile } from "@/actions/users";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    return (
        <div className="relative">
            {/* Desktop Table View */}
            <div className="hidden md:block max-h-80 lg:max-h-96 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-bg-secondary z-10">
                        <tr className="border-b border-border-primary">
                            <th className="text-left p-3 lg:p-4 text-text-secondary font-medium text-xs lg:text-sm">User</th>
                            <th className="text-left p-3 lg:p-4 text-text-secondary font-medium text-xs lg:text-sm">Role</th>
                            <th className="text-left p-3 lg:p-4 text-text-secondary font-medium text-xs lg:text-sm hidden lg:table-cell">Status</th>
                            <th className="text-left p-3 lg:p-4 text-text-secondary font-medium text-xs lg:text-sm">Articles</th>
                            <th className="text-right p-3 lg:p-4 text-text-secondary font-medium text-xs lg:text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                className="border-b border-border-primary hover:bg-bg-tertiary/50 transition-colors group"
                            >
                                <td className="p-3 lg:p-4">
                                    <div className="flex items-center gap-2 lg:gap-3">
                                        <div className="relative w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-accent-primary to-purple-600
                                            rounded-full flex items-center justify-center overflow-hidden shrink-0
                                            shadow-sm group-hover:shadow-md transition-shadow">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-white text-xs lg:text-sm font-semibold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-medium text-text-primary text-sm truncate max-w-[120px] lg:max-w-none">
                                                {user.name}
                                            </h3>
                                            <p className="text-xs text-text-tertiary truncate max-w-[120px] lg:max-w-[180px]">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 lg:p-4">
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
                                        ${user.role === 'admin'
                                            ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                                        <Shield className="w-3 h-3" />
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </td>
                                <td className="p-3 lg:p-4 hidden lg:table-cell">
                                    {user.isFeatured ? (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full
                                            bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                            <Sparkles className="w-3 h-3" />
                                            <span className="text-xs font-semibold">Featured</span>
                                        </div>
                                    ) : (
                                        <span className="text-text-tertiary text-xs">Regular</span>
                                    )}
                                </td>
                                <td className="p-3 lg:p-4">
                                    <div className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-text-tertiary" />
                                        <span className="text-text-secondary text-sm font-medium">
                                            {user.article_count || 0}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3 lg:p-4 text-right">
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setEditingUser(user)}
                                        className="p-2 text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10
                                            rounded-lg transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </motion.button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden max-h-80 overflow-y-auto divide-y divide-border-primary">
                {users.length === 0 ? (
                    <div className="p-6 text-center">
                        <Users className="w-10 h-10 text-text-tertiary mx-auto mb-2" />
                        <p className="text-text-secondary text-sm">No users found</p>
                    </div>
                ) : (
                    users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="p-3"
                        >
                            <div
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                            >
                                <div className="relative w-10 h-10 bg-gradient-to-br from-accent-primary to-purple-600
                                    rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <span className="text-white text-sm font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-text-primary text-sm truncate">
                                            {user.name}
                                        </h3>
                                        {user.isFeatured && (
                                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded
                                            ${user.role === 'admin'
                                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                                            {user.role}
                                        </span>
                                        <span className="text-[10px] text-text-tertiary">
                                            {user.article_count || 0} articles
                                        </span>
                                    </div>
                                </div>

                                <MoreVertical className="w-4 h-4 text-text-tertiary shrink-0" />
                            </div>

                            {/* Expanded Actions */}
                            <AnimatePresence>
                                {expandedUserId === user.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-3 mt-3 border-t border-border-primary flex items-center justify-between">
                                            <p className="text-xs text-text-tertiary truncate max-w-[200px]">
                                                {user.email}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingUser(user);
                                                }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-accent-primary
                                                    hover:bg-accent-primary/10 rounded-lg text-xs font-medium transition-colors"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit Profile
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Edit Modal - Responsive */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
                        onClick={() => setEditingUser(null)}
                    >
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-bg-secondary w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-border-primary
                                shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border-primary bg-bg-tertiary/30 shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-purple-600
                                        rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">
                                            {editingUser.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-text-primary">Edit Profile</h3>
                                        <p className="text-xs text-text-tertiary">{editingUser.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form
                                action={async (formData) => {
                                    await updateUserProfile(formData);
                                    setEditingUser(null);
                                    toast.success("Writer profile updated");
                                }}
                                className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1"
                            >
                                <input type="hidden" name="id" value={editingUser.id} />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Public Title</label>
                                    <input
                                        name="title"
                                        defaultValue={editingUser.title || ""}
                                        placeholder="e.g. Senior Editor"
                                        className="w-full px-4 py-3 sm:py-2.5 bg-bg-primary border border-border-primary rounded-xl
                                            focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary
                                            text-text-primary text-base sm:text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Bio</label>
                                    <textarea
                                        name="bio"
                                        defaultValue={editingUser.bio || ""}
                                        placeholder="Short biography..."
                                        rows={3}
                                        className="w-full px-4 py-3 sm:py-2.5 bg-bg-primary border border-border-primary rounded-xl
                                            focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary
                                            text-text-primary resize-none text-base sm:text-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-text-secondary">Featured Order</label>
                                        <input
                                            type="number"
                                            name="featuredOrder"
                                            defaultValue={editingUser.featuredOrder || 0}
                                            className="w-full px-4 py-3 sm:py-2.5 bg-bg-primary border border-border-primary rounded-xl
                                                focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary
                                                text-text-primary text-base sm:text-sm"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 cursor-pointer p-3 sm:p-3 border border-border-primary
                                            rounded-xl hover:bg-bg-tertiary/50 transition-colors w-full">
                                            <input
                                                type="checkbox"
                                                name="isFeatured"
                                                defaultChecked={editingUser.isFeatured || false}
                                                className="w-5 h-5 accent-accent-primary rounded"
                                            />
                                            <div>
                                                <span className="font-medium text-text-primary text-sm">Feature Writer</span>
                                                <p className="text-[10px] text-text-tertiary">Show on homepage</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3
                                    border-t border-border-primary mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="w-full sm:w-auto px-4 py-3 sm:py-2 text-text-secondary hover:text-text-primary
                                            font-medium rounded-xl hover:bg-bg-tertiary transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-accent-primary text-white rounded-xl
                                            hover:bg-accent-primary/90 font-medium transition-all shadow-lg shadow-accent-primary/25"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}