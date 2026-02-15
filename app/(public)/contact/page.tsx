"use client";

import { FAQ } from "@/components/FAQ";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Assets } from "@/lib/assets";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function ContactPage() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            support: "সহায়তা",
            getIn: "যোগাযোগে",
            touch: "আসুন",
            imageAlt: "চিঠিপত্রের শিল্প",
            sendMessage: "আমাদের বার্তা পাঠান",
            name: "নাম",
            email: "ইমেইল",
            message: "বার্তা",
            send: "বার্তা পাঠান",
            namePlaceholder: "জন ডো",
            emailPlaceholder: "john@example.com",
            messagePlaceholder: "কীভাবে সাহায্য করতে পারি?",
            editorialInquiries: "সম্পাদকীয় জিজ্ঞাসা",
            editorialBody: "প্রেস, লাইসেন্সিং এবং পার্টনারশিপ সংক্রান্ত বিষয়ে।",
            editorialLink: "সম্পাদকীয় বিভাগে যোগাযোগ →",
        }
        : {
            support: "Support",
            getIn: "Get in",
            touch: "Touch",
            imageAlt: "The Art of Correspondence",
            sendMessage: "Send us a message",
            name: "Name",
            email: "Email",
            message: "Message",
            send: "Send Message",
            namePlaceholder: "John Doe",
            emailPlaceholder: "john@example.com",
            messagePlaceholder: "How can we help?",
            editorialInquiries: "Editorial Inquiries",
            editorialBody: "For press, licensing, and partnership opportunities.",
            editorialLink: "Contact Editorial →",
        };

    return (
        <main className="min-h-screen bg-bg-primary transition-colors duration-300">
            {/* 1. Header Section */}
            <section className="pt-28 pb-20 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-text-primary mb-6 block">{copy.support}</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-medium text-text-primary tracking-tighter leading-[0.9]">
                        {copy.getIn} <br />
                        <span className="italic font-light opacity-60">{copy.touch}</span>
                    </h1>
                </MotionWrapper>
            </section>

            {/* 1.5 Conceptual Image */}
            <section className="w-full h-[400px] relative">
                <Image src={Assets.imgContactStationery} alt={copy.imageAlt} fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-black/20" />
            </section>

            {/* 2. Contact Form & Info Grid */}
            <section className="py-20 px-6 md:px-12 bg-bg-secondary border-y border-border-subtle">
                <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-serif font-bold text-text-primary">{copy.sendMessage}</h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted">{copy.name}</label>
                                    <input type="text" className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder={copy.namePlaceholder} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-text-muted">{copy.email}</label>
                                    <input type="email" className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder={copy.emailPlaceholder} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">{copy.message}</label>
                                <textarea rows={6} className="w-full bg-bg-primary border border-border-subtle p-4 text-text-primary focus:outline-none focus:border-accent transition-colors" placeholder={copy.messagePlaceholder}></textarea>
                            </div>
                            <button className="px-8 py-4 bg-text-primary text-bg-primary font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity w-full md:w-auto">
                                {copy.send}
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
                            <h4 className="text-xl font-serif font-bold text-text-primary mb-2">{copy.editorialInquiries}</h4>
                            <p className="text-text-secondary text-sm mb-4">{copy.editorialBody}</p>
                            <a href="#" className="text-accent font-bold text-sm tracking-widest uppercase hover:underline">{copy.editorialLink}</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FAQ Section */}
            <FAQ />
        </main>
    );
}
