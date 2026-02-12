import { NextResponse } from "next/server";
import { getHotTopics, getPostsByCategory } from "@/lib/posts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.max(1, Number(limitParam)) : 8;

    const stories = category
      ? await getPostsByCategory(category, limit)
      : await getHotTopics(limit);

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ stories: [] }, { status: 500 });
  }
}
