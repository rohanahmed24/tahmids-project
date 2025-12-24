"use client";

import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { ArrowRight, ShieldCheck, Star, Zap } from "lucide-react";

export default function SignInPage() {
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
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                                <input type="email" className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="name@example.com" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Password</label>
                                    <a href="#" className="text-xs text-accent hover:underline">Forgot?</a>
                                </div>
                                <input type="password" className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all" placeholder="••••••••" />
                            </div>
                            <button className="w-full bg-text-primary text-bg-primary py-4 rounded-lg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                Sign In <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="mt-8 text-center text-sm text-text-secondary">
                            <p className="text-text-muted">Don&apos;t have an account? <a href="#" className="font-bold text-text-primary hover:underline">Join Wisdomia</a></p>
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
                    <a href="#" className="text-text-secondary hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1">Reset Password</a>
                    <a href="#" className="text-text-secondary hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1">Contact Support</a>
                </div>
            </section>
        </main>
    );
}
