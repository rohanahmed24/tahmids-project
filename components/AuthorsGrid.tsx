"use client";

import { Assets } from "@/lib/assets";
import Image from "next/image";
import { MobileSlider } from "@/components/ui/MobileSlider";

const authors = [
    { id: 1, name: "Sarah Jenkins", role: "Design Lead", bio: "Exploring the intersection of design and humanity.", img: Assets.imgAvatarImage1 },
    { id: 2, name: "David Miller", role: "Tech Journalist", bio: "Reporting on the future of AI and robotics.", img: Assets.imgAvatarImage2 },
    { id: 3, name: "Emily Rose", role: "Cultural Critic", bio: "Writing about movies, music, and modern life.", img: Assets.imgAvatarImage3 },
    { id: 4, name: "James L.", role: "Architect", bio: "Designing sustainable homes for tomorrow.", img: Assets.imgAvatarImage4 },
];

export function AuthorsGrid() {
    return (
        <section className="w-full bg-bg-primary py-12 md:py-32 px-6 md:px-16">
            <div className="max-w-[1280px] mx-auto space-y-8 md:space-y-16">
                <div className="text-center space-y-4 md:space-y-6">
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-medium text-text-primary tracking-tighter">
                        Meet our <span className="italic text-text-muted">writers</span>
                    </h2>
                    <div className="flex justify-center">
                        <button className="px-6 py-2.5 md:px-8 md:py-3 rounded-full border border-border-subtle text-xs font-bold uppercase tracking-widest text-text-primary hover:bg-black hover:text-white hover:border-black transition-all">
                            View All Writers
                        </button>
                    </div>
                </div>

                {/* Mobile: Horizontal Slider */}
                <div className="md:hidden -mx-6 px-6">
                    <MobileSlider autoplayInterval={0} cardWidthPercent={60} gap={16}>
                        {authors.map((author) => (
                            <div
                                key={author.id}
                                className="flex flex-col items-center text-center space-y-3 group w-full"
                            >
                                <div className="w-24 h-24 rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <Image src={author.img} alt={author.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-base font-serif font-bold text-text-primary">{author.name}</h3>
                                    <span className="text-[10px] font-sans font-bold text-accent uppercase tracking-wide">{author.role}</span>
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                                    {author.bio}
                                </p>
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {authors.map((author) => (
                        <div key={author.id} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-32 h-32 rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                <Image src={author.img} alt={author.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-text-primary">{author.name}</h3>
                                <span className="text-xs font-sans font-bold text-accent uppercase tracking-wide">{author.role}</span>
                            </div>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {author.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
