import { UserInfo } from '@/lib/supabase';

const USER_INFO_KEY = 'zaseki_user_info';

export const localStorageUtils = {
  // ユーザー情報を保存
  saveUserInfo(userInfo: UserInfo): void {
    try {
      const jsonData = JSON.stringify(userInfo);
      localStorage.setItem(USER_INFO_KEY, jsonData);
    } catch (error) {
      console.error('ユーザー情報の保存に失敗:', error);
    }
  },

  // ユーザー情報を取得
  getUserInfo(): UserInfo | null {
    try {
      const jsonData = localStorage.getItem(USER_INFO_KEY);
      if (!jsonData) return null;
      
      const userInfo = JSON.parse(jsonData) as UserInfo;
      
      // データの妥当性をチェック
      if (!userInfo.name || !userInfo.department) {
        return null;
      }
      
      return userInfo;
    } catch (error) {
      console.error('ユーザー情報の取得に失敗:', error);
      return null;
    }
  },

  // ユーザー情報を削除
  clearUserInfo(): void {
    try {
      localStorage.removeItem(USER_INFO_KEY);
    } catch (error) {
      console.error('ユーザー情報の削除に失敗:', error);
    }
  },

  // ユーザー情報が存在するかチェック
  hasUserInfo(): boolean {
    return this.getUserInfo() !== null;
  }
};