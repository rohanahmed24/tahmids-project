"use client";

import { useMemo } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { Locale } from "@/lib/locale";

interface ArticleShareBarProps {
  title: string;
  url: string;
  locale?: Locale;
  enUrl?: string;
  bnUrl?: string;
}

function encode(value: string) {
  return encodeURIComponent(value);
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
      <path d="M24 12a12 12 0 1 0-13.875 11.86v-8.387H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.473h-2.796v8.387A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.27l-4.9-6.41L6.42 22H3.31l7.24-8.28L.8 2h6.4l4.43 5.85L18.9 2Zm-1.1 18h1.74L6.25 3.9H4.4L17.8 20Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.75a4 4 0 0 0-4 4v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4h-8.5Zm8.94 1.31a1.31 1.31 0 1 1 0 2.62 1.31 1.31 0 0 1 0-2.62ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z" />
    </svg>
  );
}

export function ArticleShareBar({ title, url, locale = "en", enUrl, bnUrl }: ArticleShareBarProps) {
  const copy = locale === "bn"
    ? {
        label: "শেয়ার করুন",
        nativeShare: "শেয়ার",
        facebook: "Facebook",
        x: "X",
        instagram: "Instagram",
        copied: "লিংক কপি হয়েছে। এখন পেস্ট করে শেয়ার করুন।",
        copiedEn: "English link copied.",
        copiedBn: "Bangla link copied.",
        failed: "লিংক কপি করা যায়নি।",
      }
    : {
        label: "Share",
        nativeShare: "Share",
        facebook: "Facebook",
        x: "X",
        instagram: "Instagram",
        copied: "Link copied. Paste it to share.",
        copiedEn: "English link copied.",
        copiedBn: "Bangla link copied.",
        failed: "Failed to copy link.",
      };

  const links = useMemo(() => {
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`,
      x: `https://twitter.com/intent/tweet?url=${encode(url)}&text=${encode(title)}`,
    };
  }, [title, url]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success(copy.copied);
    } catch {
      toast.error(copy.failed);
    }
  };

  const copySpecificLink = async (targetUrl: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      toast.success(successMessage);
    } catch {
      toast.error(copy.failed);
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url });
    } catch {
      // Ignore cancel/errors from native dialog.
    }
  };

  const baseButtonClass =
    "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-bg-secondary px-3 text-xs font-bold uppercase tracking-wider text-text-primary transition-colors hover:bg-bg-tertiary sm:w-auto";

  return (
    <section className="rounded-2xl border border-border-subtle bg-bg-primary/95 p-4 sm:p-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary mr-1">
            <Share2 className="w-4 h-4" />
            {copy.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button type="button" onClick={nativeShare} className={baseButtonClass}>
              <ExternalLink className="w-4 h-4" />
              {copy.nativeShare}
            </button>
          )}

          <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={baseButtonClass}>
            <FacebookIcon />
            {copy.facebook}
          </a>

          <a href={links.x} target="_blank" rel="noopener noreferrer" className={baseButtonClass}>
            <XIcon />
            {copy.x}
          </a>

          <button type="button" onClick={copyLink} className={baseButtonClass}>
            <InstagramIcon />
            {copy.instagram}
          </button>

          {enUrl && (
            <button
              type="button"
              onClick={() => copySpecificLink(enUrl, copy.copiedEn)}
              className={baseButtonClass}
            >
              <Copy className="w-4 h-4 shrink-0" />
              EN Link
            </button>
          )}

          {bnUrl && (
            <button
              type="button"
              onClick={() => copySpecificLink(bnUrl, copy.copiedBn)}
              className={baseButtonClass}
            >
              <Copy className="w-4 h-4 shrink-0" />
              BN Link
            </button>
          )}

          <button type="button" onClick={copyLink} className={baseButtonClass}>
            <Copy className="w-4 h-4 shrink-0" />
            {locale === "bn" ? "লিংক" : "Link"}
          </button>
        </div>
      </div>
    </section>
  );
}
