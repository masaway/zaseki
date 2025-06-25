'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Star } from '../constellation/star';
import { MemberTooltip } from '../constellation/member-tooltip';
import { ProjectConnections } from './project-connections';
import { Member } from '@/types';
import { calculateRegionalPosition, getOfficeCenter, transformOfficeLayout, getRegionalZones, getZoneByPrefecture } from '@/utils/fan-layout';

export function StarmapView() {
  const { seats, constellations, selectedMember, setSelectedMember } = useAppStore();
  const [backgroundStars, setBackgroundStars] = useState<Array<{left: number, top: number, duration: number, delay: number}>>([]);
  const [screenSize, setScreenSize] = useState({ width: 1024, height: 768 });

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

  // オフィスメンバー（座席に座っている人）を取得し、座席配置を縮小してオフィスゾーンに配置
  const officeMembers = seats
    .filter(seat => seat.occupied && seat.occupiedBy)
    .map(seat => ({
      member: seat.occupiedBy!,
      // 座席位置をオフィスゾーン内に縮小配置
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
    <div className="relative w-full h-full bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 overflow-hidden">
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

      {/* オフィスゾーン */}
      <motion.div
        className="absolute bg-blue-900 bg-opacity-40 rounded-lg border-2 border-blue-400 border-opacity-60"
        style={{
          left: officeCenter.x - 330,
          top: officeCenter.y - 150,
          width: 660,
          height: 300
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-blue-300 text-sm font-bold">
            福岡本社オフィス
          </div>
          <div className="text-blue-400 text-xs">
            出席: {officeMembers.length}名
          </div>
        </div>
      </motion.div>


      {/* オフィスメンバー（座席位置での星表示） */}
      <div className="absolute inset-0">
        {officeMembers.map(({ member, position }) => (
          <motion.div
            key={member.id}
            className="absolute"
            style={{
              left: position.x - 40, // 新しいサイズ分を引いて調整 (80px / 2)
              top: position.y - 40,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Star
              member={member}
              color="#3B82F6"
              onClick={() => setSelectedMember(
                selectedMember?.id === member.id ? undefined : member
              )}
              isSelected={selectedMember?.id === member.id}
              isConnected={connectedMemberIds.includes(member.id)}
            />
            {/* オフィスメンバーラベル */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-blue-300 text-xs font-medium">
                {member.name}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* リモートメンバー（地域ゾーン配置） */}
      <div className="absolute inset-0">
        {remoteMembers.map(({ member, constellation, zoneName, position }) => (
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

      {/* メンバー詳細ツールチップ */}
      {selectedMember && (
        <MemberTooltip
          member={selectedMember}
          onClose={() => setSelectedMember(undefined)}
        />
      )}

      {/* 凡例 */}
      <motion.div
        className="absolute bottom-4 left-4 bg-black bg-opacity-60 rounded-lg p-4 text-white"
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