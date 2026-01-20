import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletters - Wisdomia",
    description: "Subscribe to Wisdomia's newsletters and never miss a story. Get curated content delivered directly to your inbox.",
    openGraph: {
        title: "Newsletters - Wisdomia",
        description: "Subscribe to Wisdomia's newsletters and never miss a story. Get curated content delivered directly to your inbox.",
        type: "website",
    },
};

export default function NewslettersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
