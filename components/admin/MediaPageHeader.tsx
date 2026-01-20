"use client";

import { Folder, Upload } from "lucide-react";

export function MediaPageHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Media Library</h1>
                <p className="text-text-secondary mt-2">Manage your images, videos, and documents</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => alert("Folder creation coming soon!")}
                    className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                    aria-label="Create new folder"
                >
                    <Folder className="w-4 h-4 inline mr-2" />
                    New Folder
                </button>
                <button
                    onClick={() => alert("Upload feature coming soon!")}
                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                    aria-label="Upload media files"
                >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Media
                </button>
            </div>
        </div>
    );
}
