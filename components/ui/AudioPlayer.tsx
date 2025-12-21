"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    RotateCcw,
    Volume2,
    VolumeX,
    Headphones
} from "lucide-react";

interface AudioPlayerProps {
    content: string;
    title: string;
}

export function AudioPlayer({ content, title }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [currentTime, setCurrentTime] = useState("0:00");
    const [totalTime, setTotalTime] = useState("0:00");
    const [isExpanded, setIsExpanded] = useState(false);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const textRef = useRef<string>("");
    const startTimeRef = useRef<number>(0);
    const pausedAtRef = useRef<number>(0);

    // Clean the content for speech
    const cleanContent = useCallback((text: string) => {
        return text
            .replace(/<[^>]*>/g, "") // Remove HTML tags
            .replace(/#{1,6}\s/g, "") // Remove markdown headers
            .replace(/\*\*/g, "") // Remove bold markers
            .replace(/\*/g, "") // Remove italic markers
            .replace(/`/g, "") // Remove code markers
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to just text
            .replace(/\n+/g, ". ") // Convert newlines to pauses
            .replace(/\s+/g, " ") // Normalize whitespace
            .trim();
    }, []);

    // Calculate estimated duration (average 150 words per minute)
    const estimateDuration = useCallback((text: string) => {
        const words = text.split(/\s+/).length;
        const minutes = words / (150 * speed);
        return Math.ceil(minutes * 60);
    }, [speed]);

    // Format time in mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };


    useEffect(() => {
        // Check for speech synthesis support once
        const supported = typeof window !== "undefined" && !!window.speechSynthesis;
        if (!supported) {
            setIsSupported(false);
            return;
        }

        textRef.current = cleanContent(`${title}. ${content}`);
        const duration = estimateDuration(textRef.current);
        setTotalTime(formatTime(duration));
    }, [content, title, cleanContent, estimateDuration]);

    const speak = useCallback(() => {
        if (!window.speechSynthesis) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textRef.current);
        utterance.rate = speed;
        utterance.volume = isMuted ? 0 : 1;

        // Try to use a natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
            (v) => v.lang.startsWith("en") && v.name.includes("Natural")
        ) || voices.find((v) => v.lang.startsWith("en"));

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            startTimeRef.current = Date.now() - pausedAtRef.current;
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
            pausedAtRef.current = 0;
        };

        utterance.onerror = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [speed, isMuted]);

    // Update progress
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && !isPaused) {
            interval = setInterval(() => {
                const elapsed = (Date.now() - startTimeRef.current) / 1000;
                const duration = estimateDuration(textRef.current);
                const newProgress = Math.min((elapsed / duration) * 100, 100);
                setProgress(newProgress);
                setCurrentTime(formatTime(elapsed));
            }, 100);
        }

        return () => clearInterval(interval);
    }, [isPlaying, isPaused, estimateDuration]);

    const handlePlayPause = () => {
        if (!window.speechSynthesis) return;

        if (isPlaying) {
            if (isPaused) {
                window.speechSynthesis.resume();
                setIsPaused(false);
                startTimeRef.current = Date.now() - pausedAtRef.current;
            } else {
                window.speechSynthesis.pause();
                setIsPaused(true);
                pausedAtRef.current = Date.now() - startTimeRef.current;
            }
        } else {
            pausedAtRef.current = 0;
            speak();
        }
    };

    const handleRestart = () => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        setProgress(0);
        setCurrentTime("0:00");
        pausedAtRef.current = 0;
        speak();
    };

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        if (isPlaying) {
            const wasPlaying = !isPaused;
            window.speechSynthesis.cancel();
            if (wasPlaying) {
                setTimeout(speak, 100);
            }
        }
        const duration = estimateDuration(textRef.current);
        setTotalTime(formatTime(duration));
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (utteranceRef.current) {
            utteranceRef.current.volume = isMuted ? 1 : 0;
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-bg-primary/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <Headphones className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                        <p className="font-medium text-sm">Listen to Article</p>
                        <p className="text-xs text-text-muted">
                            {isPlaying ? (isPaused ? "Paused" : "Playing...") : `${totalTime} • ${speed}x speed`}
                        </p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-text-muted"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>

            {/* Expanded Controls */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="relative h-2 bg-bg-primary rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-accent rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-text-muted">
                                    <span>{currentTime}</span>
                                    <span>{totalTime}</span>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                {/* Restart */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleRestart}
                                    className="p-3 text-text-muted hover:text-text-primary transition-colors"
                                    title="Restart"
                                    aria-label="Restart"
                                >
                                    <RotateCcw className="w-5 h-5 md:w-5 md:h-5" />
                                </motion.button>

                                {/* Play/Pause */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handlePlayPause}
                                    className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/30"
                                    aria-label={isPlaying && !isPaused ? "Pause" : "Play"}
                                >
                                    {isPlaying && !isPaused ? (
                                        <Pause className="w-6 h-6" />
                                    ) : (
                                        <Play className="w-6 h-6 ml-1" />
                                    )}
                                </motion.button>

                                {/* Mute */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleMute}
                                    className="p-3 text-text-muted hover:text-text-primary transition-colors"
                                    title={isMuted ? "Unmute" : "Mute"}
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-5 h-5" />
                                    ) : (
                                        <Volume2 className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>

                            {/* Speed Controls */}
                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {[0.75, 1, 1.5, 2].map((s) => (
                                    <motion.button
                                        key={s}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSpeedChange(s)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[52px] ${speed === s
                                            ? "bg-accent text-white"
                                            : "bg-bg-primary text-text-muted hover:text-text-primary"
                                            }`}
                                    >
                                        {s}x
                                    </motion.button>
                                ))}
                            </div>

                            {/* Info */}
                            <p className="text-xs text-text-muted text-center">
                                Powered by your browser's text-to-speech
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
