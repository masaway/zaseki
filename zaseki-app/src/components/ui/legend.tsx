'use client';

import { motion } from 'framer-motion';

export function Legend() {
  return (
    <motion.div
      className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-lg p-4 text-white z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <h3 className="font-semibold mb-2 text-sm">凡例</h3>
      <div className="space-y-1 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>オフィス勤務（福岡本社）</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full" />
          <span>リモート勤務</span>
        </div>
      </div>
    </motion.div>
  );
}