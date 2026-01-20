import { NextResponse } from "next/server";
import { getAllMedia } from "@/lib/media-service";
import { verifyAdmin } from "@/actions/admin-auth";

export async function GET() {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const media = await getAllMedia();
        return NextResponse.json(media);
    } catch (error) {
        console.error("Error fetching media:", error);
        return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
    }
}
