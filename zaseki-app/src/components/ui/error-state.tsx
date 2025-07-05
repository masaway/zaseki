'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md mx-4"
      >
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center"
          >
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </motion.div>
          
          <div className="text-center">
            <h3 className="text-white text-xl font-semibold mb-2">
              エラーが発生しました
            </h3>
            <p className="text-white/80 text-sm mb-4">
              {error}
            </p>
          </div>
          
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再試行</span>
            </motion.button>
          )}
        </div>
        
        {/* 背景の星々 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${((i * 11) % 100)}%`,
                top: `${((i * 17) % 100)}%`,
              }}
              animate={{
                opacity: [0.1, 0.6, 0.1],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + ((i * 2) % 2),
                repeat: Infinity,
                delay: (i * 0.2) % 3,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}