'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/app-store';
import { SeatComponent } from './seat-component';
import { MemberTooltip } from '../constellation/member-tooltip';

export function OfficeView() {
  const { seats, selectedMember, setSelectedMember } = useAppStore();

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden">
      {/* オフィスレイアウト背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
        {/* グリッドパターン */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* セクション区切り */}
      <div className="absolute inset-0">
        {/* セクションA */}
        <motion.div
          className="absolute bg-blue-100 bg-opacity-50 rounded-lg border-2 border-dashed border-blue-300"
          style={{ left: 50, top: 50, width: 300, height: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute top-2 left-2 text-blue-600 font-semibold text-sm">
            セクションA
          </div>
        </motion.div>

        {/* セクションB */}
        <motion.div
          className="absolute bg-green-100 bg-opacity-50 rounded-lg border-2 border-dashed border-green-300"
          style={{ left: 50, top: 300, width: 300, height: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute top-2 left-2 text-green-600 font-semibold text-sm">
            セクションB
          </div>
        </motion.div>

        {/* 会議室 */}
        <motion.div
          className="absolute bg-purple-100 bg-opacity-50 rounded-lg border-2 border-dashed border-purple-300"
          style={{ left: 400, top: 100, width: 200, height: 150 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="absolute top-2 left-2 text-purple-600 font-semibold text-sm">
            会議室
          </div>
        </motion.div>
      </div>

      {/* 座席 */}
      <div className="absolute inset-0">
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
      </div>

      {/* 凡例 */}
      <motion.div
        className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3 className="font-semibold text-gray-800 mb-2">凡例</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>空席</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <span>使用中</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded" />
            <span>予約済み</span>
          </div>
        </div>
      </motion.div>

      {/* QRコードスキャン案内 */}
      <motion.div
        className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-lg shadow-lg p-4 max-w-xs"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h3 className="font-semibold mb-2">📱 チェックイン方法</h3>
        <p className="text-sm">
          座席のQRコードをスマートフォンで読み取って、チェックインしてください。
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