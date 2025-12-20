"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Zap, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
    {
        id: "free",
        name: "Reader",
        description: "For casual readers who want to explore",
        monthlyPrice: 0,
        yearlyPrice: 0,
        icon: Sparkles,
        color: "from-gray-500 to-gray-600",
        features: [
            "Access to 5 free articles per month",
            "Weekly newsletter",
            "Community discussions",
            "Basic bookmarking",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        id: "pro",
        name: "Explorer",
        description: "For dedicated readers seeking deeper wisdom",
        monthlyPrice: 12,
        yearlyPrice: 99,
        icon: Zap,
        color: "from-accent to-blue-600",
        features: [
            "Unlimited article access",
            "Ad-free reading experience",
            "Early access to new content",
            "Exclusive podcasts & videos",
            "Priority support",
            "Download for offline reading",
        ],
        cta: "Start Exploring",
        popular: true,
    },
    {
        id: "premium",
        name: "Visionary",
        description: "For thought leaders who want it all",
        monthlyPrice: 29,
        yearlyPrice: 249,
        icon: Crown,
        color: "from-amber-500 to-orange-600",
        features: [
            "Everything in Explorer",
            "1-on-1 author sessions",
            "Exclusive masterclasses",
            "Private community access",
            "Personalized recommendations",
            "White-glove concierge support",
            "First access to events",
        ],
        cta: "Become a Visionary",
        popular: false,
    },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 80,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
        },
    },
};

const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,

        },
    }),
};

const floatingVariants = {
    animate: {
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
        transition: {
            duration: 6,
            repeat: Infinity,

        },
    },
};

const glowVariants = {
    animate: {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        transition: {
            duration: 3,
            repeat: Infinity,

        },
    },
};

const titleLetterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.05,
            duration: 0.5,
        },
    }),
};

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    const title = "Choose Your Journey";

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl"
                />
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: "2s" }}
                    className="absolute bottom-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    variants={glowVariants}
                    animate="animate"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"
                />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-accent" />
                        </motion.span>
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">
                            Simple, transparent pricing
                        </span>
                    </motion.div>

                    {/* Animated Title - Word by Word for proper mobile wrapping */}
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6">
                        {title.split(" ").map((word, i) => (
                            <motion.span
                                key={i}
                                custom={i}
                                variants={titleLetterVariants}
                                initial="hidden"
                                animate="visible"
                                className="inline-block mr-[0.25em]"
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12"
                    >
                        Unlock the wisdom you deserve. Every plan is designed to
                        elevate your mind and enrich your perspective.
                    </motion.p>

                    {/* Animated Toggle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex items-center justify-center gap-4 mb-16"
                    >
                        <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-text-primary" : "text-text-muted"}`}>
                            Monthly
                        </span>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-16 h-8 bg-bg-secondary rounded-full p-1 transition-colors"
                        >
                            <motion.div
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className={`w-6 h-6 rounded-full bg-accent shadow-lg ${isYearly ? "ml-auto" : ""}`}
                            />
                        </motion.button>
                        <span className={`text-sm font-medium transition-colors ${isYearly ? "text-text-primary" : "text-text-muted"}`}>
                            Yearly
                        </span>
                        <AnimatePresence>
                            {isYearly && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 10, scale: 0.8 }}
                                    className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-full"
                                >
                                    Save 30%
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="relative px-6 pb-32">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            variants={cardVariants}
                            whileHover={{
                                y: -10,
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                            className={`relative group ${plan.popular ? "md:-mt-8 md:mb-8" : ""}`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                                >
                                    <div className="px-4 py-1 bg-accent text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-accent/30">
                                        Most Popular
                                    </div>
                                </motion.div>
                            )}

                            {/* Card Glow Effect */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${plan.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                            />

                            {/* Card Content */}
                            <div className={`relative h-full bg-bg-secondary border ${plan.popular ? "border-accent/50" : "border-border-subtle"} rounded-3xl p-8 flex flex-col`}>
                                {/* Icon */}
                                <motion.div
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.6 }}
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}
                                >
                                    <plan.icon className="w-7 h-7 text-white" />
                                </motion.div>

                                {/* Plan Info */}
                                <h3 className="text-2xl font-serif font-bold mb-2">{plan.name}</h3>
                                <p className="text-text-muted text-sm mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-8">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isYearly ? "yearly" : "monthly"}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-baseline gap-1"
                                        >
                                            <span className="text-5xl font-serif font-bold">
                                                ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                            </span>
                                            <span className="text-text-muted text-sm">
                                                /{isYearly ? "year" : "month"}
                                            </span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, i) => (
                                        <motion.li
                                            key={feature}
                                            custom={i}
                                            variants={featureVariants}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="flex items-start gap-3"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.3, rotate: 10 }}
                                                className="mt-0.5"
                                            >
                                                <Check className="w-5 h-5 text-accent" />
                                            </motion.div>
                                            <span className="text-sm text-text-secondary">{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group/btn
                                        ${plan.popular
                                            ? "bg-accent text-white hover:shadow-lg hover:shadow-accent/30"
                                            : "bg-bg-primary border border-border-subtle hover:bg-black hover:text-white hover:border-black"
                                        }`}
                                >
                                    {plan.cta}
                                    <motion.span
                                        initial={{ x: 0 }}
                                        whileHover={{ x: 5 }}
                                        className="inline-block"
                                    >
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </motion.span>
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* FAQ Teaser */}
            <section className="relative px-6 pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                        Questions? We've got <span className="italic text-accent">answers</span>.
                    </h2>
                    <p className="text-text-secondary mb-8">
                        Our team is here to help you find the perfect plan for your journey.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-bg-secondary border border-border-subtle rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all"
                        >
                            Contact Support
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Guarantee Section */}
            <section className="relative px-6 pb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto bg-gradient-to-br from-accent/10 to-blue-500/10 border border-accent/20 rounded-3xl p-12 text-center"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="inline-block mb-6"
                    >
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-accent" />
                        </div>
                    </motion.div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">
                        30-Day Money-Back Guarantee
                    </h3>
                    <p className="text-text-secondary max-w-xl mx-auto">
                        Not satisfied? No problem. We'll refund your payment within 30 days,
                        no questions asked. Your journey to wisdom should be risk-free.
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
