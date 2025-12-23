"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle registration logic here

    };

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex">
            {/* Left Side - Branding */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 bg-accent relative overflow-hidden flex-col justify-between p-12"
            >
                {/* Decorative Elements */}
                <motion.div
                    animate={{
                        y: [-20, 20, -20],
                        rotate: [-5, 5, -5],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [20, -20, 20],
                        rotate: [5, -5, 5],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-40 left-10 w-96 h-96 bg-black/10 rounded-full blur-3xl"
                />

                {/* Logo */}
                <Link href="/" className="relative z-10">
                    <h1 className="text-3xl font-serif font-black text-white tracking-tighter">
                        WISDOMIA
                    </h1>
                </Link>

                {/* Content */}
                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
                            Begin your
                            <br />
                            <span className="italic opacity-80">journey</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-lg text-white/80 max-w-md leading-relaxed"
                    >
                        Join 50,000+ readers discovering timeless wisdom and modern insights every week.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="flex items-center gap-4"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold"
                                >
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <span className="text-white/70 text-sm">
                            Join our growing community
                        </span>
                    </motion.div>
                </div>

                {/* Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="relative z-10"
                >
                    <p className="text-white/60 text-sm italic">
                        "The only true wisdom is knowing you know nothing."
                    </p>
                    <p className="text-white/40 text-xs mt-2">— Socrates</p>
                </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/">
                            <h1 className="text-2xl font-serif font-black tracking-tighter">
                                WISDOMIA
                            </h1>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20"
                        >
                            <Sparkles className="w-3 h-3 text-accent" />
                            <span className="text-xs font-bold text-accent uppercase tracking-wide">
                                Free to join
                            </span>
                        </motion.div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold">
                            Create your account
                        </h2>
                        <p className="text-text-secondary">
                            Already have an account?{" "}
                            <Link href="/signin" className="text-accent hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium text-text-secondary">
                                Full Name
                            </label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full pl-12 pr-4 py-4 bg-bg-secondary border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Email Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium text-text-secondary">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-4 py-4 bg-bg-secondary border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    required
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium text-text-secondary">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-accent transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Create a password"
                                    className="w-full pl-12 pr-12 py-4 bg-bg-secondary border border-border-subtle rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-text-muted">
                                Must be at least 8 characters
                            </p>
                        </motion.div>

                        {/* Terms */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-start gap-3"
                        >
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-1 w-4 h-4 accent-accent"
                            />
                            <label htmlFor="terms" className="text-sm text-text-secondary">
                                I agree to the{" "}
                                <Link href="/terms" className="text-accent hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-accent hover:underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-4 bg-accent text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all flex items-center justify-center gap-2 group"
                        >
                            Create Account
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border-subtle"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-bg-primary px-4 text-text-muted">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <button className="flex items-center justify-center gap-2 py-3 bg-bg-secondary border border-border-subtle rounded-xl hover:bg-black hover:text-white hover:border-black transition-all font-medium text-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-bg-secondary border border-border-subtle rounded-xl hover:bg-black hover:text-white hover:border-black transition-all font-medium text-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
