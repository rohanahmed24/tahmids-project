"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function SignInPage() {
    const router = useRouter();
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            fillAll: "সব ঘর পূরণ করুন",
            invalid: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
            wrong: "কিছু ভুল হয়েছে",
            couldNotWith: "সাইন ইন করা যায়নি",
            welcomeBack: "আবার স্বাগতম!",
            redirectingDash: "আপনাকে ড্যাশবোর্ডে নেওয়া হচ্ছে...",
            redirecting: "রিডাইরেক্ট হচ্ছে...",
            unlock: "অসাধারণ সম্ভাবনা",
            unlock2: "উন্মুক্ত করুন",
            leftBody: "চিন্তাশীল পাঠক, নির্মাতা ও উদ্ভাবকদের কমিউনিটিতে যোগ দিন। প্রিমিয়াম কনটেন্ট ও বিশেষ ইনসাইট পান।",
            joinMembers: "১০k+ সদস্যের সাথে যোগ দিন",
            signIn: "সাইন ইন",
            newHere: "নতুন?",
            createAccount: "অ্যাকাউন্ট তৈরি করুন",
            email: "ইমেইল",
            password: "পাসওয়ার্ড",
            forgot: "ভুলে গেছেন?",
            orContinue: "অথবা চালিয়ে যান",
        }
        : {
            fillAll: "Please fill in all fields",
            invalid: "Invalid credentials",
            wrong: "Something went wrong",
            couldNotWith: "Could not sign in with",
            welcomeBack: "Welcome Back!",
            redirectingDash: "Redirecting you to your dashboard...",
            redirecting: "Redirecting...",
            unlock: "Unlock the",
            unlock2: "extraordinary.",
            leftBody: "Join a community of thinkers, creators, and innovators. Access premium content and exclusive insights.",
            joinMembers: "Join 10k+ members",
            signIn: "Sign In",
            newHere: "New here?",
            createAccount: "Create an account",
            email: "Email",
            password: "Password",
            forgot: "Forgot?",
            orContinue: "Or continue with",
        };
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

        if (!formData.email.trim() || !formData.password) {
            setError(copy.fillAll);
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
                setError(copy.invalid);
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setIsLoading(false);
            router.push("/dashboard");
        } catch {
            setError(copy.wrong);
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        setError("");
        setIsLoading(true);
        try {
            await signIn(provider.toLowerCase(), { callbackUrl: "/" });
        } catch {
            setError(`${copy.couldNotWith} ${provider}`);
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 text-center space-y-6 max-w-md bg-white/5 backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30"
                    >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </motion.div>
                    <h2 className="text-3xl font-serif font-bold">{copy.welcomeBack}</h2>
                    <p className="text-gray-400">{copy.redirectingDash}</p>
                    <div className="flex items-center justify-center gap-2 text-purple-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">{copy.redirecting}</span>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white flex relative overflow-hidden pt-24">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            {/* Left Side - Visual */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 z-10"
            >
                <Link href="/" className="text-2xl font-serif font-black tracking-tighter">WISDOMIA</Link>
                <div className="space-y-8">
                    <h1 className="text-6xl font-serif font-bold leading-tight">
                        {copy.unlock} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{copy.unlock2}</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-md">
                        {copy.leftBody}
                    </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-xs font-bold">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <p>{copy.joinMembers}</p>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold mb-2">{copy.signIn}</h2>
                        <p className="text-gray-400 text-sm">
                            {copy.newHere} <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">{copy.createAccount}</Link>
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{copy.email}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="name@example.com"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-500">{copy.password}</label>
                                <Link href="/forgot-password" className="text-xs text-purple-400 hover:text-purple-300">{copy.forgot}</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 p-4 pr-12 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{copy.signIn} <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-4 text-gray-500">{copy.orContinue}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("Google")}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("GitHub")}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            GitHub
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
