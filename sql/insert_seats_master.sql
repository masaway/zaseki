-- seats_masterテーブル用サンプルデータ挿入クエリ
-- 現在のアプリケーションの座席レイアウトに対応

-- 既存データをクリア（必要に応じて）
-- DELETE FROM seats_master;

-- セクションA - 上部エリア（6席）
INSERT INTO seats_master (seat_id, seat_name, section, x_position, y_position, qr_code_url, is_active) VALUES
('A-T1', 'セクションA T1席', 'A', 95, 75, 'https://zaseki-app.vercel.app/mobile/seat-info/A-T1', true),
('A-T2', 'セクションA T2席', 'A', 215, 75, 'https://zaseki-app.vercel.app/mobile/seat-info/A-T2', true),
('A-T3', 'セクションA T3席', 'A', 335, 75, 'https://zaseki-app.vercel.app/mobile/seat-info/A-T3', true),
('A-T4', 'セクションA T4席', 'A', 95, 145, 'https://zaseki-app.vercel.app/mobile/seat-info/A-T4', true),
('A-T5', 'セクションA T5席', 'A', 215, 145, 'https://zaseki-app.vercel.app/mobile/seat-info/A-T5', true),
('A-T6', 'セクションA T6席', 'A', 335, 145, 'https://zaseki-app.vercel.app/mobile/seat-info/A-T6', true),

-- セクションA - 中部エリア（6席）
('A2-1', 'セクションA 中部1席', 'A', 95, 265, 'https://zaseki-app.vercel.app/mobile/seat-info/A4-1', true),
('A2-2', 'セクションA 中部2席', 'A', 215, 265, 'https://zaseki-app.vercel.app/mobile/seat-info/A4-2', true),
('A2-3', 'セクションA 中部3席', 'A', 335, 265, 'https://zaseki-app.vercel.app/mobile/seat-info/A4-3', true),
('A2-4', 'セクションA 中部4席', 'A', 95, 335, 'https://zaseki-app.vercel.app/mobile/seat-info/A4-4', true),
('A2-5', 'セクションA 中部5席', 'A', 215, 335, 'https://zaseki-app.vercel.app/mobile/seat-info/A4-5', true),
('A2-6', 'セクションA 中部6席', 'A', 335, 335, 'https://zaseki-app.vercel.app/mobile/seat-info/A4-6', true),

-- セクションA - 下部エリア（6席）
('A3-1', 'セクションA 下部1席', 'A', 95, 455, 'https://zaseki-app.vercel.app/mobile/seat-info/A3-1', true),
('A3-2', 'セクションA 下部2席', 'A', 215, 455, 'https://zaseki-app.vercel.app/mobile/seat-info/A3-2', true),
('A3-3', 'セクションA 下部3席', 'A', 335, 455, 'https://zaseki-app.vercel.app/mobile/seat-info/A3-3', true),
('A3-4', 'セクションA 下部4席', 'A', 95, 525, 'https://zaseki-app.vercel.app/mobile/seat-info/A3-4', true),
('A3-5', 'セクションA 下部5席', 'A', 215, 525, 'https://zaseki-app.vercel.app/mobile/seat-info/A3-5', true),
('A3-6', 'セクションA 下部6席', 'A', 335, 525, 'https://zaseki-app.vercel.app/mobile/seat-info/A3-6', true),

-- セクションB - 上部エリア（6席）
('B-T1', 'セクションB T1席', 'B', 585, 75, 'https://zaseki-app.vercel.app/mobile/seat-info/B-T1', true),
('B-T2', 'セクションB T2席', 'B', 705, 75, 'https://zaseki-app.vercel.app/mobile/seat-info/B-T2', true),
('B-T3', 'セクションB T3席', 'B', 825, 75, 'https://zaseki-app.vercel.app/mobile/seat-info/B-T3', true),
('B-T4', 'セクションB T4席', 'B', 585, 145, 'https://zaseki-app.vercel.app/mobile/seat-info/B-T4', true),
('B-T5', 'セクションB T5席', 'B', 705, 145, 'https://zaseki-app.vercel.app/mobile/seat-info/B-T5', true),
('B-T6', 'セクションB T6席', 'B', 825, 145, 'https://zaseki-app.vercel.app/mobile/seat-info/B-T6', true),

-- セクションB - 中部エリア（6席）
('B2-1', 'セクションB 中部1席', 'B', 585, 265, 'https://zaseki-app.vercel.app/mobile/seat-info/B4-1', true),
('B2-2', 'セクションB 中部2席', 'B', 705, 265, 'https://zaseki-app.vercel.app/mobile/seat-info/B4-2', true),
('B2-3', 'セクションB 中部3席', 'B', 825, 265, 'https://zaseki-app.vercel.app/mobile/seat-info/B4-3', true),
('B2-4', 'セクションB 中部4席', 'B', 585, 335, 'https://zaseki-app.vercel.app/mobile/seat-info/B4-4', true),
('B2-5', 'セクションB 中部5席', 'B', 705, 335, 'https://zaseki-app.vercel.app/mobile/seat-info/B4-5', true),
('B2-6', 'セクションB 中部6席', 'B', 825, 335, 'https://zaseki-app.vercel.app/mobile/seat-info/B4-6', true),

-- セクションB - 下部エリア（6席）
('B3-1', 'セクションB 下部1席', 'B', 585, 455, 'https://zaseki-app.vercel.app/mobile/seat-info/B3-1', true),
('B3-2', 'セクションB 下部2席', 'B', 705, 455, 'https://zaseki-app.vercel.app/mobile/seat-info/B3-2', true),
('B3-3', 'セクションB 下部3席', 'B', 825, 455, 'https://zaseki-app.vercel.app/mobile/seat-info/B3-3', true),
('B3-4', 'セクションB 下部4席', 'B', 585, 525, 'https://zaseki-app.vercel.app/mobile/seat-info/B3-4', true),
('B3-5', 'セクションB 下部5席', 'B', 705, 525, 'https://zaseki-app.vercel.app/mobile/seat-info/B3-5', true),
('B3-6', 'セクションB 下部6席', 'B', 825, 525, 'https://zaseki-app.vercel.app/mobile/seat-info/B3-6', true);

-- データの確認
SELECT 
    seat_id,
    seat_name,
    section,
    x_position,
    y_position,
    is_active
FROM seats_master 
ORDER BY section, x_position, y_position;