"use server";

import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin } from "@/actions/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function handleFileUpload(file: File | null): Promise<string | undefined> {
    if (!file || file.size === 0) return undefined;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    const uploadDir = path.join(process.cwd(), "public/imgs/uploads");

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return `/imgs/uploads/${filename}`;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

export async function createPost(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const author = "Admin";
    const videoUrl = formData.get("videoUrl") as string;

    // New fields
    const subtitle = formData.get("subtitle") as string;
    const topic_slug = formData.get("topic_slug") as string || null;
    const accent_color = formData.get("accent_color") as string || null;
    const featured = formData.get("featured") === "true";

    // Check for manual slug or generate one
    let slug = formData.get("slug") as string;
    if (!slug) {
        slug = generateSlug(title);
    }

    const coverImageFile = formData.get("coverImageFile") as File;
    const uploadedImagePath = await handleFileUpload(coverImageFile);
    const coverImage = uploadedImagePath || (formData.get("coverImage") as string) || "";

    const date = new Date().toISOString(); // Full timestamp for created_at, string for date column if it's varchar

    const db = getDb();
    try {
        await db.query(
            "INSERT INTO posts (slug, title, date, author, category, content, coverImage, videoUrl, subtitle, topic_slug, accent_color, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [slug, title, date, author, category, content, coverImage, videoUrl, subtitle, topic_slug, accent_color, featured]
        );
    } catch (error) {
        console.error("Failed to create post:", error);
        throw new Error("Failed to create post");
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    redirect("/admin/dashboard");
}

export async function deletePost(slug: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const db = getDb();
    try {
        await db.query("DELETE FROM posts WHERE slug = ?", [slug]);
        revalidatePath("/admin/dashboard");
    } catch (error) {
        console.error("Failed to delete post:", error);
        throw new Error("Failed to delete post");
    }
}

export async function updatePost(originalSlug: string, formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const videoUrl = formData.get("videoUrl") as string;

    // New fields
    const subtitle = formData.get("subtitle") as string;
    const topic_slug = formData.get("topic_slug") as string || null;
    const accent_color = formData.get("accent_color") as string || null;
    const featured = formData.get("featured") === "true";

    const coverImageFile = formData.get("coverImageFile") as File;
    const uploadedImagePath = await handleFileUpload(coverImageFile);
    let coverImage = formData.get("coverImage") as string;

    if (uploadedImagePath) {
        coverImage = uploadedImagePath;
    }

    const db = getDb();

    try {
        await db.query(
            "UPDATE posts SET title = ?, category = ?, content = ?, coverImage = ?, videoUrl = ?, subtitle = ?, topic_slug = ?, accent_color = ?, featured = ? WHERE slug = ?",
            [title, category, content, coverImage, videoUrl, subtitle, topic_slug, accent_color, featured, originalSlug]
        );

        revalidatePath(`/article/${originalSlug}`);
        revalidatePath(`/admin/edit/${originalSlug}`);
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
    } catch (error) {
        console.error("Failed to update post:", error);
        throw new Error("Failed to update post");
    }

    redirect("/admin/dashboard");
}
