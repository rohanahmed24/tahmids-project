import { StoriesGrid } from "@/components/StoriesGrid";
import { StoriesTopics } from "@/components/StoriesTopics";
import { StoriesNewsletter } from "@/components/StoriesNewsletter";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

export default function StoriesPage() {
    return (
        <main className="min-h-screen bg-base transition-colors duration-300">
            {/* Header / Hero Section */}
            <div className="bg-surface pt-40 pb-20 px-6 text-center">
                <MotionWrapper type="slide-up">
                    <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-40 text-main mb-6 block">The Archive</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-medium text-main tracking-tighter leading-[0.9]">
                        Stories that <br />
                        <span className="italic font-light opacity-60">shape us</span>
                    </h1>
                </MotionWrapper>
            </div>

            <div className="max-w-[1280px] mx-auto px-6 md:px-12 2xl:px-0 mt-20">
                <StoriesGrid />
            </div>

            <StoriesTopics />
            <StoriesNewsletter />
        </main>
    );
}
