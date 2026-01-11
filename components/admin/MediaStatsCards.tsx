"use client";

import { Image, Video, File, Folder } from "lucide-react";
import { MediaStats } from "@/lib/media-service";

interface MediaStatsCardsProps {
    stats: MediaStats;
}

interface StatCard {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export function MediaStatsCards({ stats }: MediaStatsCardsProps) {
    const cards: StatCard[] = [
        {
            title: "Images",
            value: stats.totalImages.toLocaleString(),
            icon: Image,
            color: "blue"
        },
        {
            title: "Videos", 
            value: stats.totalVideos.toLocaleString(),
            icon: Video,
            color: "purple"
        },
        {
            title: "Documents",
            value: stats.totalDocuments.toLocaleString(),
            icon: File,
            color: "green"
        },
        {
            title: "Storage Used",
            value: stats.totalStorageUsed,
            icon: Folder,
            color: "orange"
        }
    ];

    const getColorClasses = (color: string) => {
        const colorMap = {
            blue: "bg-blue-500/10 text-blue-500",
            purple: "bg-purple-500/10 text-purple-500", 
            green: "bg-green-500/10 text-green-500",
            orange: "bg-orange-500/10 text-orange-500"
        } as const;
        
        return colorMap[color as keyof typeof colorMap] || colorMap.blue;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {cards.map((card, index) => {
                const Icon = card.icon;
                
                return (
                    <div 
                        key={index}
                        className="bg-bg-secondary rounded-xl border border-border-primary p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-text-primary">
                                    {card.value}
                                </p>
                                <p className="text-text-secondary text-sm">
                                    {card.title}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}