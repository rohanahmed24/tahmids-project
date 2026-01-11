"use server";

import { auth } from "@/auth";
import { verifyAdmin } from "@/actions/admin-auth";
import { updateUser, getUserByEmail } from "@/lib/users";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await auth();
    const isAdmin = await verifyAdmin();

    if (!session?.user?.email || !isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const name = formData.get("name") as string;
        // const bio = formData.get("bio") as string; // Planned for future

        // Get current user
        const currentUser = await getUserByEmail(session.user.email);
        if (!currentUser) {
            throw new Error("User not found");
        }

        // Update user profile
        const updatedUser = await updateUser(currentUser.id, {
            name: name || currentUser.name,
            // Note: bio field would need to be added to users table
        });

        if (!updatedUser) {
            throw new Error("Failed to update profile");
        }

        revalidatePath("/admin/dashboard");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to update profile:", error);
        throw new Error("Failed to update profile");
    }
}

export async function getProfile() {
    const session = await auth();
    const isAdmin = await verifyAdmin();

    if (!session?.user?.email || !isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const user = await getUserByEmail(session.user.email);
        if (!user) {
            throw new Error("User not found");
        }

        return { success: true, user };
    } catch (error) {
        console.error("Failed to get profile:", error);
        return { success: false, error: "Failed to get profile" };
    }
}