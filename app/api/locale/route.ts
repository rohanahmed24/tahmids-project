import { NextResponse } from "next/server";
import {
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/locale";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };
    const locale = normalizeLocale(body?.locale) as Locale;

    const response = NextResponse.json({ ok: true, locale });
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid locale payload" },
      { status: 400 },
    );
  }
}
