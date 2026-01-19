"use server";

import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
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
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !session.name || !session.email) {
        throw new Error("User not authenticated");
    }

    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const authorName = session.name;
    const videoUrl = (formData.get("videoUrl") as string) || undefined;
    const subtitle = (formData.get("subtitle") as string) || undefined;
    const topic_slug = (formData.get("topic_slug") as string) || undefined;
    const accent_color = (formData.get("accent_color") as string) || "#3B82F6";
    const featured = formData.get("featured") === "true";
    const published = formData.get("published") !== "false";

    const excerpt = content ? content.substring(0, 200) + "..." : "";

    let slug = formData.get("slug") as string;
    if (!slug) {
        slug = generateSlug(title);
    }

    const coverImageFile = formData.get("coverImageFile") as File;
    const uploadedImagePath = await handleFileUpload(coverImageFile);
    const coverImage = uploadedImagePath || (formData.get("coverImage") as string) || undefined;

    const date = new Date();

    // Find author id
    const user = await prisma.user.findUnique({
        where: { email: session.email }
    });

    try {
        await prisma.post.create({
            data: {
                slug,
                title,
                subtitle,
                date,
                authorName,
                authorId: user?.id,
                category,
                content,
                excerpt,
                coverImage,
                videoUrl,
                topicSlug: topic_slug,
                accentColor: accent_color,
                featured,
                published
            }
        });
    } catch (error) {
        console.error("Failed to create post:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error("A story with this title/slug already exists. Please change the title.");
        }
        throw new Error("Failed to create post");
    }

    revalidateTag('posts', 'default');
    revalidatePath("/admin/dashboard");
    revalidatePath("/");
    redirect("/admin/dashboard");
}

export async function deletePost(slug: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.post.delete({
            where: { slug }
        });
        revalidateTag('posts', 'default');
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
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
    const videoUrl = (formData.get("videoUrl") as string) || undefined;
    const subtitle = (formData.get("subtitle") as string) || undefined;
    const topic_slug = (formData.get("topic_slug") as string) || undefined;
    const accent_color = (formData.get("accent_color") as string) || "#3B82F6";
    const featured = formData.get("featured") === "true";
    const published = formData.get("published") !== "false";

    const excerpt = content ? content.substring(0, 200) + "..." : "";

    const coverImageFile = formData.get("coverImageFile") as File;
    const uploadedImagePath = await handleFileUpload(coverImageFile);
    let coverImage = (formData.get("coverImage") as string) || undefined;

    if (uploadedImagePath) {
        coverImage = uploadedImagePath;
    }

    try {
        await prisma.post.update({
            where: { slug: originalSlug },
            data: {
                title,
                subtitle,
                category,
                content,
                excerpt,
                coverImage,
                videoUrl,
                topicSlug: topic_slug,
                accentColor: accent_color,
                featured,
                published
            }
        });

        revalidateTag('posts', 'default');
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

export async function togglePostStatus(slug: string, published: boolean) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.post.update({
            where: { slug },
            data: { published }
        });
        revalidateTag('posts', 'default');
        revalidatePath("/admin/dashboard");
        revalidatePath("/");
    } catch (error) {
        console.error("Failed to toggle post status:", error);
        throw new Error("Failed to update post status");
    }
}