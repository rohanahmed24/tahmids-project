"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, Check, Newspaper } from "lucide-react";
import Link from "next/link";
import { subscribeToNewsletter } from "@/actions/newsletter";

export default function NewslettersPage() {
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

    const newsletters = [
        {
            title: "Weekly Wisdom",
            description: "A curated selection of the week's best stories, delivered every Sunday.",
            frequency: "Weekly"
        },
        {
            title: "Breaking Insights",
            description: "Major stories and breaking news that matter, as they happen.",
            frequency: "As needed"
        },
        {
            title: "Deep Dives",
            description: "In-depth analysis and long-form journalism on important topics.",
            frequency: "Monthly"
        }
    ];

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary pt-32 pb-20 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-accent mb-4">
                        <Newspaper className="w-5 h-5" />
                        <span className="font-mono text-sm uppercase tracking-widest">Newsletters</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-black mb-6">
                        Stay Informed
                    </h1>
                    <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                        Subscribe to our newsletters and never miss a story. Get curated content delivered directly to your inbox.
                    </p>
                </div>

                <div className="grid gap-6 mb-16">
                    {newsletters.map((newsletter, index) => (
                        <motion.div
                            key={newsletter.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            data-testid={`card-newsletter-${index}`}
                            className="bg-bg-secondary border border-border-primary rounded-2xl p-6 md:p-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 data-testid={`text-newsletter-title-${index}`} className="text-xl font-bold text-text-primary mb-2">{newsletter.title}</h3>
                                    <p data-testid={`text-newsletter-description-${index}`} className="text-text-secondary">{newsletter.description}</p>
                                    <span data-testid={`text-newsletter-frequency-${index}`} className="inline-block mt-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
                                        {newsletter.frequency}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="max-w-lg mx-auto">
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-border-primary rounded-2xl p-8 text-center">
                        <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-4">Subscribe to All</h2>
                        <p className="text-text-secondary mb-6">
                            Get all our newsletters with a single subscription.
                        </p>

                        {status === "success" ? (
                            <div data-testid="status-success" className="flex items-center justify-center gap-2 text-green-400">
                                <Check className="w-5 h-5" />
                                <span data-testid="text-success-message">{message}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address..."
                                    required
                                    data-testid="input-newsletter-email"
                                    className="flex-1 px-4 py-3 bg-bg-primary border border-border-primary rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    data-testid="button-newsletter-subscribe"
                                    className="px-6 py-3 bg-accent text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
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
                        )}

                        {status === "error" && (
                            <p data-testid="status-error-message" className="text-red-400 text-sm mt-3">{message}</p>
                        )}
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="/"
                        data-testid="link-back-home"
                        className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
