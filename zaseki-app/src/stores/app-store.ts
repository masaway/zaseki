import { create } from "zustand";
import { AppState, Member, Seat, Constellation, ViewMode } from "@/types";

interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface AppStore extends AppState {
  zoomState: ZoomState;
  setCurrentView: (view: ViewMode) => void;
  setSelectedMember: (member: Member | undefined) => void;
  updateMemberStatus: (id: string, status: Member["status"]) => void;
  updateMemberComment: (id: string, comment: string) => void;
  occupySeat: (seatId: string, member: Member) => void;
  vacateSeat: (seatId: string) => void;
  setZoomState: (zoomState: ZoomState) => void;
  resetZoom: () => void;
}

// Mock データ
const mockMembers: Member[] = [
  {
    id: "1",
    name: "田中太郎",
    avatar: "👨‍💼",
    department: "エンジニアリング",
    role: "フロントエンド",
    status: "online",
    comment: "今日は集中して開発中！",
    project: "WebApp",
  },
  {
    id: "2",
    name: "佐藤花子",
    avatar: "👩‍💻",
    department: "エンジニアリング",
    role: "バックエンド",
    status: "busy",
    comment: "API開発中です",
    project: "WebApp",
  },
  {
    id: "3",
    name: "鈴木次郎",
    avatar: "👨‍🎨",
    department: "デザイン",
    role: "UIデザイナー",
    status: "online",
    comment: "プロトタイプ制作中",
    project: "MobileApp",
  },
  {
    id: "4",
    name: "高橋三郎",
    avatar: "👨‍💼",
    department: "マーケティング",
    role: "マネージャー",
    status: "away",
    comment: "会議中",
    project: "Campaign",
  },
  {
    id: "5",
    name: "伊藤美咲",
    avatar: "👩‍🔬",
    department: "エンジニアリング",
    role: "データサイエンティスト",
    status: "online",
    comment: "データ分析中",
    project: "Analytics",
  },
  // リモートワーカー
  {
    id: "6",
    name: "山田智子",
    avatar: "👩‍💻",
    department: "エンジニアリング",
    role: "フルスタック",
    status: "online",
    comment: "在宅で集中開発中",
    project: "WebApp",
    location: {
      id: "location-1",
      type: "remote",
      name: "渋谷区",
      city: "東京都",
      prefecture: "東京都",
      coordinates: { x: 700, y: 100 }, // オフィス中央から東北方向
    },
  },
  {
    id: "7",
    name: "中村健太",
    avatar: "👨‍💻",
    department: "マーケティング",
    role: "データアナリスト",
    status: "busy",
    comment: "レポート作成中",
    project: "Campaign",
    location: {
      id: "location-2",
      type: "remote",
      name: "横浜市",
      city: "神奈川県",
      prefecture: "神奈川県",
      coordinates: { x: 750, y: 150 }, // オフィス中央から東北方向（東京の近く）
    },
  },
  // 追加のリモートワーカー
  {
    id: "8",
    name: "松本美穂",
    avatar: "👩‍🎨",
    department: "デザイン",
    role: "UXデザイナー",
    status: "online",
    comment: "ユーザー調査まとめ中",
    project: "MobileApp",
    location: {
      id: "location-3",
      type: "remote",
      name: "大阪市",
      city: "大阪府",
      prefecture: "大阪府",
      coordinates: { x: 600, y: 200 }, // オフィス中央から東方向
    },
  },
  {
    id: "9",
    name: "福岡太郎",
    avatar: "👨‍💼",
    department: "営業",
    role: "セールス",
    status: "away",
    comment: "商談対応中",
    project: "Sales",
    location: {
      id: "location-4",
      type: "remote",
      name: "福岡市東区",
      city: "福岡県",
      prefecture: "福岡県",
      coordinates: { x: 400, y: 450 }, // オフィス近郊（在宅勤務）
    },
  },
  // 追加のオフィスメンバー
  {
    id: "10",
    name: "加藤雄介",
    avatar: "👨‍💼",
    department: "エンジニアリング",
    role: "インフラエンジニア",
    status: "online",
    comment: "サーバーメンテナンス中",
    project: "Infrastructure",
  },
  {
    id: "11",
    name: "木村美和",
    avatar: "👩‍💼",
    department: "人事",
    role: "HRマネージャー",
    status: "busy",
    comment: "採用面接中",
    project: "HR",
  },
  {
    id: "12",
    name: "斎藤健一",
    avatar: "👨‍💻",
    department: "エンジニアリング",
    role: "DevOpsエンジニア",
    status: "online",
    comment: "CI/CD構築中",
    project: "Infrastructure",
  },
  {
    id: "13",
    name: "五島健助",
    avatar: "👨‍💼",
    department: "エンジニアリング",
    role: "フルスタック",
    status: "online",
    comment: "レビュー地獄",
    project: "WebApp",
    location: {
      id: "location-5",
      type: "remote",
      name: "新潟市",
      city: "新潟県",
      prefecture: "新潟県",
      coordinates: { x: 600, y: 600 }, // オフィス近郊（在宅勤務）
    },
  },
  // 追加のオフィスメンバー
  {
    id: "14",
    name: "小林あや",
    avatar: "👩‍💻",
    department: "エンジニアリング",
    role: "フロントエンド",
    status: "busy",
    comment: "React hooks最適化中",
    project: "MobileApp",
  },
  {
    id: "15",
    name: "渡辺大輔",
    avatar: "👨‍🔧",
    department: "エンジニアリング",
    role: "QAエンジニア",
    status: "online",
    comment: "テスト自動化構築中",
    project: "Infrastructure",
  },
  {
    id: "16",
    name: "田村理子",
    avatar: "👩‍💼",
    department: "プロダクト",
    role: "プロダクトマネージャー",
    status: "away",
    comment: "ユーザーインタビュー中",
    project: "MobileApp",
  },
  {
    id: "17",
    name: "橋本拓也",
    avatar: "👨‍💻",
    department: "エンジニアリング",
    role: "セキュリティエンジニア",
    status: "online",
    comment: "脆弱性診断実施中",
    project: "Infrastructure",
  },
  {
    id: "18",
    name: "山本翔子",
    avatar: "👩‍🎨",
    department: "デザイン",
    role: "UIデザイナー",
    status: "online",
    comment: "デザインシステム更新中",
    project: "WebApp",
  },
  // 追加のリモートメンバー
  {
    id: "19",
    name: "安田和也",
    avatar: "👨‍💼",
    department: "営業",
    role: "アカウントマネージャー",
    status: "busy",
    comment: "大口顧客との打ち合わせ",
    project: "Sales",
    location: {
      id: "location-6",
      type: "remote",
      name: "札幌市",
      city: "北海道",
      prefecture: "北海道",
      coordinates: { x: 550, y: 80 }, // オフィス中央から北
    },
  },
  {
    id: "20",
    name: "清水美香",
    avatar: "👩‍💻",
    department: "エンジニアリング",
    role: "ML エンジニア",
    status: "online",
    comment: "AI モデル学習中",
    project: "Analytics",
    location: {
      id: "location-7",
      type: "remote",
      name: "仙台市",
      city: "宮城県",
      prefecture: "宮城県",
      coordinates: { x: 650, y: 150 }, // オフィス中央から北東
    },
  },
  {
    id: "21",
    name: "久保田浩司",
    avatar: "👨‍🔬",
    department: "R&D",
    role: "リサーチャー",
    status: "away",
    comment: "技術調査中",
    project: "Research",
    location: {
      id: "location-8",
      type: "remote",
      name: "京都市",
      city: "京都府",
      prefecture: "京都府",
      coordinates: { x: 450, y: 250 }, // オフィス中央から西
    },
  },
  {
    id: "22",
    name: "長谷川奈々",
    avatar: "👩‍💼",
    department: "マーケティング",
    role: "コンテンツマーケター",
    status: "online",
    comment: "ブログ記事執筆中",
    project: "Campaign",
    location: {
      id: "location-9",
      type: "remote",
      name: "名古屋市",
      city: "愛知県",
      prefecture: "愛知県",
      coordinates: { x: 500, y: 300 }, // オフィス中央から南西
    },
  },
  {
    id: "23",
    name: "石川隆志",
    avatar: "👨‍💼",
    department: "経営企画",
    role: "ビジネスアナリスト",
    status: "busy",
    comment: "事業計画策定中",
    project: "Strategy",
    location: {
      id: "location-10",
      type: "remote",
      name: "広島市",
      city: "広島県",
      prefecture: "広島県",
      coordinates: { x: 380, y: 350 }, // オフィス中央から南西
    },
  },
];

const mockSeats: Seat[] = [
  // セクションA - 上部・中部・下部の3エリア構成（各6席、合計18席）
  // オフィス全体エリア中央: (screenSize.width/2 - 500, screenSize.height/2 - 350)
  // セクションA枠位置: left: 15, top: 15, width: 480, height: 570
  // 座席間隔: 横120px、縦70px、エリア間80px（隙間拡大）
  // 座席群をセクション枠中央に配置: 枠内余白40px、座席エリア開始位置x=95

  // 上部エリア - 1行目（向き合う形の前列 - 下向き：テーブル向き）
  {
    id: "seat-a-top-1-1",
    number: "A-T1",
    floor: 1,
    section: "A",
    position: { x: 95, y: 75 },
    occupied: true,
    occupiedBy: mockMembers[0], // 田中太郎
    qrCode: "QR-A-T1",
    orientation: "down",
  },
  {
    id: "seat-a-top-1-2",
    number: "A-T2",
    floor: 1,
    section: "A",
    position: { x: 215, y: 75 },
    occupied: true,
    occupiedBy: mockMembers[1], // 佐藤花子
    qrCode: "QR-A-T2",
    orientation: "down",
  },
  {
    id: "seat-a-top-1-3",
    number: "A-T3",
    floor: 1,
    section: "A",
    position: { x: 335, y: 75 },
    occupied: true,
    occupiedBy: mockMembers[4], // 伊藤美咲
    qrCode: "QR-A-T3",
    orientation: "down",
  },

  // 上部エリア - 2行目（向き合う形の後列 - 上向き：テーブル向き）
  {
    id: "seat-a-top-2-1",
    number: "A-T4",
    floor: 1,
    section: "A",
    position: { x: 95, y: 145 },
    occupied: false,
    qrCode: "QR-A-T4",
    orientation: "up",
  },
  {
    id: "seat-a-top-2-2",
    number: "A-T5",
    floor: 1,
    section: "A",
    position: { x: 215, y: 145 },
    occupied: false,
    qrCode: "QR-A-T5",
    orientation: "up",
  },
  {
    id: "seat-a-top-2-3",
    number: "A-T6",
    floor: 1,
    section: "A",
    position: { x: 335, y: 145 },
    occupied: false,
    qrCode: "QR-A-T6",
    orientation: "up",
  },

  // 中部エリア（Frame 4） - 1行目（向き合う形の前列 - 下向き：テーブル向き）
  {
    id: "seat-a4-1-1",
    number: "A4-1",
    floor: 1,
    section: "A",
    position: { x: 95, y: 265 },
    occupied: false,
    qrCode: "QR-A4-1",
    orientation: "down",
  },
  {
    id: "seat-a4-1-2",
    number: "A4-2",
    floor: 1,
    section: "A",
    position: { x: 215, y: 265 },
    occupied: false,
    qrCode: "QR-A4-2",
    orientation: "down",
  },
  {
    id: "seat-a4-1-3",
    number: "A4-3",
    floor: 1,
    section: "A",
    position: { x: 335, y: 265 },
    occupied: false,
    qrCode: "QR-A4-3",
    orientation: "down",
  },

  // 中部エリア（Frame 4） - 2行目（向き合う形の後列 - 上向き：テーブル向き）
  {
    id: "seat-a4-2-1",
    number: "A4-4",
    floor: 1,
    section: "A",
    position: { x: 95, y: 335 },
    occupied: false,
    qrCode: "QR-A4-4",
    orientation: "up",
  },
  {
    id: "seat-a4-2-2",
    number: "A4-5",
    floor: 1,
    section: "A",
    position: { x: 215, y: 335 },
    occupied: false,
    qrCode: "QR-A4-5",
    orientation: "up",
  },
  {
    id: "seat-a4-2-3",
    number: "A4-6",
    floor: 1,
    section: "A",
    position: { x: 335, y: 335 },
    occupied: false,
    qrCode: "QR-A4-6",
    orientation: "up",
  },

  // 下部エリア（Frame 3） - 1行目（向き合う形の前列 - 下向き：テーブル向き）
  {
    id: "seat-a3-1-1",
    number: "A3-1",
    floor: 1,
    section: "A",
    position: { x: 95, y: 455 },
    occupied: false,
    qrCode: "QR-A3-1",
    orientation: "down",
  },
  {
    id: "seat-a3-1-2",
    number: "A3-2",
    floor: 1,
    section: "A",
    position: { x: 215, y: 455 },
    occupied: false,
    qrCode: "QR-A3-2",
    orientation: "down",
  },
  {
    id: "seat-a3-1-3",
    number: "A3-3",
    floor: 1,
    section: "A",
    position: { x: 335, y: 455 },
    occupied: false,
    qrCode: "QR-A3-3",
    orientation: "down",
  },

  // 下部エリア（Frame 3） - 2行目（向き合う形の後列 - 上向き：テーブル向き）
  {
    id: "seat-a3-2-1",
    number: "A3-4",
    floor: 1,
    section: "A",
    position: { x: 95, y: 525 },
    occupied: false,
    qrCode: "QR-A3-4",
    orientation: "up",
  },
  {
    id: "seat-a3-2-2",
    number: "A3-5",
    floor: 1,
    section: "A",
    position: { x: 215, y: 525 },
    occupied: false,
    qrCode: "QR-A3-5",
    orientation: "up",
  },
  {
    id: "seat-a3-2-3",
    number: "A3-6",
    floor: 1,
    section: "A",
    position: { x: 335, y: 525 },
    occupied: false,
    qrCode: "QR-A3-6",
    orientation: "up",
  },

  // セクションB - 上部・中部・下部の3エリア構成（各6席、合計18席）
  // セクションB枠位置: left: 505, top: 15, width: 480, height: 570
  // 座席間隔: 横120px、縦70px、エリア間80px（隙間拡大）
  // 座席群をセクション枠中央に配置: 枠内余白40px、座席エリア開始位置x=585

  // 上部エリア - 1行目（向き合う形の前列 - 下向き：テーブル向き）
  {
    id: "seat-b-top-1-1",
    number: "B-T1",
    floor: 1,
    section: "B",
    position: { x: 585, y: 75 },
    occupied: true,
    occupiedBy: mockMembers[2], // 鈴木次郎
    qrCode: "QR-B-T1",
    orientation: "down",
  },
  {
    id: "seat-b-top-1-2",
    number: "B-T2",
    floor: 1,
    section: "B",
    position: { x: 705, y: 75 },
    occupied: true,
    occupiedBy: mockMembers[3], // 高橋三郎
    qrCode: "QR-B-T2",
    orientation: "down",
  },
  {
    id: "seat-b-top-1-3",
    number: "B-T3",
    floor: 1,
    section: "B",
    position: { x: 825, y: 75 },
    occupied: true,
    occupiedBy: mockMembers[9], // 加藤雄介
    qrCode: "QR-B-T3",
    orientation: "down",
  },

  // 上部エリア - 2行目（向き合う形の後列 - 上向き：テーブル向き）
  {
    id: "seat-b-top-2-1",
    number: "B-T4",
    floor: 1,
    section: "B",
    position: { x: 585, y: 145 },
    occupied: true,
    occupiedBy: mockMembers[10], // 木村美和
    qrCode: "QR-B-T4",
    orientation: "up",
  },
  {
    id: "seat-b-top-2-2",
    number: "B-T5",
    floor: 1,
    section: "B",
    position: { x: 705, y: 145 },
    occupied: true,
    occupiedBy: mockMembers[11], // 斎藤健一
    qrCode: "QR-B-T5",
    orientation: "up",
  },
  {
    id: "seat-b-top-2-3",
    number: "B-T6",
    floor: 1,
    section: "B",
    position: { x: 825, y: 145 },
    occupied: false,
    qrCode: "QR-B-T6",
    orientation: "up",
  },

  // 中部エリア（Frame 4） - 1行目（向き合う形の前列 - 下向き：テーブル向き）
  {
    id: "seat-b4-1-1",
    number: "B4-1",
    floor: 1,
    section: "B",
    position: { x: 585, y: 265 },
    occupied: false,
    qrCode: "QR-B4-1",
    orientation: "down",
  },
  {
    id: "seat-b4-1-2",
    number: "B4-2",
    floor: 1,
    section: "B",
    position: { x: 705, y: 265 },
    occupied: false,
    qrCode: "QR-B4-2",
    orientation: "down",
  },
  {
    id: "seat-b4-1-3",
    number: "B4-3",
    floor: 1,
    section: "B",
    position: { x: 825, y: 265 },
    occupied: false,
    qrCode: "QR-B4-3",
    orientation: "down",
  },

  // 中部エリア（Frame 4） - 2行目（向き合う形の後列 - 上向き：テーブル向き）
  {
    id: "seat-b4-2-1",
    number: "B4-4",
    floor: 1,
    section: "B",
    position: { x: 585, y: 335 },
    occupied: false,
    qrCode: "QR-B4-4",
    orientation: "up",
  },
  {
    id: "seat-b4-2-2",
    number: "B4-5",
    floor: 1,
    section: "B",
    position: { x: 705, y: 335 },
    occupied: false,
    qrCode: "QR-B4-5",
    orientation: "up",
  },
  {
    id: "seat-b4-2-3",
    number: "B4-6",
    floor: 1,
    section: "B",
    position: { x: 825, y: 335 },
    occupied: false,
    qrCode: "QR-B4-6",
    orientation: "up",
  },

  // 下部エリア（Frame 3） - 1行目（向き合う形の前列 - 下向き：テーブル向き）
  {
    id: "seat-b3-1-1",
    number: "B3-1",
    floor: 1,
    section: "B",
    position: { x: 585, y: 455 },
    occupied: false,
    qrCode: "QR-B3-1",
    orientation: "down",
  },
  {
    id: "seat-b3-1-2",
    number: "B3-2",
    floor: 1,
    section: "B",
    position: { x: 705, y: 455 },
    occupied: false,
    qrCode: "QR-B3-2",
    orientation: "down",
  },
  {
    id: "seat-b3-1-3",
    number: "B3-3",
    floor: 1,
    section: "B",
    position: { x: 825, y: 455 },
    occupied: false,
    qrCode: "QR-B3-3",
    orientation: "down",
  },

  // 下部エリア（Frame 3） - 2行目（向き合う形の後列 - 上向き：テーブル向き）
  {
    id: "seat-b3-2-1",
    number: "B3-4",
    floor: 1,
    section: "B",
    position: { x: 585, y: 525 },
    occupied: false,
    qrCode: "QR-B3-4",
    orientation: "up",
  },
  {
    id: "seat-b3-2-2",
    number: "B3-5",
    floor: 1,
    section: "B",
    position: { x: 705, y: 525 },
    occupied: false,
    qrCode: "QR-B3-5",
    orientation: "up",
  },
  {
    id: "seat-b3-2-3",
    number: "B3-6",
    floor: 1,
    section: "B",
    position: { x: 825, y: 525 },
    occupied: false,
    qrCode: "QR-B3-6",
    orientation: "up",
  },
];

const mockConstellations: Constellation[] = [
  {
    id: "constellation-1",
    name: "WebApp開発チーム",
    members: [
      mockMembers[0],
      mockMembers[1],
      mockMembers[5],
      mockMembers[12],
      mockMembers[17],
    ], // 田中太郎（オフィス）, 佐藤花子（オフィス）, 山田智子（リモート）, 五島健助（リモート）, 山本翔子（オフィス）
    connections: [
      { from: "1", to: "2", type: "project" },
      { from: "1", to: "6", type: "project" },
      { from: "2", to: "6", type: "project" },
      { from: "1", to: "13", type: "project" },
      { from: "18", to: "1", type: "project" },
    ],
    position: { x: 650, y: 120 }, // 中央オフィスから北東
    color: "#3B82F6",
  },
  {
    id: "constellation-2",
    name: "マーケティング・営業チーム",
    members: [
      mockMembers[3],
      mockMembers[6],
      mockMembers[8],
      mockMembers[18],
      mockMembers[21],
    ], // 高橋三郎（オフィス）, 中村健太（リモート）, 福岡太郎（リモート）, 安田和也（リモート）, 長谷川奈々（リモート）
    connections: [
      { from: "4", to: "7", type: "project" },
      { from: "4", to: "9", type: "department" },
      { from: "19", to: "4", type: "department" },
      { from: "22", to: "4", type: "project" },
    ],
    position: { x: 350, y: 420 }, // 中央オフィスから南西
    color: "#EF4444",
  },
  {
    id: "constellation-3",
    name: "デザイン・データチーム",
    members: [mockMembers[2], mockMembers[4], mockMembers[7], mockMembers[19]], // 鈴木次郎（オフィス）, 伊藤美咲（オフィス）, 松本美穂（リモート）, 清水美香（リモート）
    connections: [
      { from: "3", to: "5", type: "department" },
      { from: "3", to: "8", type: "project" },
      { from: "5", to: "20", type: "department" },
    ],
    position: { x: 550, y: 180 }, // 中央オフィスから東
    color: "#10B981",
  },
  {
    id: "constellation-4",
    name: "インフラ・サポートチーム",
    members: [
      mockMembers[9],
      mockMembers[10],
      mockMembers[11],
      mockMembers[14],
      mockMembers[16],
    ], // 加藤雄介（オフィス）, 木村美和（オフィス）, 斎藤健一（オフィス）, 渡辺大輔（オフィス）, 橋本拓也（オフィス）
    connections: [
      { from: "10", to: "12", type: "department" },
      { from: "10", to: "11", type: "project" },
      { from: "15", to: "10", type: "department" },
      { from: "17", to: "12", type: "department" },
    ],
    position: { x: 300, y: 300 }, // 中央オフィスから南西
    color: "#8B5CF6",
  },
  {
    id: "constellation-5",
    name: "モバイルアプリチーム",
    members: [mockMembers[13], mockMembers[15]], // 小林あや（オフィス）, 田村理子（オフィス）
    connections: [{ from: "14", to: "16", type: "project" }],
    position: { x: 450, y: 350 }, // 中央オフィスから南
    color: "#F59E0B",
  },
  {
    id: "constellation-6",
    name: "研究・戦略チーム",
    members: [mockMembers[20], mockMembers[22]], // 久保田浩司（リモート）, 石川隆志（リモート）
    connections: [{ from: "21", to: "23", type: "department" }],
    position: { x: 200, y: 250 }, // 中央オフィスから西
    color: "#EC4899",
  },
];

export const useAppStore = create<AppStore>((set) => ({
  members: mockMembers,
  seats: mockSeats,
  constellations: mockConstellations,
  currentView: "office",
  selectedMember: undefined,
  zoomState: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },

  setCurrentView: (view) => set({ currentView: view }),

  setSelectedMember: (member) => set({ selectedMember: member }),

  updateMemberStatus: (id, status) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, status } : member,
      ),
    })),

  updateMemberComment: (id, comment) =>
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, comment } : member,
      ),
    })),

  occupySeat: (seatId, member) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? { ...seat, occupied: true, occupiedBy: member }
          : seat,
      ),
    })),

  vacateSeat: (seatId) =>
    set((state) => ({
      seats: state.seats.map((seat) =>
        seat.id === seatId
          ? { ...seat, occupied: false, occupiedBy: undefined }
          : seat,
      ),
    })),

  setZoomState: (zoomState) => set({ zoomState }),

  resetZoom: () =>
    set({
      zoomState: { scale: 1, translateX: 0, translateY: 0 },
    }),
}));
