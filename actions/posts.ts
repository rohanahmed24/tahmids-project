"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/actions/admin-auth";

export async function updatePost(slug: string, formData: FormData) {
    // Security check
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as string;
    const videoUrl = formData.get("videoUrl") as string;

    const db = getDb();

    try {
        await db.query(
            "UPDATE posts SET title = ?, content = ?, coverImage = ?, videoUrl = ? WHERE slug = ?",
            [title, content, coverImage, videoUrl, slug]
        );

        revalidatePath(`/article/${slug}`);
        revalidatePath(`/admin/edit/${slug}`);
    } catch (error) {
        console.error("Failed to update post:", error);
        throw new Error("Failed to update post");
    }

    redirect(`/article/${slug}`);
}
