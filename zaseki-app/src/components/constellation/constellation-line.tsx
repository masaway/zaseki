'use client';

import { motion } from 'framer-motion';

interface ConstellationLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}

export function ConstellationLine({ from, to, color }: ConstellationLineProps) {
  return (
    <motion.line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.6"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      style={{
        filter: 'drop-shadow(0 0 4px currentColor)',
      }}
    />
  );
}