"use server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./media";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File;

    if (!name) {
        throw new Error("Name is required");
    }

    const db = getDb();
    let avatarUrl = ""; // Keep existing if not updated? 
    // Ideally we fetch existing user first, but for now we'll only update if provided.

    try {
        if (avatarFile && avatarFile.size > 0) {
            const uploadFormData = new FormData();
            uploadFormData.append("file", avatarFile);
            const uploadResult = await uploadImage(uploadFormData);
            if (uploadResult.success && uploadResult.url) {
                avatarUrl = uploadResult.url;
            }
        }

        // Build generic update query
        let query = "UPDATE users SET name = ?, bio = ?";
        const params: (string | number)[] = [name, bio];

        if (avatarUrl) {
            query += ", avatar = ?"; // Assuming avatar column exists or we might need to add it/map it. 
            // Note: Users table currently doesn't have 'avatar' column in setup-full.ts, 
            // but it's used in dashboard. 
            // Let's assume users table needs 'avatar' column too if we want to store it there.
            // Wait, existing seed uses placeholder. 
            // We should add 'avatar' column to users table too in setup-full.ts if not present.
            // Let's check setup-full.ts again. It has no avatar column.

            // Correction: I should add avatar column to users table as well.
            // For now, I will omit avatar update in DB query or add it if I fix setup-full.ts.
            // I'll stick to name and bio for this specific file write, and handle avatar separation or update setup-full.ts next.

            // Actually, let's just add it to setup-full.ts in the next step if missed.
            // For now, I'll comment out the avatar update in query to avoid crash until column exists.
            // query += ", avatar = ?"; 
            // params.push(avatarUrl);
        }

        // Wait, I need to check if I can execute multiple file edits.
        // I will add avatar column to setup-full.ts as well in next step.
        // So I'll write the code assuming it exists.
        if (avatarUrl) {
            // For now, let's assume we store avatar URL in a 'image' or 'avatar' column.
            // The user dashboard maps 'avatar' to a placeholder.
            // Let's add 'image' column to users table to match session user image or just 'avatar'.
            // 'image' is standard for NextAuth adapter.
            // Let's use 'avatar' to match dashboard usage.
            query += ", avatar = ?";
            params.push(avatarUrl);
        }

        query += " WHERE id = ?";
        params.push(userId);

        await db.query(query, params);

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile", error);
        return { success: false, error: "Failed to update profile" };
    }
}
