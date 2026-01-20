import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscribe - Wisdomia",
    description: "Subscribe to Wisdomia's newsletter and get weekly curated stories, exclusive insights, and thought-provoking content delivered to your inbox.",
    openGraph: {
        title: "Subscribe - Wisdomia",
        description: "Subscribe to Wisdomia's newsletter and get weekly curated stories delivered to your inbox.",
        type: "website",
    },
};

export default function SubscribeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
