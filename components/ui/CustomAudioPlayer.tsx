"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface CustomAudioPlayerProps {
    src?: string;
    title?: string;
    // Standard audio props that might be passed by markdown renderer
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    preload?: string;
}

export function CustomAudioPlayer({ src, title }: CustomAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const updateDuration = () => {
            setDuration(audio.duration);
        };

        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", onEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!audioRef.current || !progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        let clientX: number;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }

        const clickPosition = (clientX - rect.left) / rect.width;
        const clampedPosition = Math.max(0, Math.min(1, clickPosition));
        const time = clampedPosition * duration;

        audioRef.current.currentTime = time;
        setProgress(clampedPosition * 100);
        setCurrentTime(time);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!src) return null;

    return (
        <div className="w-full my-6 bg-bg-secondary border border-border-subtle rounded-xl p-4 shadow-sm">
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Title */}
            {title && (
                <p className="text-sm font-semibold text-text-primary mb-3 line-clamp-2">
                    {title}
                </p>
            )}

            {/* Progress Bar - Full Width, Clickable */}
            <div
                ref={progressBarRef}
                className="relative w-full h-8 flex items-center cursor-pointer touch-none mb-3"
                onClick={handleSeek}
                onTouchStart={handleSeek}
            >
                {/* Track Background */}
                <div className="absolute inset-x-0 h-2 bg-border-subtle rounded-full">
                    {/* Progress Fill */}
                    <div
                        className="h-full bg-accent-primary rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {/* Thumb/Handle */}
                <div
                    className="absolute w-4 h-4 bg-accent-primary rounded-full shadow-md border-2 border-white"
                    style={{ left: `calc(${progress}% - 8px)` }}
                />
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 bg-accent-primary text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent-primary/90 transition-transform active:scale-95"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Time Display */}
                <div className="flex-1 flex items-center justify-center gap-2">
                    <span className="text-sm font-mono text-text-primary">{formatTime(currentTime)}</span>
                    <span className="text-text-muted">/</span>
                    <span className="text-sm font-mono text-text-muted">{formatTime(duration)}</span>
                </div>

                {/* Mute Button */}
                <button
                    onClick={toggleMute}
                    className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors rounded-full hover:bg-bg-tertiary"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
