import { MotionWrapper } from "@/components/ui/MotionWrapper";

export function StoriesNewsletter() {
    return (
        <section className="relative w-full py-24 px-6 overflow-hidden">
            {/* Background with slight gradient/color matching design */}
            <div className="absolute inset-0 bg-[#0A2540]/90 z-0" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
                <MotionWrapper type="slide-up">
                    <h2 className="text-4xl md:text-5xl font-serif font-medium text-white">Stay in the know</h2>
                    <p className="text-white/70 mt-4 font-sans">
                        Jump on our newsletter right without any update
                    </p>
                </MotionWrapper>

                <MotionWrapper type="fade-in" delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-background-darkest font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors">
                        Subscribe
                    </button>
                    <button className="bg-transparent border border-white/20 text-white font-bold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                        Notify me
                    </button>
                </MotionWrapper>
            </div>
        </section>
    );
}
