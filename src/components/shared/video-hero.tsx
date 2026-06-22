"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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
  overlayOpacity = 0.6,
  height = "screen",
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStatus, setVideoStatus] = useState<"loading" | "playing" | "error">("loading");
  const [showVideo, setShowVideo] = useState(false);

  const heightClass = {
    screen: "min-h-screen",
    large: "min-h-[80vh]",
    medium: "min-h-[60vh]",
  }[height];

  useEffect(() => {
    if (!videoSrc || !videoRef.current) {
      setVideoStatus("error");
      return;
    }

    const video = videoRef.current;

    const handleCanPlay = () => {
      setVideoStatus("playing");
      setShowVideo(true);
      // Force play if browser blocked autoplay
      video.play().catch((err) => {
        console.warn("Video autoplay failed:", err);
      });
    };

    const handleError = (e: Event) => {
      console.error("Video load error:", e);
      setVideoStatus("error");
      setShowVideo(false);
    };

    const handleLoadedData = () => {
      setShowVideo(true);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);
    video.addEventListener("loadeddata", handleLoadedData);

    // Force load
    video.load();

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [videoSrc]);

  // Log for debugging
  useEffect(() => {
    console.log("VideoHero state:", { videoSrc, videoStatus, showVideo });
  }, [videoSrc, videoStatus, showVideo]);

  return (
    <div className={`${heightClass} relative w-full overflow-hidden`}>
      {/* Video Background Layer */}
      <div className="absolute inset-0 w-full h-full">
        {videoSrc ? (
          <>
            {/* Actual Video Element */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                showVideo ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={videoPoster}
              style={{ zIndex: 1 }}
            >
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc} type="video/webm" />
              Your browser does not support video playback.
            </video>

            {/* Fallback gradient while video loads or if it fails */}
            {!showVideo && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900 via-teal-800 to-green-700 animate-pulse" />
            )}
          </>
        ) : (
          // No video URL provided - show gradient
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-900 via-teal-800 to-green-700" />
        )}
      </div>

      {/* Dark Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        style={{ opacity: overlayOpacity, zIndex: 2 }}
      />

      {/* 3D Glass Effect Overlay */}
      <div
        className="absolute inset-0 w-full h-full bg-gradient-to-t from-transparent via-white/[0.02] to-transparent"
        style={{ zIndex: 3 }}
      />

      {/* Content Layer with 3D Effects */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* 3D Title with depth */}
            <motion.h1
              className="text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
              style={{
                textShadow: `
                  0 1px 0 rgba(0,0,0,0.3),
                  0 2px 0 rgba(0,0,0,0.2),
                  0 3px 0 rgba(0,0,0,0.1),
                  0 10px 20px rgba(0,0,0,0.4),
                  0 15px 40px rgba(0,0,0,0.3)
                `,
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                className="mx-auto max-w-2xl text-lg text-white/90 md:text-xl"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}

            {children && (
              <motion.div
                className="flex flex-wrap items-center justify-center gap-4 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {children}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator with 3D effect */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/70"
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
          }}
        >
          <span className="text-sm uppercase tracking-widest font-semibold">Scroll</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom fade for smooth transition to content below */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
        style={{ zIndex: 4 }}
      />
    </div>
  );
}
