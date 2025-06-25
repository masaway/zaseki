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
      className="relative cursor-pointer group"
      onClick={handleSeatClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 座席番号 */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600">
        {seat.number}
      </div>

      {/* デスク */}
      <div
        className={clsx(
          'w-16 h-12 rounded-lg border-2 transition-colors relative',
          seat.occupied
            ? 'bg-blue-100 border-blue-300'
            : 'bg-green-100 border-green-300 hover:bg-green-200'
        )}
      >
        {/* モニター */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
          <Monitor size={12} className="text-gray-600" />
        </div>

        {/* 椅子 */}
        <div
          className={clsx(
            'absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-6 rounded-md border transition-colors',
            seat.occupied
              ? 'bg-blue-200 border-blue-400'
              : 'bg-green-200 border-green-400'
          )}
        >
          {/* 座っている人のアバター */}
          {seat.occupied && seat.occupiedBy && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {seat.occupiedBy.avatar ? (
                <span>{seat.occupiedBy.avatar}</span>
              ) : (
                <User size={10} className="text-blue-600" />
              )}
            </motion.div>
          )}
        </div>

        {/* ステータスインジケーター */}
        <div
          className={clsx(
            'absolute top-1 right-1 w-2 h-2 rounded-full',
            seat.occupied ? 'bg-blue-500' : 'bg-green-500'
          )}
        >
          {/* パルス効果 */}
          {!seat.occupied && (
            <motion.div
              className="absolute inset-0 rounded-full bg-green-400"
              animate={{
                scale: [1, 2],
                opacity: [0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* ホバー時の詳細情報 */}
      <motion.div
        className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: -5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {seat.occupied && seat.occupiedBy ? (
          <div>
            <div className="font-semibold">{seat.occupiedBy.name}</div>
            <div className="text-gray-300">{seat.occupiedBy.department}</div>
          </div>
        ) : (
          '空席 - クリックして予約'
        )}
      </motion.div>

      {/* QRコードインジケーター */}
      <motion.div
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border border-gray-300 rounded text-xs flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        QR
      </motion.div>
    </motion.div>
  );
}