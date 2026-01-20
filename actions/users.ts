"use server";

import { updateUser as dbUpdateUser } from "@/lib/users";
import { verifyAdmin } from "@/actions/admin-auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const id = parseInt(formData.get("id") as string);
    const title = formData.get("title") as string;
    const bio = formData.get("bio") as string;
    const isFeatured = formData.get("isFeatured") === "on";
    const featuredOrder = parseInt(formData.get("featuredOrder") as string) || 0;

    await dbUpdateUser(id, {
        title,
        bio,
        isFeatured,
        featuredOrder
    });

    revalidatePath("/admin/users");
    revalidatePath("/"); // Update homepage/writers section
}