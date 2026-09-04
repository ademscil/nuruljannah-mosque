"use client";

import { cn } from "@/lib/utils";
import { useMouse3D } from "@/hooks/use-mouse-3d";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "magnetic" | "glass" | "elevated" | "float";
  enableHover?: boolean;
  delay?: number;
}

/**
 * Advanced 3D Card with magnetic mouse tracking effect
 * Inspired by modern web design (Apple, Stripe, Linear)
 */
export function Card3D({
  children,
  className,
  variant = "default",
  enableHover = true,
  delay = 0,
}: Card3DProps) {
  const { ref: mouse3DRef, style: mouse3DStyle, isHovered } = useMouse3D({
    tiltStrength: 8,
    magneticStrength: 15,
    smoothness: 0.15,
    enableMagnetic: enableHover,
    enableTilt: enableHover,
    hoverScale: 1.02,
  });

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Combine refs
  const setRefs = (element: HTMLDivElement | null) => {
    mouse3DRef.current = element;
    inViewRef(element);
  };

  const baseClasses = "card-3d-advanced relative overflow-hidden transition-all duration-500";
  
  const variantClasses = {
    default: "rounded-3xl border border-border bg-card p-6",
    magnetic: "rounded-3xl border border-border bg-card p-6 shadow-depth-md",
    glass: "glass-ultra rounded-3xl p-6",
    elevated: "rounded-3xl border border-border bg-card p-6 shadow-depth-lg",
    float: "card-3d-float rounded-3xl border border-border bg-card p-6",
  };

  const hoverClasses = isHovered && enableHover
    ? "border-primary/20 shadow-depth-xl"
    : "";

  return (
    <motion.div
      ref={setRefs}
      style={enableHover ? mouse3DStyle : undefined}
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
    >
      {/* Shine effect on hover */}
      {enableHover && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}
          style={{
            background:
              "radial-gradient(circle at 50% 50%, oklch(1 0 0 / 0.15) 0%, transparent 50%)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

interface Card3DFlipProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
}

/**
 * 3D Flip Card with front and back faces
 */
export function Card3DFlip({
  front,
  back,
  className,
  flipped = false,
  onFlip,
}: Card3DFlipProps) {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleClick = () => {
    onFlip?.(!flipped);
  };

  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={handleClick}
      className={cn("card-flip-3d cursor-pointer", flipped && "is-flipped", className)}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        minHeight: "300px",
      }}
    >
      {/* Front Face */}
      <div
        className="card-flip-3d-front rounded-3xl border border-border bg-card p-6 shadow-depth-md"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
        }}
      >
        {front}
      </div>

      {/* Back Face */}
      <div
        className="card-flip-3d-back rounded-3xl border border-border bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-depth-md"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        {back}
      </div>
    </motion.div>
  );
}

interface Card3DStackProps {
  cards: React.ReactNode[];
  className?: string;
}

/**
 * Stacked 3D cards with depth effect
 */
export function Card3DStack({ cards, className }: Card3DStackProps) {
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={inViewRef}
      className={cn("relative", className)}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, z: -index * 20 }}
          animate={
            inView
              ? { opacity: 1, y: 0, z: -index * 20 }
              : {}
          }
          transition={{
            duration: 0.8,
            delay: index * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="card-3d rounded-3xl border border-border bg-card p-6 shadow-depth-lg"
          style={{
            position: index > 0 ? "absolute" : "relative",
            inset: 0,
            transform: `translateZ(-${index * 20}px) scale(${1 - index * 0.05})`,
            transformStyle: "preserve-3d",
            zIndex: cards.length - index,
          }}
        >
          {card}
        </motion.div>
      ))}
    </div>
  );
}

interface Card3DParallaxProps {
  children: React.ReactNode;
  className?: string;
  layers?: React.ReactNode[];
}

/**
 * 3D card with parallax layers
 */
export function Card3DParallax({
  children,
  className,
  layers = [],
}: Card3DParallaxProps) {
  const { ref: mouse3DRef, style: mouse3DStyle } = useMouse3D({
    tiltStrength: 12,
    magneticStrength: 20,
    smoothness: 0.1,
    hoverScale: 1.05,
  });

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const setRefs = (element: HTMLDivElement | null) => {
    mouse3DRef.current = element;
    inViewRef(element);
  };

  return (
    <motion.div
      ref={setRefs}
      style={{
        ...mouse3DStyle,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, scale: 0.9, rotateX: -15 }}
      animate={inView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "card-3d relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-depth-xl",
        className
      )}
    >
      {/* Parallax layers */}
      {layers.map((layer, index) => (
        <div
          key={index}
          className="pointer-events-none absolute inset-0"
          style={{
            transform: `translateZ(${(index + 1) * 30}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {layer}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
