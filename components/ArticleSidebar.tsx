import { Assets } from "@/lib/assets";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ArticleSidebar() {
    return (
        <aside className="space-y-12 shrink-0">
            {/* Author Card - Bento Style */}
            <div className="bg-[#f4f1ea] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-white p-8 rounded-none border border-black/5 dark:border-white/5 space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden relative">
                        <Image src={Assets.imgAuthorSarah} alt="Author" fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl font-bold leading-none">Sarah Jenkins</h3>
                        <p className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Design Anthropologist</p>
                    </div>
                </div>
                <p className="text-sm opacity-90 leading-relaxed font-sans">
                    Exploring the intersection of human behavior and digital interfaces. Writing about silence, minimalism, and focus.
                </p>
                <div className="flex gap-2">
                    <button className="flex-1 py-3 border border-black/10 dark:border-white/10 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                        Follow
                    </button>
                    <button className="px-4 py-3 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Related Stories */}
            <div>
                <h4 className="font-serif text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-background-blue"></span>
                    Related Stories
                </h4>
                {/* Mobile: 2 columns, PC: 1 column (larger cards look better) */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Link href="#" key={i} className="group block space-y-3">
                            {/* Mobile: square aspect, PC: 3:2 aspect for larger display */}
                            <div className="relative w-full aspect-square md:aspect-[3/2] overflow-hidden rounded-sm">
                                <Image
                                    src={i === 1 ? Assets.imgStoryCulture : i === 2 ? Assets.imgStoryScience : i === 3 ? Assets.imgStoryArt : Assets.imgStoryHistory}
                                    alt="Related"
                                    fill
                                    sizes="(max-width: 768px) 50vw, 350px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest opacity-60 text-text-muted">
                                    <span>Tech</span>
                                    <span>•</span>
                                    <span>Oct 12</span>
                                </div>
                                <h5 className="font-serif text-sm md:text-base leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary line-clamp-2">
                                    When design becomes invisible
                                </h5>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

