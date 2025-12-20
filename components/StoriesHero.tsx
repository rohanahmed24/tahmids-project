import { MotionWrapper } from "@/components/ui/MotionWrapper";

export function StoriesHero() {
    return (
        <section className="bg-background-light dark:bg-background-darkest py-10 md:py-16 text-center px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                <MotionWrapper type="slide-up">
                    <span className="text-sm md:text-base font-bold font-sans tracking-widest uppercase text-text-primary/60 dark:text-white/60">
                        Curated Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium text-text-primary dark:text-white mt-4">
                        All Stories
                    </h1>
                </MotionWrapper>
                <MotionWrapper type="fade-in" delay={0.2}>
                    <p className="text-lg md:text-xl font-sans text-text-primary/70 dark:text-white/70 max-w-2xl mx-auto">
                        Explore specific categories or browse our latest thoughts on technology, design, and culture.
                    </p>
                </MotionWrapper>
            </div>
        </section>
    );
}
