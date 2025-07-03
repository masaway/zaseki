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

-- サンプルデータの挿入（座席マスタ）
INSERT INTO seats_master (seat_id, seat_name, section, x_position, y_position, is_active) 
VALUES 
  ('A-01', 'A区画 座席1', 'A区画', 100, 100, true),
  ('A-02', 'A区画 座席2', 'A区画', 200, 100, true),
  ('A-03', 'A区画 座席3', 'A区画', 300, 100, true),
  ('A-04', 'A区画 座席4', 'A区画', 100, 200, true),
  ('A-05', 'A区画 座席5', 'A区画', 200, 200, true),
  ('A-06', 'A区画 座席6', 'A区画', 300, 200, true),
  ('A-07', 'A区画 座席7', 'A区画', 100, 300, true),
  ('A-08', 'A区画 座席8', 'A区画', 200, 300, true),
  ('A-09', 'A区画 座席9', 'A区画', 300, 300, true),
  ('B-01', 'B区画 座席1', 'B区画', 500, 100, true),
  ('B-02', 'B区画 座席2', 'B区画', 600, 100, true),
  ('B-03', 'B区画 座席3', 'B区画', 700, 100, true),
  ('B-04', 'B区画 座席4', 'B区画', 500, 200, true),
  ('B-05', 'B区画 座席5', 'B区画', 600, 200, true),
  ('B-06', 'B区画 座席6', 'B区画', 700, 200, true),
  ('B-07', 'B区画 座席7', 'B区画', 500, 300, true),
  ('B-08', 'B区画 座席8', 'B区画', 600, 300, true),
  ('B-09', 'B区画 座席9', 'B区画', 700, 300, true),
  ('C-01', 'C区画 座席1', 'C区画', 100, 500, true),
  ('C-02', 'C区画 座席2', 'C区画', 200, 500, true),
  ('C-03', 'C区画 座席3', 'C区画', 300, 500, true),
  ('C-04', 'C区画 座席4', 'C区画', 100, 600, true),
  ('C-05', 'C区画 座席5', 'C区画', 200, 600, true),
  ('C-06', 'C区画 座席6', 'C区画', 300, 600, true),
  ('C-07', 'C区画 座席7', 'C区画', 100, 700, true),
  ('C-08', 'C区画 座席8', 'C区画', 200, 700, true),
  ('C-09', 'C区画 座席9', 'C区画', 300, 700, true),
  ('D-01', 'D区画 座席1', 'D区画', 500, 500, true),
  ('D-02', 'D区画 座席2', 'D区画', 600, 500, true),
  ('D-03', 'D区画 座席3', 'D区画', 700, 500, true),
  ('D-04', 'D区画 座席4', 'D区画', 500, 600, true),
  ('D-05', 'D区画 座席5', 'D区画', 600, 600, true),
  ('D-06', 'D区画 座席6', 'D区画', 700, 600, true),
  ('D-07', 'D区画 座席7', 'D区画', 500, 700, true),
  ('D-08', 'D区画 座席8', 'D区画', 600, 700, true),
  ('D-09', 'D区画 座席9', 'D区画', 700, 700, true)
ON CONFLICT (seat_id) DO NOTHING;