'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Star } from './star';
import { ConstellationLine } from './constellation-line';
import { MemberTooltip } from './member-tooltip';

export function ConstellationView() {
  const { constellations, selectedMember, setSelectedMember } = useAppStore();
  const [screenWidth, setScreenWidth] = useState(1200); // デフォルト幅
  const [backgroundStars, setBackgroundStars] = useState<Array<{left: number, top: number, duration: number, delay: number}>>([]);

  useEffect(() => {
    // クライアント側でのみwindow.innerWidthを取得
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    // 背景の星々の位置を固定値で生成（ハイドレーションエラー対策）
    const stars = Array.from({ length: 100 }).map((_, i) => ({
      left: ((i * 7) % 100), // 疑似ランダムな固定値
      top: ((i * 13) % 100), // 疑似ランダムな固定値
      duration: 2 + ((i * 3) % 3), // 2-5秒の範囲
      delay: (i * 0.1) % 2, // 0-2秒の遅延
    }));
    setBackgroundStars(stars);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden">
      {/* 背景の星々 */}
      <div className="absolute inset-0">
        {backgroundStars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* SVGで星座の線を描画 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {constellations.map((constellation) =>
          constellation.connections.map((connection, index) => {
            const fromMember = constellation.members.find(m => m.id === connection.from);
            const toMember = constellation.members.find(m => m.id === connection.to);
            
            if (!fromMember || !toMember) return null;

            return (
              <ConstellationLine
                key={`${constellation.id}-${index}`}
                from={constellation.position}
                to={constellation.position}
                color={constellation.color}
              />
            );
          })
        )}
      </svg>

      {/* 星座（メンバーグループ） */}
      <div className="absolute inset-0">
        {constellations.map((constellation) => (
          <motion.div
            key={constellation.id}
            className="absolute"
            style={{
              left: constellation.position.x,
              top: constellation.position.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 星座名 */}
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium opacity-70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {constellation.name}
            </motion.div>

            {/* メンバーを円形に配置 */}
            <div className="relative">
              {constellation.members.map((member, index) => {
                const angle = (index * 360) / constellation.members.length;
                const radius = constellation.members.length > 1 ? 40 : 0;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={member.id}
                    className="absolute"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <Star
                      member={member}
                      color={constellation.color}
                      onClick={() => setSelectedMember(
                        selectedMember?.id === member.id ? undefined : member
                      )}
                      isSelected={selectedMember?.id === member.id}
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* メンバー詳細ツールチップ */}
      {selectedMember && (
        <MemberTooltip
          member={selectedMember}
          onClose={() => setSelectedMember(undefined)}
        />
      )}

      {/* 流れ星エフェクト */}
      <motion.div
        className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
        initial={{ x: -50, y: 100, opacity: 0 }}
        animate={{
          x: screenWidth + 50,
          y: 200,
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
      />
    </div>
  );
}