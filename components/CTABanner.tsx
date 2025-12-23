import Link from "next/link";


export function CTABanner() {
    return (
        <section className="relative w-full py-12 md:py-32 px-6 md:px-12 bg-black text-white overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Join the Circle</span>
                <h2 className="text-4xl md:text-7xl font-serif font-medium leading-[0.9] tracking-tight">
                    Wisdom worth <br className="hidden md:block" />
                    <span className="italic text-gray-500">paying for.</span>
                </h2>
                <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto font-sans leading-relaxed">
                    Unlock exclusive essays, deep dives, and a distraction-free reading experience.
                </p>
                <div className="flex flex-col md:flex-row justify-center gap-6 pt-8">
                    <Link
                        href="/register"
                        className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
                    >
                        Get Access
                    </Link>
                </div>
            </div>
        </section>
    );
}
