"use client";

import { useState } from "react";
import { Upload, Image as ImageIcon, Video, File, Search, Grid, List, Download, Trash2 } from "lucide-react";
import Image from "next/image";

interface MediaItem {
    id: string;
    name: string;
    type: "image" | "video" | "document";
    size: string;
    url: string;
    uploadDate: string;
    dimensions?: string;
}

export function MediaLibrary() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filter, setFilter] = useState<"all" | "image" | "video" | "document">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Mock media data - in real app this would come from database
    const mediaItems: MediaItem[] = [
        {
            id: "1",
            name: "welcome-cover.jpg",
            type: "image",
            size: "2.4 MB",
            url: "/images/welcome-cover.jpg",
            uploadDate: "2024-01-12",
            dimensions: "1920x1080"
        },
        {
            id: "2",
            name: "journalism-future.jpg",
            type: "image",
            size: "1.8 MB",
            url: "/images/journalism-future.jpg",
            uploadDate: "2024-01-11",
            dimensions: "1600x900"
        },
        {
            id: "3",
            name: "ancient-mysteries.jpg",
            type: "image",
            size: "3.1 MB",
            url: "/images/ancient-mysteries.jpg",
            uploadDate: "2024-01-10",
            dimensions: "2048x1152"
        },
        {
            id: "4",
            name: "interview-video.mp4",
            type: "video",
            size: "45.2 MB",
            url: "/videos/interview.mp4",
            uploadDate: "2024-01-09",
            dimensions: "1920x1080"
        },
        {
            id: "5",
            name: "press-release.pdf",
            type: "document",
            size: "856 KB",
            url: "/documents/press-release.pdf",
            uploadDate: "2024-01-08"
        }
    ];

    const filteredItems = mediaItems.filter(item => {
        const matchesFilter = filter === "all" || item.type === filter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case "image": return <ImageIcon className="w-4 h-4" />;
            case "video": return <Video className="w-4 h-4" />;
            case "document": return <File className="w-4 h-4" />;
            default: return <File className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "image": return "text-green-500";
            case "video": return "text-blue-500";
            case "document": return "text-purple-500";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="bg-bg-secondary rounded-xl border border-border-primary">
            <div className="p-6 border-b border-border-primary">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-text-primary">Media Library</h2>
                    <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2">
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
                            className="w-full pl-10 pr-4 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as "all" | "image" | "video" | "document")}
                        className="px-3 py-2 bg-bg-primary border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    >
                        <option value="all">All Media</option>
                        <option value="image">Images</option>
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
                {viewMode === "grid" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="group relative bg-bg-tertiary rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-square bg-bg-primary flex items-center justify-center">
                                    {item.type === "image" ? (
                                        <Image
                                            src={item.url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className={`${getTypeColor(item.type)}`}>
                                            {getIcon(item.type)}
                                        </div>
                                    )}
                                </div>

                                <div className="p-3">
                                    <h4 className="font-medium text-text-primary text-sm truncate">{item.name}</h4>
                                    <p className="text-text-tertiary text-xs">{item.size}</p>
                                    {item.dimensions && (
                                        <p className="text-text-tertiary text-xs">{item.dimensions}</p>
                                    )}
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex gap-1">
                                        <button className="p-1 bg-black/50 text-white rounded hover:bg-black/70">
                                            <Download className="w-3 h-3" />
                                        </button>
                                        <button className="p-1 bg-black/50 text-white rounded hover:bg-black/70">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-bg-tertiary rounded-lg hover:bg-bg-primary transition-colors">
                                <div className={`${getTypeColor(item.type)}`}>
                                    {getIcon(item.type)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-text-primary">{item.name}</h4>
                                    <p className="text-text-tertiary text-sm">
                                        {item.size} • {new Date(item.uploadDate).toLocaleDateString()}
                                        {item.dimensions && ` • ${item.dimensions}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-text-secondary hover:text-accent-primary transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-text-secondary hover:text-red-500 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Upload className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-text-primary mb-2">No media found</h3>
                        <p className="text-text-secondary mb-4">
                            {searchQuery ? "No media matches your search" : "Upload your first media file to get started"}
                        </p>
                        <button className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 transition-colors">
                            Upload Media
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}