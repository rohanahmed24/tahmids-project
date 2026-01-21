import { redirect } from "next/navigation";
import { verifyAdmin, getAdminSession } from "@/actions/admin-auth";
import { getSEOSettings } from "@/actions/seo";
import SEOSettingsForm from "@/components/admin/SEOSettingsForm";
import { Search } from "lucide-react";

export const metadata = {
    title: "SEO Settings",
    description: "Configure Google Search Console and site verification",
};

export default async function SEOPage() {
    const session = await getAdminSession();
    const isAdmin = await verifyAdmin();

    if (!session || !isAdmin) {
        redirect("/signin");
    }

    const seoSettings = await getSEOSettings();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thewisdomia.com";

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-border-primary">
                            <Search className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                                SEO Settings
                            </h1>
                            <p className="text-text-secondary text-sm sm:text-base mt-1">
                                Google Search Console configure করুন এবং site verify করুন
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Form */}
                <SEOSettingsForm initialSettings={seoSettings} siteUrl={siteUrl} />
            </div>
        </div>
    );
}
