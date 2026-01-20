"use client";

import { User } from "@/lib/users";
import { Shield, Sparkles, Edit2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { updateUserProfile } from "@/actions/users";
import { toast } from "sonner";

interface UsersTableProps {
    users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
    const [editingUser, setEditingUser] = useState<User | null>(null);

    return (
        <div className="space-y-4 relative">
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                    <thead className="sticky top-0 bg-bg-secondary z-10">
                        <tr className="border-b border-border-primary">
                            <th className="text-left p-4 text-text-secondary font-medium">User</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Role</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Writer Status</th>
                            <th className="text-left p-4 text-text-secondary font-medium">Articles</th>
                            <th className="text-right p-4 text-text-secondary font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-border-primary hover:bg-bg-tertiary/50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center overflow-hidden">
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <span className="text-white text-sm font-medium">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-text-primary">
                                                {user.name}
                                            </h3>
                                            <p className="text-sm text-text-secondary">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`} />
                                        <span className={`text-sm capitalize ${user.role === 'admin' ? 'text-red-600' : 'text-blue-600'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {user.isFeatured ? (
                                        <div className="flex items-center gap-2 text-amber-500">
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Featured</span>
                                        </div>
                                    ) : (
                                        <span className="text-text-muted text-sm">-</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className="text-text-secondary">
                                        {user.article_count || 0}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setEditingUser(user)}
                                        className="p-2 text-text-secondary hover:text-accent-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-bg-secondary w-full max-w-lg rounded-2xl border border-border-primary shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-border-primary bg-bg-tertiary/30">
                            <h3 className="text-xl font-bold text-text-primary">Edit Writer Profile</h3>
                            <button onClick={() => setEditingUser(null)} className="text-text-secondary hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form action={async (formData) => {
                            await updateUserProfile(formData);
                            setEditingUser(null);
                            toast.success("Writer profile updated");
                        }} className="p-6 space-y-4">
                            <input type="hidden" name="id" value={editingUser.id} />

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Public Title</label>
                                <input
                                    name="title"
                                    defaultValue={editingUser.title || ""}
                                    placeholder="e.g. Senior Editor"
                                    className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:border-accent-primary text-text-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Bio</label>
                                <textarea
                                    name="bio"
                                    defaultValue={editingUser.bio || ""}
                                    placeholder="Short biography..."
                                    rows={3}
                                    className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:border-accent-primary text-text-primary resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-text-secondary">Featured Order</label>
                                    <input
                                        type="number"
                                        name="featuredOrder"
                                        defaultValue={editingUser.featuredOrder || 0}
                                        className="w-full px-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:border-accent-primary text-text-primary"
                                    />
                                </div>
                                <div className="space-y-2 flex-1 flex flex-col justify-center">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 border border-border-primary rounded-lg hover:bg-bg-primary transition-colors">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            defaultChecked={editingUser.isFeatured || false}
                                            className="w-5 h-5 accent-accent-primary"
                                        />
                                        <span className="font-medium text-text-primary">Feature on Home</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-border-primary mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 text-text-secondary hover:text-text-primary font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:opacity-90 font-medium transition-opacity"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}