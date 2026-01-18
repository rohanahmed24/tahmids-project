'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function generateVideoForArticle(slug: string) {
    if (!slug) return { success: false, message: "Invalid slug" };

    try {
        // Simulate Veo 3 API call delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Mock video URL (replace with actual Veo 3 API response in future)
        // Using a reliable sample video for demonstration
        const mockVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

        await prisma.post.update({
            where: { slug },
            data: { videoUrl: mockVideoUrl }
        });

        revalidatePath(`/article/${slug}`);
        revalidatePath('/');

        return { success: true, message: "Video generated successfully" };
    } catch (error) {
        console.error("Failed to generate video:", error);
        return { success: false, message: "Failed to generate video" };
    }
}
