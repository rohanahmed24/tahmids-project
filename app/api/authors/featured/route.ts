import { NextResponse } from "next/server";
import { getFeaturedWriters } from "@/lib/users";

export async function GET() {
  const authors = await getFeaturedWriters();
  return NextResponse.json({ authors });
}
