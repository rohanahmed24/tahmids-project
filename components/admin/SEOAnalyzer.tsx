"use client";

import { useMemo } from "react";
import { AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

interface SEOAnalyzerProps {
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  backlinks: string;
  coverImage?: string;
}

type SEOCheck = {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  ok: boolean;
  hint: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLinksFromHtml(html: string): string[] {
  const matches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
  return matches
    .map((match) => match[1]?.trim())
    .filter((value): value is string => Boolean(value));
}

function normalizeBacklinks(backlinks: string): string[] {
  return backlinks
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function extractPrimaryKeyword(title: string): string {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "for", "with", "without", "in", "on",
    "at", "to", "from", "of", "by", "is", "are", "be", "that", "this", "it",
  ]);

  const words = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  return words[0] || "";
}

export function SEOAnalyzer({
  title,
  slug,
  content,
  metaDescription,
  backlinks,
  coverImage,
}: SEOAnalyzerProps) {
  const analysis = useMemo(() => {
    const plainText = stripHtml(content);
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    const titleLength = title.trim().length;
    const metaLength = metaDescription.trim().length;
    const headingCount =
      (content.match(/<h1[\s>]/gi)?.length || 0) +
      (content.match(/<h2[\s>]/gi)?.length || 0) +
      (content.match(/<h3[\s>]/gi)?.length || 0);
    const contentLinks = parseLinksFromHtml(content);
    const internalLinks = contentLinks.filter((link) =>
      link.startsWith("/") || link.includes("thewisdomia.com")
    );
    const backlinkList = normalizeBacklinks(backlinks);
    const primaryKeyword = extractPrimaryKeyword(title);
    const normalizedSlug = slug.toLowerCase();
    const normalizedText = plainText.toLowerCase();
    const normalizedMeta = metaDescription.toLowerCase();
    const keywordInTitle =
      primaryKeyword && title.toLowerCase().includes(primaryKeyword);
    const keywordInSlug =
      primaryKeyword && normalizedSlug.includes(primaryKeyword);
    const keywordInMeta =
      primaryKeyword && normalizedMeta.includes(primaryKeyword);
    const keywordInContent =
      primaryKeyword && normalizedText.includes(primaryKeyword);

    const checks: SEOCheck[] = [
      {
        id: "title-length",
        label: "Title Length (50-60 chars)",
        score: titleLength >= 50 && titleLength <= 60 ? 12 : titleLength >= 40 && titleLength <= 70 ? 7 : 0,
        maxScore: 12,
        ok: titleLength >= 50 && titleLength <= 60,
        hint: `Current: ${titleLength} chars`,
      },
      {
        id: "meta-length",
        label: "Meta Description (120-160 chars)",
        score: metaLength >= 120 && metaLength <= 160 ? 12 : metaLength >= 90 && metaLength <= 180 ? 7 : 0,
        maxScore: 12,
        ok: metaLength >= 120 && metaLength <= 160,
        hint: `Current: ${metaLength} chars`,
      },
      {
        id: "content-depth",
        label: "Content Depth (600+ words)",
        score: wordCount >= 600 ? 16 : wordCount >= 350 ? 10 : wordCount >= 200 ? 5 : 0,
        maxScore: 16,
        ok: wordCount >= 600,
        hint: `Current: ${wordCount} words`,
      },
      {
        id: "heading-structure",
        label: "Heading Structure (3+ headings)",
        score: headingCount >= 3 ? 10 : headingCount === 2 ? 6 : headingCount === 1 ? 3 : 0,
        maxScore: 10,
        ok: headingCount >= 3,
        hint: `Current: ${headingCount} headings`,
      },
      {
        id: "keyword-coverage",
        label: "Primary Keyword Coverage",
        score:
          (keywordInTitle ? 4 : 0) +
          (keywordInSlug ? 4 : 0) +
          (keywordInMeta ? 4 : 0) +
          (keywordInContent ? 4 : 0),
        maxScore: 16,
        ok: Boolean(keywordInTitle && keywordInSlug && keywordInMeta && keywordInContent),
        hint: primaryKeyword ? `Keyword: "${primaryKeyword}"` : "Add a descriptive title",
      },
      {
        id: "internal-links",
        label: "Internal Links (1+)",
        score: internalLinks.length >= 1 ? 8 : 0,
        maxScore: 8,
        ok: internalLinks.length >= 1,
        hint: `Current: ${internalLinks.length} internal links`,
      },
      {
        id: "cited-sources",
        label: "Cited Sources / Backlinks (2+)",
        score: backlinkList.length >= 2 ? 10 : backlinkList.length === 1 ? 5 : 0,
        maxScore: 10,
        ok: backlinkList.length >= 2,
        hint: `Current: ${backlinkList.length} backlinks`,
      },
      {
        id: "slug-quality",
        label: "Slug Quality",
        score: slug.length >= 20 && slug.length <= 75 && /^[a-z0-9-]+$/.test(slug) ? 8 : 3,
        maxScore: 8,
        ok: slug.length >= 20 && slug.length <= 75 && /^[a-z0-9-]+$/.test(slug),
        hint: slug ? `Slug: /${slug}` : "Set a clean slug",
      },
      {
        id: "cover-image",
        label: "Featured Image Present",
        score: coverImage?.trim() ? 8 : 0,
        maxScore: 8,
        ok: Boolean(coverImage?.trim()),
        hint: coverImage?.trim() ? "Cover image set" : "Add a cover image",
      },
    ];

    const score = checks.reduce((sum, item) => sum + item.score, 0);

    return {
      score,
      checks,
      wordCount,
      primaryKeyword,
    };
  }, [title, slug, content, metaDescription, backlinks, coverImage]);

  const scoreTone =
    analysis.score >= 85
      ? "text-green-400"
      : analysis.score >= 70
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div className="bg-bg-card border border-border-primary rounded-2xl p-6 space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-text-muted uppercase tracking-widest text-xs">
            SEO Analyzer
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Live score with actionable recommendations
          </p>
        </div>
        <div className={`text-2xl font-black ${scoreTone}`}>
          {analysis.score}
          <span className="text-sm text-text-muted font-semibold">/100</span>
        </div>
      </div>

      <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            analysis.score >= 85
              ? "bg-green-500"
              : analysis.score >= 70
                ? "bg-amber-500"
                : "bg-red-500"
          }`}
          style={{ width: `${analysis.score}%` }}
        />
      </div>

      <div className="space-y-2">
        {analysis.checks.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 p-2 rounded-lg bg-bg-tertiary/30 border border-border-primary"
          >
            {item.ok ? (
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm text-text-primary">
                {item.label}{" "}
                <span className="text-xs text-text-muted">
                  ({item.score}/{item.maxScore})
                </span>
              </p>
              <p className="text-[11px] text-text-muted">{item.hint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-border-primary space-y-2">
        <p className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Best Practices
        </p>
        <ul className="text-[11px] text-text-muted space-y-1 leading-relaxed">
          <li>Use one clear primary keyword and include it in title, slug, meta, and body.</li>
          <li>Keep intro tight and answer search intent within the first 120 words.</li>
          <li>Break sections with meaningful H2/H3 headings for scanability.</li>
          <li>Add 1+ internal links and cite credible external sources.</li>
          <li>Use concise meta descriptions that motivate clicks, not keyword stuffing.</li>
        </ul>
      </div>
    </div>
  );
}

