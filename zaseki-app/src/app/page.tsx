'use client';

import { OfficeView } from '@/components/office/office-view';
import { StarmapView } from '@/components/starmap/starmap-view';
import { ViewSwitcher } from '@/components/ui/view-switcher';
import { useAppStore } from '@/stores/app-store';

export default function Home() {
  const { currentView } = useAppStore();

  const renderView = () => {
    switch (currentView) {
      case 'office':
        return <OfficeView />;
      case 'starmap':
        return <StarmapView />;
      default:
        return <OfficeView />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* ビュー切り替えコントロール */}
      <ViewSwitcher />
      
      {/* メインコンテンツ */}
      <main className="w-full h-full">
        {renderView()}
      </main>

      {/* アプリタイトル */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium bg-black bg-opacity-50 px-4 py-2 rounded-full">
        Zaseki - 座席管理システム
        <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">
          ハイブリッド
        </span>
      </div>
    </div>
  );
}
