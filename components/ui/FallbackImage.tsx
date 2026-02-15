"use client";

import { useEffect, useMemo, useState } from "react";

type FallbackImageProps = {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
  loading?: "eager" | "lazy";
  priority?: boolean;
};

export function FallbackImage({
  src,
  alt,
  fallbackSrc = "/placeholder.jpg",
  className,
  sizes,
  fill = false,
  loading = "lazy",
  priority = false,
}: FallbackImageProps) {
  const resolvedSrc = useMemo(() => {
    if (!src) return fallbackSrc;
    const trimmed = src.trim();
    return trimmed ? trimmed : fallbackSrc;
  }, [src, fallbackSrc]);

  const [imgSrc, setImgSrc] = useState(resolvedSrc);

  useEffect(() => {
    setImgSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : loading}
      decoding="async"
      className={fill ? `absolute inset-0 h-full w-full ${className || ""}` : className}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
