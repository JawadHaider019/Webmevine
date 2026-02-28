// src/components/GlowingButton.jsx
import { motion } from 'framer-motion';

const GlowingButton = ({ 
  children, 
  onClick, 
  variant = "primary", // "primary" or "secondary"
  className = "",
  glowColor = "255, 0, 0",
  spreadSize = "medium",
  speed = "medium",
  waveCount = 5, 
  ...props 
}) => {
  
  const spreadConfig = {
    small: {
      baseScale: 1.1,
      increment: 0.1,
    },
    medium: {
      baseScale: 1.2,
      increment: 0.15,
    },
    large: {
      baseScale: 1.4,
      increment: 0.2,
    }
  };

  const speedConfig = {
    slow: { duration: 3.5 },
    medium: { duration: 2.5 },
    fast: { duration: 1.5 },
  };

  const selectedSpread = spreadConfig[spreadSize] || spreadConfig.medium;
  const selectedSpeed = speedConfig[speed] || speedConfig.medium;

  // Determine button class based on variant
  const buttonClass = variant === "primary" ? "btn-primary" : "btn-secondary";

  // Generate waves dynamically
  const waves = Array.from({ length: waveCount }).map((_, index) => {
    const delay = index * 0.2; // Stagger each wave
    const scaleMultiplier = 1 + (index * selectedSpread.increment);
    const opacity = Math.max(0.9 - (index * 0.15), 0.2);
    const borderWidth = Math.max(3 - index, 1);
    const blurAmount = Math.max(3 - (index * 0.5), 0.5);
    
    return {
      id: index,
      delay,
      scale: [1, selectedSpread.baseScale * scaleMultiplier, selectedSpread.baseScale * (scaleMultiplier + 0.2), 0],
      opacity: [0, opacity, opacity * 0.6, 0],
      borderWidth,
      blurAmount,
      zIndex: -1 - index,
    };
  });

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-visible group ${buttonClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Multiple wave effects */}
      {waves.map((wave) => (
        <motion.span
          key={wave.id}
          className="absolute inset-0 rounded-full"
          style={{
            border: `${wave.borderWidth}px solid rgba(${glowColor}, ${0.9 - wave.id * 0.1})`,
            boxShadow: `0 0 ${20 + wave.id * 10}px rgba(${glowColor}, ${0.7 - wave.id * 0.1}), 
                        0 0 ${40 + wave.id * 15}px rgba(${glowColor}, ${0.5 - wave.id * 0.1})`,
            filter: `blur(${wave.blurAmount}px)`,
            zIndex: wave.zIndex,
          }}
          animate={{
            scale: wave.scale,
            opacity: wave.opacity,
            boxShadow: [
              `0 0 0px rgba(${glowColor}, 0)`,
              `0 0 ${20 + wave.id * 10}px rgba(${glowColor}, ${0.7 - wave.id * 0.1}), 
               0 0 ${40 + wave.id * 15}px rgba(${glowColor}, ${0.5 - wave.id * 0.1})`,
              `0 0 ${30 + wave.id * 15}px rgba(${glowColor}, ${0.6 - wave.id * 0.1}), 
               0 0 ${60 + wave.id * 20}px rgba(${glowColor}, ${0.4 - wave.id * 0.1})`,
              `0 0 0px rgba(${glowColor}, 0)`
            ],
          }}
          transition={{
            duration: selectedSpeed.duration,
            repeat: Infinity,
            ease: "easeOut",
            delay: wave.delay,
          }}
        />
      ))}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlowingButton;