-- 現在のmockデータをSupabaseテーブルに挿入
-- app-store.tsのmockデータをデータベース化

-- 1. プロジェクトマスタデータ挿入
INSERT INTO projects (id, name, description, color, is_active) VALUES
('WebApp', 'WebApp開発プロジェクト', 'メインのWebアプリケーション開発', '#3B82F6', true),
('MobileApp', 'モバイルアプリ開発', 'iOSとAndroidアプリの開発', '#10B981', true),
('Campaign', 'マーケティングキャンペーン', '新規ユーザー獲得キャンペーン', '#EF4444', true),
('Analytics', 'データ分析プロジェクト', 'ビジネス分析とデータ可視化', '#8B5CF6', true),
('Infrastructure', 'インフラ構築・運用', 'サーバーインフラとDevOps', '#8B5CF6', true),
('HR', '人事管理システム', '人事業務デジタル化プロジェクト', '#F59E0B', true),
('Sales', '営業支援システム', 'CRMと営業プロセス改善', '#EF4444', true);

-- 2. メンバーマスタデータ挿入
INSERT INTO members (id, name, avatar, department, role, status, comment, location_type, is_active) VALUES
-- オフィス勤務メンバー
('1', '田中太郎', '👨‍💼', 'エンジニアリング', 'フロントエンド', 'online', '今日は集中して開発中！', 'office', true),
('2', '佐藤花子', '👩‍💻', 'エンジニアリング', 'バックエンド', 'busy', 'API開発中です', 'office', true),
('3', '鈴木次郎', '👨‍🎨', 'デザイン', 'UIデザイナー', 'online', 'プロトタイプ制作中', 'office', true),
('4', '高橋三郎', '👨‍💼', 'マーケティング', 'マネージャー', 'away', '会議中', 'office', true),
('5', '伊藤美咲', '👩‍🔬', 'エンジニアリング', 'データサイエンティスト', 'online', 'データ分析中', 'office', true),
('10', '加藤雄介', '👨‍💼', 'エンジニアリング', 'インフラエンジニア', 'online', 'サーバーメンテナンス中', 'office', true),
('11', '木村美和', '👩‍💼', '人事', 'HRマネージャー', 'busy', '採用面接中', 'office', true),
('12', '斎藤健一', '👨‍💻', 'エンジニアリング', 'DevOpsエンジニア', 'online', 'CI/CD構築中', 'office', true),

-- リモートワーカー
('6', '山田智子', '👩‍💻', 'エンジニアリング', 'フルスタック', 'online', '在宅で集中開発中', 'remote', true),
('7', '中村健太', '👨‍💻', 'マーケティング', 'データアナリスト', 'busy', 'レポート作成中', 'remote', true),
('8', '松本美穂', '👩‍🎨', 'デザイン', 'UXデザイナー', 'online', 'ユーザー調査まとめ中', 'remote', true),
('9', '福岡太郎', '👨‍💼', '営業', 'セールス', 'away', '商談対応中', 'remote', true);

-- 3. リモートワーカーの位置情報更新
UPDATE members SET 
  location_name = '渋谷区', 
  location_prefecture = '東京都',
  location_coordinates_x = 700,
  location_coordinates_y = 100
WHERE id = '6';

UPDATE members SET 
  location_name = '横浜市', 
  location_prefecture = '神奈川県',
  location_coordinates_x = 750,
  location_coordinates_y = 150
WHERE id = '7';

UPDATE members SET 
  location_name = '大阪市', 
  location_prefecture = '大阪府',
  location_coordinates_x = 600,
  location_coordinates_y = 200
WHERE id = '8';

UPDATE members SET 
  location_name = '福岡市東区', 
  location_prefecture = '福岡県',
  location_coordinates_x = 400,
  location_coordinates_y = 450
WHERE id = '9';

-- 4. メンバー・プロジェクト関連データ挿入
INSERT INTO member_projects (member_id, project_id, role, is_active) VALUES
-- WebApp開発チーム
('1', 'WebApp', 'フロントエンド開発', true),
('2', 'WebApp', 'バックエンド開発', true),
('6', 'WebApp', 'フルスタック開発', true),

-- マーケティング・営業チーム
('4', 'Campaign', 'マーケティングマネージャー', true),
('7', 'Campaign', 'データアナリスト', true),
('9', 'Sales', 'セールス担当', true),

-- デザイン・データチーム
('3', 'MobileApp', 'UIデザイナー', true),
('5', 'Analytics', 'データサイエンティスト', true),
('8', 'MobileApp', 'UXデザイナー', true),

-- インフラ・サポートチーム
('10', 'Infrastructure', 'インフラエンジニア', true),
('11', 'HR', 'HRマネージャー', true),
('12', 'Infrastructure', 'DevOpsエンジニア', true);

-- 5. コンステレーション（チーム配置）データ挿入
INSERT INTO constellations (id, name, description, position_x, position_y, color, is_active) VALUES
('constellation-1', 'WebApp開発チーム', 'メインのWebアプリケーション開発チーム', 650, 120, '#3B82F6', true),
('constellation-2', 'マーケティング・営業チーム', 'マーケティングと営業連携チーム', 350, 420, '#EF4444', true),
('constellation-3', 'デザイン・データチーム', 'デザインとデータ分析の連携チーム', 550, 180, '#10B981', true),
('constellation-4', 'インフラ・サポートチーム', 'インフラ構築と社内サポートチーム', 300, 300, '#8B5CF6', true);

-- 6. コンステレーション・メンバー関連データ挿入
INSERT INTO constellation_members (constellation_id, member_id, connection_type, is_active) VALUES
-- WebApp開発チーム
('constellation-1', '1', 'project', true), -- 田中太郎
('constellation-1', '2', 'project', true), -- 佐藤花子
('constellation-1', '6', 'project', true), -- 山田智子（リモート）

-- マーケティング・営業チーム
('constellation-2', '4', 'project', true), -- 高橋三郎
('constellation-2', '7', 'project', true), -- 中村健太（リモート）
('constellation-2', '9', 'department', true), -- 福岡太郎（リモート）

-- デザイン・データチーム
('constellation-3', '3', 'department', true), -- 鈴木次郎
('constellation-3', '5', 'department', true), -- 伊藤美咲
('constellation-3', '8', 'project', true), -- 松本美穂（リモート）

-- インフラ・サポートチーム
('constellation-4', '10', 'department', true), -- 加藤雄介
('constellation-4', '11', 'project', true), -- 木村美和
('constellation-4', '12', 'department', true); -- 斎藤健一

-- データの確認
SELECT 
    m.name,
    m.department,
    m.role,
    m.status,
    m.location_type,
    p.name as project_name
FROM members m
LEFT JOIN member_projects mp ON m.id = mp.member_id
LEFT JOIN projects p ON mp.project_id = p.id
ORDER BY m.department, m.name;