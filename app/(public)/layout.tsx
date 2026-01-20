import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen pt-24">
                {children}
            </main>
            <Footer />
        </>
    );
}
