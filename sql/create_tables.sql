-- 座席マスタテーブルの作成
CREATE TABLE IF NOT EXISTS seats_master (
  seat_id VARCHAR(50) PRIMARY KEY,
  seat_name VARCHAR(100),
  section VARCHAR(50),
  x_position INTEGER,
  y_position INTEGER,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 座席利用履歴テーブルの作成
CREATE TABLE IF NOT EXISTS seats_usage (
  id SERIAL PRIMARY KEY,
  seat_id VARCHAR(50) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  projects TEXT[], -- プロジェクト配列
  comment TEXT,
  scan_datetime TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_seats_usage_seat_id ON seats_usage(seat_id);
CREATE INDEX IF NOT EXISTS idx_seats_usage_scan_datetime ON seats_usage(scan_datetime);
CREATE INDEX IF NOT EXISTS idx_seats_master_active ON seats_master(is_active);

