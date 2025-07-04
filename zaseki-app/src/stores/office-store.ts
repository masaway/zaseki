import { create } from 'zustand';
import { supabaseApi, SeatMaster } from '@/lib/supabase';
import { Seat, Member } from '@/types';

interface OfficeState {
  seats: Seat[];
  selectedMember: Member | undefined;
  isLoading: boolean;
  error: string | null;
}

interface OfficeStore extends OfficeState {
  setSelectedMember: (member: Member | undefined) => void;
  occupySeat: (seatId: string, member: Member) => void;
  vacateSeat: (seatId: string) => void;
  loadSeats: () => Promise<void>;
  refreshSeats: () => Promise<void>;
}

// SupabaseのSeatMasterを既存のSeat型に変換
const convertSupabaseSeatToSeat = (seatMaster: SeatMaster): Seat => {
  // orientation を座席番号から推定（簡易的な実装）
  const getOrientation = (seatId: string): 'up' | 'down' | 'left' | 'right' => {
    if (seatId.includes('T1') || seatId.includes('T2') || seatId.includes('T3') || 
        seatId.includes('4-1') || seatId.includes('4-2') || seatId.includes('4-3') ||
        seatId.includes('3-1') || seatId.includes('3-2') || seatId.includes('3-3')) {
      return 'down';
    }
    return 'up';
  };

  return {
    id: seatMaster.seat_id,
    number: seatMaster.seat_id,
    floor: 1, // デフォルト値
    section: seatMaster.section || 'A',
    position: {
      x: seatMaster.x_position || 0,
      y: seatMaster.y_position || 0
    },
    occupied: false, // 初期状態は空席（別途利用状況で更新）
    occupiedBy: undefined,
    qrCode: seatMaster.seat_id,
    orientation: getOrientation(seatMaster.seat_id)
  };
};

export const useOfficeStore = create<OfficeStore>((set, get) => ({
  // 初期状態
  seats: [],
  selectedMember: undefined,
  isLoading: false,
  error: null,

  // Actions
  setSelectedMember: (member) => set({ selectedMember: member }),

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

  loadSeats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Supabaseから座席マスタデータを取得
      const seatMasters = await supabaseApi.getAllSeats();
      
      if (seatMasters.length === 0) {
        throw new Error('座席データが見つかりませんでした');
      }

      // Seat型に変換
      const seats = seatMasters.map(convertSupabaseSeatToSeat);

      // 各座席の利用状況を取得（並列処理、エラーは静かに処理）
      const seatsWithUsage = await Promise.allSettled(
        seats.map(async (seat) => {
          const usage = await supabaseApi.getLatestSeatUsage(seat.id);
          
          if (usage) {
            // 利用履歴がある場合は占有状態とする
            const occupiedBy: Member = {
              id: usage.user_name, // 暫定的にユーザー名をIDとして使用
              name: usage.user_name,
              avatar: '👤', // デフォルトアバター
              department: usage.department,
              role: 'メンバー', // デフォルト役職
              status: 'online' as const,
              comment: usage.comment || '',
              project: usage.projects.join(', ') || '未設定'
            };

            return {
              ...seat,
              occupied: true,
              occupiedBy
            };
          }
          
          return seat;
        })
      );

      // 成功した結果のみを取得
      const validSeats = seatsWithUsage
        .filter((result): result is PromiseFulfilledResult<Seat> => result.status === 'fulfilled')
        .map(result => result.value);

      set({ 
        seats: validSeats,
        isLoading: false,
        error: null 
      });

    } catch (error) {
      console.error('座席データの読み込みに失敗:', error);
      set({ 
        error: error instanceof Error ? error.message : '座席データの読み込みに失敗しました',
        isLoading: false 
      });
    }
  },

  refreshSeats: async () => {
    const { loadSeats } = get();
    await loadSeats();
  }
}));