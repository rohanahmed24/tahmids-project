"use client";

import { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Loader2, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { subscribeToNewsletter } from "@/actions/newsletter";

interface SubscriptionPopupProps {
    delay?: number; // Delay in milliseconds before showing popup
}

export function SubscriptionPopup({ delay = 15000 }: SubscriptionPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check if user already subscribed or dismissed recently
        const dismissed = localStorage.getItem("subscription_popup_dismissed");
        const subscribed = localStorage.getItem("subscribed");

        if (dismissed || subscribed) {
            const dismissedTime = parseInt(dismissed || "0");
            // Don't show if dismissed within last 7 days
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                return;
            }
        }

        // Show popup after delay
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("subscription_popup_dismissed", Date.now().toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        setStatus("idle");

        try {
            const result = await subscribeToNewsletter(email);
            if (result.success) {
                setStatus("success");
                setMessage(result.message || "You're all set! 🎉");
                localStorage.setItem("subscribed", "true");
                // Close popup after 2 seconds
                setTimeout(() => {
                    setIsOpen(false);
                }, 2000);
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101]"
                    >
                        <div className="bg-gradient-to-br from-bg-primary to-bg-secondary border border-border-subtle rounded-2xl shadow-2xl overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-tertiary rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Content */}
                            <div className="p-6 md:p-8">
                                {/* Icon */}
                                <div className="w-16 h-16 mx-auto mb-6 bg-accent-primary/10 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-accent-primary" />
                                </div>

                                {status === "success" ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                            <Check className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-text-primary mb-2">Welcome aboard!</h3>
                                        <p className="text-text-secondary">{message}</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-center text-text-primary mb-2">
                                            Stay in the Loop
                                        </h3>
                                        <p className="text-center text-text-secondary mb-6">
                                            Get our best stories delivered to your inbox. Free, forever.
                                        </p>

                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Enter your email"
                                                    required
                                                    className="w-full bg-bg-tertiary border border-border-subtle rounded-xl pl-12 pr-4 py-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        Subscribe Free
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                )}
                                            </button>
                                        </form>

                                        {status === "error" && (
                                            <p className="mt-4 text-red-400 text-sm text-center">{message}</p>
                                        )}

                                        <p className="mt-4 text-xs text-center text-text-muted">
                                            No spam. Unsubscribe anytime.
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Decorative gradient */}
                            <div className="h-1 bg-gradient-to-r from-accent-primary via-purple-500 to-pink-500" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
