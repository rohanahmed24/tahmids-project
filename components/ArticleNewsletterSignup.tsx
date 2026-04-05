"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";

interface ArticleNewsletterSignupProps {
    locale: string;
    variant: "inline" | "footer";
}

const copyByLocale = {
    bn: {
        inlineBadge: "প্রিমিয়াম অ্যাক্সেস",
        inlineTitle: "SIGN UP করে নিন ad-free premium experience!",
        inlineBody: "100% FREE",
        inlineSecondary: "NO SPAM",
        inlineTertiary: "১টি Newsletter প্রতি সপ্তাহে",
        inlineCta: "Sign Up",
        footerBadge: "নিউজলেটার",
        footerTitle: "লেখাটি ভালো লেগেছে? নিউজলেটারে যোগ দিন",
        footerBody: "পড়ার শেষে এখান থেকেই যুক্ত হোন। ভবিষ্যতের গুরুত্বপূর্ণ লেখা ও আপডেট ইমেইলে পেয়ে যাবেন।",
        placeholder: "আপনার ইমেইল লিখুন",
        submit: "সাবস্ক্রাইব",
        finePrint: "স্প্যাম নয়। যখন খুশি আনসাবস্ক্রাইব করতে পারবেন।",
        success: "ধন্যবাদ। আপনি এখন নিউজলেটার তালিকায় যুক্ত আছেন।",
        error: "সাবস্ক্রাইব করা যায়নি। আবার চেষ্টা করুন।",
    },
    en: {
        inlineBadge: "Premium Access",
        inlineTitle: "SIGN UP for ad-free premium experience!",
        inlineBody: "100% FREE",
        inlineSecondary: "NO SPAM",
        inlineTertiary: "1 Newsletter each week",
        inlineCta: "Sign Up",
        footerBadge: "Newsletter",
        footerTitle: "Enjoying?",
        footerBody: "Sign up for newsletter to stay connected.",
        placeholder: "Enter your email",
        submit: "Subscribe",
        finePrint: "1 mail each week. No spam. Unsubscribe anytime.",
        success: "You are on the list. Watch your inbox for future updates.",
        error: "Subscription failed. Please try again.",
    },
} as const;

export function ArticleNewsletterSignup({
    locale,
    variant,
}: ArticleNewsletterSignupProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isBangla = locale === "bn";
    const copy = isBangla ? copyByLocale.bn : copyByLocale.en;
    const isInline = variant === "inline";
    const inlineStyles = isInline
        ? {
            section: {
                backgroundColor: "var(--bg-card)",
                borderColor: "color-mix(in srgb, var(--accent-gold) 42%, var(--border-subtle) 58%)",
            },
            badge: {
                backgroundColor: "color-mix(in srgb, var(--accent-gold) 12%, var(--bg-card) 88%)",
                borderColor: "color-mix(in srgb, var(--accent-gold) 38%, transparent 62%)",
                color: "color-mix(in srgb, var(--accent-gold) 62%, var(--text-primary) 38%)",
            },
            title: {
                color: "var(--text-primary)",
            },
            body: {
                color: "var(--text-secondary)",
            },
            input: {
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "color-mix(in srgb, var(--accent-gold) 34%, var(--border-subtle) 66%)",
            },
            finePrint: {
                color: "var(--text-muted)",
            },
        }
        : null;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!email.trim()) return;

        setIsSubmitting(true);
        setStatus("idle");
        setMessage("");

        try {
            const result = await subscribeToNewsletter(email, {
                source: isInline ? "article-inline" : "article-footer",
                locale,
            });

            if (result.success) {
                setStatus("success");
                setMessage(result.message || copy.success);
                setEmail("");
                return;
            }

            setStatus("error");
            setMessage(result.error || copy.error);
        } catch {
            setStatus("error");
            setMessage(copy.error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isInline) {
        return (
            <section className="overflow-hidden rounded-[28px] border border-[#c8a26c]/40 bg-[linear-gradient(145deg,rgba(29,20,12,0.96),rgba(12,12,12,0.98))] text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
                <div className="relative px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
                    <div className="pointer-events-none absolute -right-16 -top-12 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
                    <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-amber-200 to-purple-400" />

                    <div className="relative flex flex-col items-center text-center gap-6">
                        <div className="max-w-3xl space-y-4">
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
                                <span>{copy.inlineBadge}</span>
                            </div>

                            <h2 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl text-white">
                                {copy.inlineTitle}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
                                <p className="rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm sm:text-base font-bold tracking-wide text-amber-200 dark:text-white uppercase">
                                    {copy.inlineBody}
                                </p>
                                <p className="rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm sm:text-base font-bold tracking-wide text-amber-200 dark:text-white uppercase">
                                    {copy.inlineSecondary}
                                </p>
                            </div>

                            <p className="text-base sm:text-lg text-white/90 font-medium">
                                {copy.inlineTertiary}
                            </p>
                        </div>

                        <div className="w-full max-w-xs shrink-0">
                            <Link
                                href="/register"
                                className="inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-300 to-amber-200 px-5 py-3 text-sm font-semibold text-[#1f140a] transition hover:brightness-105"
                            >
                                <span>{copy.inlineCta}</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            style={inlineStyles?.section}
            className={`overflow-hidden rounded-[28px] border border-border-primary ${
                isInline
                    ? "shadow-[0_18px_50px_rgba(106,78,43,0.08)] dark:shadow-[0_18px_50px_rgba(0,0,0,0.32)]"
                    : "bg-[linear-gradient(145deg,rgba(76,44,24,0.92),rgba(24,24,24,0.96))] text-white"
            }`}
        >
            <div className="relative px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
                <div
                    className={`pointer-events-none absolute ${
                        isInline
                            ? "-right-12 -top-12 h-40 w-40 bg-[#d8b788]/18 dark:bg-[#c6a87c]/10"
                            : "-left-10 -bottom-10 h-44 w-44 bg-amber-400/10"
                    } rounded-full blur-3xl`}
                />
                {isInline && (
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#b88c4a] via-[#d8b788] to-[#7a5a2b] dark:from-[#a77c3a] dark:via-[#d8b788] dark:to-[#6b4e25]" />
                )}

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <div
                            style={inlineStyles?.badge}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${
                                isInline
                                    ? ""
                                    : "border-white/15 bg-white/10 text-white/80"
                            }`}
                        >
                            <Mail className="h-3.5 w-3.5" />
                            <span>{isInline ? copy.inlineBadge : copy.footerBadge}</span>
                        </div>

                        <div className="space-y-2">
                            <h2
                                style={inlineStyles?.title}
                                className={`font-serif text-2xl font-semibold leading-tight sm:text-3xl ${
                                    isInline ? "" : "text-white"
                                }`}
                            >
                                {isInline ? copy.inlineTitle : copy.footerTitle}
                            </h2>
                            <p
                                style={inlineStyles?.body}
                                className={`max-w-xl text-sm leading-6 sm:text-base ${
                                    isInline ? "" : "text-white dark:text-white"
                                }`}
                            >
                                {isInline ? copy.inlineBody : copy.footerBody}
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-xl lg:max-w-md">
                        {status === "success" ? (
                            <div
                                className={`flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-4 ${
                                    isInline
                                        ? "border-green-700/20 bg-[#f7fff8] text-green-900 dark:border-green-400/25 dark:bg-[#162219] dark:text-green-200"
                                        : "border-green-400/30 bg-green-400/10 text-green-100"
                                }`}
                            >
                                <CheckCircle2 className="h-5 w-5 shrink-0" />
                                <p className="text-sm font-medium">{message || copy.success}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder={copy.placeholder}
                                        required
                                        style={inlineStyles?.input}
                                        className={`min-h-12 flex-1 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 ${
                                            isInline
                                                ? "shadow-sm placeholder:text-text-muted"
                                                : "border-white/15 bg-white/10 text-white placeholder:text-white/45"
                                        }`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                            isInline
                                                ? "bg-[#0a2540] text-white shadow-[0_12px_24px_rgba(10,37,64,0.18)] hover:bg-[#13385e] dark:bg-[#d8b788] dark:text-[#20150b] dark:shadow-[0_12px_24px_rgba(0,0,0,0.24)] dark:hover:bg-[#e4c79d]"
                                                : "bg-white text-[#4c2c18] hover:bg-white/90"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <span>{copy.submit}</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p
                                        style={inlineStyles?.finePrint}
                                        className={`text-xs ${
                                            isInline ? "" : "text-white/70"
                                        }`}
                                    >
                                        {copy.finePrint}
                                    </p>
                                    {status === "error" && (
                                        <p className={`text-xs font-medium ${isInline ? "text-red-700 dark:text-red-300" : "text-red-400"}`}>{message || copy.error}</p>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
