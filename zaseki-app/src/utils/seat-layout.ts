// 座席配置の動的計算ユーティリティ
export interface SeatLayoutConfig {
  sectionWidth: number;
  sectionHeight: number;
  seatSpacing: {
    horizontal: number;
    vertical: number;
  };
  areaSpacing: number; // エリア間の隙間
  marginFromBorder: number; // セクション枠からの余白
}

export interface AreaConfig {
  name: string;
  rows: number;
  seatsPerRow: number;
  startY: number;
  faceToFace: boolean; // 向き合う配置かどうか
}

export const DEFAULT_LAYOUT_CONFIG: SeatLayoutConfig = {
  sectionWidth: 450,
  sectionHeight: 520,
  seatSpacing: {
    horizontal: 120,
    vertical: 70,
  },
  areaSpacing: 80,
  marginFromBorder: 30,
};

/**
 * セクション内のエリア配置を計算
 */
export function calculateAreaLayout(areas: AreaConfig[], config: SeatLayoutConfig) {
  let currentY = config.marginFromBorder;
  
  return areas.map((area) => {
    const areaLayout = {
      ...area,
      startY: currentY,
      endY: currentY + (area.rows * config.seatSpacing.vertical),
    };
    
    // 次のエリアの開始位置を計算
    currentY = areaLayout.endY + config.areaSpacing;
    
    return areaLayout;
  });
}

/**
 * 座席位置を動的に計算
 */
export function calculateSeatPositions(
  sectionX: number,
  areas: ReturnType<typeof calculateAreaLayout>,
  config: SeatLayoutConfig
) {
  const seats: Array<{
    x: number;
    y: number;
    areaName: string;
    row: number;
    position: number;
    orientation?: 'up' | 'down';
  }> = [];

  areas.forEach((area) => {
    for (let row = 0; row < area.rows; row++) {
      for (let position = 0; position < area.seatsPerRow; position++) {
        const x = sectionX + config.marginFromBorder + (position * config.seatSpacing.horizontal);
        const y = area.startY + (row * config.seatSpacing.vertical);
        
        let orientation: 'up' | 'down' | undefined;
        if (area.faceToFace) {
          // 向き合う配置の場合、奇数行は上向き、偶数行は下向き
          orientation = row % 2 === 0 ? 'up' : 'down';
        }
        
        seats.push({
          x,
          y,
          areaName: area.name,
          row: row + 1,
          position: position + 1,
          orientation,
        });
      }
    }
  });

  return seats;
}

/**
 * セクション枠のサイズを動的に計算
 */
export function calculateSectionBounds(areas: AreaConfig[], config: SeatLayoutConfig) {
  const maxSeatsPerRow = Math.max(...areas.map(area => area.seatsPerRow));
  const totalRows = areas.reduce((sum, area) => sum + area.rows, 0);
  const totalAreaSpacing = (areas.length - 1) * config.areaSpacing;
  
  return {
    width: config.marginFromBorder * 2 + (maxSeatsPerRow - 1) * config.seatSpacing.horizontal + 50, // 余裕を追加
    height: config.marginFromBorder * 2 + (totalRows - 1) * config.seatSpacing.vertical + totalAreaSpacing + 50, // 余裕を追加
  };
}

/**
 * 新しい座席を追加するための推奨位置を計算
 */
export function getNextSeatPosition(
  existingSeats: Array<{ x: number; y: number; section: string }>,
  section: string,
  config: SeatLayoutConfig
) {
  const sectionSeats = existingSeats.filter(seat => seat.section === section);
  
  if (sectionSeats.length === 0) {
    // 最初の座席の場合
    return {
      x: config.marginFromBorder,
      y: config.marginFromBorder,
    };
  }
  
  // 既存座席の最後の行を探す
  const maxY = Math.max(...sectionSeats.map(seat => seat.y));
  const lastRowSeats = sectionSeats.filter(seat => seat.y === maxY);
  const maxX = Math.max(...lastRowSeats.map(seat => seat.x));
  
  // 新しい座席の位置を提案
  const nextX = maxX + config.seatSpacing.horizontal;
  const suggestedBounds = calculateSectionBounds([
    { name: 'existing', rows: 1, seatsPerRow: lastRowSeats.length + 1, startY: 0, faceToFace: false }
  ], config);
  
  if (nextX + 50 > suggestedBounds.width) {
    // 新しい行を開始
    return {
      x: config.marginFromBorder,
      y: maxY + config.seatSpacing.vertical,
    };
  } else {
    // 同じ行に追加
    return {
      x: nextX,
      y: maxY,
    };
  }
}