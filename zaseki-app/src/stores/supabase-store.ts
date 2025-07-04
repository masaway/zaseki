import { create } from 'zustand';
import { supabaseApi, Member, SeatMaster, Project, Constellation } from '@/lib/supabase';
import { AppState, Seat, ViewMode } from '@/types';

interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface SupabaseAppStore extends AppState {
  zoomState: ZoomState;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentView: (view: ViewMode) => void;
  setSelectedMember: (member: Member | undefined) => void;
  updateMemberStatus: (id: string, status: Member['status']) => void;
  updateMemberComment: (id: string, comment: string) => void;
  occupySeat: (seatId: string, member: Member) => void;
  vacateSeat: (seatId: string) => void;
  setZoomState: (zoomState: ZoomState) => void;
  resetZoom: () => void;
  
  // Supabase data loading actions
  loadAllData: () => Promise<void>;
  loadMembers: () => Promise<void>;
  loadSeats: () => Promise<void>;
  loadProjects: () => Promise<void>;
  loadConstellations: () => Promise<void>;
}

// Supabaseデータを既存の型に変換する関数
const convertSupabaseSeatToAppSeat = (seatMaster: SeatMaster, members: Member[]): Seat => {
  return {
    id: seatMaster.seat_id,
    number: seatMaster.seat_id,
    floor: 1, // デフォルト値
    section: seatMaster.section || 'A',
    position: {
      x: seatMaster.x_position || 0,
      y: seatMaster.y_position || 0
    },
    occupied: false, // 初期状態は空席
    occupiedBy: undefined,
    qrCode: seatMaster.seat_id,
    orientation: 'down' as const // デフォルト値
  };
};

const convertSupabaseMemberToAppMember = (member: Member, projects: Project[] = []): any => {
  const location = member.location_type === 'remote' && member.location_coordinates_x && member.location_coordinates_y ? {
    id: `location-${member.id}`,
    type: 'remote' as const,
    name: member.location_name || '',
    city: member.location_prefecture || '',
    prefecture: member.location_prefecture || '',
    coordinates: {
      x: member.location_coordinates_x,
      y: member.location_coordinates_y
    }
  } : undefined;

  return {
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    department: member.department,
    role: member.role,
    status: member.status,
    comment: member.comment,
    project: projects[0]?.id || 'Unknown', // 最初のプロジェクトを使用
    location
  };
};

const convertSupabaseConstellationToAppConstellation = (
  constellation: Constellation, 
  members: Member[]
): any => {
  return {
    id: constellation.id,
    name: constellation.name,
    members: members.map(member => convertSupabaseMemberToAppMember(member)),
    connections: [], // TODO: 接続情報の管理方法を検討
    position: {
      x: constellation.position_x,
      y: constellation.position_y
    },
    color: constellation.color
  };
};

export const useSupabaseAppStore = create<SupabaseAppStore>((set, get) => ({
  // 初期状態
  members: [],
  seats: [],
  constellations: [],
  currentView: 'office',
  selectedMember: undefined,
  zoomState: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  isLoading: false,
  error: null,

  // Actions
  setCurrentView: (view) => set({ currentView: view }),
  
  setSelectedMember: (member) => set({ selectedMember: member }),
  
  updateMemberStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await supabaseApi.updateMemberStatus(id, status);
      
      if (success) {
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id ? { ...member, status } : member
          ),
          isLoading: false
        }));
      } else {
        set({ error: 'ステータス更新に失敗しました', isLoading: false });
      }
    } catch (error) {
      set({ error: 'ステータス更新中にエラーが発生しました', isLoading: false });
    }
  },
  
  updateMemberComment: async (id, comment) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await supabaseApi.updateMemberComment(id, comment);
      
      if (success) {
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id ? { ...member, comment } : member
          ),
          isLoading: false
        }));
      } else {
        set({ error: 'コメント更新に失敗しました', isLoading: false });
      }
    } catch (error) {
      set({ error: 'コメント更新中にエラーが発生しました', isLoading: false });
    }
  },
  
  occupySeat: (seatId, member) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? { ...seat, occupied: true, occupiedBy: member }
          : seat
      ),
    })),
  
  vacateSeat: (seatId) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? { ...seat, occupied: false, occupiedBy: undefined }
          : seat
      ),
    })),

  setZoomState: (zoomState) => set({ zoomState }),
  
  resetZoom: () => set({ 
    zoomState: { scale: 1, translateX: 0, translateY: 0 } 
  }),

  // Supabase data loading actions
  loadAllData: async () => {
    const { loadMembers, loadSeats, loadProjects, loadConstellations } = get();
    
    set({ isLoading: true, error: null });
    
    try {
      await Promise.all([
        loadMembers(),
        loadSeats(),
        loadProjects(),
        loadConstellations()
      ]);
    } catch (error) {
      set({ error: 'データの読み込みに失敗しました', isLoading: false });
    }
  },

  loadMembers: async () => {
    try {
      const members = await supabaseApi.getAllMembers();
      const membersWithProjects = await Promise.all(
        members.map(async (member) => {
          const projects = await supabaseApi.getMemberProjects(member.id);
          return convertSupabaseMemberToAppMember(member, projects);
        })
      );
      
      set({ members: membersWithProjects });
    } catch (error) {
      console.error('メンバーデータの読み込みに失敗:', error);
      throw error;
    }
  },

  loadSeats: async () => {
    try {
      const seatMasters = await supabaseApi.getAllSeats();
      const { members } = get();
      
      const seats = seatMasters.map(seatMaster => 
        convertSupabaseSeatToAppSeat(seatMaster, members)
      );
      
      set({ seats });
    } catch (error) {
      console.error('座席データの読み込みに失敗:', error);
      throw error;
    }
  },

  loadProjects: async () => {
    try {
      await supabaseApi.getAllProjects();
      // プロジェクトデータは現在アプリレベルでは直接使用していないため、
      // 必要に応じて状態に追加
    } catch (error) {
      console.error('プロジェクトデータの読み込みに失敗:', error);
      throw error;
    }
  },

  loadConstellations: async () => {
    try {
      const constellations = await supabaseApi.getAllConstellations();
      const constellationsWithMembers = await Promise.all(
        constellations.map(async (constellation) => {
          const members = await supabaseApi.getConstellationMembers(constellation.id);
          return convertSupabaseConstellationToAppConstellation(constellation, members);
        })
      );
      
      set({ constellations: constellationsWithMembers });
    } catch (error) {
      console.error('コンステレーションデータの読み込みに失敗:', error);
      throw error;
    }
  }
}));

// 開発時のモード切り替え用フラグ
// 環境変数でSupabaseモードとMockモードを切り替え
export const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

// 条件付きエクスポート：環境に応じてSupabaseストアまたはMockストアを使用
export { useAppStore } from './app-store';

// Supabaseモードを強制的に使用したい場合の明示的エクスポート
export { useSupabaseAppStore };