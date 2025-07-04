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

// 追加のデータベース型定義
export interface Member {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  comment?: string;
  location_type: 'office' | 'remote';
  location_name?: string;
  location_prefecture?: string;
  location_coordinates_x?: number;
  location_coordinates_y?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberProject {
  id: number;
  member_id: string;
  project_id: string;
  role?: string;
  is_active: boolean;
  created_at: string;
}

export interface Constellation {
  id: string;
  name: string;
  description?: string;
  position_x: number;
  position_y: number;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstellationMember {
  id: number;
  constellation_id: string;
  member_id: string;
  connection_type: 'project' | 'department' | 'team';
  is_active: boolean;
  created_at: string;
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

    // データが見つからない場合（PGRST116）は正常ケースとして扱う
    if (error) {
      if (error.code === 'PGRST116') {
        // データなし（初期状態）
        return null;
      }
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

  // 全座席マスタ情報を取得
  async getAllSeats(): Promise<SeatMaster[]> {
    const { data, error } = await supabase
      .from('seats_master')
      .select('*')
      .eq('is_active', true)
      .order('section', { ascending: true })
      .order('x_position', { ascending: true })
      .order('y_position', { ascending: true });

    if (error) {
      console.error('座席マスタ情報の取得に失敗:', error);
      return [];
    }

    return data || [];
  },

  // 全メンバー情報を取得
  async getAllMembers(): Promise<Member[]> {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('is_active', true)
      .order('department', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('メンバー情報の取得に失敗:', error);
      return [];
    }

    return data || [];
  },

  // メンバーのプロジェクト情報を取得
  async getMemberProjects(memberId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('member_projects')
      .select(`
        projects:project_id (
          id,
          name,
          description,
          color,
          is_active
        )
      `)
      .eq('member_id', memberId)
      .eq('is_active', true);

    if (error) {
      console.error('メンバープロジェクト情報の取得に失敗:', error);
      return [];
    }

    return data?.map(item => item.projects).filter(Boolean) || [];
  },

  // 全プロジェクト情報を取得
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('プロジェクト情報の取得に失敗:', error);
      return [];
    }

    return data || [];
  },

  // 全コンステレーション情報を取得
  async getAllConstellations(): Promise<Constellation[]> {
    const { data, error } = await supabase
      .from('constellations')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('コンステレーション情報の取得に失敗:', error);
      return [];
    }

    return data || [];
  },

  // コンステレーションのメンバー情報を取得
  async getConstellationMembers(constellationId: string): Promise<Member[]> {
    const { data, error } = await supabase
      .from('constellation_members')
      .select(`
        members:member_id (
          id,
          name,
          avatar,
          department,
          role,
          status,
          comment,
          location_type,
          location_name,
          location_prefecture,
          location_coordinates_x,
          location_coordinates_y
        )
      `)
      .eq('constellation_id', constellationId)
      .eq('is_active', true);

    if (error) {
      console.error('コンステレーションメンバー情報の取得に失敗:', error);
      return [];
    }

    return data?.map(item => item.members).filter(Boolean) || [];
  },

  // メンバーステータス更新
  async updateMemberStatus(memberId: string, status: Member['status']): Promise<boolean> {
    const { error } = await supabase
      .from('members')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId);

    if (error) {
      console.error('メンバーステータス更新に失敗:', error);
      return false;
    }

    return true;
  },

  // メンバーコメント更新
  async updateMemberComment(memberId: string, comment: string): Promise<boolean> {
    const { error } = await supabase
      .from('members')
      .update({ 
        comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId);

    if (error) {
      console.error('メンバーコメント更新に失敗:', error);
      return false;
    }

    return true;
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