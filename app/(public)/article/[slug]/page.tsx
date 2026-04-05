import { redirect } from "next/navigation";
import { getCurrentLocale, normalizeLocale } from "@/lib/locale";

interface LegacyArticlePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string; lang?: string }>;
}

export default async function LegacyArticlePage({
  params,
  searchParams,
}: LegacyArticlePageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const locale = resolvedSearchParams.lang
    ? normalizeLocale(resolvedSearchParams.lang)
    : await getCurrentLocale();
  const mode = resolvedSearchParams.mode;
  const modeQuery =
    mode === "watch" || mode === "listen" ? `?mode=${mode}` : "";

  redirect(`/${locale}/article/${resolvedParams.slug}${modeQuery}`);
}

