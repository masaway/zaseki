'use client';

import { motion } from 'framer-motion';
import { Monitor, User } from 'lucide-react';
import { Seat } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { clsx } from 'clsx';

interface SeatComponentProps {
  seat: Seat;
}

export function SeatComponent({ seat }: SeatComponentProps) {
  const { setSelectedMember } = useAppStore();

  const handleSeatClick = () => {
    if (seat.occupiedBy) {
      setSelectedMember(seat.occupiedBy);
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer group seat"
      onClick={handleSeatClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 座席番号（星座のような表示） */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-300">
        ⭐ {seat.number}
      </div>

      {/* 宇宙ステーション風デスク */}
      <div
        className={clsx(
          'w-16 h-12 rounded-lg border-2 transition-all duration-300 relative shadow-lg',
          seat.occupied
            ? 'bg-gradient-to-br from-blue-800 to-blue-600 border-blue-400 shadow-blue-500/50'
            : 'bg-gradient-to-br from-cyan-800 to-cyan-600 border-cyan-400 shadow-cyan-500/50 hover:from-cyan-700 hover:to-cyan-500'
        )}
        style={{
          boxShadow: seat.occupied 
            ? '0 0 20px rgba(59, 130, 246, 0.5)' 
            : '0 0 20px rgba(34, 211, 238, 0.5)'
        }}
      >
        {/* ホログラムモニター */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          <Monitor size={12} className="text-blue-200" />
          {/* ホログラム効果 */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Monitor size={12} className="text-cyan-300" />
          </motion.div>
        </div>

        {/* 宇宙船風椅子 */}
        <div
          className={clsx(
            'absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-6 rounded-md border transition-all duration-300',
            seat.occupied
              ? 'bg-gradient-to-b from-blue-700 to-blue-500 border-blue-300 shadow-blue-400/50'
              : 'bg-gradient-to-b from-cyan-700 to-cyan-500 border-cyan-300 shadow-cyan-400/50'
          )}
          style={{
            boxShadow: seat.occupied 
              ? '0 0 10px rgba(59, 130, 246, 0.4)' 
              : '0 0 10px rgba(34, 211, 238, 0.4)'
          }}
        >
          {/* 座っている人のアバター */}
          {seat.occupied && seat.occupiedBy && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-xs"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {seat.occupiedBy.avatar ? (
                <motion.span
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {seat.occupiedBy.avatar}
                </motion.span>
              ) : (
                <User size={10} className="text-blue-200" />
              )}
            </motion.div>
          )}
        </div>

        {/* エネルギーコア（ステータスインジケーター） */}
        <div
          className={clsx(
            'absolute top-1 right-1 w-2 h-2 rounded-full transition-all duration-300',
            seat.occupied ? 'bg-blue-400' : 'bg-cyan-400'
          )}
          style={{
            boxShadow: seat.occupied 
              ? '0 0 8px rgba(96, 165, 250, 0.8)' 
              : '0 0 8px rgba(34, 211, 238, 0.8)'
          }}
        >
          {/* エネルギーパルス効果 */}
          <motion.div
            className={clsx(
              'absolute -inset-1 rounded-full',
              seat.occupied ? 'bg-blue-400/30' : 'bg-cyan-400/30'
            )}
            animate={{
              scale: [1, 2.5],
              opacity: [0.6, 0],
            }}
            transition={{ 
              duration: seat.occupied ? 1.5 : 2,
              repeat: Infinity,
              repeatDelay: 0.5
            }}
          />
        </div>
      </div>

      {/* ホログラム情報パネル */}
      <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gradient-to-r from-blue-900/90 to-cyan-900/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-blue-400/50 whitespace-nowrap pointer-events-none transition-opacity z-10">
        {seat.occupied && seat.occupiedBy ? (
          <div className="space-y-1">
            <div className="font-semibold text-blue-200">🚀 {seat.occupiedBy.name}</div>
            <div className="text-cyan-300">{seat.occupiedBy.department}</div>
            <div className="text-blue-400 text-xs">{seat.occupiedBy.role}</div>
          </div>
        ) : (
          <div className="text-cyan-300">
            ✨ 空きステーション<br/>
            <span className="text-xs text-blue-400">チェックインして着席</span>
          </div>
        )}
      </div>

      {/* 量子QRコードポート */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-blue-600 to-cyan-600 border border-blue-400 rounded text-xs flex items-center justify-center text-white font-bold shadow-lg"
        style={{
          boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          ⚡
        </motion.div>
      </motion.div>
    </motion.div>
  );
}