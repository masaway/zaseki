'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScannerComponent } from '@/components/mobile/qr-scanner';
import { QRCodeData } from '@/lib/supabase';
import { localStorageUtils } from '@/utils/localStorage';

export default function QRReaderPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQRScan = async (qrData: QRCodeData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // QRコードデータの検証
      if (!qrData.seatId) {
        setError('無効なQRコードです。座席IDが含まれていません。');
        return;
      }

      // ユーザー情報の確認
      const userInfo = localStorageUtils.getUserInfo();
      
      if (!userInfo) {
        // ユーザー情報がない場合は入力画面に遷移
        router.push(`/mobile/user-info?seatId=${qrData.seatId}`);
      } else {
        // ユーザー情報がある場合は直接座席情報画面に遷移
        router.push(`/mobile/seat-info/${qrData.seatId}`);
      }
    } catch (err) {
      console.error('QRコード処理エラー:', err);
      setError('QRコードの処理中にエラーが発生しました。');
    } finally {
      // 2秒後にprocessingステートをリセット
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleQRError = (errorMessage: string) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  const clearError = () => {
    setError(null);
  };

  const hasUserInfo = localStorageUtils.hasUserInfo();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">QRコードスキャン</h2>
        <p className="text-gray-600">
          座席のQRコードをスキャンして座席情報を取得してください
        </p>
      </div>

      {/* ユーザー情報ステータス */}
      <div className={`p-4 rounded-lg border ${
        hasUserInfo 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {hasUserInfo ? '✅' : '⚠️'}
          </span>
          <div>
            <p className={`font-medium ${
              hasUserInfo ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {hasUserInfo ? 'ユーザー情報設定済み' : 'ユーザー情報未設定'}
            </p>
            <p className={`text-sm ${
              hasUserInfo ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {hasUserInfo 
                ? 'QRコードスキャン後、直接座席登録ができます' 
                : 'QRコードスキャン後、ユーザー情報の入力が必要です'
              }
            </p>
          </div>
        </div>
        {hasUserInfo && (
          <button
            onClick={() => router.push('/mobile/user-info')}
            className="mt-2 text-green-600 text-sm hover:text-green-800 transition-colors"
          >
            ユーザー情報を編集
          </button>
        )}
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-xl">❌</span>
            <div className="flex-1">
              <h3 className="font-medium text-red-800">エラーが発生しました</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={clearError}
            className="mt-3 text-red-600 text-sm hover:text-red-800 transition-colors"
          >
            エラーを閉じる
          </button>
        </div>
      )}

      {/* 処理中表示 */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="text-blue-800 font-medium">QRコードを処理中...</p>
          </div>
        </div>
      )}

      {/* QRスキャナー */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <QRScannerComponent
          onScan={handleQRScan}
          onError={handleQRError}
        />
      </div>

      {/* 使用方法 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">使用方法</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
            <span>スキャン開始ボタンを押してカメラを起動</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
            <span>座席のQRコードにカメラを向ける</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
            <span>自動的に読み取りが開始されます</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
            <span>座席情報画面で詳細を確認して登録</span>
          </li>
        </ol>
      </div>

      {/* フッターナビゲーション */}
      <div className="flex space-x-4">
        <button
          onClick={() => router.push('/')}
          className="flex-1 py-3 px-4 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          メインページに戻る
        </button>
        {hasUserInfo && (
          <button
            onClick={() => localStorageUtils.clearUserInfo()}
            className="flex-1 py-3 px-4 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            ユーザー情報をリセット
          </button>
        )}
      </div>
    </div>
  );
}