'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Member } from '@/types';

interface MemberTooltipProps {
  member: Member;
  onClose: () => void;
}

export function MemberTooltip({ member, onClose }: MemberTooltipProps) {

  return (
    <motion.div
      className="fixed top-4 right-4 bg-white rounded-lg shadow-xl p-6 max-w-sm z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X size={16} />
      </button>

      {/* メンバー情報 */}
      <div className="flex items-start space-x-4">
        {/* アバター */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {member.avatar || member.name.charAt(0)}
        </div>

        {/* 詳細情報 */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
          
          {/* 部署・プロジェクト情報 */}
          <div className="mt-2 space-y-1">
            <div className="text-sm">
              <span className="text-gray-500">部署:</span>
              <span className="ml-2 text-gray-800">{member.department}</span>
            </div>
            {member.project && (
              <div className="text-sm">
                <span className="text-gray-500">プロジェクト:</span>
                <span className="ml-2 text-gray-800">{member.project}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* コメント */}
      {member.comment && (
        <motion.div
          className="mt-4 p-3 bg-blue-50 rounded-lg relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* 吹き出しの三角形 */}
          <div className="absolute -top-2 left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-blue-50" />
          
          <p className="text-sm text-gray-700 italic">
            &quot;{member.comment}&quot;
          </p>
        </motion.div>
      )}

      {/* アクションボタン */}
      <div className="mt-4 flex space-x-2">
        <motion.button
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          メッセージ
        </motion.button>
        <motion.button
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          詳細
        </motion.button>
      </div>
    </motion.div>
  );
}