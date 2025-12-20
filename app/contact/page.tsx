"use client";

import { FAQ } from "@/components/FAQ";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Assets } from "@/lib/assets";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            {/* 1. Header Section */}
            <section className="pt-40 pb-20 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-text-primary mb-6 block">Support</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-medium text-text-primary tracking-tighter leading-[0.9]">
                        Get in <br />
                        <span className="italic font-light opacity-60">Touch</span>
                    </h1>
                </MotionWrapper>
            </section>

            {/* 1.5 Conceptual Image */}
            <section className="w-full h-[400px] relative">
                <Image src={Assets.imgContactStationery} alt="The Art of Correspondence" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </section>

            {/* 2. Contact Form & Info Grid */}
            <section className="py-20 px-6 md:px-12 bg-bg-secondary border-y border-border-subtle">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-serif font-bold text-text-primary">Send us a message</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Name</label>
                                    <input type="text" className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Email</label>
                                    <input type="email" className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Message</label>
                                <textarea rows={6} className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="px-8 py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity w-full md:w-auto">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-12 lg:pl-12 lg:border-l border-border-subtle">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-text-primary">
                                <Mail className="w-6 h-6 text-accent" />
                                <span className="text-lg font-sans">hello@wisdomia.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-primary">
                                <Phone className="w-6 h-6 text-accent" />
                                <span className="text-lg font-sans">+1 (555) 000-0000</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-primary">
                                <MapPin className="w-6 h-6 text-accent" />
                                <span className="text-lg font-sans">123 Wisdom Ave, New York, NY</span>
                            </div>
                        </div>
                        <div className="p-8 bg-bg-card rounded-xl border border-border-subtle">
                            <h4 className="text-xl font-serif font-bold text-text-primary mb-2">Editorial Inquiries</h4>
                            <p className="text-text-secondary text-sm mb-4">For press, licensing, and partnership opportunities.</p>
                            <a href="#" className="text-accent font-bold text-sm tracking-widest uppercase hover:underline">Contact Editorial →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FAQ Section */}
            <FAQ />
        </main>
    );
}
