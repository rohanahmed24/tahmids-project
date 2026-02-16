"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Headphones,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface CustomAudioPlayerProps {
  src?: string;
  title?: string;
}

export function CustomAudioPlayer({ src, title }: CustomAudioPlayerProps) {
  const { locale } = useLocale();
  const copy =
    locale === "bn"
      ? {
          listenToArticle: "লেখাটি শুনুন",
          playing: "চলছে...",
          paused: "বিরতি",
          restart: "আবার শুরু",
          play: "চালু করুন",
          pause: "বিরতি",
          mute: "মিউট",
          unmute: "আনমিউট",
          speed: "গতি",
        }
      : {
          listenToArticle: "Listen to Article",
          playing: "Playing...",
          paused: "Paused",
          restart: "Restart",
          play: "Play",
          pause: "Pause",
          mute: "Mute",
          unmute: "Unmute",
          speed: "Speed",
        };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
        if (audio.duration > 0) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      }
    };

    const updateDuration = () => {
      if (audio.duration > 0 && Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audio.duration > 0) {
        audio.currentTime = 0;
      }
    };
    const onRateChange = () => setPlaybackRate(audio.playbackRate);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("ratechange", onRateChange);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("ratechange", onRateChange);
    };
  }, [isSeeking]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
    void audio.play();
  };

  const handleSpeedChange = (nextRate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const seekToPosition = useCallback(
    (progressPercent: number) => {
      if (!audioRef.current || !duration) return;
      const time = (progressPercent / 100) * duration;
      if (Number.isFinite(time)) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    [duration],
  );

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextProgress = Number(e.target.value);
    setProgress(nextProgress);
    seekToPosition(nextProgress);
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!src) return null;

  return (
    <div className="w-full my-6 bg-bg-secondary border border-border-subtle rounded-2xl overflow-hidden select-none">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          if (audio.duration > 0 && Number.isFinite(audio.duration)) {
            setDuration(audio.duration);
          }
        }}
      />

      <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {title || copy.listenToArticle}
            </p>
            <p className="text-xs text-text-muted">
              {isPlaying ? copy.playing : copy.paused}
            </p>
          </div>
        </div>
        <span className="text-xs text-text-muted font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="relative w-full h-4 flex items-center rounded-full cursor-pointer touch-none overflow-hidden focus-within:ring-2 focus-within:ring-accent/40">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={Number.isFinite(progress) ? progress : 0}
            onChange={handleSeekChange}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={() => setIsSeeking(false)}
            onTouchStart={() => setIsSeeking(true)}
            onTouchEnd={() => setIsSeeking(false)}
            aria-label={`${copy.listenToArticle} progress`}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />
          <div className="absolute inset-x-0 h-2 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-accent rounded-full"
              style={{
                width: `${progress}%`,
                transition: isSeeking ? "none" : "width 0.12s ease",
              }}
            />
          </div>
          <div
            className="absolute w-4 h-4 rounded-full border-2 border-white bg-accent shadow-md z-10"
            style={{
              left: `clamp(0px, calc(${progress}% - 8px), calc(100% - 16px))`,
              transition: isSeeking ? "none" : "left 0.12s ease",
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleRestart}
            className="w-10 h-10 !p-0 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors"
            title={copy.restart}
            aria-label={copy.restart}
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-14 h-14 !p-0 bg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/20 hover:opacity-95 transition-all active:scale-95"
            aria-label={isPlaying ? copy.pause : copy.play}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="w-10 h-10 !p-0 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors"
            title={isMuted ? copy.unmute : copy.mute}
            aria-label={isMuted ? copy.unmute : copy.mute}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[0.75, 1, 1.5, 2].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className={`min-w-[52px] rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                playbackRate === rate
                  ? "bg-accent text-white"
                  : "bg-bg-primary text-text-muted hover:text-text-primary"
              }`}
              aria-label={`${copy.speed} ${rate}x`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
