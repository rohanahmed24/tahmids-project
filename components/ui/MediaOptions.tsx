"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Headphones, Play } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MediaOptionsProps {
  slug: string;
  hasAudio?: boolean;
  hasVideo?: boolean;
  variant?: "default" | "compact" | "overlay" | "minimal" | "prominent";
  className?: string;
}

export function MediaOptions({
  slug,
  hasAudio = false,
  hasVideo = false,
  variant = "default",
  className = "",
}: MediaOptionsProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const labels =
    locale === "bn"
      ? { read: "পড়ুন", listen: "শুনুন", watch: "দেখুন" }
      : { read: "Read", listen: "Listen", watch: "Watch" };

  const scrollToTarget = useCallback((targetId: string, attempt = 0) => {
    const target = document.getElementById(targetId);
    if (target) {
      const nav = document.querySelector("nav.fixed.top-0") as HTMLElement | null;
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const extraOffset = 16;
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        navHeight -
        extraOffset;

      window.scrollTo({
        top: Math.max(0, top),
        behavior: "smooth",
      });
      return;
    }

    if (attempt < 30) {
      window.requestAnimationFrame(() => scrollToTarget(targetId, attempt + 1));
    }
  }, []);

  const options = [
    {
      id: "read",
      label: labels.read,
      icon: BookOpen,
      href: `/article/${slug}`,
      targetId: "article-content",
    },
    ...(hasAudio
      ? [
          {
            id: "listen",
            label: labels.listen,
            icon: Headphones,
            href: `/article/${slug}?mode=listen`,
            targetId: "article-media",
          },
        ]
      : []),
    ...(hasVideo
      ? [
          {
            id: "watch",
            label: labels.watch,
            icon: Play,
            href: `/article/${slug}?mode=watch`,
            targetId: "article-media",
          },
        ]
      : []),
  ];

  const handleClick = (e: React.MouseEvent, href: string, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(href, { scroll: false });
    scrollToTarget(targetId);
  };

  // Prominent variant - Labeled icons for mobile hero/sliders
  if (variant === "prominent") {
    return (
      <div className={`flex items-center gap-3 flex-wrap ${className}`}>
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={(e) => handleClick(e, option.href, option.targetId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium text-xs transition-all"
            aria-label={option.label}
          >
            <option.icon className="w-4 h-4" />
            <span>{option.label}</span>
          </motion.button>
        ))}
      </div>
    );
  }

  // Compact/Minimal variant - Subtle icons for grid cards
  if (variant === "minimal" || variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={(e) => handleClick(e, option.href, option.targetId)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full bg-bg-secondary hover:bg-border-subtle flex items-center justify-center text-text-primary border border-border-subtle transition-all !p-0"
            aria-label={option.label}
            title={option.label}
          >
            <option.icon className="w-5 h-5" strokeWidth={2.5} />
          </motion.button>
        ))}
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {options.map((option) => (
          <motion.button
            key={option.id}
            onClick={(e) => handleClick(e, option.href, option.targetId)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3 rounded-full text-white text-sm font-medium hover:bg-white/20 transition-all min-h-[44px]"
            aria-label={option.label}
          >
            <option.icon className="w-4 h-4" />
            {option.label}
          </motion.button>
        ))}
      </div>
    );
  }

  // Default variant - subtle pills with mobile touch targets
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {options.map((option) => (
        <motion.button
          key={option.id}
          onClick={(e) => handleClick(e, option.href, option.targetId)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 bg-bg-secondary hover:bg-bg-tertiary border border-border-subtle px-4 py-2 rounded-full text-text-secondary hover:text-text-primary text-xs font-medium transition-all min-h-[36px]"
          aria-label={option.label}
        >
          <option.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{option.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
