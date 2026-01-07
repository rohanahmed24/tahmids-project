import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DevToolsBlocker } from "@/components/DevToolsBlocker";

export const metadata: Metadata = {
  title: "Wisdomia",
  description: "Where every tale comes alive",
};

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
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DevToolsBlocker />
            {children}
            <Navbar />
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
