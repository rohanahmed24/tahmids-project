"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/actions/newsletter";

export default function SubscribePage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");

        try {
            const result = await subscribeToNewsletter(email);
            if (result.success) {
                setStatus("success");
                setMessage(result.message || "Successfully subscribed!");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(result.error || "Failed to subscribe");
            }
        } catch {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-primary flex items-center justify-center px-6 pt-24 pb-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-lg text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8"
                >
                    <Mail className="w-10 h-10 text-white" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
                    Stay in the Loop
                </h1>
                <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                    Get weekly curated stories, exclusive insights, and thought-provoking content delivered straight to your inbox.
                </p>

                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-testid="status-success"
                        className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-400 mb-2">You're In!</h2>
                        <p className="text-text-secondary" data-testid="text-success-message">{message}</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email..."
                                required
                                data-testid="input-subscribe-email"
                                className="w-full pl-12 pr-4 py-4 bg-bg-secondary border border-border-primary rounded-xl text-text-primary placeholder:text-text-muted focus:border-accent-main focus:outline-none transition-colors"
                            />
                        </div>

                        {status === "error" && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                data-testid="status-error-message"
                                className="text-red-400 text-sm"
                            >
                                {message}
                            </motion.p>
                        )}

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            data-testid="button-subscribe-submit"
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Subscribe Now
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>
                )}

                <p className="text-text-muted text-xs mt-6" data-testid="text-no-spam">
                    No spam, ever. Unsubscribe anytime.
                </p>

                <Link
                    href="/"
                    data-testid="link-back-home"
                    className="inline-block mt-8 text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                    ← Back to Home
                </Link>
            </motion.div>
        </main>
    );
}
