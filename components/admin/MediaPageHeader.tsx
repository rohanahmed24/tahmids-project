"use client";

import { Folder, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "@/actions/media";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export function MediaPageHeader() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const id = toast.loading("Uploading file...");
        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadImage(formData);
            if (result.success) {
                toast.success("File uploaded successfully", { id });
                router.refresh();
            } else {
                toast.error(result.error || "Upload failed", { id });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed", { id });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Media Library</h1>
                <p className="text-text-secondary mt-2">Manage your images, videos, and documents</p>
            </div>
            <div className="flex items-center gap-4">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleUpload}
                    accept="image/*,audio/*" // Matches validation in action
                />
                <button
                    onClick={() => alert("Folder creation coming soon!")}
                    className="px-4 py-2 border border-border-primary rounded-lg hover:bg-bg-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                    aria-label="Create new folder"
                >
                    <Folder className="w-4 h-4 inline mr-2" />
                    New Folder
                </button>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Upload media files"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 inline mr-2 animate-spin" /> : <Upload className="w-4 h-4 inline mr-2" />}
                    Upload Media
                </button>
            </div>
        </div>
    );
}
