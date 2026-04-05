import type { Locale } from "@/lib/locale";

export function getArticlePath(
  slug: string,
  locale: Locale,
  mode?: "listen" | "watch",
): string {
  const basePath = `/${locale}/article/${slug}`;
  if (!mode) return basePath;
  return `${basePath}?mode=${mode}`;
}

