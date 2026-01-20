
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    // Security check: Ensure user is admin
    const cookieStore = await cookies();
    const isAdminCookie = cookieStore.get("admin_session")?.value === "true";

    // Also check NextAuth session if available
    const session = await auth();
    const isNextAuthAdmin = session?.user?.role === "admin";

    if (!isAdminCookie && !isNextAuthAdmin) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { filename } = await params;

    // Prevent directory traversal
    const safeFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), "uploads/resumes", safeFilename);

    try {
        const fileBuffer = await readFile(filePath);

        // Determine content type
        const ext = path.extname(safeFilename).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".pdf") contentType = "application/pdf";
        if (ext === ".doc") contentType = "application/msword";
        if (ext === ".docx") contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Content-Disposition": `inline; filename="${safeFilename}"`
            }
        });
    } catch (error) {
        console.error("Resume download error:", error);
        return new NextResponse("File not found", { status: 404 });
    }
}
