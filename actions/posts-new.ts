"use server";

import { redirect } from "next/navigation";
import { PostService } from "@/lib/post-service";

// Simplified action functions using the PostService
export async function createPost(formData: FormData) {
    const postService = new PostService();
    await postService.createPost(formData);
    redirect("/admin/dashboard");
}

export async function deletePost(slug: string) {
    const postService = new PostService();
    await postService.deletePost(slug);
}

export async function updatePost(originalSlug: string, formData: FormData) {
    const postService = new PostService();
    await postService.updatePost(originalSlug, formData);
    redirect("/admin/dashboard");
}

export async function togglePostStatus(slug: string, published: boolean) {
    const postService = new PostService();
    await postService.togglePostStatus(slug, published);
}