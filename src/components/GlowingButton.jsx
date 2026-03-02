// src/components/GlowingButton.jsx
import { motion } from 'framer-motion';

const GlowingButton = ({ 
  children, 
  onClick, 
  variant = "primary", // "primary" or "secondary"
  className = "",
  glowColor = "255, 0, 0",
  spreadSize = "small",
  speed = "medium",
  waveCount = 3, // Back to 3 waves for more visibility
  ...props 
}) => {
  
  const spreadConfig = {
    small: {
      baseScale: 1.0,
      increment: 0.04,
    },
    medium: {
      baseScale: 1.02,
      increment: 0.06,
    },
    large: {
      baseScale: 1.04,
      increment: 0.08,
    }
  };

  const speedConfig = {
    slow: { duration: 4 },
    medium: { duration: 3 },
    fast: { duration: 2 },
  };

  const selectedSpread = spreadConfig[spreadSize] || spreadConfig.small;
  const selectedSpeed = speedConfig[speed] || speedConfig.medium;

  // Determine button class based on variant
  const buttonClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  // Generate glow waves with good visibility but tight spread
  const waves = Array.from({ length: waveCount }).map((_, index) => {
    const delay = index * 0.15;
    const scaleMultiplier = 1 + (index * selectedSpread.increment);
    const maxScale = Math.min(1 + ((index + 1) * 0.03), 1.12); // Max 12% growth
    const opacity = Math.max(0.5 - (index * 0.12), 0.15);
    const blurAmount = 3 + (index * 1.5);
    
    return {
      id: index,
      delay,
      scale: [1, maxScale, 1],
      opacity: [0.2, opacity, 0.2],
      blurAmount,
      zIndex: -1 - index,
    };
  });

  // Create synchronized animation for float and glow
  const buttonAnimation = {
    y: [0, -4, 0, 4, 0], // Visible float
    scale: [1, 1.03, 1, 0.97, 1], // Visible scale
    transition: {
      y: {
        duration: selectedSpeed.duration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      },
      scale: {
        duration: selectedSpeed.duration,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1]
      }
    }
  };

  return (
    <motion.button
      animate={buttonAnimation}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        y: 2,
        transition: { duration: 0.1 }
      }}
      className={`relative overflow-visible group ${buttonClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Multiple glow wave effects - visible but tight */}
      {waves.map((wave) => (
        <motion.span
          key={wave.id}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            // Balanced glow - visible but not spreading too far
            boxShadow: `0 0 ${12 + wave.id * 4}px ${4 + wave.id}px rgba(${glowColor}, ${0.25})`,
            filter: `blur(${wave.blurAmount}px)`,
            zIndex: wave.zIndex,
          }}
          animate={{
            scale: wave.scale,
            opacity: wave.opacity,
            boxShadow: [
              `0 0 ${8 + wave.id * 2}px ${2 + wave.id}px rgba(${glowColor}, 0.15)`,
              `0 0 ${15 + wave.id * 5}px ${5 + wave.id * 1.5}px rgba(${glowColor}, 0.4)`,
              `0 0 ${8 + wave.id * 2}px ${2 + wave.id}px rgba(${glowColor}, 0.15)`,
            ],
          }}
          transition={{
            duration: selectedSpeed.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: wave.delay,
          }}
        />
      ))}

      <span className="relative z-10 font-medium">{children}</span>
    </motion.button>
  );
};

export default GlowingButton;