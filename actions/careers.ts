"use server";

import { verifyAdmin } from "@/actions/admin-auth";
import { revalidatePath } from "next/cache";

export async function getApplications() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // In a real implementation, you would fetch from a careers/applications table
        // For now, return mock data
        const mockApplications = [
            {
                id: 1,
                name: "John Doe",
                email: "john.doe@example.com",
                position: "Content Writer",
                status: "pending",
                appliedAt: "2024-01-10",
                resume: "/resumes/john-doe.pdf"
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane.smith@example.com",
                position: "Editor",
                status: "reviewed",
                appliedAt: "2024-01-08",
                resume: "/resumes/jane-smith.pdf"
            }
        ];

        return { success: true, applications: mockApplications };
    } catch (error) {
        console.error("Failed to get applications:", error);
        return { success: false, error: "Failed to get applications", applications: [] };
    }
}

export async function updateApplicationStatus(applicationId: number, status: string) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // In a real implementation, you would update the application status in database
        // Mock usage:
        console.log(`Updating application ${applicationId} to ${status}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update application status:", error);
        throw new Error("Failed to update application status");
    }
}

export async function createJobPosting(formData: FormData) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
        throw new Error("Unauthorized");
    }

    try {
        // formData.get... lines removed as they are unused in mock
        // const title = formData.get("title") as string;
        // ...
        console.log("Creating job posting with data:", Object.fromEntries(formData));

        // In a real implementation, you would save to database

        revalidatePath("/admin/careers");
        return { success: true };
    } catch (error) {
        console.error("Failed to create job posting:", error);
        throw new Error("Failed to create job posting");
    }
}

export async function submitJobApplication(formData: FormData) {
    try {
        // Unused vars removed
        // const name = formData.get("name") as string;
        // ...
        console.log("Submitting application with data:", Object.fromEntries(formData));

        // In a real implementation, you would save to database

        return { success: true, message: "Application submitted successfully!" };
    } catch (error) {
        console.error("Failed to submit application:", error);
        return { success: false, message: "Failed to submit application" };
    }
}