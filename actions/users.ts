"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/actions/admin-auth";
import { updateUser, deleteUser, createUser } from "@/lib/users";
import bcrypt from "bcryptjs";

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const updatedUser = await updateUser(userId, { role });
        if (!updatedUser) {
            throw new Error("Failed to update user role");
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin/dashboard");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to update user role:", error);
        throw new Error("Failed to update user role");
    }
}

export async function deleteUserAccount(userId: number) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const success = await deleteUser(userId);
        if (!success) {
            throw new Error("Failed to delete user");
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw new Error("Failed to delete user");
    }
}

// Export alias for compatibility
export { deleteUserAccount as deleteUser };

export async function createNewUser(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as 'user' | 'admin') || 'user';

    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required");
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await createUser({
            name,
            email,
            password: hashedPassword,
            role
        });

        if (!newUser) {
            throw new Error("Failed to create user");
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin/dashboard");
        return { success: true, user: newUser };
    } catch (error) {
        console.error("Failed to create user:", error);
        if (error instanceof Error && error.message.includes("Duplicate entry")) {
            throw new Error("A user with this email already exists");
        }
        throw new Error("Failed to create user");
    }
}

export async function updateUserProfile(userId: number, formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as 'user' | 'admin';
    const image = formData.get("image") as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (image) updates.image = image;

    try {
        const updatedUser = await updateUser(userId, updates);
        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin/dashboard");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to update user:", error);
        throw new Error("Failed to update user");
    }
}

export async function updateUserImage(userId: number, imagePath: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        const updatedUser = await updateUser(userId, { image: imagePath });
        if (!updatedUser) {
            throw new Error("Failed to update user image");
        }

        revalidatePath("/admin/users");
        revalidatePath("/admin/dashboard");
        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("Failed to update user image:", error);
        throw new Error("Failed to update user image");
    }
}