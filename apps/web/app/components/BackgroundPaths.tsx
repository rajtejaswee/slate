"use client";

import { motion } from "framer-motion";

function FloatingPaths({ position }: { position: number }) {
  const paths = [
    "M-100 300 C150 100, 350 -50, 600 200",
    "M900 100 C700 300, 400 500, 100 400",
    "M-50 150 C200 400, 500 550, 950 250",
    "M1000 50 C700 -50, 400 150, -50 400",
    "M0 450 C300 350, 600 50, 1100 150",
  ];

  const colors = [
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#3B82F6",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full opacity-60"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        {paths.map((path, i) => (
          <motion.path
            key={i}
            d={path}
            stroke={colors[i]}
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: [0, 1, 1, 0.8],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.5,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* --- 1. THE GRID LAYER (Moved inside here) --- */}
        <div 
            className="absolute inset-0 opacity-60" // INCREASED OPACITY (was 40)
            style={{
                // Changed color to #cbd5e1 (Slate 300) - Much darker than before
                backgroundImage: 'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '32px 32px',
                // Optional: Mask the edges so it fades out at the very far corners
                maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)', 
            }}
        />

        {/* --- 2. THE COLORED CURVES --- */}
        {/* Center Mask for the curves only */}
        <div 
            className="absolute inset-0"
            style={{
                maskImage: 'radial-gradient(circle at center, transparent 20%, black 100%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 20%, black 100%)'
            }}
        >
            <FloatingPaths position={1} />
        </div>
    </div>
  );
}