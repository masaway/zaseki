"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundStars() {
  const [stars, setStars] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // 画面サイズに応じて星の数を調整（パフォーマンス最適化）
    const starCount = 60;
    const newStars = [];

    for (let i = 0; i < starCount; i++) {
      // 疑似ランダムな値を生成（ハイドレーション対策）
      const baseX = (i * 17 + 23) % 100;
      const baseY = (i * 31 + 47) % 100;
      const sizeVariation = (i * 13 + 11) % 3;
      const durationVariation = (i * 7 + 3) % 4;
      const delayVariation = (i * 5 + 2) % 8;

      newStars.push({
        x: baseX,
        y: baseY,
        size: 1 + sizeVariation,
        duration: 4 + durationVariation, // 長めの周期でCPU負荷軽減
        delay: delayVariation * 0.5,
      });
    }

    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {stars.map((star, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
