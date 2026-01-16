"use client";

import { useState } from "react";
import { generateVideoForArticle } from "@/actions/generateVideo";
import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GenerateVideoButtonProps {
    slug: string;
}

export function GenerateVideoButton({ slug }: GenerateVideoButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGenerate = async () => {
        setIsLoading(true);
        toast.info("Generating AI Video with Veo 3... This may take a moment.");

        try {
            const result = await generateVideoForArticle(slug);

            if (result.success) {
                toast.success("Video generated successfully!");
                router.refresh();
            } else {
                toast.error("Failed to generate video. Please try again.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed group"
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                </>
            ) : (
                <>
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Generate AI Video</span>
                </>
            )}
        </button>
    );
}
