"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { createNewUser } from "@/actions/users";
import { useState, useCallback } from "react";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserAdded: () => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

interface NotificationState {
    type: 'success' | 'error' | null;
    message: string;
}

export function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [notification, setNotification] = useState<NotificationState>({ type: null, message: '' });

    // Clear form state when modal opens/closes
    const resetForm = useCallback(() => {
        setErrors({});
        setNotification({ type: null, message: '' });
        setIsLoading(false);
    }, []);

    // Validate form data
    const validateForm = (formData: FormData): FormErrors => {
        const errors: FormErrors = {};
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!name?.trim()) {
            errors.name = "Name is required";
        } else if (name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }

        if (!email?.trim()) {
            errors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email address";
        }

        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            errors.password = "Password must contain uppercase, lowercase, and number";
        }

        return errors;
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // Validate form
        const formErrors = validateForm(formData);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});
        setNotification({ type: null, message: '' });

        try {
            const result = await createNewUser(formData);
            if (result.success) {
                setNotification({ 
                    type: 'success', 
                    message: 'User created successfully!' 
                });
                
                // Delay to show success message
                setTimeout(() => {
                    onUserAdded();
                    onClose();
                    form.reset();
                    resetForm();
                }, 1500);
            } else {
                setNotification({ 
                    type: 'error', 
                    message: 'Failed to create user. Please try again.' 
                });
            }
        } catch (error) {
            console.error('Create user error:', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'An unexpected error occurred';
            setNotification({ 
                type: 'error', 
                message: errorMessage 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            resetForm();
            onClose();
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
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-bg-secondary border border-border-primary rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-text-primary">Add New User</h3>
                            <button 
                                onClick={handleClose} 
                                disabled={isLoading}
                                className="text-text-secondary hover:text-text-primary disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 rounded-lg p-1"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Notification */}
                        <AnimatePresence>
                            {notification.type && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                                        notification.type === 'success' 
                                            ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                                            : 'bg-red-500/10 text-red-600 border border-red-500/20'
                                    }`}
                                >
                                    {notification.type === 'success' ? (
                                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    )}
                                    <span className="text-sm">{notification.message}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleAddUser} className="space-y-4" noValidate>
                            {/* Name Field */}
                            <div>
                                <label 
                                    htmlFor="user-name" 
                                    className="text-sm text-text-secondary block mb-2"
                                >
                                    Name *
                                </label>
                                <input
                                    id="user-name"
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    className={`w-full px-4 py-3 bg-bg-primary border rounded-xl focus:outline-none transition-colors text-text-primary ${
                                        errors.name 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-border-primary focus:border-accent-primary'
                                    }`}
                                    required
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                    aria-invalid={!!errors.name}
                                />
                                {errors.name && (
                                    <p id="name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label 
                                    htmlFor="user-email" 
                                    className="text-sm text-text-secondary block mb-2"
                                >
                                    Email *
                                </label>
                                <input
                                    id="user-email"
                                    type="email"
                                    name="email"
                                    placeholder="user@example.com"
                                    className={`w-full px-4 py-3 bg-bg-primary border rounded-xl focus:outline-none transition-colors text-text-primary ${
                                        errors.email 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-border-primary focus:border-accent-primary'
                                    }`}
                                    required
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && (
                                    <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label 
                                    htmlFor="user-password" 
                                    className="text-sm text-text-secondary block mb-2"
                                >
                                    Password *
                                </label>
                                <input
                                    id="user-password"
                                    type="password"
                                    name="password"
                                    placeholder="Minimum 8 characters"
                                    className={`w-full px-4 py-3 bg-bg-primary border rounded-xl focus:outline-none transition-colors text-text-primary ${
                                        errors.password 
                                            ? 'border-red-500 focus:border-red-500' 
                                            : 'border-border-primary focus:border-accent-primary'
                                    }`}
                                    required
                                    minLength={8}
                                    aria-describedby={errors.password ? "password-error" : "password-help"}
                                    aria-invalid={!!errors.password}
                                />
                                {errors.password ? (
                                    <p id="password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.password}
                                    </p>
                                ) : (
                                    <p id="password-help" className="text-text-tertiary text-xs mt-1">
                                        Must contain uppercase, lowercase, and number
                                    </p>
                                )}
                            </div>

                            {/* Role Field */}
                            <div>
                                <label 
                                    htmlFor="user-role" 
                                    className="text-sm text-text-secondary block mb-2"
                                >
                                    Role
                                </label>
                                <select
                                    id="user-role"
                                    name="role"
                                    className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-xl focus:border-accent-primary focus:outline-none transition-colors text-text-primary"
                                    defaultValue="user"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-accent-primary text-white font-bold uppercase tracking-widest rounded-xl hover:bg-accent-primary/90 transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
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
