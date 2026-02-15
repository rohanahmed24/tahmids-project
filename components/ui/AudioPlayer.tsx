"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Headphones,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface AudioPlayerProps {
  content: string;
  title: string;
}

export function AudioPlayer({ content, title }: AudioPlayerProps) {
  const { locale } = useLocale();
  const copy = locale === "bn"
    ? {
      listenToArticle: "লেখাটি শুনুন",
      paused: "বিরতি",
      playing: "চলছে...",
      speed: "গতি",
      restart: "আবার শুরু",
      pause: "বিরতি",
      play: "চালু করুন",
      unmute: "আনমিউট",
      mute: "মিউট",
      poweredBy: "আপনার ব্রাউজারের টেক্সট-টু-স্পিচ দ্বারা চালিত",
      audioProgress: "অডিও অগ্রগতি",
    }
    : {
      listenToArticle: "Listen to Article",
      paused: "Paused",
      playing: "Playing...",
      speed: "speed",
      restart: "Restart",
      pause: "Pause",
      play: "Play",
      unmute: "Unmute",
      mute: "Mute",
      poweredBy: "Powered by your browser's text-to-speech",
      audioProgress: "Audio progress",
    };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<string>("");
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const seekWordIndexRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

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
  const estimateDuration = useCallback(
    (text: string, playbackSpeed = speed) => {
      const words = text.split(/\s+/).length;
      const minutes = words / (150 * playbackSpeed);
      return Math.ceil(minutes * 60);
    },
    [speed],
  );

  // Format time in mm:ss
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Memoize cleaned content and duration to avoid recalculating
  const cleanedText = useMemo(
    () => cleanContent(`${title}. ${content}`),
    [cleanContent, title, content],
  );
  const estimatedDuration = useMemo(
    () => estimateDuration(cleanedText),
    [estimateDuration, cleanedText],
  );

  // Update text ref when content changes (no setState in effect)
  useEffect(() => {
    textRef.current = cleanedText;
  }, [cleanedText]);

  // Initialize total time from memoized duration
  const formattedTotalTime = useMemo(
    () => formatTime(estimatedDuration),
    [formatTime, estimatedDuration],
  );

  // Sync totalTime state with formatted value
  useEffect(() => {
    setTotalTime(formattedTotalTime);
  }, [formattedTotalTime]);

  // Detect browser TTS support on client only to avoid hydration mismatches.
  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" && !!window.speechSynthesis,
    );
  }, []);

  // Web Speech voices load asynchronously in many browsers.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    updateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", updateVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", updateVoices);
    };
  }, []);

  // Ensure speech does not continue after navigation/unmount.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (options?: { playbackSpeed?: number; muted?: boolean }) => {
      if (!window.speechSynthesis) return;
      const playbackSpeed = options?.playbackSpeed ?? speed;
      const muted = options?.muted ?? isMuted;

      // Cancel any ongoing speech
      utteranceRef.current = null;
      window.speechSynthesis.cancel();

      const words = textRef.current.split(/\s+/).filter(Boolean);
      const safeSeekIndex = Math.max(
        0,
        Math.min(words.length - 1, seekWordIndexRef.current),
      );
      const textToSpeak = words.slice(safeSeekIndex).join(" ");
      const utterance = new SpeechSynthesisUtterance(
        textToSpeak || textRef.current,
      );
      utterance.rate = playbackSpeed;
      utterance.volume = muted ? 0 : 1;

      // Try to use a natural voice
      const voices = voicesRef.current;
      const preferredVoice =
        voices.find(
          (v) => v.lang.startsWith("en") && v.name.includes("Natural"),
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        if (utteranceRef.current !== utterance) return;
        setIsPlaying(true);
        setIsPaused(false);
        startTimeRef.current = Date.now() - pausedAtRef.current;
      };

      utterance.onend = () => {
        if (utteranceRef.current !== utterance) return;
        const duration = estimateDuration(textRef.current, playbackSpeed);
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
        setCurrentTime(formatTime(duration));
        pausedAtRef.current = 0;
        startOffsetRef.current = duration;
        seekWordIndexRef.current = words.length;
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        if (utteranceRef.current !== utterance) return;
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [speed, isMuted, estimateDuration, formatTime],
  );

  // Update progress
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const duration = estimateDuration(textRef.current);
        const absoluteElapsed = Math.min(
          startOffsetRef.current + elapsed,
          duration,
        );
        const newProgress = Math.min((absoluteElapsed / duration) * 100, 100);

        if (!isDraggingRef.current) {
          setProgress(newProgress);
          setCurrentTime(formatTime(absoluteElapsed));
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, estimateDuration, formatTime]);

  // Keep synthesis alive on browsers that may stop long-running speech.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis ||
      !isPlaying ||
      isPaused
    ) {
      return;
    }

    const keepAliveInterval = setInterval(() => {
      window.speechSynthesis.resume();
    }, 14000);

    return () => clearInterval(keepAliveInterval);
  }, [isPlaying, isPaused]);

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
      if (progress >= 100) {
        seekWordIndexRef.current = 0;
        startOffsetRef.current = 0;
        pausedAtRef.current = 0;
        setProgress(0);
        setCurrentTime("0:00");
      }
      speak();
    }
  };

  const handleRestart = () => {
    if (!window.speechSynthesis) return;
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    setProgress(0);
    setCurrentTime("0:00");
    pausedAtRef.current = 0;
    startOffsetRef.current = 0;
    seekWordIndexRef.current = 0;
    speak();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    const duration = estimateDuration(textRef.current, newSpeed);
    setTotalTime(formatTime(duration));
    setCurrentTime(formatTime((progress / 100) * duration));

    if (isPlaying) {
      const wasPlaying = !isPaused;
      const words = textRef.current.split(/\s+/).filter(Boolean);
      seekWordIndexRef.current = Math.floor((progress / 100) * words.length);
      startOffsetRef.current = (progress / 100) * duration;
      pausedAtRef.current = 0;
      utteranceRef.current = null;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      if (wasPlaying) {
        setTimeout(() => speak({ playbackSpeed: newSpeed }), 100);
      }
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (isPlaying && !isPaused && window.speechSynthesis) {
      const duration = estimateDuration(textRef.current);
      const words = textRef.current.split(/\s+/).filter(Boolean);
      seekWordIndexRef.current = Math.floor((progress / 100) * words.length);
      startOffsetRef.current = (progress / 100) * duration;
      pausedAtRef.current = 0;
      utteranceRef.current = null;
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setTimeout(() => speak({ muted: nextMuted }), 100);
    }
  };

  const getProgressFromClientX = useCallback((clientX: number) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(100, position * 100));
  }, []);

  const commitSeek = useCallback(
    (newProgress: number) => {
      const words = textRef.current.split(/\s+/).filter(Boolean);
      const duration = estimateDuration(textRef.current);
      const normalized = Math.max(0, Math.min(100, newProgress));
      const targetOffset = (normalized / 100) * duration;

      seekWordIndexRef.current = Math.floor((normalized / 100) * words.length);
      startOffsetRef.current = targetOffset;
      pausedAtRef.current = 0;
      setProgress(normalized);
      setCurrentTime(formatTime(targetOffset));

      if (window.speechSynthesis && isPlaying) {
        const wasPlaying = !isPaused;
        utteranceRef.current = null;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        if (wasPlaying) {
          setTimeout(speak, 100);
        }
      }
    },
    [estimateDuration, formatTime, isPaused, isPlaying, speak],
  );

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    progressBarRef.current?.setPointerCapture(e.pointerId);
    const newProgress = getProgressFromClientX(e.clientX);
    setProgress(newProgress);
    setCurrentTime(
      formatTime((newProgress / 100) * estimateDuration(textRef.current)),
    );
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const newProgress = getProgressFromClientX(e.clientX);
    setProgress(newProgress);
    setCurrentTime(
      formatTime((newProgress / 100) * estimateDuration(textRef.current)),
    );
  };

  const handleProgressPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    progressBarRef.current?.releasePointerCapture(e.pointerId);
    const newProgress = getProgressFromClientX(e.clientX);
    commitSeek(newProgress);
  };

  const handleProgressKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isDraggingRef.current) return;

      const width = progressBarRef.current?.getBoundingClientRect().width ?? 0;
      const baseStep = width > 0 ? Math.max(1, (10 / width) * 100) : 5;
      const pageStep = Math.min(baseStep * 5, 25);

      let nextProgress = progress;
      let handled = true;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          nextProgress = progress - baseStep;
          break;
        case "ArrowRight":
        case "ArrowUp":
          nextProgress = progress + baseStep;
          break;
        case "PageDown":
          nextProgress = progress - pageStep;
          break;
        case "PageUp":
          nextProgress = progress + pageStep;
          break;
        case "Home":
          nextProgress = 0;
          break;
        case "End":
          nextProgress = 100;
          break;
        default:
          handled = false;
      }

      if (!handled) return;
      e.preventDefault();

      const normalized = Math.max(0, Math.min(100, nextProgress));
      const duration = estimateDuration(textRef.current);

      isDraggingRef.current = true;
      setIsDragging(true);
      setProgress(normalized);
      setCurrentTime(formatTime((normalized / 100) * duration));
      commitSeek(normalized);
      isDraggingRef.current = false;
      setIsDragging(false);
    },
    [progress, estimateDuration, formatTime, commitSeek],
  );

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
            <p className="font-medium text-sm">{copy.listenToArticle}</p>
            <p className="text-xs text-text-muted">
              {isPlaying
                ? isPaused
                  ? copy.paused
                  : copy.playing
                : `${totalTime} • ${speed}x ${copy.speed}`}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-text-muted"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
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
                                <div
                                    ref={progressBarRef}
                                    className="relative w-full h-4 flex items-center rounded-full cursor-pointer touch-none overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                                    role="slider"
                                    tabIndex={0}
                                    aria-label={copy.audioProgress}
                                    aria-valuenow={Math.round(progress)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuetext={`${currentTime} of ${totalTime}`}
                                    onPointerDown={handleProgressPointerDown}
                                    onPointerMove={handleProgressPointerMove}
                                    onPointerUp={handleProgressPointerUp}
                                    onPointerCancel={handleProgressPointerUp}
                                    onKeyDown={handleProgressKeyDown}
                >
                  <div className="absolute inset-x-0 h-2 bg-bg-primary rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-accent rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <motion.div
                                        className="absolute w-4 h-4 rounded-full border-2 border-white bg-accent shadow-md z-10"
                                        style={{
                                            left: `clamp(0px, calc(${progress}% - 8px), calc(100% - 16px))`,
                                            transition: isDragging ? "none" : "left 0.12s ease",
                                        }}
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
                  title={copy.restart}
                  aria-label={copy.restart}
                >
                  <RotateCcw className="w-5 h-5 md:w-5 md:h-5" />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/30"
                  aria-label={isPlaying && !isPaused ? copy.pause : copy.play}
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
                  title={isMuted ? copy.unmute : copy.mute}
                  aria-label={isMuted ? copy.unmute : copy.mute}
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
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all min-w-[52px] ${
                      speed === s
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
                {copy.poweredBy}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
