"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    { question: "What is Wisdomenia?", answer: "Wisdomenia is a curated digital publication dedicated to exploring culture, design, and future technology through long-form storytelling." },
    { question: "How does the subscription work?", answer: "Our membership is simple: $9/month or $90/year. You get unlimited access to all stories, the full archive, and our weekly curated newsletter." },
    { question: "Can I cancel anytime?", answer: "Yes. We believe in freedom. You can turn off auto-renew at any time from your account settings, no questions asked." },
    { question: "Do you offer student discounts?", answer: "We support lifelong learning. Students with a valid .edu email get 50% off. Contact support@wisdomenia.com to apply." },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="w-full bg-bg-primary py-32 px-6 md:px-12 border-b border-border-subtle">
            <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                {/* Header */}
                <div className="lg:col-span-4 space-y-6">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-text-muted">Support</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-text-primary leading-tight">
                        Common <br />
                        <span className="italic opacity-60">Queries</span>
                    </h2>
                    <p className="text-lg text-text-secondary font-sans max-w-xs">
                        Everything you need to know about the platform and membership.
                    </p>
                </div>

                {/* Accordion */}
                <div className="lg:col-span-8 space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-border-subtle last:border-0">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex justify-between items-center py-6 group text-left"
                            >
                                <span className={`text-xl md:text-2xl font-serif transition-colors duration-300 ${openIndex === idx ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                                    {faq.question}
                                </span>
                                <div className={`relative w-6 h-6 text-text-primary transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : 'rotate-0'}`}>
                                    {openIndex === idx ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-8 text-base md:text-lg text-text-secondary font-sans max-w-2xl leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
