// src/components/GlowingButton.jsx
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

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

  const spreadConfig = {
    small: { baseScale: 1.0, increment: 0.03 },
    medium: { baseScale: 1.02, increment: 0.05 },
    large: { baseScale: 1.04, increment: 0.07 }
  };

  const speedConfig = {
    slow: { duration: 4 },
    medium: { duration: 3 },
    fast: { duration: 2 },
  };

  const selectedSpread = spreadConfig[spreadSize] || spreadConfig.small;
  const selectedSpeed = speedConfig[speed] || speedConfig.medium;

  const buttonClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  const waves = Array.from({ length: waveCount }).map((_, index) => {
    const delay = index * 0.2;
    const maxScale = Math.min(1 + ((index + 1) * 0.02), 1.08);
    const opacity = Math.max(0.4 - (index * 0.1), 0.1);

    return {
      id: index,
      delay,
      scale: [1, maxScale, 1],
      opacity: [0.15, opacity, 0.15],
      zIndex: -1 - index,
    };
  });

  const floatAnimation = {
    y: [0, -4, 0],
    transition: {
      duration: selectedSpeed.duration,
      repeat: Infinity,
      ease: "easeInOut",
    }
  };

  return (
    <motion.button
      animate={floatAnimation}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{
        scale: 0.98,
        y: 0
      }}
      className={`relative overflow-visible group flex items-center justify-center ${buttonClass} ${className}`}
      style={{
        background: variant === "primary"
          ? `linear-gradient(135deg, #cc0000 0%, #000000 100%)`
          : undefined,
        boxShadow: variant === "primary"
          ? `0 10px 30px -10px rgba(${glowColor}, 0.5)`
          : undefined,
      }}
      onClick={onClick}
      {...props}
    >
      {/* Background Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1
          }}
          className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-0"
        />
      </div>

      {/* Subtle Inner Ring */}
      <div className="absolute inset-[1px] rounded-full border border-white/10 z-0 pointer-events-none" />

      {/* Glow Waves */}
      {waves.map((wave) => (
        <motion.span
          key={wave.id}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            boxShadow: `0 0 ${15 + wave.id * 5}px rgba(${glowColor}, ${0.3})`,
            zIndex: wave.zIndex,
          }}
          animate={{
            scale: wave.scale,
            opacity: wave.opacity,
          }}
          transition={{
            duration: selectedSpeed.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: wave.delay,
          }}
        />
      ))}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
        {children}

      </span>
    </motion.button>
  );
};

export default GlowingButton;