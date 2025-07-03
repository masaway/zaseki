import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key (環境変数から取得)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベース型定義
export interface SeatUsage {
  id: number;
  seat_id: string;
  user_name: string;
  department: string;
  projects: string[];
  comment?: string;
  scan_datetime: string;
  created_at: string;
  updated_at: string;
}

export interface SeatMaster {
  seat_id: string;
  seat_name?: string;
  section?: string;
  x_position?: number;
  y_position?: number;
  qr_code_url?: string;
  is_active: boolean;
  created_at: string;
}

// ユーザー情報の型定義（localStorage用）
export interface UserInfo {
  name: string;
  department: string;
  projects: string[];
  comment?: string;
}

// QRコードデータの型定義
export interface QRCodeData {
  seatId: string;
  type: string;
  version: string;
}

// Supabase API関数
export const supabaseApi = {
  // 座席利用履歴を保存
  async saveSeatUsage(data: Omit<SeatUsage, 'id' | 'created_at' | 'updated_at'>): Promise<SeatUsage | null> {
    const { data: result, error } = await supabase
      .from('seats_usage')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('座席利用履歴の保存に失敗:', error);
      return null;
    }

    return result;
  },

  // 座席の最新利用状況を取得
  async getLatestSeatUsage(seatId: string): Promise<SeatUsage | null> {
    const { data, error } = await supabase
      .from('seats_usage')
      .select('*')
      .eq('seat_id', seatId)
      .order('scan_datetime', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('座席利用状況の取得に失敗:', error);
      return null;
    }

    return data;
  },

  // 座席マスタ情報を取得
  async getSeatMaster(seatId: string): Promise<SeatMaster | null> {
    const { data, error } = await supabase
      .from('seats_master')
      .select('*')
      .eq('seat_id', seatId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('座席マスタ情報の取得に失敗:', error);
      return null;
    }

    return data;
  },

  // 前日以前の座席利用データをクリーンアップ
  async cleanupOldSeatUsage(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const { error } = await supabase
      .from('seats_usage')
      .delete()
      .lt('scan_datetime', yesterday.toISOString());

    if (error) {
      console.error('古い座席利用データのクリーンアップに失敗:', error);
    }
  }
};