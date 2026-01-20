"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function getNavbarLinks() {
    try {
        const links = await prisma.navbarLink.findMany({
            orderBy: { order: "asc" },
            where: { isActive: true },
        });
        return { success: true, links };
    } catch (error) {
        console.error("Error fetching navbar links:", error);
        return { success: false, error: "Failed to fetch links" };
    }
}

export async function getAllNavbarLinksAdmin() {
    try {
        const links = await prisma.navbarLink.findMany({
            orderBy: { order: "asc" },
        });
        return { success: true, links };
    } catch (error) {
        console.error("Error fetching admin navbar links:", error);
        return { success: false, error: "Failed to fetch links" };
    }
}

export async function createNavbarLink(data: { label: string; href: string; order?: number }) {
    try {
        const link = await prisma.navbarLink.create({
            data: {
                label: data.label,
                href: data.href,
                order: data.order || 0,
            },
        });
        revalidatePath("/");
        revalidateTag("navbar_links", "default");
        return { success: true, link };
    } catch (error) {
        console.error("Error creating navbar link:", error);
        return { success: false, error: "Failed to create link" };
    }
}

export async function updateNavbarLink(id: number, data: { label?: string; href?: string; order?: number; isActive?: boolean }) {
    try {
        const link = await prisma.navbarLink.update({
            where: { id },
            data,
        });
        revalidatePath("/");
        revalidateTag("navbar_links", "default");
        return { success: true, link };
    } catch (error) {
        console.error("Error updating navbar link:", error);
        return { success: false, error: "Failed to update link" };
    }
}

export async function deleteNavbarLink(id: number) {
    try {
        await prisma.navbarLink.delete({
            where: { id },
        });
        revalidatePath("/");
        revalidateTag("navbar_links", "default");
        return { success: true };
    } catch (error) {
        console.error("Error deleting navbar link:", error);
        return { success: false, error: "Failed to delete link" };
    }
}

export async function reorderNavbarLinks(updates: { id: number; order: number }[]) {
    try {
        await prisma.$transaction(
            updates.map((u) =>
                prisma.navbarLink.update({
                    where: { id: u.id },
                    data: { order: u.order },
                })
            )
        );
        revalidatePath("/");
        revalidateTag("navbar_links", "default");
        return { success: true };
    } catch (error) {
        console.error("Error reordering navbar links:", error);
        return { success: false, error: "Failed to reorder links" };
    }
}
