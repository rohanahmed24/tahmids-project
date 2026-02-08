"use client";

import { ExternalLinkIcon } from "lucide-react";

interface BacklinksSectionProps {
  backlinks: string[];
}

export function BacklinksSection({ backlinks }: BacklinksSectionProps) {
  if (!backlinks || backlinks.length === 0) {
    return null;
  }

  // Filter out empty strings and validate URLs
  const validBacklinks = backlinks
    .filter(url => url && url.trim().length > 0)
    .map(url => {
      // Clean up URL - remove HTML anchor tags if present
      let cleanUrl = url.trim();

      // Check if the backlink contains an HTML anchor tag and extract the href
      const anchorMatch = cleanUrl.match(/<a\s+(?:[^>]*?\s+)?href=["']([^"']+)["'][^>]*>/i);
      if (anchorMatch) {
        cleanUrl = anchorMatch[1]; // Extract the URL from href attribute
      }

      // Ensure URL has protocol
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }

      // Extract domain for display
      try {
        const domain = new URL(cleanUrl).hostname;
        return { url: cleanUrl, domain };
      } catch {
        // If URL parsing fails, use original URL
        return { url: cleanUrl, domain: cleanUrl };
      }
    });

  if (validBacklinks.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-6 mt-12">
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="w-1 h-6 bg-accent rounded-full"></span>
        Cited Sources
      </h3>
      
      <p className="text-text-muted text-sm mb-4">
        This article references the following external sources:
      </p>

      <div className="space-y-2">
        {validBacklinks.map(({ url, domain }, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 rounded-md hover:bg-bg-tertiary transition-colors group"
          >
            <ExternalLinkIcon className="w-4 h-4 text-text-muted group-hover:text-accent flex-shrink-0" />
            <span className="text-text-primary text-sm truncate group-hover:text-accent transition-colors">
              {domain}
            </span>
            <span className="ml-auto text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              ↗
            </span>
          </a>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-text-muted text-xs">
          External links open in new window. Wisdomia is not responsible for content on external sites.
        </p>
      </div>
    </div>
  );
}