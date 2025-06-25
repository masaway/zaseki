import { create } from 'zustand';
import { AppState, Member, Seat, Constellation, ViewMode } from '@/types';

interface AppStore extends AppState {
  setCurrentView: (view: ViewMode) => void;
  setSelectedMember: (member: Member | undefined) => void;
  updateMemberStatus: (id: string, status: Member['status']) => void;
  updateMemberComment: (id: string, comment: string) => void;
  occupySeat: (seatId: string, member: Member) => void;
  vacateSeat: (seatId: string) => void;
}

// Mock データ
const mockMembers: Member[] = [
  {
    id: '1',
    name: '田中太郎',
    avatar: '👨‍💼',
    department: 'エンジニアリング',
    role: 'フロントエンド',
    status: 'online',
    comment: '今日は集中して開発中！',
    project: 'WebApp'
  },
  {
    id: '2',
    name: '佐藤花子',
    avatar: '👩‍💻',
    department: 'エンジニアリング',
    role: 'バックエンド',
    status: 'busy',
    comment: 'API開発中です',
    project: 'WebApp'
  },
  {
    id: '3',
    name: '鈴木次郎',
    avatar: '👨‍🎨',
    department: 'デザイン',
    role: 'UIデザイナー',
    status: 'online',
    comment: 'プロトタイプ制作中',
    project: 'MobileApp'
  },
  {
    id: '4',
    name: '高橋三郎',
    avatar: '👨‍💼',
    department: 'マーケティング',
    role: 'マネージャー',
    status: 'away',
    comment: '会議中',
    project: 'Campaign'
  },
  {
    id: '5',
    name: '伊藤美咲',
    avatar: '👩‍🔬',
    department: 'エンジニアリング',
    role: 'データサイエンティスト',
    status: 'online',
    comment: 'データ分析中',
    project: 'Analytics'
  },
  // リモートワーカー
  {
    id: '6',
    name: '山田智子',
    avatar: '👩‍💻',
    department: 'エンジニアリング',
    role: 'フルスタック',
    status: 'online',
    comment: '在宅で集中開発中',
    project: 'WebApp',
    location: {
      id: 'location-1',
      type: 'remote',
      name: '渋谷区',
      city: '東京都',
      prefecture: '東京都',
      coordinates: { x: 700, y: 100 } // オフィス中央から東北方向
    }
  },
  {
    id: '7',
    name: '中村健太',
    avatar: '👨‍💻',
    department: 'マーケティング',
    role: 'データアナリスト',
    status: 'busy',
    comment: 'レポート作成中',
    project: 'Campaign',
    location: {
      id: 'location-2',
      type: 'remote',
      name: '横浜市',
      city: '神奈川県',
      prefecture: '神奈川県',
      coordinates: { x: 750, y: 150 } // オフィス中央から東北方向（東京の近く）
    }
  },
  // 追加のリモートワーカー
  {
    id: '8',
    name: '松本美穂',
    avatar: '👩‍🎨',
    department: 'デザイン',
    role: 'UXデザイナー',
    status: 'online',
    comment: 'ユーザー調査まとめ中',
    project: 'MobileApp',
    location: {
      id: 'location-3',
      type: 'remote',
      name: '大阪市',
      city: '大阪府',
      prefecture: '大阪府',
      coordinates: { x: 600, y: 200 } // オフィス中央から東方向
    }
  },
  {
    id: '9',
    name: '福岡太郎',
    avatar: '👨‍💼',
    department: '営業',
    role: 'セールス',
    status: 'away',
    comment: '商談対応中',
    project: 'Sales',
    location: {
      id: 'location-4',
      type: 'remote',
      name: '福岡市東区',
      city: '福岡県',
      prefecture: '福岡県',
      coordinates: { x: 400, y: 450 } // オフィス近郊（在宅勤務）
    }
  },
  // 追加のオフィスメンバー
  {
    id: '10',
    name: '加藤雄介',
    avatar: '👨‍💼',
    department: 'エンジニアリング',
    role: 'インフラエンジニア',
    status: 'online',
    comment: 'サーバーメンテナンス中',
    project: 'Infrastructure'
  },
  {
    id: '11',
    name: '木村美和',
    avatar: '👩‍💼',
    department: '人事',
    role: 'HRマネージャー',
    status: 'busy',
    comment: '採用面接中',
    project: 'HR'
  },
  {
    id: '12',
    name: '斎藤健一',
    avatar: '👨‍💻',
    department: 'エンジニアリング',
    role: 'DevOpsエンジニア',
    status: 'online',
    comment: 'CI/CD構築中',
    project: 'Infrastructure'
  }
];

const mockSeats: Seat[] = [
  // セクションA（10席中3人が座っている）
  {
    id: 'seat-1',
    number: 'A-01',
    floor: 1,
    section: 'A',
    position: { x: 80, y: 80 },
    occupied: true,
    occupiedBy: mockMembers[0], // 田中太郎
    qrCode: 'QR-A01'
  },
  {
    id: 'seat-2',
    number: 'A-02',
    floor: 1,
    section: 'A',
    position: { x: 120, y: 80 },
    occupied: false,
    qrCode: 'QR-A02'
  },
  {
    id: 'seat-3',
    number: 'A-03',
    floor: 1,
    section: 'A',
    position: { x: 160, y: 80 },
    occupied: true,
    occupiedBy: mockMembers[1], // 佐藤花子
    qrCode: 'QR-A03'
  },
  {
    id: 'seat-4',
    number: 'A-04',
    floor: 1,
    section: 'A',
    position: { x: 200, y: 80 },
    occupied: false,
    qrCode: 'QR-A04'
  },
  {
    id: 'seat-5',
    number: 'A-05',
    floor: 1,
    section: 'A',
    position: { x: 240, y: 80 },
    occupied: false,
    qrCode: 'QR-A05'
  },
  {
    id: 'seat-6',
    number: 'A-06',
    floor: 1,
    section: 'A',
    position: { x: 80, y: 120 },
    occupied: false,
    qrCode: 'QR-A06'
  },
  {
    id: 'seat-7',
    number: 'A-07',
    floor: 1,
    section: 'A',
    position: { x: 120, y: 120 },
    occupied: true,
    occupiedBy: mockMembers[4], // 伊藤美咲
    qrCode: 'QR-A07'
  },
  {
    id: 'seat-8',
    number: 'A-08',
    floor: 1,
    section: 'A',
    position: { x: 160, y: 120 },
    occupied: false,
    qrCode: 'QR-A08'
  },
  {
    id: 'seat-9',
    number: 'A-09',
    floor: 1,
    section: 'A',
    position: { x: 200, y: 120 },
    occupied: false,
    qrCode: 'QR-A09'
  },
  {
    id: 'seat-10',
    number: 'A-10',
    floor: 1,
    section: 'A',
    position: { x: 240, y: 120 },
    occupied: false,
    qrCode: 'QR-A10'
  },
  
  // セクションB（10席中5人が座っている）- セクションB枠内 (left: 50, top: 300, width: 300, height: 200)
  {
    id: 'seat-11',
    number: 'B-01',
    floor: 1,
    section: 'B',
    position: { x: 80, y: 330 }, // セクションB枠内
    occupied: true,
    occupiedBy: mockMembers[2], // 鈴木次郎
    qrCode: 'QR-B01'
  },
  {
    id: 'seat-12',
    number: 'B-02',
    floor: 1,
    section: 'B',
    position: { x: 120, y: 330 }, // セクションB枠内
    occupied: true,
    occupiedBy: mockMembers[3], // 高橋三郎
    qrCode: 'QR-B02'
  },
  {
    id: 'seat-13',
    number: 'B-03',
    floor: 1,
    section: 'B',
    position: { x: 160, y: 330 }, // セクションB枠内
    occupied: false,
    qrCode: 'QR-B03'
  },
  {
    id: 'seat-14',
    number: 'B-04',
    floor: 1,
    section: 'B',
    position: { x: 200, y: 330 }, // セクションB枠内
    occupied: true,
    occupiedBy: mockMembers[9], // 加藤雄介
    qrCode: 'QR-B04'
  },
  {
    id: 'seat-15',
    number: 'B-05',
    floor: 1,
    section: 'B',
    position: { x: 240, y: 330 }, // セクションB枠内
    occupied: true,
    occupiedBy: mockMembers[10], // 木村美和
    qrCode: 'QR-B05'
  },
  {
    id: 'seat-16',
    number: 'B-06',
    floor: 1,
    section: 'B',
    position: { x: 80, y: 370 }, // セクションB枠内
    occupied: false,
    qrCode: 'QR-B06'
  },
  {
    id: 'seat-17',
    number: 'B-07',
    floor: 1,
    section: 'B',
    position: { x: 120, y: 370 }, // セクションB枠内
    occupied: true,
    occupiedBy: mockMembers[11], // 斎藤健一
    qrCode: 'QR-B07'
  },
  {
    id: 'seat-18',
    number: 'B-08',
    floor: 1,
    section: 'B',
    position: { x: 160, y: 370 }, // セクションB枠内
    occupied: false,
    qrCode: 'QR-B08'
  },
  {
    id: 'seat-19',
    number: 'B-09',
    floor: 1,
    section: 'B',
    position: { x: 200, y: 370 }, // セクションB枠内
    occupied: false,
    qrCode: 'QR-B09'
  },
  {
    id: 'seat-20',
    number: 'B-10',
    floor: 1,
    section: 'B',
    position: { x: 240, y: 370 }, // セクションB枠内
    occupied: false,
    qrCode: 'QR-B10'
  }
];

const mockConstellations: Constellation[] = [
  {
    id: 'constellation-1',
    name: 'WebApp開発チーム',
    members: [mockMembers[0], mockMembers[1], mockMembers[5]], // 田中太郎（オフィス）, 佐藤花子（オフィス）, 山田智子（リモート）
    connections: [
      { from: '1', to: '2', type: 'project' },
      { from: '1', to: '6', type: 'project' },
      { from: '2', to: '6', type: 'project' }
    ],
    position: { x: 650, y: 120 }, // 中央オフィスから北東
    color: '#3B82F6'
  },
  {
    id: 'constellation-2',
    name: 'マーケティング・営業チーム',
    members: [mockMembers[3], mockMembers[6], mockMembers[8]], // 高橋三郎（オフィス）, 中村健太（リモート）, 福岡太郎（リモート）
    connections: [
      { from: '4', to: '7', type: 'project' },
      { from: '4', to: '9', type: 'department' }
    ],
    position: { x: 350, y: 420 }, // 中央オフィスから南西
    color: '#EF4444'
  },
  {
    id: 'constellation-3',
    name: 'デザイン・データチーム',
    members: [mockMembers[2], mockMembers[4], mockMembers[7]], // 鈴木次郎（オフィス）, 伊藤美咲（オフィス）, 松本美穂（リモート）
    connections: [
      { from: '3', to: '5', type: 'department' },
      { from: '3', to: '8', type: 'project' }
    ],
    position: { x: 550, y: 180 }, // 中央オフィスから東
    color: '#10B981'
  },
  {
    id: 'constellation-4',
    name: 'インフラ・サポートチーム',
    members: [mockMembers[9], mockMembers[10], mockMembers[11]], // 加藤雄介（オフィス）, 木村美和（オフィス）, 斎藤健一（オフィス）
    connections: [
      { from: '10', to: '12', type: 'department' }, // 加藤雄介 - 斎藤健一（共にインフラ）
      { from: '10', to: '11', type: 'project' }, // 加藤雄介 - 木村美和（サポート業務）
    ],
    position: { x: 300, y: 300 }, // 中央オフィスから南西
    color: '#8B5CF6'
  }
];

export const useAppStore = create<AppStore>((set) => ({
  members: mockMembers,
  seats: mockSeats,
  constellations: mockConstellations,
  currentView: 'office',
  selectedMember: undefined,

  setCurrentView: (view) => set({ currentView: view }),
  
  setSelectedMember: (member) => set({ selectedMember: member }),
  
  updateMemberStatus: (id, status) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, status } : member
      ),
    })),
  
  updateMemberComment: (id, comment) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, comment } : member
      ),
    })),
  
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
}));