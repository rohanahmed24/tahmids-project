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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="antialiased bg-base text-main transition-colors duration-300"
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
            {children}
            <Navbar />
            <Footer />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
