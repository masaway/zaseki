# Zaseki - 座席管理システム

QRコードを使用したモバイル対応の座席管理システムです。

## 機能概要

### 主要機能
- **QRコードスキャン**: スマートフォンで座席のQRコードを読み取り
- **座席利用登録**: ユーザー情報と座席の利用状況を記録
- **利用状況確認**: 座席の現在の利用状況をリアルタイムで確認
- **QRコード生成**: 管理者用のQRコード一括生成機能

### 対応デバイス
- **メイン画面**: デスクトップ/タブレット (座席レイアウト表示)
- **QRスキャン**: スマートフォン専用 (モバイル最適化UI)

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成し、Supabaseの設定を入力してください。

```bash
cp .env.local.example .env.local
```

`.env.local`ファイルを編集：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Supabaseデータベースの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. `sql/create_tables.sql`の内容をSupabase SQL Editorで実行
3. 必要に応じてRow Level Security (RLS)の設定を行う

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### 5. QRコードの生成

1. [http://localhost:3000/admin/qr-generator](http://localhost:3000/admin/qr-generator) にアクセス
2. 座席IDを入力またはサンプルデータの一括生成
3. QRコードを生成・ダウンロード
4. 印刷して各座席に配置

## URL構成

### デスクトップ向け
- `/` - メイン座席管理画面
- `/admin/qr-generator` - QRコード生成ツール

### モバイル向け
- `/mobile/qr-reader` - QRコードスキャン画面
- `/mobile/user-info` - ユーザー情報入力画面
- `/mobile/seat-info/[seatId]` - 座席情報確認・登録画面

## 技術スタック

### フロントエンド
- **Next.js 15.3.4** - Reactフレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **Zustand** - 状態管理
- **Framer Motion** - アニメーション

### QRコード関連
- **qr-scanner** - QRコード読み取り (モバイル)
- **qrcode** - QRコード生成

### バックエンド・データベース
- **Supabase** - データベース・認証
- **PostgreSQL** - リレーショナルデータベース

## データベース構造

### テーブル

#### seats_master (座席マスタ)
- `seat_id`: 座席ID (主キー)
- `seat_name`: 座席名
- `section`: セクション
- `x_position`, `y_position`: 座席位置座標
- `is_active`: 有効フラグ

#### seats_usage (座席利用履歴)
- `id`: 履歴ID (主キー)
- `seat_id`: 座席ID
- `user_name`: ユーザー名
- `department`: 所属部署
- `projects`: プロジェクト一覧
- `comment`: コメント
- `scan_datetime`: スキャン日時

## 使用フロー

### 初回利用
1. `/mobile/qr-reader`でQRコードをスキャン
2. ユーザー情報入力画面に自動遷移
3. 名前・部署・プロジェクトを入力
4. 座席情報確認・登録

### 2回目以降
1. `/mobile/qr-reader`でQRコードをスキャン
2. 座席情報確認・登録（ユーザー情報は自動入力）

## 開発者向け情報

### ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── mobile/            # モバイル専用ページ
│   └── admin/             # 管理者ツール
├── components/            # Reactコンポーネント
│   ├── mobile/           # モバイル専用コンポーネント
│   ├── office/           # オフィスビューコンポーネント
│   └── starmap/          # スターマップビューコンポーネント
├── lib/                  # ライブラリ・設定
├── utils/                # ユーティリティ関数
├── types/                # TypeScript型定義
└── stores/               # Zustand状態管理
```

### 主要なコンポーネント

- `QRScannerComponent`: QRコード読み取り機能
- `OfficeView`: オフィスレイアウト表示
- `StarmapView`: 星座風座席レイアウト表示

### カスタムフック

- `useZoom`: ズーム機能
- `useAppStore`: アプリケーション状態管理

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。