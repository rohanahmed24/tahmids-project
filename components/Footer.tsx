import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full bg-bg-primary border-t border-border-subtle pt-16 md:pt-20 pb-10 px-6 md:px-12 text-text-primary transition-colors duration-500 safe-bottom">
            <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-24 mb-16 md:mb-20">
                {/* Brand */}
                <div className="col-span-2 md:col-span-4 space-y-4 md:space-y-6">
                    <h2 className="text-3xl md:text-9xl lg:text-[12rem] font-serif font-black tracking-tighter leading-none opacity-10 select-none">
                        WISDOMIA
                    </h2>
                    <p className="text-xs md:text-sm text-text-muted leading-relaxed max-w-sm">
                        A digital sanctuary for stories that matter. Curating wisdom, design, and culture for the modern thinker.
                    </p>
                </div>

                {/* Links 1 */}
                <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Explore</h4>
                    <ul className="space-y-3 md:space-y-4 text-sm font-medium">
                        <li><Link href="/topics/design-culture" className="hover:text-accent active:opacity-70 transition-colors">Design</Link></li>
                        <li><Link href="/topics/culture" className="hover:text-accent active:opacity-70 transition-colors">Culture</Link></li>
                        <li><Link href="/topics/technology-ai" className="hover:text-accent active:opacity-70 transition-colors">Technology</Link></li>
                        <li><Link href="/topics/philosophy" className="hover:text-accent active:opacity-70 transition-colors">Philosophy</Link></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted">Company</h4>
                    <ul className="space-y-3 md:space-y-4 text-sm font-medium">
                        <li><Link href="/about" className="hover:text-accent active:opacity-70 transition-colors">About</Link></li>
                        <li><Link href="/advertise" className="hover:text-accent active:opacity-70 transition-colors">Advertise</Link></li>
                        <li><Link href="/careers" className="hover:text-accent active:opacity-70 transition-colors">Careers</Link></li>
                        <li><Link href="/contact" className="hover:text-accent active:opacity-70 transition-colors">Contact</Link></li>
                        <li><Link href="/privacy" className="hover:text-accent active:opacity-70 transition-colors">Privacy</Link></li>
                        <li><Link href="/terms" className="hover:text-accent active:opacity-70 transition-colors">Terms</Link></li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="col-span-2 md:col-span-4 flex flex-col items-center md:items-end justify-start md:justify-between pt-4 md:pt-0">
                    <Link
                        href="/pricing"
                        className="text-xs font-bold uppercase tracking-widest border border-border-subtle px-6 py-4 rounded-full hover:bg-black hover:text-white hover:border-black active:scale-95 transition-all w-full md:w-auto text-center"
                    >
                        Become a Member
                    </Link>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border-subtle text-text-muted">
                <p className="text-[10px] font-bold uppercase tracking-widest">© 2024 Wisdomia Inc.</p>
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                    <a href="#" className="hover:text-text-primary transition-colors">Twitter</a>
                    <a href="#" className="hover:text-text-primary transition-colors">Instagram</a>
                    <a href="#" className="hover:text-text-primary transition-colors">LinkedIn</a>
                </div>
            </div>
        </footer>
    );
}
