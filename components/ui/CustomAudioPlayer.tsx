"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface CustomAudioPlayerProps {
    src?: string;
    title?: string;
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
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => {
            if (!isDragging) {
                setCurrentTime(audio.currentTime);
                setProgress((audio.currentTime / audio.duration) * 100);
            }
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
    }, [isDragging]);

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

    const calculateProgress = useCallback((clientX: number) => {
        if (!progressBarRef.current) return 0;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = (clientX - rect.left) / rect.width;
        return Math.max(0, Math.min(100, clickPosition * 100));
    }, []);

    const seekToPosition = useCallback((progressPercent: number) => {
        if (!audioRef.current || !duration) return;
        const time = (progressPercent / 100) * duration;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }, [duration]);

    // Mouse events for PC
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const newProgress = calculateProgress(e.clientX);
        setProgress(newProgress);
        seekToPosition(newProgress);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const newProgress = calculateProgress(e.clientX);
        setProgress(newProgress);
    }, [isDragging, calculateProgress]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!isDragging) return;
        const newProgress = calculateProgress(e.clientX);
        seekToPosition(newProgress);
        setIsDragging(false);
    }, [isDragging, calculateProgress, seekToPosition]);

    // Touch events for mobile
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        setIsDragging(true);
        const newProgress = calculateProgress(e.touches[0].clientX);
        setProgress(newProgress);
        seekToPosition(newProgress);
    };

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        const newProgress = calculateProgress(e.touches[0].clientX);
        setProgress(newProgress);
    }, [isDragging, calculateProgress]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!isDragging) return;
        if (e.changedTouches.length > 0) {
            const newProgress = calculateProgress(e.changedTouches[0].clientX);
            seekToPosition(newProgress);
        }
        setIsDragging(false);
    }, [isDragging, calculateProgress, seekToPosition]);

    // Global event listeners for drag
    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleTouchEnd);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!src) return null;

    return (
        <div className="w-full my-6 bg-bg-secondary border border-border-subtle rounded-xl p-4 shadow-sm select-none">
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Title */}
            {title && (
                <p className="text-sm font-semibold text-text-primary mb-3 line-clamp-2">
                    {title}
                </p>
            )}

            {/* Progress Bar - Full Width, Draggable */}
            <div
                ref={progressBarRef}
                className="relative w-full h-8 flex items-center cursor-pointer touch-none mb-3"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                {/* Track Background */}
                <div className="absolute inset-x-0 h-2 bg-border-subtle rounded-full">
                    {/* Progress Fill */}
                    <div
                        className="h-full bg-accent-primary rounded-full"
                        style={{ width: `${progress}%`, transition: isDragging ? 'none' : 'width 0.1s' }}
                    />
                </div>
                {/* Thumb/Handle - Always visible */}
                <div
                    className="absolute w-4 h-4 bg-accent-primary rounded-full shadow-md border-2 border-white pointer-events-none"
                    style={{
                        left: `calc(${progress}% - 8px)`,
                        transition: isDragging ? 'none' : 'left 0.1s'
                    }}
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
