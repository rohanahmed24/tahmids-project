"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus } from "lucide-react";
import { registerUser } from "@/actions/auth";
import { useState } from "react";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserAdded: () => void;
}

export function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const result = await registerUser(formData);
            if (result.success) {
                alert("User created successfully!");
                onUserAdded();
                onClose();
            } else {
                alert(result.message || "Failed to create user");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                            <h3 className="text-xl font-bold">Add New User</h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-400 block mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Temporary Password"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                                    required
                                    minLength={8}
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
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-red-500 to-purple-600 font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <UserPlus className="w-4 h-4" />
                                {isLoading ? "Creating..." : "Create User"}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
