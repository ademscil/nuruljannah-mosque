"use client";

import { useEffect, useRef, useState } from "react";

interface Mouse3DOptions {
  /**
   * Strength of the 3D tilt effect (degrees)
   * @default 10
   */
  tiltStrength?: number;

  /**
   * Strength of the magnetic pull effect (pixels)
   * @default 20
   */
  magneticStrength?: number;

  /**
   * Smoothness of the transition (0-1)
   * @default 0.1
   */
  smoothness?: number;

  /**
   * Enable magnetic effect on hover
   * @default true
   */
  enableMagnetic?: boolean;

  /**
   * Enable 3D tilt effect
   * @default true
   */
  enableTilt?: boolean;

  /**
   * Scale on hover
   * @default 1.02
   */
  hoverScale?: number;
}

interface Mouse3DReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
  isHovered: boolean;
}

/**
 * Hook for creating advanced 3D mouse tracking effects
 * Provides magnetic pull and 3D tilt based on mouse position
 */
export function useMouse3D(options: Mouse3DOptions = {}): Mouse3DReturn {
  const {
    tiltStrength = 10,
    magneticStrength = 20,
    smoothness = 0.1,
    enableMagnetic = true,
    enableTilt = true,
    hoverScale = 1.02,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId: number;
    let currentTransform = { x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 };

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate mouse position relative to element center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Calculate distance from center
      const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
      const maxDistance = Math.sqrt(
        rect.width * rect.width + rect.height * rect.height
      ) / 2;

      // Normalize values (-1 to 1)
      const normalizedX = mouseX / (rect.width / 2);
      const normalizedY = mouseY / (rect.height / 2);

      // Calculate target transform values
      const targetTransform = {
        x: enableMagnetic ? normalizedX * magneticStrength : 0,
        y: enableMagnetic ? normalizedY * magneticStrength : 0,
        rotateX: enableTilt ? -normalizedY * tiltStrength : 0,
        rotateY: enableTilt ? normalizedX * tiltStrength : 0,
        scale: isHovered ? hoverScale : 1,
      };

      // Smooth transition using lerp (linear interpolation)
      const lerp = (start: number, end: number, factor: number) =>
        start + (end - start) * factor;

      const smoothTransition = () => {
        currentTransform.x = lerp(currentTransform.x, targetTransform.x, smoothness);
        currentTransform.y = lerp(currentTransform.y, targetTransform.y, smoothness);
        currentTransform.rotateX = lerp(
          currentTransform.rotateX,
          targetTransform.rotateX,
          smoothness
        );
        currentTransform.rotateY = lerp(
          currentTransform.rotateY,
          targetTransform.rotateY,
          smoothness
        );
        currentTransform.scale = lerp(
          currentTransform.scale,
          targetTransform.scale,
          smoothness
        );

        setTransform({ ...currentTransform });

        // Continue animation if values haven't settled
        const threshold = 0.01;
        if (
          Math.abs(currentTransform.x - targetTransform.x) > threshold ||
          Math.abs(currentTransform.y - targetTransform.y) > threshold ||
          Math.abs(currentTransform.rotateX - targetTransform.rotateX) > threshold ||
          Math.abs(currentTransform.rotateY - targetTransform.rotateY) > threshold ||
          Math.abs(currentTransform.scale - targetTransform.scale) > threshold
        ) {
          animationFrameId = requestAnimationFrame(smoothTransition);
        }
      };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(smoothTransition);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);

      // Reset transform smoothly
      const resetTransition = () => {
        currentTransform.x = currentTransform.x * (1 - smoothness * 2);
        currentTransform.y = currentTransform.y * (1 - smoothness * 2);
        currentTransform.rotateX = currentTransform.rotateX * (1 - smoothness * 2);
        currentTransform.rotateY = currentTransform.rotateY * (1 - smoothness * 2);
        currentTransform.scale = currentTransform.scale + (1 - currentTransform.scale) * smoothness * 2;

        setTransform({ ...currentTransform });

        const threshold = 0.01;
        if (
          Math.abs(currentTransform.x) > threshold ||
          Math.abs(currentTransform.y) > threshold ||
          Math.abs(currentTransform.rotateX) > threshold ||
          Math.abs(currentTransform.rotateY) > threshold ||
          Math.abs(currentTransform.scale - 1) > threshold
        ) {
          animationFrameId = requestAnimationFrame(resetTransition);
        }
      };

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(resetTransition);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    isHovered,
    tiltStrength,
    magneticStrength,
    smoothness,
    enableMagnetic,
    enableTilt,
    hoverScale,
  ]);

  const style: React.CSSProperties = {
    transform: `perspective(1000px) translate(${transform.x}px, ${transform.y}px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
    transformStyle: "preserve-3d",
    transition: "box-shadow 0.3s ease, border-color 0.3s ease",
    willChange: "transform",
  };

  return { ref, style, isHovered };
}
