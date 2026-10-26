"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Sparkles, ChevronDown } from "lucide-react";

interface VideoHeroProps {
  videoSrc?: string;
  videoPoster?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  overlayOpacity?: number;
  height?: "screen" | "large" | "medium";
}

export function VideoHero({
  videoSrc,
  videoPoster,
  title,
  subtitle,
  children,
  overlayOpacity = 0.55,
  height = "large",
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const heightClass = {
    screen: "min-h-[100dvh]",
    large: "min-h-[82vh] sm:min-h-[85vh]",
    medium: "min-h-[60vh]",
  }[height];

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;
    const video = videoRef.current;

    const handleCanPlay = () => {
      setShowVideo(true);
      video.play().catch(() => {});
    };

    video.addEventListener("canplay", handleCanPlay);
    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [videoSrc]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className={`${heightClass} relative w-full overflow-hidden flex items-center justify-center`}>
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full">
        {videoSrc ? (
          <>
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                showVideo ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              poster={videoPoster}
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc} type="video/webm" />
            </video>
            {/* Fallback ambient gradient if video is loading */}
            {!showVideo && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-950 via-[oklch(0.20_0.04_170)] to-[oklch(0.16_0.03_170)]" />
            )}
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-950 via-[oklch(0.20_0.04_170)] to-[oklch(0.16_0.03_170)]" />
        )}
      </div>

      {/* Modern Gradient Overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/80"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Subtle radial center highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08)_0%,transparent_60%)]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/95 backdrop-blur-md shadow-sm">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Pusat Ibadah & Dakwah Pangkal Pinang</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-[1.15]">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-white/85 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {subtitle}
            </p>
          )}

          {/* Action CTAs */}
          {children && (
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 sm:pt-6">
              {children}
            </div>
          )}
        </motion.div>
      </div>

      {/* Video Audio Control (if video active) */}
      {videoSrc && showVideo && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Aktifkan suara video" : "Bisukan video"}
          className="absolute bottom-8 right-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/90 backdrop-blur-md transition-all hover:bg-black/60 active:scale-95"
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      )}

      {/* Subtle Scroll Down Prompt on desktop */}
      <div className="hidden sm:flex absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex-col items-center gap-1.5 text-white/60 transition-opacity hover:text-white/90">
        <span className="text-[11px] font-medium tracking-widest uppercase">Jelajahi</span>
        <ChevronDown className="size-4 animate-bounce" />
      </div>

      {/* Bottom Seamless Fade into Alabaster Body */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background via-background/40 to-transparent" />
    </div>
  );
}
