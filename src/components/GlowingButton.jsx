"use client";

import { motion } from "framer-motion";

const GlowingButton = ({
  children,
  onClick,
  variant = "primary", // "primary" or "secondary"
  className = "",
  glowColor = "255, 0, 0",
  spreadSize = "small",
  speed = "medium",
  waveCount = 3,
  ...props
}) => {
  const buttonClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 18 },
      }}
      whileTap={{
        scale: 0.98,
        y: 0,
      }}
      className={`relative overflow-visible group flex items-center justify-center ${buttonClass} ${className}`}
      style={{
        background:
          variant === "primary"
            ? "linear-gradient(135deg, #cc0000 0%, #000000 100%)"
            : undefined,
        boxShadow:
          variant === "primary"
            ? `0 10px 30px -10px rgba(${glowColor}, 0.55)`
            : undefined,
      }}
      onClick={onClick}
      {...props}
    >
      {/* Signature Pulsing Outer Glow Ring (GPU CSS keyframe — zero JS overhead) */}
      <span
        className="btn-glow-ring absolute inset-0 rounded-full pointer-events-none -z-10"
        style={{
          boxShadow: `0 0 22px 2px rgba(${glowColor}, 0.45)`,
        }}
      />

      {/* Pure CSS GPU-composited shimmer */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <div className="btn-shimmer-bar absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent z-0" />
      </div>

      {/* Subtle Inner Ring */}
      <div className="absolute inset-[1px] rounded-full border border-white/10 z-0 pointer-events-none" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
        {children}
      </span>
    </motion.button>
  );
};

export default GlowingButton;
