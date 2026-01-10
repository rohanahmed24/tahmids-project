"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { updateUserPlan } from "@/actions/users";
import { useState } from "react";

import { User } from "../dashboard/types";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onUserUpdated: (userId: number, newPlan: string) => void;
}

export function EditUserModal({ isOpen, onClose, user, onUserUpdated }: EditUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const saveUserChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            const form = e.target as HTMLFormElement;
            const newPlan = (form.elements.namedItem("plan") as HTMLSelectElement).value;

            await updateUserPlan(user.id, newPlan);

            onUserUpdated(user.id, newPlan);
            onClose();
        } catch (error) {
            console.error("Failed to update user", error);
            alert("Failed to update user plan");
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
                        className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Edit User</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={saveUserChanges} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Name</label>
                                <input
                                    type="text"
                                    defaultValue={user.name}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Plan / Role</label>
                                <select
                                    name="plan"
                                    defaultValue={user.plan}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                >
                                    <option value="Explorer">Explorer</option>
                                    <option value="Reader">Reader</option>
                                    <option value="Visionary">Visionary</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
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
