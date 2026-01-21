"use client";

import { useState } from "react";
import { FileText, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface SitemapDisplayProps {
    url: string;
    label: string;
}

export default function SitemapDisplay({ url, label }: SitemapDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("URL copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy URL");
        }
    };

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="font-medium text-text-primary">{label}</h3>
            </div>

            <div className="flex items-center gap-2">
                <div className="flex-1 bg-bg-tertiary rounded-lg px-3 py-2 overflow-hidden">
                    <p className="text-sm text-text-secondary truncate font-mono">
                        {url}
                    </p>
                </div>
                <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-all ${
                        copied
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-bg-tertiary text-text-secondary hover:text-text-primary hover:bg-bg-primary'
                    }`}
                    title="Copy URL"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-bg-tertiary rounded-lg text-text-secondary
                        hover:text-text-primary hover:bg-bg-primary transition-colors"
                    title="Open in new tab"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
}
