"use client";

import Image from "next/image";
import { MobileSlider } from "@/components/ui/MobileSlider";
import { useEffect, useState } from "react";
import type { User } from "@/lib/users";
import { Assets } from "@/lib/assets";

export function AuthorsGrid() {
    const [authors, setAuthors] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadAuthors() {
            try {
                const res = await fetch("/api/authors/featured");
                if (!res.ok) throw new Error("Failed to fetch authors");
                const data = (await res.json()) as { authors: User[] };
                if (isMounted) {
                    setAuthors(data.authors || []);
                }
            } catch (error) {
                console.error("Failed to load authors", error);
                if (isMounted) {
                    setAuthors([]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadAuthors();
        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) return null; // Or a skeleton
    if (authors.length === 0) return null;

    return (
        <section className="w-full bg-bg-primary py-12 md:py-32 px-6 md:px-16 border-t border-border-primary">
            <div className="max-w-[1280px] mx-auto space-y-8 md:space-y-16">
                <div className="text-center space-y-4 md:space-y-6">
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-medium text-text-primary tracking-tighter">
                        Meet our <span className="italic text-text-muted">writers</span>
                    </h2>
                    {/* Optional: View All Link */}
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
                                    <Image
                                        src={author.image || Assets.imgPlaceholderImage4}
                                        alt={author.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-base font-serif font-bold text-text-primary">{author.name}</h3>
                                    {author.title && (
                                        <span className="text-[10px] font-sans font-bold text-accent uppercase tracking-wide block mt-1">
                                            {author.title}
                                        </span>
                                    )}
                                </div>
                                {author.bio && (
                                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                        {author.bio}
                                    </p>
                                )}
                            </div>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: Grid */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {authors.map((author) => (
                        <div key={author.id} className="flex flex-col items-center text-center space-y-4 group">
                            <div className="w-32 h-32 rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                <Image
                                    src={author.image || Assets.imgPlaceholderImage4}
                                    alt={author.name}
                                    fill
                                    sizes="128px"
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-text-primary">{author.name}</h3>
                                {author.title && (
                                    <span className="text-xs font-sans font-bold text-accent uppercase tracking-wide block mt-1">
                                        {author.title}
                                    </span>
                                )}
                            </div>
                            {author.bio && (
                                <p className="text-sm text-text-secondary leading-relaxed max-w-[250px]">
                                    {author.bio}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}
