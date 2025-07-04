import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useSupabaseAppStore } from '@/stores/supabase-store';

// 環境変数でSupabaseモードを判定
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

/**
 * データストアの統一インターフェース
 * 環境変数に応じてSupabaseストアまたはMockストアを使用
 */
export const useDataStore = () => {
  const mockStore = useAppStore();
  const supabaseStore = useSupabaseAppStore();
  
  // 初期データ読み込み（Supabaseモードの場合のみ）
  useEffect(() => {
    if (USE_SUPABASE && supabaseStore.members.length === 0) {
      supabaseStore.loadAllData();
    }
  }, [supabaseStore, USE_SUPABASE]);

  // 使用するストアを返す
  if (USE_SUPABASE) {
    return {
      ...supabaseStore,
      isSupabaseMode: true,
      isMockMode: false
    };
  } else {
    return {
      ...mockStore,
      isSupabaseMode: false,
      isMockMode: true,
      isLoading: false,
      error: null,
      loadAllData: async () => {}, // Mock用のダミー関数
      loadMembers: async () => {},
      loadSeats: async () => {},
      loadProjects: async () => {},
      loadConstellations: async () => {}
    };
  }
};

/**
 * Supabaseストアを明示的に使用するフック
 * 管理画面等で強制的にSupabaseモードを使いたい場合に使用
 */
export const useSupabaseStore = () => {
  const store = useSupabaseAppStore();
  
  useEffect(() => {
    if (store.members.length === 0) {
      store.loadAllData();
    }
  }, [store]);

  return {
    ...store,
    isSupabaseMode: true,
    isMockMode: false
  };
};

/**
 * Mockストアを明示的に使用するフック
 * デモモードやオフラインモードで使用
 */
export const useMockStore = () => {
  const store = useAppStore();
  
  return {
    ...store,
    isSupabaseMode: false,
    isMockMode: true,
    isLoading: false,
    error: null,
    loadAllData: async () => {},
    loadMembers: async () => {},
    loadSeats: async () => {},
    loadProjects: async () => {},
    loadConstellations: async () => {}
  };
};