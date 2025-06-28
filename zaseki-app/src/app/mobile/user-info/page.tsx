'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserInfo } from '@/lib/supabase';
import { localStorageUtils } from '@/utils/localStorage';

export default function UserInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seatId = searchParams.get('seatId');

  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    department: '',
    projects: [],
    comment: ''
  });

  const [newProject, setNewProject] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 既存のユーザー情報があれば読み込み
    const existingUserInfo = localStorageUtils.getUserInfo();
    if (existingUserInfo) {
      setUserInfo(existingUserInfo);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!userInfo.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!userInfo.department.trim()) {
      newErrors.department = '所属部署は必須です';
    }

    if (userInfo.projects.length === 0) {
      newErrors.projects = '少なくとも1つのプロジェクトを追加してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProject = () => {
    if (newProject.trim() && !userInfo.projects.includes(newProject.trim())) {
      setUserInfo(prev => ({
        ...prev,
        projects: [...prev.projects, newProject.trim()]
      }));
      setNewProject('');
      // プロジェクト関連のエラーをクリア
      if (errors.projects) {
        setErrors(prev => ({ ...prev, projects: '' }));
      }
    }
  };

  const removeProject = (index: number) => {
    setUserInfo(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // ユーザー情報をlocalStorageに保存
      localStorageUtils.saveUserInfo(userInfo);

      // 座席情報画面に遷移
      if (seatId) {
        router.push(`/mobile/seat-info/${seatId}`);
      } else {
        router.push('/mobile/qr-reader');
      }
    } catch (error) {
      console.error('ユーザー情報の保存に失敗:', error);
      alert('ユーザー情報の保存に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">ユーザー情報入力</h2>
        <p className="text-gray-600">
          座席利用のためにあなたの情報を入力してください
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 名前 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={userInfo.name}
            onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="山田 太郎"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* 所属部署 */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
            所属部署 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="department"
            value={userInfo.department}
            onChange={(e) => setUserInfo(prev => ({ ...prev, department: e.target.value }))}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="開発部"
          />
          {errors.department && <p className="mt-1 text-sm text-red-500">{errors.department}</p>}
        </div>

        {/* プロジェクト */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            プロジェクト <span className="text-red-500">*</span>
          </label>
          
          {/* プロジェクト追加 */}
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProject())}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="プロジェクト名を入力"
            />
            <button
              type="button"
              onClick={addProject}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              追加
            </button>
          </div>

          {/* プロジェクト一覧 */}
          <div className="space-y-2">
            {userInfo.projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-800">{project}</span>
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
          
          {errors.projects && <p className="mt-1 text-sm text-red-500">{errors.projects}</p>}
        </div>

        {/* 一言コメント */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            一言コメント（任意）
          </label>
          <textarea
            id="comment"
            value={userInfo.comment || ''}
            onChange={(e) => setUserInfo(prev => ({ ...prev, comment: e.target.value }))}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="今日の作業内容や連絡事項など..."
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '保存中...' : '情報を保存して続行'}
        </button>
      </form>

      {/* 戻るボタン */}
      <button
        onClick={() => router.back()}
        className="w-full py-2 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        戻る
      </button>
    </div>
  );
}