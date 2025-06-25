'use client';

import { motion } from 'framer-motion';
import { Member } from '@/types';
import { clsx } from 'clsx';

interface StarProps {
  member: Member;
  color: string;
  onClick: () => void;
  isSelected: boolean;
  isConnected?: boolean;
}

export function Star({ member, color, onClick, isSelected, isConnected = false }: StarProps) {
  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'online':
        return '#10B981'; // green
      case 'busy':
        return '#EF4444'; // red
      case 'away':
        return '#F59E0B'; // yellow
      case 'offline':
        return '#6B7280'; // gray
      default:
        return color;
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer group w-20 h-20" // クリック範囲を拡大
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isConnected ? {
        scale: [1.05, 1.1, 1.05],
        y: [-1, 1, -1],
      } : {}}
      transition={isConnected ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : { duration: 0.3 }}
    >
      {/* 星の光る効果 */}
      <motion.div
        className={clsx(
          'absolute top-4 left-4 w-12 h-12 rounded-full blur-md', // 中央配置に調整
          isSelected ? 'opacity-80' : isConnected ? 'opacity-60' : 'opacity-0 group-hover:opacity-50'
        )}
        style={{ backgroundColor: getStatusColor(member.status) }}
        animate={isSelected ? {
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        } : isConnected ? {
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 星の本体 */}
      <motion.div
        className={clsx(
          "absolute top-4 left-4 w-12 h-12 flex items-center justify-center text-white font-bold rounded-full border-2", // 中央配置に調整
          isConnected && "shadow-lg shadow-blue-400"
        )}
        style={{
          backgroundColor: getStatusColor(member.status),
          borderColor: isSelected ? '#FFFFFF' : isConnected ? '#3B82F6' : 'transparent',
        }}
        animate={{
          rotate: isSelected ? [0, 360] : 0,
        }}
        transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
      >
        {/* アバター文字またはアイコン */}
        <span className="text-sm">
          {member.avatar || member.name.charAt(0)}
        </span>
      </motion.div>

      {/* ホバー時の名前表示 */}
      <motion.div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: -5 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {member.name}
      </motion.div>

      {/* ステータスインジケーター */}
      <motion.div
        className="absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white" // 位置調整
        style={{ backgroundColor: getStatusColor(member.status) }}
        animate={{
          scale: member.status === 'busy' ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 1, repeat: member.status === 'busy' ? Infinity : 0 }}
      />

      {/* パルス効果 */}
      {member.status === 'online' && (
        <motion.div
          className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-green-400" // 位置調整
          animate={{
            scale: [1, 2],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* 通常状態でのホバー強化 */}
      {!isSelected && !isConnected && (
        <motion.div
          className="absolute top-4 left-4 w-12 h-12 rounded-full border-2 border-blue-300 opacity-0 group-hover:opacity-60"
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}