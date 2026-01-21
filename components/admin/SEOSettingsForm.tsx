"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ExternalLink,
    AlertCircle,
    Loader2,
    Save,
    Shield,
    Search
} from "lucide-react";
import { toast } from "sonner";
import { updateSEOSettings } from "@/actions/seo";
import SEOTutorialAccordion from "./SEOTutorialAccordion";
import VerificationStatusIndicator from "./VerificationStatusIndicator";
import SitemapDisplay from "./SitemapDisplay";

interface SEOSettingsFormProps {
    initialSettings: {
        googleVerificationTag: string;
        googleVerificationStatus: "verified" | "pending" | "not_verified";
        lastVerificationCheck: string | null;
    };
    siteUrl: string;
}

export default function SEOSettingsForm({ initialSettings, siteUrl }: SEOSettingsFormProps) {
    const [saving, setSaving] = useState(false);
    const [verificationTag, setVerificationTag] = useState(initialSettings.googleVerificationTag || "");
    const [status, setStatus] = useState(initialSettings.googleVerificationStatus);
    const [lastCheck, setLastCheck] = useState(initialSettings.lastVerificationCheck);
    const [error, setError] = useState<string | null>(null);
    const [tagError, setTagError] = useState<string | null>(null);

    // Validate tag format on change
    const handleTagChange = (value: string) => {
        setVerificationTag(value);
        setTagError(null);
        setError(null);

        // Basic validation - allow empty for removal
        if (value && !value.match(/^[a-zA-Z0-9_-]+$/)) {
            setTagError("Invalid format. Only letters, numbers, underscores (-) and hyphens (_) allowed.");
        }

        if (value && value.length > 100) {
            setTagError("Tag is too long. Please check and try again.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (tagError) return;

        setSaving(true);
        setError(null);

        try {
            const result = await updateSEOSettings({
                googleVerificationTag: verificationTag.trim()
            });

            if (result.success) {
                const newStatus = verificationTag.trim() ? "pending" : "not_verified";
                setStatus(newStatus);
                setLastCheck(new Date().toISOString());

                if (verificationTag.trim()) {
                    toast.success("Verification tag saved! Now verify in Google Search Console.");
                } else {
                    toast.success("Verification tag removed.");
                }
            } else {
                setError(result.error || "Failed to save settings");
                toast.error(result.error || "Failed to save settings");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    const robotsUrl = `${siteUrl}/robots.txt`;

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Quick Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <VerificationStatusIndicator
                    status={status}
                    lastCheck={lastCheck}
                />

                <SitemapDisplay
                    url={sitemapUrl}
                    label="Sitemap URL"
                />

                {/* Google Search Console Link */}
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Search className="w-5 h-5 text-blue-500" />
                        </div>
                        <h3 className="font-medium text-text-primary">Search Console</h3>
                    </div>
                    <p className="text-sm text-text-secondary mb-4">
                        Google Search Console এ গিয়ে site verify করুন
                    </p>
                    <a
                        href="https://search.google.com/search-console"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white rounded-lg
                            hover:bg-accent-primary/90 transition-colors text-sm font-medium w-full justify-center"
                    >
                        Open Search Console
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Additional URLs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <SitemapDisplay
                    url={robotsUrl}
                    label="Robots.txt URL"
                />
                <SitemapDisplay
                    url={siteUrl}
                    label="Site URL"
                />
            </div>

            {/* Tutorial Section */}
            <SEOTutorialAccordion />

            {/* Verification Tag Input Form */}
            <form onSubmit={handleSubmit}>
                <div className="bg-bg-secondary rounded-xl border border-border-primary p-5 sm:p-6 space-y-5 sm:space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-primary/10 rounded-lg">
                            <Shield className="w-5 h-5 text-accent-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
                                Google Site Verification
                            </h2>
                            <p className="text-sm text-text-secondary">
                                Google থেকে পাওয়া verification code এখানে দিন
                            </p>
                        </div>
                    </div>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20
                                    rounded-xl text-red-500"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Error</p>
                                    <p className="text-sm opacity-90">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Google Verification Meta Tag Content
                            </label>
                            <p className="text-sm text-text-secondary mb-3">
                                শুধুমাত্র <code className="bg-bg-tertiary px-1.5 py-0.5 rounded text-xs">
                                content</code> এর value দিন, পুরো tag না।
                            </p>
                            <input
                                type="text"
                                value={verificationTag}
                                onChange={(e) => handleTagChange(e.target.value)}
                                placeholder="যেমন: ABC123xyz_verification-code"
                                className={`w-full px-4 py-3 bg-bg-primary border rounded-xl
                                    focus:outline-none focus:ring-2 focus:ring-accent-primary transition-all
                                    ${tagError ? 'border-red-500 focus:ring-red-500' : 'border-border-primary'}`}
                            />
                            <AnimatePresence>
                                {tagError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="mt-2 text-sm text-red-500 flex items-center gap-2"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                        {tagError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Example Box */}
                        <div className="p-4 bg-bg-tertiary rounded-xl">
                            <p className="text-xs text-text-tertiary mb-2 font-medium">
                                Google এরকম tag দিবে:
                            </p>
                            <code className="text-xs text-text-secondary break-all block">
                                {'<meta name="google-site-verification" content="'}
                                <span className="text-accent-primary font-bold">YOUR_CODE_HERE</span>
                                {'" />'}
                            </code>
                            <p className="text-xs text-text-tertiary mt-3">
                                শুধু highlighted অংশটুকু (YOUR_CODE_HERE) উপরের ফিল্ডে paste করুন।
                            </p>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                        <p className="text-xs text-text-tertiary">
                            Save করার পর Google Search Console এ গিয়ে &quot;Verify&quot; বাটনে ক্লিক করুন
                        </p>
                        <button
                            type="submit"
                            disabled={saving || !!tagError}
                            className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white
                                rounded-xl hover:bg-accent-primary/90 transition-all shadow-lg
                                hover:shadow-accent-primary/25 disabled:opacity-50 disabled:cursor-not-allowed
                                w-full sm:w-auto justify-center font-medium"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Verification Tag
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
