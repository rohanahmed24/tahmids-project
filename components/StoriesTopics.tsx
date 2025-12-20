import { MotionWrapper } from "@/components/ui/MotionWrapper";
import Link from "next/link";

const topics = [
    {
        id: 1,
        title: "Politics and power",
        desc: "Structural power dynamics",
        slug: "politics-power",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        )
    },
    {
        id: 2,
        title: "History and empire",
        desc: "How we got to where we are",
        slug: "history-empire",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        id: 3,
        title: "Crime and mystery",
        desc: "Unsolved mysteries and...",
        slug: "crime-mystery",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
        )
    },
    {
        id: 4,
        title: "Culture and traditions",
        desc: "Immersion in the new",
        slug: "culture-traditions",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
        )
    },
];

export function StoriesTopics() {
    return (
        <section className="bg-[#050505] text-white py-24 px-6 overflow-hidden">
            <div className="max-w-[1280px] mx-auto text-center space-y-16">
                <MotionWrapper type="fade-in">
                    <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-60 block mb-4">Blog</span>
                    <h2 className="text-3xl md:text-4xl font-serif">Find stories by topic</h2>
                    <p className="text-white/60 text-sm mt-3">See our curated list</p>
                </MotionWrapper>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/10 pt-10 text-left">
                    {topics.map((topic) => (
                        <Link href={`/topics/${topic.slug}`} key={topic.id} className="group block space-y-4 hover:opacity-80 transition-opacity">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white group-hover:bg-white group-hover:text-[#000000] transition-colors">
                                {topic.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-serif font-bold">{topic.title}</h3>
                                <p className="text-xs text-white/50 mt-1">{topic.desc}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mt-4">
                                <span>Explore</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
