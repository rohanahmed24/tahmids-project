"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getMenuCategories } from "@/actions/categories";

export function Footer() {
    const { locale } = useLocale();
    const copy = locale === "bn"
        ? {
            brandDesc: "গুরুত্বপূর্ণ গল্পের জন্য একটি ডিজিটাল ঠিকানা। আধুনিক চিন্তাশীল পাঠকের জন্য প্রজ্ঞা, নকশা ও সংস্কৃতি।",
            explore: "অন্বেষণ",
            company: "কোম্পানি",
            about: "আমাদের সম্পর্কে",
            advertise: "বিজ্ঞাপন",
            careers: "ক্যারিয়ার",
            contact: "যোগাযোগ",
            privacy: "গোপনীয়তা",
            terms: "শর্তাবলি",
            member: "সদস্য হোন",
        }
        : {
            brandDesc: "A digital sanctuary for stories that matter. Curating wisdom, design, and culture for the modern thinker.",
            explore: "Explore",
            company: "Company",
            about: "About",
            advertise: "Advertise",
            careers: "Careers",
            contact: "Contact",
            privacy: "Privacy",
            terms: "Terms",
            member: "Become a Member",
        };

    const [sectionLinks, setSectionLinks] = useState<{ name: string; href: string }[]>([]);

    useEffect(() => {
        const loadSections = async () => {
            const result = await getMenuCategories();
            if (result.success && result.links) {
                setSectionLinks(result.links);
            } else {
                setSectionLinks([]);
            }
        };

        loadSections();
    }, [locale]);

    const exploreLinks = useMemo(() => sectionLinks.slice(0, 4), [sectionLinks]);

    return (
        <footer className="relative w-full bg-bg-primary border-t border-border-subtle pt-16 md:pt-20 pb-10 px-6 md:px-12 text-text-primary transition-colors duration-500 safe-bottom overflow-hidden">
            {/* Watermark */}
            <div className="absolute bottom-0 left-0 w-full select-none pointer-events-none opacity-5 overflow-hidden z-0">
                <h2 className="text-[12rem] md:text-[20rem] font-serif font-black tracking-tighter leading-none text-text-primary whitespace-nowrap -mb-10 md:-mb-24">
                    WISDOMIA
                </h2>
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-24 mb-16 md:mb-20">
                {/* Brand */}
                <div className="col-span-2 md:col-span-4 space-y-4 md:space-y-6">
                    <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tighter leading-none">
                        WISDOMIA
                    </h2>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-sm">
                        {copy.brandDesc}
                    </p>
                </div>

                {/* Links 1 */}
                <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">{copy.explore}</h4>
                    <ul className="space-y-3 md:space-y-4 text-sm font-medium">
                        {exploreLinks.length > 0 ? (
                            exploreLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="hover:text-accent active:opacity-70 transition-colors">{link.name}</Link>
                                </li>
                            ))
                        ) : (
                            <li className="text-text-muted text-xs">
                                No categories yet
                            </li>
                        )}
                    </ul>
                </div>

                {/* Links 2 */}
                <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">{copy.company}</h4>
                    <ul className="space-y-3 md:space-y-4 text-sm font-medium">
                        <li><Link href="/about" className="hover:text-accent active:opacity-70 transition-colors">{copy.about}</Link></li>
                        <li><Link href="/advertise" className="hover:text-accent active:opacity-70 transition-colors">{copy.advertise}</Link></li>
                        <li><Link href="/careers" className="hover:text-accent active:opacity-70 transition-colors">{copy.careers}</Link></li>
                        <li><Link href="/contact" className="hover:text-accent active:opacity-70 transition-colors">{copy.contact}</Link></li>
                        <li><Link href="/privacy" className="hover:text-accent active:opacity-70 transition-colors">{copy.privacy}</Link></li>
                        <li><Link href="/terms" className="hover:text-accent active:opacity-70 transition-colors">{copy.terms}</Link></li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="col-span-2 md:col-span-4 flex flex-col items-center md:items-start justify-start pt-4 md:pt-0">
                    <Link
                        href="/pricing"
                        className="text-xs font-bold uppercase tracking-widest border border-border-subtle px-6 py-4 rounded-full hover:bg-black hover:text-white hover:border-black active:scale-95 transition-all w-full md:w-auto text-center"
                    >
                        {copy.member}
                    </Link>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border-subtle text-text-muted">
                <p className="text-[10px] font-bold uppercase tracking-widest">© {new Date().getFullYear()} Wisdomia Inc.</p>
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                    <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
                    <a href="#" className="hover:text-text-primary transition-colors">Instagram</a>
                    <a href="#" className="hover:text-text-primary transition-colors">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
}
