'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserInfo, supabaseApi, SeatMaster, SeatUsage } from '@/lib/supabase';
import { localStorageUtils } from '@/utils/localStorage';

export default function SeatInfoPage() {
  const params = useParams();
  const router = useRouter();
  const seatId = params.seatId as string;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [seatMaster, setSeatMaster] = useState<SeatMaster | null>(null);
  const [currentSeatUsage, setCurrentSeatUsage] = useState<SeatUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);

        // ユーザー情報をlocalStorageから取得
        const storedUserInfo = localStorageUtils.getUserInfo();
        if (!storedUserInfo) {
          // ユーザー情報がない場合は入力画面に遷移
          router.push(`/mobile/user-info?seatId=${seatId}`);
          return;
        }
        setUserInfo(storedUserInfo);

        // 座席マスタ情報を取得
        const seatMasterData = await supabaseApi.getSeatMaster(seatId);
        if (!seatMasterData) {
          setError('座席情報が見つかりません。有効なQRコードをスキャンしてください。');
          return;
        }
        setSeatMaster(seatMasterData);

        // 現在の座席利用状況を取得
        const currentUsage = await supabaseApi.getLatestSeatUsage(seatId);
        setCurrentSeatUsage(currentUsage);

      } catch (err) {
        console.error('初期化エラー:', err);
        setError('座席情報の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    if (seatId) {
      initializePage();
    }
  }, [seatId, router]);

  const handleSeatRegistration = async () => {
    if (!userInfo || !seatMaster) return;

    setIsSaving(true);
    setError(null);

    try {
      // 座席利用履歴を保存
      const seatUsageData = {
        seat_id: seatId,
        user_name: userInfo.name,
        department: userInfo.department,
        projects: userInfo.projects,
        comment: userInfo.comment || '',
        scan_datetime: new Date().toISOString(),
      };

      const result = await supabaseApi.saveSeatUsage(seatUsageData);
      if (result) {
        setSuccess(true);
        setCurrentSeatUsage(result);
        
        // 3秒後にQRスキャン画面に戻る
        setTimeout(() => {
          router.push('/mobile/qr-reader');
        }, 3000);
      } else {
        setError('座席登録に失敗しました。もう一度お試しください。');
      }
    } catch (err) {
      console.error('座席登録エラー:', err);
      setError('座席登録中にエラーが発生しました。');
    } finally {
      setIsSaving(false);
    }
  };

  const isCurrentlyOccupied = () => {
    if (!currentSeatUsage) return false;
    
    const scanDate = new Date(currentSeatUsage.scan_datetime);
    const today = new Date();
    return scanDate.toDateString() === today.toDateString();
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">座席情報を読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <div className="text-red-500 text-6xl">❌</div>
        <h2 className="text-xl font-bold text-gray-800">エラーが発生しました</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => router.push('/mobile/qr-reader')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          QRスキャンに戻る
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <div className="text-green-500 text-6xl">✅</div>
        <h2 className="text-xl font-bold text-gray-800">座席登録完了！</h2>
        <p className="text-gray-600">
          座席 {seatId} が正常に登録されました。
          3秒後に自動的にQRスキャン画面に戻ります。
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-green-800 mb-2">登録情報</h3>
          <div className="space-y-1 text-sm text-green-700">
            <p><span className="font-medium">名前:</span> {userInfo?.name}</p>
            <p><span className="font-medium">部署:</span> {userInfo?.department}</p>
            <p><span className="font-medium">プロジェクト:</span> {userInfo?.projects.join(', ')}</p>
            {userInfo?.comment && (
              <p><span className="font-medium">コメント:</span> {userInfo.comment}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">座席情報</h2>
        <p className="text-gray-600">座席の詳細と登録を確認してください</p>
      </div>

      {/* 座席情報カード */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">座席 {seatId}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isCurrentlyOccupied() 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isCurrentlyOccupied() ? '利用中' : '空席'}
          </span>
        </div>

        {seatMaster?.seat_name && (
          <p className="text-gray-600 mb-2">
            <span className="font-medium">座席名:</span> {seatMaster.seat_name}
          </p>
        )}

        {seatMaster?.section && (
          <p className="text-gray-600 mb-4">
            <span className="font-medium">セクション:</span> {seatMaster.section}
          </p>
        )}

        {/* 現在の利用者情報 */}
        {isCurrentlyOccupied() && currentSeatUsage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-red-800 mb-2">現在の利用者</h4>
            <div className="space-y-1 text-sm text-red-700">
              <p><span className="font-medium">名前:</span> {currentSeatUsage.user_name}</p>
              <p><span className="font-medium">部署:</span> {currentSeatUsage.department}</p>
              <p><span className="font-medium">プロジェクト:</span> {currentSeatUsage.projects.join(', ')}</p>
              <p><span className="font-medium">開始時刻:</span> {formatDateTime(currentSeatUsage.scan_datetime)}</p>
              {currentSeatUsage.comment && (
                <p><span className="font-medium">コメント:</span> {currentSeatUsage.comment}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ユーザー情報確認 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">あなたの情報</h3>
        <div className="space-y-2 text-sm text-blue-700">
          <p><span className="font-medium">名前:</span> {userInfo?.name}</p>
          <p><span className="font-medium">部署:</span> {userInfo?.department}</p>
          <p><span className="font-medium">プロジェクト:</span> {userInfo?.projects.join(', ')}</p>
          {userInfo?.comment && (
            <p><span className="font-medium">コメント:</span> {userInfo.comment}</p>
          )}
        </div>
        <button
          onClick={() => router.push(`/mobile/user-info?seatId=${seatId}`)}
          className="mt-3 text-blue-600 text-sm hover:text-blue-800 transition-colors"
        >
          情報を編集
        </button>
      </div>

      {/* アクションボタン */}
      <div className="space-y-3">
        {isCurrentlyOccupied() ? (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <p className="text-orange-800 font-medium mb-2">
              この座席は現在利用中です
            </p>
            <p className="text-orange-600 text-sm">
              別の座席を選択するか、時間をおいてから再度お試しください
            </p>
          </div>
        ) : (
          <button
            onClick={handleSeatRegistration}
            disabled={isSaving}
            className={`w-full py-4 px-4 rounded-lg font-semibold transition-colors ${
              isSaving
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? '登録中...' : 'この座席を利用する'}
          </button>
        )}

        <button
          onClick={() => router.push('/mobile/qr-reader')}
          className="w-full py-3 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          別のQRコードをスキャン
        </button>
      </div>
    </div>
  );
}