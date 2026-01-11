"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateUserRole } from "@/actions/users";
import { useState } from "react";
import { User } from "@/lib/users";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onUserUpdated: (userId: number, newRole: 'user' | 'admin') => void;
}

export function EditUserModal({ isOpen, onClose, user, onUserUpdated }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const saveUserChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            const form = e.target as HTMLFormElement;
            const newRole = (form.elements.namedItem("role") as HTMLSelectElement).value as 'user' | 'admin';

            await updateUserRole(user.id, newRole);

            onUserUpdated(user.id, newRole);
            onClose();
        } catch (error) {
            console.error("Failed to update user", error);
            alert("Failed to update user role");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && user && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-bg-secondary border border-border-primary rounded-2xl p-8 max-w-md w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-text-primary">Edit User</h3>
                            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={saveUserChanges} className="space-y-4">
                            <div>
                                <label className="text-sm text-text-secondary block mb-2">Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    disabled
                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border-primary rounded-xl text-text-tertiary cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary block mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-bg-tertiary border border-border-primary rounded-xl text-text-tertiary cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-text-secondary block mb-2">Role</label>
                                <select
                                    name="role"
                                    defaultValue={user.role}
                                    className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl focus:border-accent-primary focus:outline-none transition-colors text-text-primary"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-accent-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent-primary/90 transition-colors mt-4 disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
