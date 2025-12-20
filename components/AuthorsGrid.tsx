import { Assets } from "@/lib/assets";
import Image from "next/image";

const authors = [
    { id: 1, name: "Sarah Jenkins", role: "Design Lead", bio: "Exploring the intersection of design and humanity.", img: Assets.imgAvatarImage1 },
    { id: 2, name: "David Miller", role: "Tech Journalist", bio: "Reporting on the future of AI and robotics.", img: Assets.imgAvatarImage2 },
    { id: 3, name: "Emily Rose", role: "Cultural Critic", bio: "Writing about movies, music, and modern life.", img: Assets.imgAvatarImage3 },
    { id: 4, name: "James L.", role: "Architect", bio: "Designing sustainable homes for tomorrow.", img: Assets.imgAvatarImage4 },
];

export function AuthorsGrid() {
    return (
        <section className="w-full bg-bg-primary py-32 px-6 md:px-16">
            <div className="max-w-[1280px] mx-auto space-y-16">
                <div className="max-w-[1280px] mx-auto space-y-20">
                    <div className="text-center space-y-6">
                        <h2 className="text-5xl md:text-7xl font-serif font-medium text-text-muted/20 tracking-tighter">
                            Meet our writers
                        </h2>
                        <div className="flex justify-center">
                            <button className="px-8 py-3 rounded-full border border-border-subtle text-xs font-bold uppercase tracking-widest text-text-primary hover:bg-black hover:text-white hover:border-black transition-all">
                                View All Writers
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
            </div>
        </section>
    );
}
