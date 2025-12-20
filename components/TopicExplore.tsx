import Link from "next/link";
import { MotionWrapper, MotionItem } from "@/components/ui/MotionWrapper";
import { MobileSlider } from "@/components/ui/MobileSlider";

const topics = [
    { id: 1, name: "Technology", count: "120+ stories" },
    { id: 2, name: "Design", count: "85+ stories" },
    { id: 3, name: "Culture", count: "200+ stories" },
    { id: 4, name: "Business", count: "50+ stories" },
    { id: 5, name: "Self", count: "150+ stories" },
    { id: 6, name: "Politics", count: "40+ stories" },
];

export function TopicExplore() {
    return (
        <section className="w-full bg-bg-primary py-24 px-6 md:px-16 2xl:px-32">
            <div className="max-w-[1600px] mx-auto space-y-16 text-center">
                <MotionWrapper type="slide-up">
                    <div className="space-y-4">
                        <span className="text-text-primary text-xs md:text-sm font-sans font-bold tracking-[0.2em] uppercase opacity-60">Discover</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-text-primary">
                            Explore by <span className="italic font-light">category</span>
                        </h2>
                    </div>
                </MotionWrapper>

                {/* Mobile: Draggable Slider */}
                <div className="md:hidden -mx-6 px-6">
                    <MobileSlider autoplayInterval={6000} cardWidth={120} gap={12}>
                        {topics.map((topic) => (
                            <Link
                                key={topic.id}
                                href="/stories"
                                className="h-[80px] flex flex-col items-center justify-center gap-1 bg-bg-secondary border border-border-subtle rounded-xl p-3"
                            >
                                <span className="text-base font-sans font-bold text-text-primary">{topic.name}</span>
                                <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">{topic.count}</span>
                            </Link>
                        ))}
                    </MobileSlider>
                </div>

                {/* Desktop: Circular Layout */}
                <MotionWrapper type="stagger-container" className="hidden md:flex md:flex-wrap md:justify-center lg:justify-between gap-6 2xl:gap-10">
                    {topics.map((topic) => (
                        <MotionItem key={topic.id} className="group">
                            <Link
                                href="/stories"
                                className="flex flex-col items-center justify-center w-40 h-40 lg:w-52 lg:h-52 2xl:w-64 2xl:h-64 rounded-full border border-border-subtle bg-transparent hover:bg-bg-card hover:border-transparent focus:scale-105 hover:scale-105 transition-all duration-500 ease-out relative overflow-hidden group outline-none focus:ring-2 focus:ring-offset-2 focus:ring-text-primary"
                            >
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative z-10 text-center space-y-2">
                                    <span className="text-2xl 2xl:text-3xl font-sans font-bold text-text-primary group-hover:text-[#000000] transition-colors block">{topic.name}</span>
                                    <span className="text-xs font-bold tracking-widest text-text-primary/70 uppercase block group-hover:text-[#000000] transition-colors">{topic.count}</span>
                                </div>
                            </Link>
                        </MotionItem>
                    ))}
                </MotionWrapper>

                <MotionWrapper type="fade-in" delay={0.4} className="pt-8">
                    <Link href="/topics" className="font-bold font-sans text-sm md:text-base border-b-2 border-text-primary pb-1 hover:text-text-primary/70 hover:border-text-primary/70 transition-all">
                        See all topics
                    </Link>
                </MotionWrapper>
            </div>
        </section>
    );
}
