"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ExternalLink, AlertTriangle, Lightbulb, CheckCircle2 } from "lucide-react";

const tutorialSteps = [
    {
        title: "Google Search Console Account তৈরি করুন",
        titleEn: "Create Google Search Console Account",
        content: `
            <ol class="list-decimal list-inside space-y-3 text-text-secondary">
                <li><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer"
                    class="text-accent-primary hover:underline inline-flex items-center gap-1">Google Search Console
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a> এ যান</li>
                <li>আপনার Google account দিয়ে Sign in করুন</li>
                <li><strong>"Add Property"</strong> বাটনে ক্লিক করুন</li>
                <li><strong>"URL prefix"</strong> অপশন সিলেক্ট করুন এবং আপনার সাইটের URL দিন:<br/>
                    <code class="bg-bg-tertiary px-2 py-1 rounded text-sm mt-2 inline-block text-accent-primary">
                        https://thewisdomia.com
                    </code>
                </li>
                <li><strong>"Continue"</strong> ক্লিক করে পরের ধাপে যান</li>
            </ol>
        `,
        estimatedTime: "2-3 মিনিট"
    },
    {
        title: "HTML Tag Verification Method বেছে নিন",
        titleEn: "Choose HTML Tag Verification",
        content: `
            <ol class="list-decimal list-inside space-y-3 text-text-secondary">
                <li>Verification পেজে <strong>"Other verification methods"</strong> দেখুন</li>
                <li><strong>"HTML tag"</strong> অপশনে ক্লিক করুন</li>
                <li>Google আপনাকে এরকম একটা meta tag দেখাবে:<br/>
                    <code class="bg-bg-tertiary px-2 py-1 rounded text-xs mt-2 block overflow-x-auto whitespace-nowrap">
                        &lt;meta name="google-site-verification" content="<span class="text-accent-primary font-bold">ABC123xyz...</span>" /&gt;
                    </code>
                </li>
                <li>শুধুমাত্র <code class="bg-bg-tertiary px-1.5 py-0.5 rounded text-xs">content="..."</code> এর ভেতরের অংশটি কপি করুন</li>
                <li>এই পেজটি খোলা রাখুন - পরে "Verify" বাটনে ক্লিক করতে হবে</li>
            </ol>
            <div class="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2">
                <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <p class="text-sm text-amber-600 dark:text-amber-400">
                    <strong>গুরুত্বপূর্ণ:</strong> পুরো tag কপি করবেন না, শুধু content এর value টুকু কপি করুন।
                </p>
            </div>
        `,
        estimatedTime: "1 মিনিট"
    },
    {
        title: "এখানে Verification Tag যোগ করুন",
        titleEn: "Add Your Verification Tag",
        content: `
            <ol class="list-decimal list-inside space-y-3 text-text-secondary">
                <li>কপি করা verification code নিচের ইনপুট ফিল্ডে paste করুন</li>
                <li><strong>"Save Verification Tag"</strong> বাটনে ক্লিক করুন</li>
                <li>Success message আসার জন্য অপেক্ষা করুন</li>
                <li>Google Search Console এ ফিরে গিয়ে <strong>"Verify"</strong> বাটনে ক্লিক করুন</li>
                <li>Google আপনার সাইট চেক করে ownership confirm করবে</li>
            </ol>
            <div class="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-sm text-blue-600 dark:text-blue-400">
                    <strong>টিপ:</strong> Verification কয়েক মিনিট সময় নিতে পারে। প্রথমবার fail হলে 5 মিনিট পর আবার চেষ্টা করুন।
                </p>
            </div>
        `,
        estimatedTime: "2-5 মিনিট"
    },
    {
        title: "Sitemap Submit করুন",
        titleEn: "Submit Your Sitemap",
        content: `
            <ol class="list-decimal list-inside space-y-3 text-text-secondary">
                <li>Verification এর পর, বাম সাইডবারে <strong>"Sitemaps"</strong> এ যান</li>
                <li>"Add a new sitemap" ফিল্ডে লিখুন:<br/>
                    <code class="bg-bg-tertiary px-2 py-1 rounded text-sm mt-2 inline-block text-accent-primary">
                        sitemap.xml
                    </code>
                </li>
                <li><strong>"Submit"</strong> বাটনে ক্লিক করুন</li>
                <li>Google আপনার sitemap fetch করে পেজগুলো index করা শুরু করবে</li>
            </ol>
            <div class="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-2">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-sm text-green-600 dark:text-green-400">
                    <strong>Good news:</strong> আপনার sitemap automatically generate হয় এবং সব published articles include করে। নতুন content publish করলে sitemap আপডেট হয়ে যায়।
                </p>
            </div>
            <div class="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-start gap-2">
                <svg class="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-sm text-purple-600 dark:text-purple-400">
                    <strong>কতদিন লাগবে?</strong> Google সাধারণত 2-7 দিনের মধ্যে নতুন সাইট index করে। কিছু ক্ষেত্রে 2-4 সপ্তাহ পর্যন্ত সময় লাগতে পারে।
                </p>
            </div>
        `,
        estimatedTime: "1-2 মিনিট"
    }
];

export default function SEOTutorialAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary overflow-hidden">
            <div className="p-6 border-b border-border-primary bg-gradient-to-r from-bg-secondary to-bg-tertiary/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-primary/10 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary">
                            Setup Guide
                        </h2>
                        <p className="text-sm text-text-secondary mt-0.5">
                            Google Search Console এ সাইট connect করতে এই steps follow করুন
                        </p>
                    </div>
                </div>
            </div>

            <div className="divide-y divide-border-primary">
                {tutorialSteps.map((step, idx) => (
                    <div key={idx}>
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex justify-between items-center p-5 sm:p-6 group text-left
                                hover:bg-bg-tertiary/30 transition-colors"
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full
                                    text-sm font-bold transition-colors flex-shrink-0
                                    ${openIndex === idx
                                        ? 'bg-accent-primary text-white'
                                        : 'bg-bg-tertiary text-text-secondary'}`}
                                >
                                    {idx + 1}
                                </span>
                                <div>
                                    <span className={`text-base sm:text-lg font-medium transition-colors block
                                        ${openIndex === idx ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {step.title}
                                    </span>
                                    <span className="text-xs text-text-tertiary hidden sm:block">
                                        {step.titleEn}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <span className="text-xs text-text-tertiary hidden sm:block px-2 py-1 bg-bg-tertiary rounded-full">
                                    {step.estimatedTime}
                                </span>
                                <div className={`transition-transform duration-300
                                    ${openIndex === idx ? 'rotate-180' : ''}`}>
                                    {openIndex === idx
                                        ? <Minus className="w-5 h-5 text-text-primary" />
                                        : <Plus className="w-5 h-5 text-text-tertiary" />
                                    }
                                </div>
                            </div>
                        </button>

                        <AnimatePresence>
                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className="px-5 sm:px-6 pb-6 pl-[3.25rem] sm:pl-[4.5rem]"
                                        dangerouslySetInnerHTML={{ __html: step.content }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
