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
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
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

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!audioRef.current) return;
        const time = (parseFloat(e.target.value) / 100) * duration;
        audioRef.current.currentTime = time;
        setProgress(parseFloat(e.target.value));
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!src) return null;

    return (
        <div className="w-full my-8 bg-bg-secondary border border-border-subtle rounded-xl p-4 flex items-center gap-4 shadow-sm group hover:border-accent-primary/30 transition-colors">
            <audio ref={audioRef} src={src} preload="metadata" />

            <button
                onClick={togglePlay}
                className="w-12 h-12 bg-accent-primary text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-accent-primary/90 transition-transform active:scale-95"
            >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="flex-1 space-y-1">
                {title && <p className="text-xs font-semibold text-text-primary truncate">{title}</p>}

                <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted w-10 text-right font-mono">{formatTime(currentTime)}</span>

                    <div className="relative flex-1 h-3 group/slider">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress || 0}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="absolute inset-y-0 left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-border-subtle rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent-primary transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-all duration-100 opacity-0 group-hover/slider:opacity-100"
                            style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                        />
                    </div>

                    <span className="text-xs text-text-muted w-10 font-mono">{formatTime(duration)}</span>
                </div>
            </div>

            <button onClick={toggleMute} className="text-text-muted hover:text-text-primary transition-colors p-2">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </div>
    );
}
