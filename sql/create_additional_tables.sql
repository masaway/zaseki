-- メンバー管理用の追加テーブル作成
-- 既存のseats_master, seats_usageに加えて、メンバーとプロジェクト管理用テーブルを追加

-- 1. メンバーマスタテーブル
CREATE TABLE IF NOT EXISTS members (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar VARCHAR(10), -- 絵文字アバター
  department VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'offline', -- online, busy, away, offline
  comment TEXT,
  location_type VARCHAR(20) DEFAULT 'office', -- office, remote
  location_name VARCHAR(100), -- リモートの場合の地域名
  location_prefecture VARCHAR(50), -- 都道府県
  location_coordinates_x INTEGER, -- リモート表示用X座標
  location_coordinates_y INTEGER, -- リモート表示用Y座標
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. プロジェクトマスタテーブル
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- HEX色コード
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. メンバー・プロジェクト関連テーブル
CREATE TABLE IF NOT EXISTS member_projects (
  id SERIAL PRIMARY KEY,
  member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
  project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
  role VARCHAR(100), -- プロジェクト内での役割
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(member_id, project_id)
);

-- 4. チーム・コンステレーション設定テーブル
CREATE TABLE IF NOT EXISTS constellations (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  position_x INTEGER NOT NULL, -- スターマップでの表示位置X
  position_y INTEGER NOT NULL, -- スターマップでの表示位置Y
  color VARCHAR(7) DEFAULT '#3B82F6', -- HEX色コード
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. コンステレーション・メンバー関連テーブル
CREATE TABLE IF NOT EXISTS constellation_members (
  id SERIAL PRIMARY KEY,
  constellation_id VARCHAR(50) REFERENCES constellations(id) ON DELETE CASCADE,
  member_id VARCHAR(50) REFERENCES members(id) ON DELETE CASCADE,
  connection_type VARCHAR(20) DEFAULT 'project', -- project, department, team
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(constellation_id, member_id)
);

-- 6. 座席利用履歴テーブルの拡張（既存テーブルに列追加）
ALTER TABLE seats_usage 
ADD COLUMN IF NOT EXISTS member_id VARCHAR(50) REFERENCES members(id);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_members_department ON members(department);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);
CREATE INDEX IF NOT EXISTS idx_member_projects_member_id ON member_projects(member_id);
CREATE INDEX IF NOT EXISTS idx_member_projects_project_id ON member_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_constellation_members_constellation_id ON constellation_members(constellation_id);
CREATE INDEX IF NOT EXISTS idx_constellation_members_member_id ON constellation_members(member_id);
CREATE INDEX IF NOT EXISTS idx_seats_usage_member_id ON seats_usage(member_id);

-- Row Level Security (RLS) の設定
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellation_members ENABLE ROW LEVEL SECURITY;

-- RLSポリシー設定（全ユーザー読み取り・書き込み許可）
CREATE POLICY "Enable read access for all users" ON members FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON members FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON projects FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON member_projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON member_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON member_projects FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON constellations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON constellations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON constellations FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON constellation_members FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON constellation_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON constellation_members FOR UPDATE USING (true);

-- 更新日時の自動更新用関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 更新日時の自動更新トリガー
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constellations_updated_at BEFORE UPDATE ON constellations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();