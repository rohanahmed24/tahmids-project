"use server";

import { updateUser as dbUpdateUser } from "@/lib/users";
import { verifyAdmin } from "@/actions/admin-auth";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function createNewUser(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "user";

    // Validate inputs
    if (!name?.trim() || !email?.trim() || !password) {
        throw new Error("All fields are required");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
        data: {
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            role: role as "user" | "admin"
        }
    });

    revalidatePath("/admin/users");
    
    return { success: true };
}

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { role }
    });

    revalidatePath("/admin/users");
    
    return { success: true };
}

export async function updateUserImage(userId: number, imagePath: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: { id: userId },
        data: { image: imagePath }
    });

    revalidatePath("/admin/users");
    revalidatePath("/"); // Update homepage if user is featured
    
    return { success: true };
}

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