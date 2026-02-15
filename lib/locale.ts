import { cookies } from "next/headers";

export const LOCALE_COOKIE_NAME = "wisdomia_locale";
export const SUPPORTED_LOCALES = ["en", "bn"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function normalizeLocale(value?: string | null): Locale {
  if (!value) return "en";
  const lowered = value.toLowerCase();
  if (lowered === "bn" || lowered === "en") return lowered;
  return "en";
}

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  return normalizeLocale(localeCookie);
}

export function getLocaleFromCookieHeader(cookieHeader?: string | null): Locale {
  if (!cookieHeader) return "en";
  const match = cookieHeader.match(
    new RegExp(`${LOCALE_COOKIE_NAME}=([^;]+)`),
  );
  if (!match) return "en";
  return normalizeLocale(decodeURIComponent(match[1]));
}

