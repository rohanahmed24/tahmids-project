import { MotionWrapper } from "@/components/ui/MotionWrapper";

export function StoriesHero() {
    return (
        <section className="bg-surface pt-28 pb-20 px-6 text-center">
            <MotionWrapper type="slide-up">
                <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-main mb-6 block">The Archive</span>
                <h1 className="text-6xl md:text-8xl font-serif font-medium text-main tracking-tighter leading-[0.9]">
                    Stories that <br />
                    <span className="italic font-light opacity-60">shape us</span>
                </h1>
            </MotionWrapper>
        </section>
    );
}
