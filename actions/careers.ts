"use server";

import { pool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/actions/admin-auth";
import { auth } from "@/auth";

async function checkAuth() {
    const isAdmin = await verifyAdmin();
    const session = await auth();
    const isNextAuthAdmin = session?.user?.role === "admin";

    if (!isAdmin && !isNextAuthAdmin) {
        throw new Error("Unauthorized");
    }
}

export async function submitApplication(formData: FormData) {
    // Public action, no auth needed
    const jobId = formData.get("jobId");
    const jobTitle = formData.get("jobTitle");
    const name = formData.get("name");
    const email = formData.get("email");
    const linkedin = formData.get("linkedin");
    const message = formData.get("message");
    const resume = formData.get("resume") as File;

    if (!jobId || !name || !email || !resume) {
        return { success: false, message: "Missing required fields" };
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(resume.type)) {
        return { success: false, message: "Invalid file type. Please upload PDF or Word document." };
    }

    try {
        // Save file to private directory
        const buffer = Buffer.from(await resume.arrayBuffer());
        const filename = `${Date.now()}-${resume.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        // Store outside of public/ to prevent public access
        const uploadDir = path.join(process.cwd(), "uploads/resumes");

        const fs = require('fs');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await writeFile(path.join(uploadDir, filename), buffer);

        // Store filename only, or secure route path
        const resumePath = `/api/admin/resumes/${filename}`;

        // DB Insert
        const connection = await pool.getConnection();
        try {
            await connection.query<ResultSetHeader>(
                `INSERT INTO job_applications (job_id, job_title, applicant_name, email, linkedin, message, resume_path)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [jobId, jobTitle, name, email, linkedin, message, resumePath]
            );
        } finally {
            connection.release();
        }

        revalidatePath("/admin/dashboard");
        return { success: true, message: "Application submitted successfully" };
    } catch (error) {
        console.error("Application submission error:", error);
        return { success: false, message: "Failed to submit application" };
    }
}

export async function getApplications() {
    try {
        await checkAuth();
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM job_applications ORDER BY created_at DESC"
        );
        return rows as any[];
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        return [];
    }
}

export async function updateApplicationStatus(id: number, status: string) {
    try {
        await checkAuth();
        await pool.query(
            "UPDATE job_applications SET status = ? WHERE id = ?",
            [status, id]
        );
        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update status:", error);
        return { success: false };
    }
}
