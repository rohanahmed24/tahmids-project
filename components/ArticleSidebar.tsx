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
                <h4 className="font-serif text-lg font-bold mb-6 flex items-center gap-2 text-text-primary">
                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                    Related Stories
                </h4>
                {/* Mobile: 2 columns, PC: 1 column (larger cards look better) */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {[
                        { slug: "creative-process", title: "The Creative Process Unveiled", category: "Design", date: "Dec 12", image: Assets.imgStoryCulture },
                        { slug: "science-sleep", title: "The Science of Sleep", category: "Science", date: "Dec 9", image: Assets.imgStoryScience },
                        { slug: "future-cities", title: "Cities of Tomorrow: Reimagining Urban Life", category: "Future Tech", date: "Dec 14", image: Assets.imgStoryArt },
                        { slug: "philosophy-simplicity", title: "The Philosophy of Simplicity", category: "Minimalism", date: "Dec 10", image: Assets.imgStoryHistory },
                    ].map((story) => (
                        <Link href={`/article/${story.slug}`} key={story.slug} className="group block space-y-3">
                            {/* Mobile: square aspect, PC: 3:2 aspect for larger display */}
                            <div className="relative w-full aspect-square md:aspect-[3/2] overflow-hidden rounded-sm">
                                <Image
                                    src={story.image}
                                    alt={story.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 350px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary">
                                    <span>{story.category}</span>
                                    <span className="mx-1.5">•</span>
                                    <span>{story.date}</span>
                                </p>
                                <h5 className="font-serif text-sm md:text-base leading-tight group-hover:underline decoration-1 underline-offset-4 text-text-primary line-clamp-2">
                                    {story.title}
                                </h5>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}

