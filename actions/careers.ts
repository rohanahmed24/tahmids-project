
"use server";

import { getDb } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/actions/admin-auth";
import { auth } from "@/auth";

export async function submitJobApplication(prevState: unknown, formData: FormData) {
    try {
        const jobId = formData.get("jobId");
        const jobTitle = formData.get("jobTitle");
        const name = formData.get("name");
        const email = formData.get("email");
        const linkedin = formData.get("linkedin");
        const message = formData.get("message");
        const resume = formData.get("resume") as File;

        if (!jobId || !jobTitle || !name || !email || !message || !resume) {
            return {
                success: false,
                message: "Please fill in all required fields."
            };
        }

        // Validate file type
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const validExtensions = ['.pdf', '.doc', '.docx'];

        const fileExtension = path.extname(resume.name).toLowerCase();

        if (!validTypes.includes(resume.type) || !validExtensions.includes(fileExtension)) {
             return {
                success: false,
                message: "Invalid file type. Please upload a PDF or Word document."
            };
        }

        // Validate file size (e.g. 5MB)
        if (resume.size > 5 * 1024 * 1024) {
             return {
                success: false,
                message: "File size too large. Max 5MB."
            };
        }

        // Save the file
        const buffer = Buffer.from(await resume.arrayBuffer());
        const fileName = `${randomUUID()}${fileExtension}`;
        const uploadDir = path.join(process.cwd(), "public/imgs/uploads/resumes");

        // Ensure directory exists
        try {
             await mkdir(uploadDir, { recursive: true });
        } catch {
            // Ignore if exists
        }

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const resumePath = `/imgs/uploads/resumes/${fileName}`;

        // Save to database
        const db = getDb();
        try {
             await db.query(
                "INSERT INTO job_applications (job_id, job_title, name, email, linkedin, resume_path, message) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [jobId, jobTitle, name, email, linkedin, resumePath, message]
            );
        } catch (error) {
            console.error("Database error:", error);
             return {
                success: false,
                message: "Failed to save application. Please try again later."
            };
        }


        return {
            success: true,
            message: "Application submitted successfully!"
        };

    } catch (error) {
        console.error("Submission error:", error);
        return {
            success: false,
            message: "Something went wrong. Please try again."
        };
    }
}

export async function getApplications() {
    try {
        const isAdmin = await verifyAdmin();
        const session = await auth();
        const isNextAuthAdmin = session?.user?.role === "admin";

        if (!isAdmin && !isNextAuthAdmin) {
            throw new Error("Unauthorized");
        }

        const db = getDb();
        const [rows] = await db.query<RowDataPacket[]>(
            "SELECT * FROM job_applications ORDER BY applied_at DESC"
        );
        return rows;
    } catch (error) {
        console.error("Get applications error:", error);
        return [];
    }
}

export async function updateApplicationStatus(id: number, status: string) {
    try {
        const isAdmin = await verifyAdmin();
        const session = await auth();
        const isNextAuthAdmin = session?.user?.role === "admin";

        if (!isAdmin && !isNextAuthAdmin) {
            throw new Error("Unauthorized");
        }

        const db = getDb();
        await db.query<ResultSetHeader>(
            "UPDATE job_applications SET status = ? WHERE id = ?",
            [status, id]
        );
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Update application status error:", error);
        return { success: false };
    }
}
