'use client';

import { motion } from 'framer-motion';
import { useOfficeStore } from '@/stores/office-store';
import { SeatComponent } from './seat-component';
import { MemberTooltip } from '../constellation/member-tooltip';
import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

export function OfficeView() {
  const { 
    seats, 
    selectedMember, 
    setSelectedMember, 
    isLoading, 
    error, 
    loadSeats,
    refreshSeats 
  } = useOfficeStore();
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });

  // 初回データ読み込み
  useEffect(() => {
    if (seats.length === 0) {
      loadSeats();
    }
  }, [seats.length, loadSeats]);

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // オフィス中央配置の座標
  const officeCenter = {
    x: screenSize.width / 2,
    y: screenSize.height / 2
  };

  // エラー状態の表示
  if (error) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md mx-4"
        >
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <div className="text-center">
              <h3 className="text-white text-xl font-semibold mb-2">
                座席データの読み込みに失敗
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {error}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshSeats}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>再試行</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-md rounded-lg p-8 flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-white" />
          </motion.div>
          <div className="text-center">
            <p className="text-white text-lg font-medium">座席データを読み込み中...</p>
            <p className="text-white/60 text-sm mt-1">
              しばらくお待ちください
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${((i * 7) % 100)}%`,
              top: `${((i * 13) % 100)}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + ((i * 3) % 3),
              repeat: Infinity,
              delay: (i * 0.1) % 2,
            }}
          />
        ))}
      </div>

      {/* オフィスタイトル（タブと同じ高さ） */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="text-blue-300 text-lg font-bold">
          🌌 福岡本社オフィス
        </div>
        <div className="text-blue-400 text-sm">
          出席: {seats.filter(seat => seat.occupied).length}名 / 全{seats.length}席
        </div>
      </div>

      {/* オフィス全体エリア（画面中央配置） */}
      <motion.div
        className="absolute"
        style={{
          left: officeCenter.x - 500,
          top: officeCenter.y - 380,
          width: 1000,
          height: 810
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* セクションA背景 */}
        <motion.div
          className="absolute bg-blue-900/20 rounded-lg border-2 border-dashed border-blue-400/50"
          style={{ left: 15, top: 15, width: 480, height: 600 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute top-2 left-2 text-blue-300 font-semibold text-sm">
            ✨ セクションA
          </div>
        </motion.div>

        {/* セクションB背景 */}
        <motion.div
          className="absolute bg-cyan-900/20 rounded-lg border-2 border-dashed border-cyan-400/50"
          style={{ left: 505, top: 15, width: 480, height: 600 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute top-2 left-2 text-cyan-300 font-semibold text-sm">
            ⭐ セクションB
          </div>
        </motion.div>

        {/* 共有エリア */}
        <motion.div
          className="absolute bg-purple-900/20 rounded-lg border-2 border-dashed border-purple-400/50"
          style={{ left: 350, top: 630, width: 300, height: 120 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="absolute top-2 left-2 text-purple-300 font-semibold text-sm">
            🛸 共有エリア・会議室
          </div>
        </motion.div>
      </motion.div>

      {/* 座席（実際のオフィス配置） */}
      <motion.div
        className="absolute"
        style={{
          left: officeCenter.x - 500,
          top: officeCenter.y - 380,
          width: 1000,
          height: 810
        }}
      >
        {seats.map((seat, index) => (
          <motion.div
            key={seat.id}
            className="absolute"
            style={{ left: seat.position.x, top: seat.position.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <SeatComponent seat={seat} />
          </motion.div>
        ))}
      </motion.div>

      {/* 銀河オフィス凡例 */}
      <motion.div
        className="absolute bottom-4 left-4 bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm rounded-lg border border-blue-400/50 p-4 text-white shadow-2xl"
        style={{
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3 className="font-semibold text-blue-300 mb-3 flex items-center">
          🌌 ステーション状態
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded shadow-lg" 
                 style={{ boxShadow: '0 0 8px rgba(34, 211, 238, 0.6)' }} />
            <span className="text-cyan-300">空きステーション</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-600 to-blue-400 rounded shadow-lg"
                 style={{ boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)' }} />
            <span className="text-blue-300">使用中ステーション</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-600 to-purple-400 rounded shadow-lg"
                 style={{ boxShadow: '0 0 8px rgba(147, 51, 234, 0.6)' }} />
            <span className="text-purple-300">予約済みステーション</span>
          </div>
        </div>
      </motion.div>

      {/* 量子チェックイン案内 */}
      <motion.div
        className="absolute bottom-4 right-4 bg-gradient-to-br from-cyan-900/80 to-blue-900/80 backdrop-blur-sm rounded-lg border border-cyan-400/50 p-4 max-w-xs text-white shadow-2xl"
        style={{
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)'
        }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h3 className="font-semibold mb-2 text-cyan-300 flex items-center">
          ⚡ 量子チェックイン
        </h3>
        <p className="text-sm text-cyan-200">
          ステーションの量子QRポート（⚡）をスキャンして、
          宇宙オフィスにチェックインしてください。
        </p>
      </motion.div>

      {/* メンバー詳細ツールチップ */}
      {selectedMember && (
        <MemberTooltip
          member={selectedMember}
          onClose={() => setSelectedMember(undefined)}
        />
      )}
    </div>
  );
}