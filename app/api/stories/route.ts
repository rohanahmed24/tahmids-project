import { NextResponse } from "next/server";
import { getStoriesFeed } from "@/lib/posts";
import { getLocaleFromCookieHeader } from "@/lib/locale";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");
    const limit = limitParam ? Math.max(1, Number(limitParam)) : 8;
    const offset = offsetParam ? Math.max(0, Number(offsetParam)) : 0;
    const locale = getLocaleFromCookieHeader(request.headers.get("cookie"));

    const { stories, hasMore } = await getStoriesFeed({
      category,
      limit,
      offset,
      locale,
    });

    return NextResponse.json({ stories, hasMore });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json({ stories: [], hasMore: false }, { status: 500 });
  }
}
