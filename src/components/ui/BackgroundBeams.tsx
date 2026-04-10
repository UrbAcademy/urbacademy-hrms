import React from "react";
import { motion } from "framer-motion";

export const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 bg-[#000814]">
      {/* 1. HIGH-GLOW NEBULA - Now much brighter and centered */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
          opacity: [0.5, 0.8, 0.5], // Boosted opacity
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.3)_0%,rgba(59,130,246,0.2)_40%,transparent_70%)] blur-[120px]"
      />

      {/* 2. ELECTRIC DATA BEAMS - Thicker and faster */}
      <svg className="absolute inset-0 w-full h-full z-10 opacity-90">
        <defs>
          <linearGradient id="neon-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {[...Array(50)].map((_, i) => (
          <motion.line
            key={i}
            x1="50%" y1="50%"
            x2={`${50 + 90 * Math.cos((i * 7.2 * Math.PI) / 180)}%`}
            y2={`${50 + 90 * Math.sin((i * 7.2 * Math.PI) / 180)}%`}
            stroke="url(#neon-glow)"
            strokeWidth="2.5" // Thicker lines
            initial={{ strokeDasharray: "1, 100", strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: [-100, 100], opacity: [0, 1, 0] }}
            transition={{ 
              duration: 1.2 + Math.random() * 1.5, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "easeIn" 
            }}
          />
        ))}
      </svg>

      {/* 3. CENTER LIGHT CORE - Illuminates the card from behind */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px]" />

      {/* 4. ANIMATED GRID - Now using cyan lines */}
      <div 
        className="absolute inset-0 z-20 opacity-30" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
    </div>
  );
};