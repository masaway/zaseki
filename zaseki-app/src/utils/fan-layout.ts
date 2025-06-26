// 地域ゾーンレイアウト用の座標変換ユーティリティ

interface Coordinates {
  x: number;
  y: number;
}

interface RegionalZone {
  name: string;
  center: (screenWidth: number, screenHeight: number) => Coordinates;
  size: { width: number; height: number };
  shape: 'circle' | 'ellipse' | 'rect';
  color: string;
}

// 地域ゾーンの定義（画面いっぱいに配置）
const REGIONAL_ZONES: Record<string, RegionalZone> = {
  'kyushu': {
    name: '九州エリア',
    center: (sw, sh) => ({ x: sw * 0.15, y: sh * 0.55 }), // 左側
    size: { width: 320, height: 320 },
    shape: 'circle',
    color: '#06B6D4' // 水色
  },
  'central': {
    name: '日本中心エリア',
    center: (sw, sh) => ({ x: sw * 0.65, y: sh * 0.2 }), // 上部
    size: { width: 400, height: 240 },
    shape: 'ellipse',
    color: '#10B981' // 緑色
  },
  'hokkaido': {
    name: '北海道エリア',
    center: (sw, sh) => ({ x: sw * 0.85, y: sh * 0.65 }), // 右下
    size: { width: 280, height: 200 },
    shape: 'ellipse',
    color: '#F59E0B' // 黄色
  }
};

// 都道府県と地域ゾーンのマッピング
const PREFECTURE_TO_ZONE: Record<string, string> = {
  // 九州エリア
  '福岡県': 'kyushu',
  '佐賀県': 'kyushu',
  '長崎県': 'kyushu',
  '熊本県': 'kyushu',
  '大分県': 'kyushu',
  '宮崎県': 'kyushu',
  '鹿児島県': 'kyushu',
  '沖縄県': 'kyushu',
  
  // 日本中心エリア（関東・中部・関西）
  '東京都': 'central',
  '神奈川県': 'central',
  '千葉県': 'central',
  '埼玉県': 'central',
  '茨城県': 'central',
  '栃木県': 'central',
  '群馬県': 'central',
  '山梨県': 'central',
  '長野県': 'central',
  '新潟県': 'central',
  '富山県': 'central',
  '石川県': 'central',
  '福井県': 'central',
  '静岡県': 'central',
  '愛知県': 'central',
  '岐阜県': 'central',
  '三重県': 'central',
  '滋賀県': 'central',
  '京都府': 'central',
  '大阪府': 'central',
  '兵庫県': 'central',
  '奈良県': 'central',
  '和歌山県': 'central',
  
  // 北海道エリア
  '北海道': 'hokkaido',
  '青森県': 'hokkaido',
  '岩手県': 'hokkaido',
  '宮城県': 'hokkaido',
  '秋田県': 'hokkaido',
  '山形県': 'hokkaido',
  '福島県': 'hokkaido',
  '鳥取県': 'central', // 中国・四国は中央エリアに含める
  '島根県': 'central',
  '岡山県': 'central',
  '広島県': 'central',
  '山口県': 'central',
  '徳島県': 'central',
  '香川県': 'central',
  '愛媛県': 'central',
  '高知県': 'central'
};

/**
 * 地域ゾーンに基づいたメンバー配置を計算
 * @param prefecture 都道府県名
 * @param memberIndex 同一ゾーン内のメンバーインデックス
 * @param totalInZone 同一ゾーン内の総メンバー数
 * @param screenWidth 画面幅
 * @param screenHeight 画面高さ
 * @returns 地域ゾーン内での座標
 */
export function calculateRegionalPosition(
  prefecture: string,
  memberIndex: number,
  totalInZone: number,
  screenWidth: number,
  screenHeight: number
): Coordinates {
  const zoneName = PREFECTURE_TO_ZONE[prefecture];
  
  if (!zoneName) {
    // 未定義の場合は中央エリアに配置
    const zone = REGIONAL_ZONES['central'];
    const center = zone.center(screenWidth, screenHeight);
    return center;
  }
  
  const zone = REGIONAL_ZONES[zoneName];
  const center = zone.center(screenWidth, screenHeight);
  
  if (totalInZone === 1) {
    // 1人の場合はゾーン中心に配置
    return center;
  }
  
  // ゾーン内での円形配置（より広範囲に配置）
  const radius = Math.min(zone.size.width, zone.size.height) * 0.4;
  const angleStep = (2 * Math.PI) / totalInZone;
  const angle = memberIndex * angleStep;
  
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  };
}

/**
 * 画面サイズに基づいて福岡オフィスの中心座標を計算
 * @param screenWidth 画面幅
 * @param screenHeight 画面高さ
 * @returns オフィス中心座標
 */
export function getOfficeCenter(screenWidth: number, screenHeight: number): Coordinates {
  return {
    x: screenWidth / 2,
    y: screenHeight / 2 // 画面中央に配置（銀河ゾーン内に収める）
  };
}

/**
 * 地域ゾーン情報を取得
 */
export function getRegionalZones() {
  return REGIONAL_ZONES;
}

/**
 * 都道府県から地域ゾーンを取得
 */
export function getZoneByPrefecture(prefecture: string): string | undefined {
  return PREFECTURE_TO_ZONE[prefecture];
}

/**
 * オフィスメンバーの座席をオフィスゾーン内に縮小配置
 * @param seatPosition 元の座席位置
 * @param officeCenter オフィス中心座標
 * @param scale スケール係数
 * @returns 変換後の座標
 */
export function transformOfficeLayout(
  seatPosition: Coordinates,
  officeCenter: Coordinates,
  scale: number = 0.3
): Coordinates {
  // 新しい座席配置の中心点を計算（セクションA・Bの全体中心）
  // セクションA範囲: x: 80-280, y: 80-200
  // セクションB範囲: x: 560-760, y: 80-200  
  const seatLayoutCenterX = 420; // 座席配置全体の中心X座標（(80+760)/2）
  const seatLayoutCenterY = 140; // 座席配置全体の中心Y座標（(80+200)/2）
  
  // 銀河ゾーンサイズ（700x700px）を考慮してより小さくスケーリング
  // 座席配置全体サイズ: 幅680px(760-80), 高さ120px(200-80)
  // 銀河ゾーン内に収めるため、最大300px程度の範囲に制限
  const maxGalaxyRadius = 250; // 銀河ゾーン半径の約70%
  const currentLayoutWidth = 680; // 現在の座席配置幅
  const galaxyScale = Math.min(scale, maxGalaxyRadius * 2 / currentLayoutWidth);
  
  return {
    x: officeCenter.x + (seatPosition.x - seatLayoutCenterX) * galaxyScale,
    y: officeCenter.y + (seatPosition.y - seatLayoutCenterY) * galaxyScale
  };
}

/**
 * 銀河の渦巻き状に座席を配置する関数
 * @param seatIndex 座席のインデックス（0から開始）
 * @param totalSeats 総座席数
 * @param officeCenter オフィス中心座標
 * @param maxRadius 最大半径
 * @returns 銀河配置での座標
 */
export function calculateGalaxyPosition(
  seatIndex: number,
  totalSeats: number,
  officeCenter: Coordinates,
  maxRadius: number = 250
): Coordinates {
  // 渦巻きの腕の数（銀河の渦巻き腕）
  const numberOfArms = 3;
  
  // 座席を腕ごとに分散
  const armIndex = seatIndex % numberOfArms;
  const positionInArm = Math.floor(seatIndex / numberOfArms);
  const seatsPerArm = Math.ceil(totalSeats / numberOfArms);
  
  // 渦巻きパラメータ
  const armAngleOffset = (2 * Math.PI * armIndex) / numberOfArms;
  const progress = positionInArm / seatsPerArm; // 0から1の進行度
  
  // 半径（中心から外側へ）
  const radius = Math.sqrt(progress) * maxRadius;
  
  // 角度（渦巻き効果）
  const spiralFactor = 2; // 渦巻きの巻き数
  const angle = armAngleOffset + progress * Math.PI * spiralFactor;
  
  return {
    x: officeCenter.x + Math.cos(angle) * radius,
    y: officeCenter.y + Math.sin(angle) * radius
  };
}