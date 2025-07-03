'use client';

import { motion } from 'framer-motion';
import { Building, Stars } from 'lucide-react';
import { ViewMode } from '@/types';
import { useAppStore } from '@/stores/app-store';
import { clsx } from 'clsx';

export function ViewSwitcher() {
  const { currentView, setCurrentView } = useAppStore();

  const views = [
    { id: 'office' as ViewMode, label: 'オフィス', icon: Building },
    { id: 'starmap' as ViewMode, label: 'スターマップ', icon: Stars },
  ];

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-2 flex space-x-1">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <motion.button
              key={view.id}
              onClick={() => setCurrentView(view.id)}
              className={clsx(
                'relative px-4 py-2 rounded-md transition-colors flex items-center space-x-2',
                currentView === view.id
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* 背景アニメーション */}
              {currentView === view.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md"
                  layoutId="activeView"
                  transition={{ duration: 0.3 }}
                />
              )}

              {/* アイコンとテキスト */}
              <div className="relative flex items-center space-x-2">
                <Icon size={16} />
                <span className="text-sm font-medium">{view.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}