import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

let uploadsPattern: RemotePattern | null = null;
if (process.env.NEXT_PUBLIC_UPLOADS_BASE_URL) {
  try {
    const parsed = new URL(process.env.NEXT_PUBLIC_UPLOADS_BASE_URL);
    const protocol = parsed.protocol.replace(":", "");
    if (protocol === "http" || protocol === "https") {
      uploadsPattern = {
        protocol,
        hostname: parsed.hostname,
        ...(parsed.port ? { port: parsed.port } : {}),
      };
    }
  } catch {
    uploadsPattern = null;
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent XSS attacks
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Referrer policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions policy
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https:",
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // Strict Transport Security (HTTPS only)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
  // Disable X-Powered-By header
  poweredByHeader: false,
  // Rewrite uploaded images to API route (for standalone mode)
  async rewrites() {
    return [
      {
        source: '/imgs/uploads/:path*',
        destination: '/api/uploads/:path*',
      },
    ];
  },
  images: {
    // Avoid local optimizer fetch failures during dev when using remote uploads.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thewisdomia.com',
      },
      {
        protocol: 'http',
        hostname: 'thewisdomia.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      ...(uploadsPattern ? [uploadsPattern] : []),
    ],
  },
};

export default nextConfig;
