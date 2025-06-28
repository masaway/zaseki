# QRコード機能設計書

## 1. 概要

### 1.1 目的
座席管理システムにおいて、物理的な座席位置とデジタル情報を連携させるQRコード機能を実装する。

### 1.2 基本方針
- **ログイン不要**: 誰でも簡単に利用可能
- **スマホ専用**: モバイルファーストのUI/UX
- **リアルタイム更新**: 座席占有状況の即座反映
- **シンプルな操作**: QRコードスキャンによる直感的な操作

## 2. 機能仕様

### 2.1 QRコードスキャン機能
- **対象デバイス**: スマートフォンのカメラ
- **スキャン方式**: リアルタイムカメラ読み取り
- **エラーハンドリング**: カメラアクセス権限、QRコード認識失敗

### 2.2 ユーザー情報管理
#### 2.2.1 必須情報
- 名前（必須）
- 所属部署（必須）
- プロジェクト（複数選択可能）
- 一言コメント（任意）

#### 2.2.2 データ保存
- **保存場所**: localStorage
- **保存タイミング**: 初回入力時、情報更新時
- **データ形式**: JSON形式での構造化データ

### 2.3 座席情報表示
- **表示内容**: 座席番号、現在の利用者情報、利用開始時刻
- **更新方式**: QRコードスキャン時のリアルタイム更新

## 3. データベース設計

### 3.1 利用技術
- **データベース**: Supabase（PostgreSQL）
- **認証**: 認証なし（匿名アクセス）

### 3.2 テーブル設計

#### 3.2.1 seats_usage テーブル
```sql
CREATE TABLE seats_usage (
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
```

#### 3.2.2 seats_master テーブル
```sql
CREATE TABLE seats_master (
  seat_id VARCHAR(50) PRIMARY KEY,
  seat_name VARCHAR(100),
  section VARCHAR(50),
  x_position INTEGER,
  y_position INTEGER,
  qr_code_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. QRコード仕様

### 4.1 QRコード内容
- **データ形式**: JSON文字列
- **データ例**:
```json
{
  "seatId": "A-01",
  "type": "zaseki-qr",
  "version": "1.0"
}
```

### 4.2 QRコード生成
- **生成ライブラリ**: qrcode.js（既存依存関係を活用）
- **サイズ**: 200x200px
- **エラー訂正レベル**: M（中程度）

## 5. 画面フロー

### 5.1 基本フロー
```
1. QRコードスキャン画面
   ↓
2. ユーザー情報確認
   ├─ localStorage に情報あり → 4へ
   └─ localStorage に情報なし → 3へ
   ↓
3. ユーザー情報入力画面
   ↓
4. 座席情報表示画面
   ↓
5. 完了画面
```

### 5.2 URL構成
```
/mobile/qr-reader          # QRコードスキャン画面
/mobile/user-info          # ユーザー情報入力画面
/mobile/seat-info/[seatId] # 座席情報表示画面
```

## 6. 技術仕様

### 6.1 フロントエンド
- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **状態管理**: Zustand
- **QRコード読み取り**: Web Camera API + QR Code Detection

### 6.2 バックエンド
- **API**: Next.js API Routes
- **データベース**: Supabase
- **認証**: 匿名アクセス

### 6.3 必要なライブラリ追加
```json
{
  "qr-scanner": "^1.4.2",
  "@supabase/supabase-js": "^2.45.0"
}
```

## 7. セキュリティ考慮事項

### 7.1 データ保護
- **個人情報**: 最小限の情報のみ収集
- **データ保持期間**: 座席利用履歴は30日間で自動削除
- **匿名化**: 個人を特定できる情報の除外

### 7.2 不正利用防止
- **QRコード検証**: 有効な座席IDかチェック
- **重複チェック**: 同一座席の重複利用検知
- **レート制限**: 短時間での大量アクセス制限

## 8. 運用仕様

### 8.1 座席状態管理
- **占有判定**: スキャン日時が当日の場合は「占有中」
- **自動解除**: 前日以前のスキャンデータは「空き」扱い
- **手動解除**: 管理画面からの強制解除機能

### 8.2 QRコード配置
- **物理配置**: 各座席のモニター下部またはデスク上
- **素材**: 耐久性のあるシール素材
- **サイズ**: 5cm x 5cm程度

## 9. 実装計画

### 9.1 Phase 1: 基本機能
- QRコードスキャン機能
- ユーザー情報入力・保存
- 座席情報表示

### 9.2 Phase 2: データベース連携
- Supabase連携
- 座席利用履歴保存
- 占有状況管理

### 9.3 Phase 3: 運用機能
- 管理画面
- 統計レポート
- エラーログ管理

## 10. テスト仕様

### 10.1 単体テスト
- QRコード読み取り処理
- localStorage操作
- データベース操作

### 10.2 結合テスト
- 画面フロー確認
- データ整合性確認
- エラーハンドリング確認

### 10.3 ユーザビリティテスト
- スマホでの操作性
- QRコード読み取り精度
- 画面表示速度