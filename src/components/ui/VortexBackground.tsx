import React from "react";
import { motion } from "framer-motion";

export const VortexBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#000205]">
      {/* 1. NEON NEBULA - Rotating massive glowing core */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.2)_0%,rgba(59,130,246,0.15)_40%,transparent_70%)] blur-[80px]"
      />

      {/* 2. WARP SPEED BEAMS - Constant outward motion */}
      <svg className="absolute inset-0 w-full h-full opacity-80">
        <defs>
          <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[...Array(50)].map((_, i) => {
          const angle = (i * 360) / 50;
          const x2 = 50 + 120 * Math.cos((angle * Math.PI) / 180);
          const y2 = 50 + 120 * Math.sin((angle * Math.PI) / 180);
          return (
            <motion.line
              key={i}
              x1="50%" y1="50%"
              x2={`${x2}%`} y2={`${y2}%`}
              stroke="url(#beam-grad)"
              strokeWidth="2"
              initial={{ strokeDasharray: "1, 100", strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: [100, -100], opacity: [0, 1, 0] }}
              transition={{ 
                duration: 1.5 + Math.random() * 1.5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "easeIn" 
              }}
            />
          );
        })}
      </svg>

      {/* 3. EXPANDING PULSE RINGS */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 3], opacity: [0, 0.5, 0] }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            delay: i * 1.25, 
            ease: "easeOut" 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/30 shadow-[0_0_60px_rgba(34,211,238,0.3)]"
          style={{ width: '400px', height: '400px' }}
        />
      ))}

      {/* 4. DIGITAL GRID FLOOR */}
      <div className="absolute bottom-0 w-full h-full opacity-20">
        <motion.div 
          animate={{ backgroundPosition: ["0px 0px", "0px 100px"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(34,211,238,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(600px) rotateX(70deg)',
            transformOrigin: 'center bottom',
          }}
        />
      </div>
    </div>
  );
};