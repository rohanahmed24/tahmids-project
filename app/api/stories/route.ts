import { NextResponse } from "next/server";
import { getHotTopics, getPostsByCategory } from "@/lib/posts";
import { getLocaleFromCookieHeader } from "@/lib/locale";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.max(1, Number(limitParam)) : 8;
    const locale = getLocaleFromCookieHeader(request.headers.get("cookie"));

    const stories = category
      ? await getPostsByCategory(category, limit, locale)
      : await getHotTopics(limit, locale);

    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ stories: [] }, { status: 500 });
  }
}
