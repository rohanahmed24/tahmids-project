"use server";

import { pool } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { writeFile, unlink } from "fs/promises";
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

export async function uploadImage(formData: FormData) {
    try {
        await checkAuth();
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, message: "No file provided" };
        }

        if (!file.type.startsWith("image/")) {
            return { success: false, message: "Invalid file type" };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const uploadDir = path.join(process.cwd(), "public/imgs/uploads");

        // Ensure dir exists
        const fs = require('fs');
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await writeFile(path.join(uploadDir, filename), buffer);
        const url = `/imgs/uploads/${filename}`;

        // Add to assets table
        const connection = await pool.getConnection();
        try {
            await connection.query<ResultSetHeader>(
                "INSERT INTO assets (name, url, type) VALUES (?, ?, ?)",
                [file.name, url, 'image']
            );
        } finally {
            connection.release();
        }

        revalidatePath("/admin/dashboard");
        return { success: true, url };
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, message: "Upload failed" };
    }
}

export async function getImages() {
    try {
        await checkAuth();
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM assets ORDER BY id DESC");
        return rows as any[];
    } catch (error) {
        console.error("Fetch images error:", error);
        return [];
    }
}

export async function deleteImage(id: number, url: string) {
    try {
        await checkAuth();

        // Sanitize path to ensure it is within public/imgs/uploads
        // url should be like /imgs/uploads/filename.ext
        if (!url.startsWith("/imgs/uploads/")) {
             throw new Error("Invalid file path");
        }

        const filename = path.basename(url);
        const filepath = path.join(process.cwd(), "public/imgs/uploads", filename);

        // Ensure the resolved path is actually inside the uploads directory
        const uploadsDir = path.join(process.cwd(), "public/imgs/uploads");
        if (!filepath.startsWith(uploadsDir)) {
             throw new Error("Path traversal detected");
        }

        // Delete from DB
        await pool.query("DELETE FROM assets WHERE id = ?", [id]);

        // Delete file
        try {
            await unlink(filepath);
        } catch (e) {
            console.warn("File not found on disk:", filepath);
        }

        revalidatePath("/admin/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Delete image error:", error);
        return { success: false };
    }
}
