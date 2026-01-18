import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/actions/admin-auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

// Types for better type safety
interface PostFormData {
    title: string;
    content: string;
    category: string;
    subtitle?: string;
    videoUrl?: string;
    topic_slug?: string;
    accent_color: string;
    featured: boolean;
    published: boolean;
    slug?: string;
    coverImage?: string;
}

interface PostInsertData extends PostFormData {
    author: string;
    excerpt: string;
    cover_image?: string;
    video_url?: string;
    date: string;
}

// Constants
const DEFAULT_ACCENT_COLOR = "#3B82F6";
const EXCERPT_LENGTH = 200;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Service class for better organization and separation of concerns
export class PostService {
    private async validateAuthentication(): Promise<string> {
        const session = await auth();
        if (!session?.user?.name) {
            throw new Error("User not authenticated");
        }

        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            throw new Error("Unauthorized");
        }

        return session.user.name;
    }

    private validateFile(file: File): void {
        if (file.size > MAX_FILE_SIZE) {
            throw new Error("File size exceeds 5MB limit");
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            throw new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed");
        }
    }

    private validatePostData(data: Partial<PostFormData>): void {
        const errors: string[] = [];

        if (!data.title?.trim()) errors.push("Title is required");
        if (!data.content?.trim()) errors.push("Content is required");
        if (!data.category?.trim()) errors.push("Category is required");

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(", ")}`);
        }
    }

    private async handleFileUpload(file: File | null): Promise<string | undefined> {
        if (!file || file.size === 0) return undefined;

        this.validateFile(file);

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}-${sanitizedName}`;
        const uploadDir = path.join(process.cwd(), "public/imgs/uploads");

        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, filename), buffer);

        return `/imgs/uploads/${filename}`;
    }

    private generateSlug(title: string): string {
        if (!title?.trim()) {
            throw new Error("Title is required to generate slug");
        }

        return title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    private generateExcerpt(content: string): string {
        if (!content?.trim()) return "";

        const plainText = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        return plainText.length > EXCERPT_LENGTH
            ? plainText.substring(0, EXCERPT_LENGTH).trim() + "..."
            : plainText;
    }

    private extractFormData(formData: FormData): PostFormData {
        const data: PostFormData = {
            title: (formData.get("title") as string)?.trim() || "",
            content: (formData.get("content") as string)?.trim() || "",
            category: (formData.get("category") as string)?.trim() || "",
            subtitle: (formData.get("subtitle") as string)?.trim() || undefined,
            videoUrl: (formData.get("videoUrl") as string)?.trim() || undefined,
            topic_slug: (formData.get("topic_slug") as string)?.trim() || undefined,
            accent_color: (formData.get("accent_color") as string)?.trim() || DEFAULT_ACCENT_COLOR,
            featured: formData.get("featured") === "true",
            published: formData.get("published") !== "false", // Default to true
            slug: (formData.get("slug") as string)?.trim() || undefined,
            coverImage: (formData.get("coverImage") as string)?.trim() || undefined,
        };

        this.validatePostData(data);
        return data;
    }

    private async insertPost(postData: PostInsertData): Promise<void> {
        try {
            await prisma.post.create({
                data: {
                    slug: postData.slug!,
                    title: postData.title,
                    subtitle: postData.subtitle,
                    date: new Date(postData.date),
                    authorName: postData.author, // Assuming authorName exists, or standardizing on authorId
                    category: postData.category,
                    content: postData.content,
                    excerpt: postData.excerpt,
                    coverImage: postData.cover_image,
                    videoUrl: postData.video_url,
                    topicSlug: postData.topic_slug,
                    accentColor: postData.accent_color,
                    featured: postData.featured,
                    published: postData.published
                }
            });
        } catch (error) {
            console.error("Database insert failed:", error);

            // Check for Prisma unique constraint violation
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new Error("A story with this title/slug already exists. Please change the title.");
            }

            throw new Error("Failed to create post. Please try again.");
        }
    }

    private async updatePostInDb(originalSlug: string, postData: Partial<PostInsertData>): Promise<void> {
        try {
            const dataToUpdate: Prisma.PostUpdateInput = {
                title: postData.title,
                subtitle: postData.subtitle,
                category: postData.category,
                content: postData.content,
                excerpt: postData.excerpt,
                coverImage: postData.cover_image,
                videoUrl: postData.video_url,
                topicSlug: postData.topic_slug,
                accentColor: postData.accent_color,
                featured: postData.featured,
                published: postData.published
            };

            // Remove undefined keys
            Object.keys(dataToUpdate).forEach(key => (dataToUpdate as any)[key] === undefined && delete (dataToUpdate as any)[key]);

            await prisma.post.update({
                where: { slug: originalSlug },
                data: dataToUpdate
            });

        } catch (error) {
            console.error("Database update failed:", error);

            // Check for Prisma record not found
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new Error("Post not found or no changes made");
            }

            throw new Error("Failed to update post. Please try again.");
        }
    }

    private revalidatePostPaths(slug?: string): void {
        revalidatePath("/admin/dashboard");
        revalidatePath("/");

        if (slug) {
            revalidatePath(`/article/${slug}`);
            revalidatePath(`/admin/edit/${slug}`);
        }
    }

    async createPost(formData: FormData): Promise<void> {
        const author = await this.validateAuthentication();

        try {
            // Extract and validate form data
            const postFormData = this.extractFormData(formData);

            // Handle file upload
            const coverImageFile = formData.get("coverImageFile") as File;
            const uploadedImagePath = await this.handleFileUpload(coverImageFile);
            const coverImage = uploadedImagePath || postFormData.coverImage;

            // Generate slug if not provided
            const slug = postFormData.slug || this.generateSlug(postFormData.title);

            // Prepare post data for insertion
            const postData: PostInsertData = {
                ...postFormData,
                slug,
                author,
                excerpt: this.generateExcerpt(postFormData.content),
                cover_image: coverImage,
                video_url: postFormData.videoUrl,
                date: new Date().toISOString(), // Use ISO string for consistency
            };

            // Insert into database
            await this.insertPost(postData);

            // Revalidate cache
            this.revalidatePostPaths();

        } catch (error) {
            console.error("Create post failed:", error);
            throw error; // Re-throw to let the UI handle the error
        }
    }

    async updatePost(originalSlug: string, formData: FormData): Promise<void> {
        await this.validateAuthentication();

        try {
            // Extract and validate form data
            const postFormData = this.extractFormData(formData);

            // Handle file upload
            const coverImageFile = formData.get("coverImageFile") as File;
            const uploadedImagePath = await this.handleFileUpload(coverImageFile);
            const coverImage = uploadedImagePath || postFormData.coverImage;

            // Prepare update data
            const updateData: Partial<PostInsertData> = {
                ...postFormData,
                excerpt: this.generateExcerpt(postFormData.content),
                cover_image: coverImage,
                video_url: postFormData.videoUrl,
            };

            // Update in database
            await this.updatePostInDb(originalSlug, updateData);

            // Revalidate cache
            this.revalidatePostPaths(originalSlug);

        } catch (error) {
            console.error("Update post failed:", error);
            throw error; // Re-throw to let the UI handle the error
        }
    }

    async deletePost(slug: string): Promise<void> {
        await this.validateAuthentication();

        try {
            await prisma.post.delete({ where: { slug } });
            this.revalidatePostPaths();
        } catch (error) {
            console.error("Failed to delete post:", error);
            throw new Error("Failed to delete post");
        }
    }

    async togglePostStatus(slug: string, published: boolean): Promise<void> {
        await this.validateAuthentication();

        try {
            await prisma.post.update({
                where: { slug },
                data: { published }
            });
            this.revalidatePostPaths();
        } catch (error) {
            console.error("Failed to toggle post status:", error);
            throw new Error("Failed to update post status");
        }
    }
}