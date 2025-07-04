# Supabase移行手順

zasekiアプリケーションをmockデータからSupabaseデータベースに移行する手順を説明します。

## 1. 移行作業の完了内容

### データベーステーブル作成
✅ **完了したファイル**:
- `/sql/create_tables.sql` - 基本テーブル（既存）
- `/sql/create_additional_tables.sql` - 追加テーブル（メンバー・プロジェクト管理）
- `/sql/insert_seats_master.sql` - 座席マスタデータ
- `/sql/insert_mock_data.sql` - mockデータのデータベース化

### フロントエンド実装
✅ **完了したファイル**:
- `/src/lib/supabase.ts` - Supabase API拡張
- `/src/stores/supabase-store.ts` - Supabaseデータストア
- `/src/hooks/useDataStore.ts` - 統一データインターフェース
- `/src/components/ui/loading-state.tsx` - ローディング画面
- `/src/components/ui/error-state.tsx` - エラー画面

✅ **更新したファイル**:
- `/src/app/page.tsx` - メインページでSupabase対応
- `/src/components/office/office-view.tsx` - 統一データフック使用
- `/src/components/starmap/starmap-view.tsx` - 統一データフック使用
- `/src/components/ui/view-switcher.tsx` - 統一データフック使用

## 2. 設定手順

### Step 1: データベースセットアップ

1. **Supabaseプロジェクト作成**
   ```bash
   # Supabaseダッシュボードで新規プロジェクト作成
   # プロジェクト名: zaseki-app
   ```

2. **テーブル作成**
   ```sql
   -- 1. 基本テーブル作成
   -- SQL Editor で create_tables.sql を実行
   
   -- 2. 追加テーブル作成
   -- SQL Editor で create_additional_tables.sql を実行
   ```

3. **データ投入**
   ```sql
   -- 1. 座席マスタデータ
   -- SQL Editor で insert_seats_master.sql を実行
   
   -- 2. メンバー・プロジェクトデータ
   -- SQL Editor で insert_mock_data.sql を実行
   ```

### Step 2: 環境変数設定

1. **ローカル環境設定**
   ```bash
   cd zaseki-app
   cp .env.local.example .env.local
   ```

2. **環境変数編集**
   ```bash
   # .env.local
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_USE_SUPABASE=true  # Supabaseモード有効化
   ```

### Step 3: 本番環境設定

1. **Vercel環境変数**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   NEXT_PUBLIC_BASE_URL = https://zaseki-app.vercel.app
   NEXT_PUBLIC_USE_SUPABASE = true
   ```

## 3. 動作モード

### Mockモード（デフォルト）
```bash
# .env.local
NEXT_PUBLIC_USE_SUPABASE=false  # または未設定
```
- 既存のmockデータを使用
- オフライン動作
- 開発・デモ用

### Supabaseモード
```bash
# .env.local
NEXT_PUBLIC_USE_SUPABASE=true
```
- データベースからデータ取得
- リアルタイム更新対応
- 本番運用用

## 4. 新機能

### 統一データインターフェース
```typescript
// 自動的にモードを判定してストアを切り替え
import { useDataStore } from '@/hooks/useDataStore';

const { 
  seats, members, constellations,
  isLoading, error,
  isSupabaseMode, isMockMode 
} = useDataStore();
```

### エラーハンドリング
- **ローディング状態**: データ取得中の表示
- **エラー状態**: 接続エラー時の表示と再試行機能
- **モード表示**: 画面下部にDB接続状態を表示

### リアルタイム更新
```typescript
// メンバーステータス・コメント更新
await updateMemberStatus(memberId, 'busy');
await updateMemberComment(memberId, '会議中');
```

## 5. テーブル構成

### 既存テーブル
- `seats_master` - 座席マスタ（36席）
- `seats_usage` - 座席利用履歴

### 新規追加テーブル
- `members` - メンバーマスタ（12名）
- `projects` - プロジェクトマスタ（7プロジェクト）
- `member_projects` - メンバー・プロジェクト関連
- `constellations` - チーム配置（4チーム）
- `constellation_members` - チーム・メンバー関連

## 6. 移行時の検証項目

### 基本機能確認
- [ ] 座席表示の正常動作
- [ ] オフィスビュー・スターマップ切り替え
- [ ] 座席クリック・メンバー選択
- [ ] QRコード機能の動作

### Supabase連携確認
- [ ] データ読み込みの正常動作
- [ ] メンバーステータス更新
- [ ] エラーハンドリングの動作
- [ ] ローディング表示の動作

### パフォーマンス確認
- [ ] 初期読み込み時間
- [ ] ビュー切り替えの応答性
- [ ] モバイル端末での動作

## 7. トラブルシューティング

### データが表示されない
1. 環境変数の確認
2. Supabase接続の確認
3. テーブル作成の確認
4. RLSポリシーの確認

### 接続エラー
1. ネットワーク接続の確認
2. SupabaseプロジェクトURLの確認
3. APIキーの確認
4. ブラウザコンソールのエラー確認

### ローディングが終わらない
1. データベースのデータ存在確認
2. SQLクエリの実行確認
3. ブラウザの開発者ツールでネットワークタブ確認

## 8. 今後の拡張予定

### フェーズ2: リアルタイム同期
- Supabase Realtimeを使用した座席状態の即座同期
- 複数ユーザー間での座席予約競合回避

### フェーズ3: 高度な分析機能
- 座席利用率の分析ダッシュボード
- 部署・プロジェクト別の利用状況分析
- 座席配置最適化の提案機能

### フェーズ4: 管理機能強化
- Webベースの管理画面
- メンバー・座席・プロジェクトのCRUD操作
- 座席レイアウトの動的変更機能