'use client';

import { motion } from 'framer-motion';
import { Member } from '@/types';

interface ProjectConnectionsProps {
  selectedMember: Member;
  allMembers: Array<{ member: Member; position: { x: number; y: number } }>;
}

export function ProjectConnections({ selectedMember, allMembers }: ProjectConnectionsProps) {
  if (!selectedMember?.project) return null;

  // 選択されたメンバーの位置を取得
  const selectedMemberData = allMembers.find(m => m.member.id === selectedMember.id);
  if (!selectedMemberData) return null;

  // 同じプロジェクトのメンバーを取得（選択されたメンバーも含む）
  const projectMembers = allMembers.filter(
    ({ member }) => member.project === selectedMember.project
  );

  if (projectMembers.length <= 1) return null;

  // 選択されたメンバーから開始して、順序を決める
  const selectedIndex = projectMembers.findIndex(({ member }) => member.id === selectedMember.id);
  const orderedMembers = [
    ...projectMembers.slice(selectedIndex),
    ...projectMembers.slice(0, selectedIndex)
  ];

  // 連続する線分を作成
  const connectionLines = [];
  for (let i = 0; i < orderedMembers.length - 1; i++) {
    const fromMember = orderedMembers[i];
    const toMember = orderedMembers[i + 1];
    connectionLines.push({ from: fromMember, to: toMember, index: i });
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        {connectionLines.map(({ from, to, index }) => {
          const pathId = `connection-${from.member.id}-${to.member.id}`;
          
          return (
            <motion.line
              key={pathId}
              x1={from.position.x} // アイコンの中心座標
              y1={from.position.y}
              x2={to.position.x}
              y2={to.position.y}
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
              initial={{ 
                pathLength: 0,
                opacity: 0 
              }}
              animate={{ 
                pathLength: 1,
                opacity: 0.7 
              }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
            />
          );
        })}
        
        {/* 選択されたメンバーから線が伸びるパルスエフェクト */}
        <motion.circle
          cx={selectedMemberData.position.x}
          cy={selectedMemberData.position.y}
          r="40"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          initial={{ 
            scale: 0,
            opacity: 0.8 
          }}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.8, 0.3, 0.8] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* プロジェクト名の表示 */}
      <motion.div
        className="absolute bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
        style={{
          left: selectedMemberData.position.x - 40, // アイコン中心から調整
          top: selectedMemberData.position.y - 85, // アイコン上部
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {selectedMember.project}
      </motion.div>
    </div>
  );
}