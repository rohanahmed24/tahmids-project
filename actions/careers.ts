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
        console.log(`Updated application ${applicationId} status to ${status}`);

        revalidatePath("/admin/careers");
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
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const requirements = formData.get("requirements") as string;
        const location = formData.get("location") as string;
        const type = formData.get("type") as string;

        // In a real implementation, you would save to database
        console.log("Job posting created:", {
            title,
            description,
            requirements,
            location,
            type
        });

        revalidatePath("/admin/careers");
        return { success: true };
    } catch (error) {
        console.error("Failed to create job posting:", error);
        throw new Error("Failed to create job posting");
    }
}

export async function submitJobApplication(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const position = formData.get("position") as string;
        const coverLetter = formData.get("coverLetter") as string;
        const resume = formData.get("resume") as File;

        // In a real implementation, you would save to database
        console.log("Job application submitted:", {
            name,
            email,
            position,
            coverLetter,
            resumeSize: resume?.size || 0
        });

        return { success: true, message: "Application submitted successfully!" };
    } catch (error) {
        console.error("Failed to submit application:", error);
        return { success: false, message: "Failed to submit application" };
    }
}