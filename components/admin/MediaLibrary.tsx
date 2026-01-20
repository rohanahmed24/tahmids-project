"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Image as ImageIcon, Video, File, Search, Grid, List, Download, Trash2, Loader2, Music, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import { uploadImage, deleteMediaById } from "@/actions/media";

interface MediaItem {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    altText?: string;
    createdAt: string;
}

interface MediaLibraryProps {
    initialMedia?: MediaItem[];
}

export function MediaLibrary({ initialMedia }: MediaLibraryProps) {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filter, setFilter] = useState<"all" | "image" | "video" | "audio" | "document">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia || []);
    const [loading, setLoading] = useState(!initialMedia);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!initialMedia) {
            fetchMedia();
        }
    }, [initialMedia]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/media');
            if (res.ok) {
                const data = await res.json();
                setMediaItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch media:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setUploadProgress("Uploading...");

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                setUploadProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);

                const formData = new FormData();
                formData.append("file", file);

                const result = await uploadImage(formData);

                if (result.success) {
                    // Add to local state
                    const newItem: MediaItem = {
                        id: Date.now().toString(),
                        filename: result.filename || file.name,
                        originalName: file.name,
                        mimeType: file.type,
                        size: file.size,
                        path: result.url || "",
                        createdAt: new Date().toISOString()
                    };
                    setMediaItems(prev => [newItem, ...prev]);
                } else {
                    alert(`Failed to upload ${file.name}: ${result.error}`);
                }
            }
            setUploadProgress("Upload complete!");
            setTimeout(() => {
                setUploadProgress(null);
                setShowUploadModal(false);
            }, 1500);
        } catch (error) {
            console.error("Upload failed:", error);
            setUploadProgress("Upload failed!");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDelete = async (item: MediaItem) => {
        if (!confirm(`Delete "${item.originalName}"?`)) return;

        try {
            const result = await deleteMediaById(parseInt(item.id), item.filename);
            if (result.success) {
                setMediaItems(prev => prev.filter(m => m.id !== item.id));
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const copyToClipboard = (path: string) => {
        navigator.clipboard.writeText(path);
        alert("Path copied to clipboard!");
    };

    const getMediaType = (mimeType: string): "image" | "video" | "audio" | "document" => {
        if (mimeType.startsWith("image/")) return "image";
        if (mimeType.startsWith("video/")) return "video";
        if (mimeType.startsWith("audio/")) return "audio";
        return "document";
    };

    const formatSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const filteredItems = mediaItems.filter(item => {
        const type = getMediaType(item.mimeType);
        const matchesFilter = filter === "all" || type === filter;
        const matchesSearch = item.originalName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (mimeType: string) => {
        const type = getMediaType(mimeType);
        switch (type) {
            case "image": return <ImageIcon className="w-6 h-6" />;
            case "video": return <Video className="w-6 h-6" />;
            case "audio": return <Music className="w-6 h-6" />;
            case "document": return <File className="w-6 h-6" />;
            default: return <File className="w-6 h-6" />;
        }
    };

    const getTypeColor = (mimeType: string) => {
        const type = getMediaType(mimeType);
        switch (type) {
            case "image": return "text-green-500 bg-green-500/10";
            case "video": return "text-blue-500 bg-blue-500/10";
            case "audio": return "text-orange-500 bg-orange-500/10";
            case "document": return "text-purple-500 bg-purple-500/10";
            default: return "text-gray-500 bg-gray-500/10";
        }
    };

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary">
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">Media Library</h2>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                        <input
                            type="text"
                            placeholder="Search media..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as typeof filter)}
                        className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                    >
                        <option value="all">All Media</option>
                        <option value="image">Images</option>
                        <option value="audio">Audio</option>
                        <option value="video">Videos</option>
                        <option value="document">Documents</option>
                    </select>

                    <div className="flex border border-border-primary rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 ${viewMode === "grid" ? "bg-accent-primary text-white" : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 ${viewMode === "list" ? "bg-accent-primary text-white" : "bg-bg-primary text-text-secondary hover:bg-bg-tertiary"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-accent-primary animate-spin" />
                        <span className="ml-3 text-text-secondary">Loading media...</span>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="group relative bg-bg-tertiary rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div
                                    className="aspect-square bg-bg-primary flex items-center justify-center relative cursor-pointer"
                                    onClick={() => copyToClipboard(item.path)}
                                >
                                    {getMediaType(item.mimeType) === "image" ? (
                                        <Image
                                            src={item.path}
                                            alt={item.altText || item.originalName}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                    ) : getMediaType(item.mimeType) === "audio" ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className={`p-4 rounded-full ${getTypeColor(item.mimeType)}`}>
                                                <Music className="w-8 h-8" />
                                            </div>
                                            <audio controls className="w-full px-2" preload="metadata">
                                                <source src={item.path} type={item.mimeType} />
                                            </audio>
                                        </div>
                                    ) : (
                                        <div className={`p-4 rounded-lg ${getTypeColor(item.mimeType)}`}>
                                            {getIcon(item.mimeType)}
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <h4 className="font-medium text-text-primary text-sm truncate">{item.originalName}</h4>
                                    <p className="text-text-tertiary text-xs">{formatSize(item.size)}</p>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-1">
                                        <a
                                            href={item.path}
                                            download={item.originalName}
                                            className="p-1.5 bg-black/50 text-white rounded hover:bg-black/70"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                                            className="p-1.5 bg-black/50 text-white rounded hover:bg-red-600"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-3 bg-bg-tertiary rounded-lg hover:bg-bg-primary transition-colors cursor-pointer"
                                onClick={() => copyToClipboard(item.path)}
                            >
                                <div className={`p-2 rounded-lg ${getTypeColor(item.mimeType)}`}>
                                    {getIcon(item.mimeType)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-text-primary">{item.originalName}</h4>
                                    <p className="text-text-tertiary text-sm">
                                        {formatSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {getMediaType(item.mimeType) === "audio" && (
                                    <audio controls className="w-48" preload="metadata" onClick={(e) => e.stopPropagation()}>
                                        <source src={item.path} type={item.mimeType} />
                                    </audio>
                                )}
                                <div className="flex items-center gap-2">
                                    <a
                                        href={item.path}
                                        download={item.originalName}
                                        className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">No media found</h3>
                        <p className="text-text-secondary mb-4">
                            {searchQuery ? "No media matches your search" : "Upload your first media file to get started"}
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors"
                        >
                            Upload Media
                        </button>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-bg-secondary rounded-xl p-6 w-full max-w-md mx-4 border border-border-primary">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text-primary">Upload Media</h3>
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="p-1 text-text-secondary hover:text-text-primary"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="border-2 border-dashed border-border-primary rounded-xl p-8 text-center hover:border-accent-primary transition-colors">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*,audio/*,video/*"
                                onChange={handleUpload}
                                className="hidden"
                                id="file-upload"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                            >
                                {uploading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
                                        <p className="text-text-secondary">{uploadProgress}</p>
                                    </div>
                                ) : uploadProgress === "Upload complete!" ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <CheckCircle className="w-12 h-12 text-green-500" />
                                        <p className="text-green-500 font-medium">{uploadProgress}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                                        <p className="text-text-primary font-medium mb-2">Click to upload</p>
                                        <p className="text-text-tertiary text-sm">
                                            Images, Audio, or Video (max 20MB)
                                        </p>
                                        <div className="flex items-center justify-center gap-4 mt-4">
                                            <div className="flex items-center gap-1 text-xs text-text-tertiary">
                                                <ImageIcon className="w-4 h-4" /> Images
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-text-tertiary">
                                                <Music className="w-4 h-4" /> Audio
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-text-tertiary">
                                                <Video className="w-4 h-4" /> Video
                                            </div>
                                        </div>
                                    </>
                                )}
                            </label>
                        </div>

                        <p className="text-xs text-text-tertiary mt-4 text-center">
                            Click on any media item to copy its path
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
