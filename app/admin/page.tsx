"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAdmin } from "@/actions/admin-auth";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await loginAdmin(password);

            if (result.success) {
                // Also keep sessionStorage for Client UI state if needed, but cookie is main source of truth
                sessionStorage.setItem("adminAuth", "true");
                router.push("/admin/dashboard");
            } else {
                setError(result.error || "Access denied.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Shield Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8"
                >
                    <Shield className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">
                        Admin Access
                    </h1>
                    <p className="text-gray-400 text-sm">
                        This area is restricted. Enter your credentials to continue.
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleLogin}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 text-red-400 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    {/* Password Field */}
                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm mb-2">
                            Admin Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password..."
                                className="w-full pl-12 pr-12 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Access Dashboard
                            </>
                        )}
                    </motion.button>

                    {/* Security Notice */}
                    <p className="text-center text-gray-600 text-xs mt-6">
                        🔒 256-bit encrypted connection
                    </p>
                </motion.form>

                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-6"
                >
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-white text-sm transition-colors"
                    >
                        ← Back to Website
                    </Link>
                </motion.div>
            </motion.div>
        </main>
    );
}
