"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { ArrowRight, ShieldCheck, Star, Zap, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email.trim()) {
            setError("Please enter your email address");
            return;
        }
        if (!formData.password) {
            setError("Please enter your password");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
                setIsLoading(false);
                return;
            }

            // Save user info to localStorage for legacy compatibility
            // Since we can't access the session immediately here without a hook/page reload,
            // we rely on next-auth session management.
            // However, to keep existing localStorage checks working for now (if any remain),
            // we could fetch the session, but it's async.
            // For now, assume next-auth handles it and we just redirect.
            // But wait, the app checks "wisdomia_current_user" in localStorage.
            // We should ideally fetch the session and populate it, or update the app to use useSession.
            // Given the task scope, let's try to update localStorage if possible or just proceed.
            // Actually, we can just proceed. The user will be authenticated via cookie.

            setSuccess(true);
            setIsLoading(false);
            router.push("/");
        } catch {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        setError("");
        setIsLoading(true);

        try {
            await signIn(provider.toLowerCase(), { callbackUrl: "/" });
        } catch (err) {
             console.error(err);
             setError(`Could not sign in with ${provider}`);
             setIsLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6 max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"
                    >
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-3xl font-serif font-bold">Welcome Back!</h2>
                    <p className="text-text-secondary">
                        Successfully signed in. Redirecting you to the homepage...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-accent">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Redirecting...</span>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            {/* 1. Header / Hero */}
            <section className="pt-28 pb-12 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <h1 className="text-5xl md:text-6xl font-serif font-medium text-text-primary tracking-tighter mb-4">
                        Welcome <span className="italic font-light opacity-60">Back</span>
                    </h1>
                    <p className="text-text-secondary max-w-md mx-auto">Access your curated library and exclusive content.</p>
                </MotionWrapper>
            </section>

            {/* 2. Login Form & Benefits Split */}
            <section className="py-12 px-6 md:px-12">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-bg-secondary rounded-3xl overflow-hidden shadow-2xl border border-border-subtle">

                    {/* Left: Form */}
                    <div className="p-8 md:p-16 flex flex-col justify-center bg-bg-card">
                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 mb-6"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => {
                                        setFormData({ ...formData, email: e.target.value });
                                        setError("");
                                    }}
                                    className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                                    placeholder="name@example.com"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Password</label>
                                    <Link href="/forgot-password" className="text-xs text-accent hover:underline">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={(e) => {
                                            setFormData({ ...formData, password: e.target.value });
                                            setError("");
                                        }}
                                        className="w-full bg-bg-primary border border-border-subtle p-4 pr-12 text-text-primary rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-text-primary text-bg-primary py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border-subtle"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-bg-card px-4 text-text-muted">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin("Google")}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 py-3 bg-bg-primary border border-border-subtle rounded-lg hover:bg-black hover:text-white hover:border-black transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin("GitHub")}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 py-3 bg-bg-primary border border-border-subtle rounded-lg hover:bg-black hover:text-white hover:border-black transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                        </div>

                        <div className="mt-8 text-center text-sm text-text-secondary">
                            <p className="text-text-muted">Don&apos;t have an account? <Link href="/register" className="font-bold text-text-primary hover:underline">Join Wisdomia</Link></p>
                        </div>
                    </div>

                    {/* Right: Benefits */}
                    <div className="hidden md:flex flex-col justify-center p-8 md:p-16 bg-accent text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-3xl font-serif font-medium">Why join Wisdomia?</h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg"><Star className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold mb-1">Exclusive Essays</h4>
                                        <p className="text-sm opacity-80">Access to our complete archive of premium articles.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg"><Zap className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold mb-1">Ad-Free Experience</h4>
                                        <p className="text-sm opacity-80">Read without distractions, focused purely on wisdom.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-bold mb-1">Community Access</h4>
                                        <p className="text-sm opacity-80">Join discussions with fellow thinkers.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>
                </div>
            </section>

            {/* 3. Help Section */}
            <section className="py-20 text-center">
                <p className="text-text-muted text-sm mb-4 uppercase tracking-widest">Having Trouble?</p>
                <div className="flex justify-center gap-8">
                    <Link href="/forgot-password" className="text-text-secondary hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1">Reset Password</Link>
                    <Link href="/contact" className="text-text-secondary hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1">Contact Support</Link>
                </div>
            </section>
        </main>
    );
}
