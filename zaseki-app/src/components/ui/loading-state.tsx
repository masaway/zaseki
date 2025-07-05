'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'データを読み込み中...' }: LoadingStateProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-lg p-8 flex flex-col items-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-white" />
        </motion.div>
        
        <div className="text-center">
          <p className="text-white text-lg font-medium">{message}</p>
          <p className="text-white/60 text-sm mt-1">
            しばらくお待ちください
          </p>
        </div>
        
        {/* 背景の星々 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40"
              style={{
                left: `${((i * 7) % 100)}%`,
                top: `${((i * 13) % 100)}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + ((i * 3) % 3),
                repeat: Infinity,
                delay: (i * 0.1) % 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}