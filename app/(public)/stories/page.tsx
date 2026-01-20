import { StoriesGrid } from "@/components/StoriesGrid";
import { StoriesTopics } from "@/components/StoriesTopics";
import { StoriesNewsletter } from "@/components/StoriesNewsletter";
import { StoriesHero } from "@/components/StoriesHero";

export default function StoriesPage() {
    return (
        <main className="min-h-screen bg-base transition-colors duration-300">
            <StoriesHero />

            <div className="max-w-[1280px] mx-auto px-6 md:px-12 2xl:px-0 mt-20">
                <StoriesGrid />
            </div>

            <StoriesTopics />
            <StoriesNewsletter />
        </main>
    );
}
