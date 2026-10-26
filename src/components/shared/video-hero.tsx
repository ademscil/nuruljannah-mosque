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

const DEFAULT_MOSQUE_VIDEO = "/videos/hero-mosque.webm";

export function VideoHero({
  videoSrc,
  videoPoster,
  title,
  subtitle,
  children,
  overlayOpacity = 0.42,
  height = "large",
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Safe fallback to bundled local high-definition mosque video
  const effectiveSrc =
    videoSrc && videoSrc.trim().length > 0 && !videoSrc.includes("BigBuckBunny")
      ? videoSrc
      : DEFAULT_MOSQUE_VIDEO;

  const heightClass = {
    screen: "min-h-[100dvh]",
    large: "min-h-[82vh] sm:min-h-[88vh]",
    medium: "min-h-[60vh]",
  }[height];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct property setting guarantees unblocked autoplay on all desktop & mobile browsers
    video.muted = true;
    video.defaultMuted = true;

    const markActive = () => {
      setShowVideo(true);
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      markActive();
    }

    video.addEventListener("loadeddata", markActive);
    video.addEventListener("canplay", markActive);
    video.addEventListener("playing", markActive);

    video.load();
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("loadeddata", markActive);
      video.removeEventListener("canplay", markActive);
      video.removeEventListener("playing", markActive);
    };
  }, [effectiveSrc]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className={`${heightClass} relative w-full overflow-hidden flex items-center justify-center bg-black`}>
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            showVideo ? "opacity-100" : "opacity-40"
          }`}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={videoPoster}
          onLoadedData={() => setShowVideo(true)}
          onCanPlay={() => setShowVideo(true)}
          onPlaying={() => setShowVideo(true)}
        >
          <source src={effectiveSrc} type="video/webm" />
          <source src={effectiveSrc} type="video/mp4" />
        </video>

        {/* Ambient subtle fallback layer underneath video */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-950/80 via-slate-950 to-emerald-950/80 -z-10" />
      </div>

      {/* Balanced Cinematic Overlays (Keeps looping video clearly visible while preserving text legibility) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75 transition-opacity"
        style={{ opacity: overlayOpacity }}
      />
      
      {/* Subtle radial center highlight */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 sm:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md shadow-md">
            <Sparkles className="size-3.5 text-amber-300" />
            <span>Pusat Ibadah & Dakwah Pangkal Pinang</span>
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-[1.12]">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl text-white/90 font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
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

      {/* Video Audio Control */}
      {showVideo && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Aktifkan suara video" : "Bisukan video"}
          className="absolute bottom-8 right-6 z-20 flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/90 backdrop-blur-md transition-all hover:bg-black/75 hover:scale-105 active:scale-95 shadow-md"
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      )}

      {/* Subtle Scroll Down Prompt on desktop */}
      <div className="hidden sm:flex absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex-col items-center gap-1.5 text-white/70 transition-opacity hover:text-white/100">
        <span className="text-[11px] font-semibold tracking-widest uppercase drop-shadow-md">Jelajahi</span>
        <ChevronDown className="size-4 animate-bounce" />
      </div>

      {/* Bottom Seamless Fade into Alabaster Body */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background via-background/30 to-transparent" />
    </div>
  );
}
