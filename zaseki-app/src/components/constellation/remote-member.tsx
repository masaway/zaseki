"use client";

import { motion } from "framer-motion";
import { Member } from "@/types";
import { Star } from "../constellation/star";

interface RemoteMemberProps {
  member: Member;
  position: { x: number; y: number };
  isSelected: boolean;
  isConnected: boolean;
  onClick: () => void;
}

export function RemoteMember({
  member,
  position,
  isSelected,
  isConnected,
  onClick,
}: RemoteMemberProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: position.x - 40,
        top: position.y - 40,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -4, 0], // 浮遊効果
      }}
      transition={{
        duration: 0.8,
        delay: 0.4,
        y: {
          duration: 6, // より長い周期でCPU負荷軽減
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        },
      }}
    >
      <Star
        member={member}
        color="#8B5CF6"
        onClick={onClick}
        isSelected={isSelected}
        isConnected={isConnected}
      />
      {/* メンバー情報ラベル */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-purple-300 text-xs font-medium">{member.name}</div>
        <div className="text-purple-400 text-xs opacity-80">
          {member.location?.prefecture}
        </div>
      </div>
    </motion.div>
  );
}
