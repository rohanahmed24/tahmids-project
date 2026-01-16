import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DevToolsBlocker } from "@/components/DevToolsBlocker";
import { SessionProvider } from "next-auth/react";
import { SessionSync } from "@/components/SessionSync";

export const metadata: Metadata = {
  title: "Wisdomia",
  description: "Where every tale comes alive",
};

import { Toaster } from 'sonner';

import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${playfair.variable} antialiased bg-base text-main transition-colors duration-300`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DevToolsBlocker />
            <SessionSync />
            <Navbar />
            {children}
            <Footer />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
