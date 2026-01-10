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

import { auth } from "@/auth";

// ... existing imports

export async function createPost(formData: FormData) {
    const session = await auth();
    const isAdmin = await verifyAdmin(); // Keep admin verification for now if this is an admin-only feature, or just check session

    // Fallback if strict admin check passes but session is missing (unlikely)
    if (!session?.user?.name) {
        throw new Error("User not authenticated");
    }

    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const author = session.user.name; // Use real user name
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

    const date = new Date().toISOString();

    const db = getDb();
    try {
        await db.query(
            "INSERT INTO posts (slug, title, date, author, category, content, coverImage, videoUrl, subtitle, topic_slug, accent_color, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [slug, title, date, author, category, content, coverImage, videoUrl, subtitle, topic_slug, accent_color, featured]
        );
    } catch (error: unknown) {
        console.error("Failed to create post:", error);
        const err = error as { code?: string; };
        if (err.code === 'ER_DUP_ENTRY') {
            // Simple retry logic or error for now - appending random string to make unique if auto-generated, 
            // but if user manually set it, we should probably error. 
            // For now, let's throw a clear error string the UI can maybe catch, or just fail safely.
            throw new Error("A story with this title/slug already exists. Please change the title.");
        }
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
