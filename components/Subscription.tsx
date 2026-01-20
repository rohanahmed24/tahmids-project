"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { subscribeToNewsletter } from "@/actions/newsletter";

export function Subscription() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        
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
        <section className="w-full py-10 md:py-32 bg-[#4A3428] text-white overflow-hidden relative">
            {/* Decorative Circles - Adjusted opacity for brown background */}
            <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-black/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-7xl font-serif font-medium mb-4 md:mb-6 tracking-tight text-white">
                    Stay <span className="italic opacity-70">Ahead</span>
                </h2>
                <p className="text-base md:text-lg opacity-90 mb-8 md:mb-12 font-sans font-light text-white/90">
                    Join 50,000+ readers receiving our weekly curation of timeless wisdom and modern insights.
                </p>

                {status === "success" ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        data-testid="status-success"
                        className="flex items-center justify-center gap-3 text-white"
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5" />
                        </div>
                        <span data-testid="text-success-message" className="text-lg font-medium">{message}</span>
                    </motion.div>
                ) : (
                    <>
                        {/* Mobile: Stacked Form */}
                        <form onSubmit={handleSubmit} className="md:hidden flex flex-col gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type your email..."
                                required
                                data-testid="input-subscription-email-mobile"
                                className="w-full bg-white/10 border border-white/30 rounded-full px-6 py-4 text-base placeholder:text-white/60 text-white focus:outline-none focus:border-white transition-colors"
                            />
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileTap={{ scale: 0.95 }}
                                data-testid="button-subscription-submit-mobile"
                                className="w-full bg-white text-[#4A3428] font-bold text-sm uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 active:opacity-90 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Subscribe
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* Desktop: Inline Form */}
                        <form onSubmit={handleSubmit} className="hidden md:block relative group">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type your email..."
                                required
                                data-testid="input-subscription-email-desktop"
                                className="w-full bg-transparent border-b-2 border-white/30 py-6 text-2xl font-serif placeholder:text-white/60 text-white focus:outline-none focus:border-white transition-colors"
                            />
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.05, x: 5 }}
                                whileTap={{ scale: 0.95 }}
                                data-testid="button-subscription-submit-desktop"
                                className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-white hover:opacity-80 transition-opacity disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Subscribe
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {status === "error" && (
                            <p data-testid="status-error-message" className="mt-4 text-red-300 text-sm">{message}</p>
                        )}
                    </>
                )}
                
                <div data-testid="text-no-spam" className="mt-6 text-xs opacity-60 uppercase tracking-widest text-white/60">
                    No spam. Unsubscribe anytime.
                </div>
            </div>
        </section>
    );
}
