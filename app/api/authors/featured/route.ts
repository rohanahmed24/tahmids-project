import { NextResponse } from "next/server";
import { getFeaturedWriters } from "@/lib/users";

export async function GET() {
  try {
    const authors = await getFeaturedWriters();
    return NextResponse.json({ authors });
  } catch (error) {
    console.error("Failed to fetch featured authors:", error);
    return NextResponse.json({ authors: [] }, { status: 500 });
  }
}
