"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Planet {
  id: string;
  size: number;
  color: string;
  glowColor: string;
  orbitRadius: number;
  orbitDuration: number;
  orbitDelay: number;
  centerX: number;
  centerY: number;
}

export function OrbitingPlanets() {
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);
    return () => window.removeEventListener("resize", updateScreenSize);
  }, []);

  // 太陽系の中心座標（画面中央に配置）
  const solarSystemCenter = useMemo(
    () => ({
      x: screenSize.width * 0.5, // 画面中央
      y: screenSize.height * 0.5, // 画面中央
    }),
    [screenSize.width, screenSize.height],
  );

  const planets = useMemo(() => {
    // 太陽系のような配置（パフォーマンス最適化のためuseMemoを使用）
    return [
      {
        id: "planet-1", // 水星的なポジション
        size: 18, // さらに大きなサイズ
        color: "#FFA500",
        glowColor: "#FFA500",
        orbitRadius: 240, // 3倍に拡大
        orbitDuration: 60, // さらに長い周期
        orbitDelay: 0,
        centerX: solarSystemCenter.x,
        centerY: solarSystemCenter.y,
      },
      {
        id: "planet-2", // 金星的なポジション
        size: 22,
        color: "#FFD700",
        glowColor: "#FFD700",
        orbitRadius: 360, // 3倍に拡大
        orbitDuration: 90,
        orbitDelay: 15,
        centerX: solarSystemCenter.x,
        centerY: solarSystemCenter.y,
      },
      {
        id: "planet-3", // 地球的なポジション
        size: 26,
        color: "#4ECDC4",
        glowColor: "#4ECDC4",
        orbitRadius: 480, // 3倍に拡大
        orbitDuration: 120,
        orbitDelay: 30,
        centerX: solarSystemCenter.x,
        centerY: solarSystemCenter.y,
      },
      {
        id: "planet-4", // 火星的なポジション
        size: 20,
        color: "#FF6B6B",
        glowColor: "#FF6B6B",
        orbitRadius: 600, // 3倍に拡大
        orbitDuration: 150,
        orbitDelay: 45,
        centerX: solarSystemCenter.x,
        centerY: solarSystemCenter.y,
      },
    ];
  }, [solarSystemCenter.x, solarSystemCenter.y]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 中央の恒星（太陽） */}
      <div
        className="absolute"
        style={{
          left: solarSystemCenter.x,
          top: solarSystemCenter.y,
          transform: "translate3d(-50%, -50%, 0)", // GPU最適化
        }}
      >
        <motion.div
          className="rounded-full"
          style={{
            width: 80, // 3倍に拡大
            height: 80,
            background:
              "radial-gradient(circle at 30% 30%, #FFD700, #FFA500, #FF6B47)",
            boxShadow:
              "0 0 120px #FFD700, 0 0 240px #FFA500, 0 0 360px #FF6B47",
            filter: "drop-shadow(0 0 60px #FFD700)",
            willChange: "transform", // GPU最適化
          }}
          animate={{
            scale: [1, 1.05, 1], // より小さな変化
            opacity: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 12, // より長い周期
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 惑星システム */}
      {planets.map((planet) => (
        <div
          key={planet.id}
          className="absolute"
          style={{
            left: planet.centerX,
            top: planet.centerY,
            transform: "translate3d(-50%, -50%, 0)", // GPU最適化
          }}
        >
          {/* 軌道線（太陽系らしく薄く表示） */}
          <div
            className="absolute border border-yellow-300 opacity-15 rounded-full"
            style={{
              width: planet.orbitRadius * 2,
              height: planet.orbitRadius * 2,
              left: -planet.orbitRadius,
              top: -planet.orbitRadius,
              borderStyle: "dashed",
            }}
          />

          {/* 回転する惑星 */}
          <motion.div
            className="absolute"
            style={{
              width: planet.orbitRadius * 2,
              height: planet.orbitRadius * 2,
              left: -planet.orbitRadius,
              top: -planet.orbitRadius,
              willChange: "transform", // GPU最適化
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: planet.orbitDuration,
              delay: planet.orbitDelay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: planet.size,
                height: planet.size,
                backgroundColor: planet.color,
                boxShadow: `0 0 ${planet.size}px ${planet.glowColor}`, // 軽量化
                left: planet.orbitRadius - planet.size / 2,
                top: -planet.size / 2,
                willChange: "transform", // GPU最適化
              }}
            >
              {/* 惑星の表面（簡略化） */}
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}cc)`,
                }}
              />
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
