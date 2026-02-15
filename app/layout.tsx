import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SessionProvider } from "next-auth/react";
import { SessionSync } from "@/components/SessionSync";
import { getGoogleVerificationTag } from "@/actions/seo";
import { getCurrentLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const googleVerificationTag = await getGoogleVerificationTag();

  return {
    title: {
      default: "Wisdomia - Your Digital Magazine",
      template: "%s | Wisdomia"
    },
    description: "Explore stories that matter across politics, mystery, crime, history, news, and science. Thoughtful, well-researched content that informs and inspires.",
    keywords: ["digital magazine", "politics", "mystery", "crime", "history", "news", "science", "wisdomia"],
    authors: [{ name: "Wisdomia Team" }],
    creator: "Wisdomia",
    publisher: "Wisdomia",
    metadataBase: new URL("https://thewisdomia.com"),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://thewisdomia.com",
      siteName: "Wisdomia",
      title: "Wisdomia - Your Digital Magazine",
      description: "Explore stories that matter across politics, mystery, crime, history, news, and science.",
      images: [
        {
          url: "https://thewisdomia.com/og-image.png",
          width: 1200,
          height: 630,
          alt: "Wisdomia - Your Digital Magazine"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "Wisdomia - Your Digital Magazine",
      description: "Explore stories that matter across politics, mystery, crime, history, news, and science.",
      images: ["/og-image.png"]
    },
    icons: {
      icon: [
        { url: "/favicon.ico?v=2", type: "image/x-icon", sizes: "any" },
        { url: "/icon.png?v=2", type: "image/png", sizes: "32x32" }
      ],
      shortcut: "/favicon.ico?v=2",
      apple: "/apple-touch-icon.png?v=2"
    },
    manifest: "/site.webmanifest",
    verification: {
      google: googleVerificationTag || undefined,
    },
  };
}

import { Toaster } from 'sonner';

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getCurrentLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased bg-base text-main transition-colors duration-300`}
      >
        <SessionProvider>
          <LocaleProvider initialLocale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SessionSync />
              {children}
              <Toaster richColors position="top-center" />
            </ThemeProvider>
          </LocaleProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
