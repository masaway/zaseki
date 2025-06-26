'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Star } from '../constellation/star';
import { MemberTooltip } from '../constellation/member-tooltip';
import { ProjectConnections } from './project-connections';
import { Seat } from '@/types';
import { calculateRegionalPosition, getOfficeCenter, transformOfficeLayout, getZoneByPrefecture, calculateGalaxyPosition } from '@/utils/fan-layout';
import { Monitor, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useZoom } from '@/hooks/use-zoom';

interface CompactSeatProps {
  seat: Seat;
  position: { x: number; y: number };
  scale?: number;
}

function CompactSeat({ seat, position, scale = 0.4 }: CompactSeatProps) {
  const { setSelectedMember } = useAppStore();

  const handleSeatClick = () => {
    if (seat.occupiedBy) {
      setSelectedMember(seat.occupiedBy);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: position.x - (16 * scale),
        top: position.y - (12 * scale),
        transform: `scale(${scale})`,
      }}
      onClick={handleSeatClick}
      whileHover={{ scale: scale * 1.1 }}
      whileTap={{ scale: scale * 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 座席番号 */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-300">
        {seat.number}
      </div>

      {/* デスク */}
      <div
        className={clsx(
          'w-8 h-6 rounded border transition-colors relative',
          seat.occupied
            ? 'bg-blue-600 border-blue-400'
            : 'bg-green-600 border-green-400'
        )}
      >
        {/* モニター */}
        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2">
          <Monitor size={6} className="text-blue-200" />
        </div>

        {/* ステータスインジケーター */}
        <div
          className={clsx(
            'absolute top-0.5 right-0.5 w-1 h-1 rounded-full',
            seat.occupied ? 'bg-blue-300' : 'bg-green-300'
          )}
        />
      </div>

      {/* 椅子 */}
      <div
        className={clsx(
          'absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-4 h-3 rounded border transition-colors',
          seat.occupied
            ? 'bg-blue-500 border-blue-300'
            : 'bg-green-500 border-green-300'
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
              <span className="text-xs">{seat.occupiedBy.avatar}</span>
            ) : (
              <User size={6} className="text-blue-200" />
            )}
          </motion.div>
        )}
      </div>

      {/* ホバー時の詳細情報 */}
      <div className="opacity-0 group-hover:opacity-100 absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity z-10">
        {seat.occupied && seat.occupiedBy ? (
          <div>
            <div className="font-semibold">{seat.occupiedBy.name}</div>
            <div className="text-gray-300">{seat.occupiedBy.department}</div>
            <div className="text-blue-300">{seat.occupiedBy.status}</div>
          </div>
        ) : (
          '空席'
        )}
      </div>
    </motion.div>
  );
}

export function StarmapView() {
  const { seats, constellations, selectedMember, setSelectedMember } = useAppStore();
  const [backgroundStars, setBackgroundStars] = useState<Array<{left: number, top: number, duration: number, delay: number}>>([]);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });
  
  const {
    zoomState,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetZoom,
    zoomIn,
    zoomOut,
  } = useZoom();

  useEffect(() => {
    // 背景の星々の位置を固定値で生成（ハイドレーションエラー対策）
    const stars = Array.from({ length: 80 }).map((_, i) => ({
      left: ((i * 7) % 100), // 疑似ランダムな固定値
      top: ((i * 13) % 100), // 疑似ランダムな固定値
      duration: 2 + ((i * 3) % 3), // 2-5秒の範囲
      delay: (i * 0.1) % 2, // 0-2秒の遅延
    }));
    setBackgroundStars(stars);

    // 画面サイズを取得
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

  // 福岡オフィスの中心座標を計算
  const officeCenter = getOfficeCenter(screenSize.width, screenSize.height);

  // オフィスメンバー（座席に座っている人）を取得し、実際の座席配置を縮小してオフィスゾーンに配置
  const officeMembers = seats
    .filter(seat => seat.occupied && seat.occupiedBy)
    .map(seat => ({
      member: seat.occupiedBy!,
      // 実際の座席位置をオフィスゾーン内に縮小配置
      position: transformOfficeLayout(seat.position, officeCenter)
    }));

  // リモートメンバーを地域ゾーンごとにグループ化
  const remoteMembers = (() => {
    const allRemoteMembers = constellations.flatMap(constellation => 
      constellation.members.filter(member => 
        !officeMembers.some(office => office.member.id === member.id) && member.location
      ).map(member => ({
        member,
        constellation,
        prefecture: member.location!.prefecture!
      }))
    );
    
    // 地域ゾーンごとにグループ化
    const groupedByZone: Record<string, typeof allRemoteMembers> = {};
    allRemoteMembers.forEach(member => {
      const zoneName = getZoneByPrefecture(member.prefecture) || 'central';
      if (!groupedByZone[zoneName]) {
        groupedByZone[zoneName] = [];
      }
      groupedByZone[zoneName].push(member);
    });
    
    // 各ゾーン内で座標を計算
    return Object.entries(groupedByZone).flatMap(([zoneName, members]) => 
      members.map((memberData, index) => ({
        member: memberData.member,
        constellation: memberData.constellation,
        zoneName,
        position: calculateRegionalPosition(
          memberData.prefecture,
          index,
          members.length,
          screenSize.width,
          screenSize.height
        )
      }))
    );
  })();

  // 全メンバーの位置情報を統合（プロジェクト連携線用）
  const allMembersWithPositions = [
    ...officeMembers,
    ...remoteMembers
  ];

  // 接続されているメンバーのIDを取得
  const connectedMemberIds = selectedMember 
    ? allMembersWithPositions
        .filter(({ member }) => member.project === selectedMember.project && member.id !== selectedMember.id)
        .map(({ member }) => member.id)
    : [];

  return (
    <div 
      className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ズームコントロール */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black bg-opacity-60 rounded-lg p-2">
        <button
          onClick={zoomIn}
          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors"
          title="ズームイン"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors"
          title="ズームアウト"
        >
          -
        </button>
        <button
          onClick={resetZoom}
          className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center justify-center transition-colors text-xs"
          title="リセット"
        >
          ↺
        </button>
        <div className="text-white text-xs text-center mt-1">
          {Math.round(zoomState.scale * 100)}%
        </div>
      </div>

      {/* ズーム可能なコンテンツ */}
      <div
        className="absolute inset-0 origin-top-left"
        style={{
          transform: `scale(${zoomState.scale}) translate(${zoomState.translateX}px, ${zoomState.translateY}px)`,
          transition: 'none',
        }}
      >
      {/* 背景の星々 */}
      <div className="absolute inset-0">
        {backgroundStars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
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

      {/* オフィスゾーン（銀河エリア） */}
      <motion.div
        className="absolute"
        style={{
          left: officeCenter.x - 350,
          top: officeCenter.y - 350,
          width: 700,
          height: 700
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* 銀河の渦巻き背景 */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(30, 58, 138, 0.2) 0%, rgba(30, 64, 175, 0.1) 50%, transparent 100%)'
          }}
        >
          {/* 銀河の渦巻き腕 */}
          {[0, 1, 2].map((armIndex) => (
            <motion.div
              key={armIndex}
              className="absolute inset-0"
              initial={{ opacity: 0, rotate: armIndex * 120 }}
              animate={{ opacity: 0.3, rotate: armIndex * 120 + 360 }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: armIndex * 0.5
              }}
            >
              <div
                className="absolute w-full h-full"
                style={{
                  background: `conic-gradient(from ${armIndex * 120}deg, transparent 0deg, rgba(59, 130, 246, 0.3) 30deg, transparent 60deg, transparent 120deg, rgba(59, 130, 246, 0.2) 150deg, transparent 180deg)`
                }}
              />
            </motion.div>
          ))}
          
          {/* 銀河中心の明るい領域 */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, transparent 100%)'
            }}
          />
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-blue-300 text-sm font-bold">
            🌌 福岡本社銀河オフィス
          </div>
          <div className="text-blue-400 text-xs">
            出席: {seats.filter(seat => seat.occupied).length}名 / 全{seats.length}席
          </div>
        </div>
      </motion.div>


      {/* オフィス座席（実際の配置を縮小表示） */}
      <div className="absolute inset-0">
        {seats.map((seat) => {
          const position = transformOfficeLayout(seat.position, officeCenter);
          return (
            <CompactSeat
              key={seat.id}
              seat={seat}
              position={position}
              scale={0.5}
            />
          );
        })}
      </div>

      {/* リモートメンバー（地域ゾーン配置） */}
      <div className="absolute inset-0">
        {remoteMembers.map(({ member, position }) => (
          <motion.div
            key={member.id}
            className="absolute"
            style={{
              left: position.x - 40, // 新しいサイズ分を引いて調整 (80px / 2)
              top: position.y - 40,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Star
              member={member}
              color="#8B5CF6"
              onClick={() => setSelectedMember(
                selectedMember?.id === member.id ? undefined : member
              )}
              isSelected={selectedMember?.id === member.id}
              isConnected={connectedMemberIds.includes(member.id)}
            />
            {/* メンバー情報ラベル */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-purple-300 text-xs font-medium">
                {member.name}
              </div>
              <div className="text-purple-400 text-xs opacity-80">
                {member.location?.prefecture}
              </div>
            </div>
          </motion.div>
        ))}
      </div>


      {/* プロジェクト連携線エフェクト */}
      {selectedMember && (
        <ProjectConnections
          selectedMember={selectedMember}
          allMembers={allMembersWithPositions}
        />
      )}
      </div>

      {/* ズーム対象外の固定UI要素 */}
      {/* メンバー詳細ツールチップ */}
      {selectedMember && (
        <MemberTooltip
          member={selectedMember}
          onClose={() => setSelectedMember(undefined)}
        />
      )}

      {/* 凡例 */}
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
    </div>
  );
}