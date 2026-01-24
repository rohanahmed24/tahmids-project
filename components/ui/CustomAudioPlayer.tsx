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
    const isDraggingRef = useRef(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Force update duration if already loaded
        if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
            setDuration(audio.duration);
        }

        const updateTime = () => {
            // Check REF immediately, not state
            if (!isDraggingRef.current) {
                setCurrentTime(audio.currentTime);
                if (audio.duration) {
                    setProgress((audio.currentTime / audio.duration) * 100);
                }
            }
        };

        const updateDuration = () => {
            if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                setDuration(audio.duration);
            }
        };

        const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        };

        audio.addEventListener("timeupdate", updateTime);
        // We also add onLoadedMetadata to the element, but keeping listener for safety
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("ended", onEnded);
        };
    }, []); // Empty dependency array - logic relies on refs/closures

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
        if (!isNaN(time) && isFinite(time)) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, [duration]);

    // Unified Pointer Events
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // Prevent default to avoid selection/scroll actions
        e.preventDefault();

        // Update REF state immediately to block timeupdates
        isDraggingRef.current = true;
        setIsDragging(true);

        if (progressBarRef.current) {
            progressBarRef.current.setPointerCapture(e.pointerId);
        }

        const newProgress = calculateProgress(e.clientX);
        setProgress(newProgress);
        // Optional: Seek immediately on click
        // seekToPosition(newProgress); 
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;

        e.preventDefault();
        const newProgress = calculateProgress(e.clientX);
        setProgress(newProgress);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDraggingRef.current) return;

        isDraggingRef.current = false;
        setIsDragging(false);

        if (progressBarRef.current) {
            progressBarRef.current.releasePointerCapture(e.pointerId);
        }

        const newProgress = calculateProgress(e.clientX);
        seekToPosition(newProgress);
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || !isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!src) return null;

    // Custom brown accent color
    const accentColor = "#4A3428"; // Dark brown

    return (
        <div className="w-full max-w-full overflow-hidden my-6 bg-[#F5F5F4] border border-[#E7E5E4] rounded-xl p-4 shadow-sm select-none">
            <audio
                ref={audioRef}
                src={src}
                preload="metadata"
                onLoadedMetadata={(e) => {
                    const audio = e.currentTarget;
                    if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
                        setDuration(audio.duration);
                    }
                }}
            />

            {/* Progress Bar - Full Width, Draggable */}
            <div
                ref={progressBarRef}
                className="relative w-full h-12 flex items-center cursor-pointer mb-3 touch-none" // touch-none is CRITICAL for pointer events
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp} // Safety fallback
            >
                {/* Track Background - Visual Only */}
                <div className="absolute inset-x-0 h-2 bg-[#D6D3D1] rounded-full overflow-hidden pointer-events-none">
                    {/* Progress Fill */}
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: accentColor,
                            transition: isDragging ? 'none' : 'width 0.1s'
                        }}
                    />
                </div>
                {/* Thumb/Handle - Visual Only */}
                <div
                    className="absolute w-5 h-5 rounded-full shadow-md border-2 border-white pointer-events-none z-10"
                    style={{
                        left: `calc(${progress}% - 10px)`,
                        backgroundColor: accentColor,
                        transition: isDragging ? 'none' : 'left 0.1s'
                    }}
                />
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-4">
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 text-white rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-transform active:scale-95 shadow-md"
                    style={{ backgroundColor: accentColor }}
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Time Display */}
                <div className="flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-mono text-[#57534E]">
                    <span>{formatTime(currentTime)}</span>
                    <span className="text-[#A8A29E]">/</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Mute Button */}
                <button
                    onClick={toggleMute}
                    className="w-10 h-10 flex items-center justify-center text-[#57534E] hover:text-[#1C1917] transition-colors rounded-full hover:bg-[#E7E5E4]"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}
