"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { Seat } from "@/types";
import { Monitor, User } from "lucide-react";
import { clsx } from "clsx";

interface CompactSeatProps {
  seat: Seat;
  position: { x: number; y: number };
  scale?: number;
}

export function CompactSeat({ seat, position, scale = 0.4 }: CompactSeatProps) {
  const { setSelectedMember } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleSeatClick = () => {
    if (seat.occupiedBy) {
      setSelectedMember(seat.occupiedBy);
    }
  };

  return (
    <>
      <motion.div
        className="absolute cursor-pointer group"
        style={{
          left: position.x - 16 * scale,
          top: position.y - 12 * scale,
          transform: `scale(${scale})`,
        }}
        onClick={handleSeatClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: scale * 1.1 }}
        whileTap={{ scale: scale * 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* 座席番号 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-cyan-300">
          {seat.number}
        </div>

        {/* デスク */}
        <div
          className={clsx(
            "w-8 h-6 rounded border transition-colors relative",
            seat.occupied
              ? "bg-gradient-to-br from-blue-600 to-purple-600 border-blue-400 shadow-lg"
              : "bg-gradient-to-br from-green-600 to-teal-600 border-green-400 shadow-lg",
          )}
          style={{
            boxShadow: seat.occupied
              ? "0 0 8px rgba(59, 130, 246, 0.6)"
              : "0 0 8px rgba(34, 197, 94, 0.6)",
          }}
        >
          {/* モニター */}
          <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
            <Monitor size={6} className="text-cyan-200" />
          </div>

          {/* ステータスインジケーター */}
          <motion.div
            className={clsx(
              "absolute top-0.5 right-0.5 w-1 h-1 rounded-full",
              seat.occupied ? "bg-cyan-300" : "bg-green-300",
            )}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* 椅子 */}
        <div
          className={clsx(
            "absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded border transition-colors",
            seat.occupied
              ? "bg-gradient-to-br from-blue-500 to-purple-500 border-blue-300"
              : "bg-gradient-to-br from-green-500 to-teal-500 border-green-300",
          )}
          style={{
            boxShadow: seat.occupied
              ? "0 0 6px rgba(59, 130, 246, 0.4)"
              : "0 0 6px rgba(34, 197, 94, 0.4)",
          }}
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
                <span className="text-xs">{seat.occupiedBy.avatar}</span>
              ) : (
                <User size={6} className="text-blue-200" />
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ホバー時の詳細情報 - 親要素外に配置して最前面表示 */}
      <div
        className={clsx(
          "absolute bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border border-cyan-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity",
          isHovered ? "opacity-100" : "opacity-0",
        )}
        style={{
          zIndex: 9999,
          left: position.x - 40,
          top: position.y + 30,
          transform: `scale(${1 / scale})`,
          boxShadow: "0 0 12px rgba(6, 182, 212, 0.5)",
        }}
      >
        {seat.occupied && seat.occupiedBy ? (
          <div>
            <div className="font-semibold">{seat.occupiedBy.name}</div>
            <div className="text-gray-300">{seat.occupiedBy.department}</div>
            <div className="text-blue-300">{seat.occupiedBy.status}</div>
          </div>
        ) : (
          "空席"
        )}
      </div>
    </>
  );
}
