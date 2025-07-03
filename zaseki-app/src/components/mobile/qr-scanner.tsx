'use client';

import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { QRCodeData } from '@/lib/supabase';

interface QRScannerProps {
  onScan: (data: QRCodeData) => void;
  onError: (error: string) => void;
}

export function QRScannerComponent({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const initializeScanner = async () => {
      try {
        // カメラ権限の確認
        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          onError('このデバイスにはカメラが見つかりません');
          return;
        }

        // QRスキャナーの初期化
        const qrScanner = new QrScanner(
          videoRef.current!,
          (result) => {
            try {
              // QRコードデータの解析
              const qrData = JSON.parse(result.data) as QRCodeData;
              
              // zaseki QRコードかチェック
              if (qrData.type !== 'zaseki-qr') {
                onError('無効なQRコードです。座席用のQRコードをスキャンしてください。');
                return;
              }

              // スキャン成功
              onScan(qrData);
              setIsScanning(false);
            } catch (error) {
              onError('QRコードの解析に失敗しました。');
            }
          },
          {
            onDecodeError: () => {
              // デコードエラーは無視（連続スキャン中は頻発するため）
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // 背面カメラを優先
          }
        );

        qrScannerRef.current = qrScanner;
        setHasPermission(true);
      } catch (error) {
        console.error('QRスキャナーの初期化に失敗:', error);
        setHasPermission(false);
        onError('カメラのアクセス権限が必要です。ブラウザの設定でカメラアクセスを許可してください。');
      }
    };

    initializeScanner();

    // クリーンアップ
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [onScan, onError]);

  const startScanning = async () => {
    if (qrScannerRef.current && hasPermission) {
      try {
        await qrScannerRef.current.start();
        setIsScanning(true);
      } catch (error) {
        console.error('スキャンの開始に失敗:', error);
        onError('スキャンの開始に失敗しました。');
      }
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      setIsScanning(false);
    }
  };

  if (hasPermission === null) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">カメラを初期化中...</p>
      </div>
    );
  }

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-red-500 text-6xl">📷</div>
        <h3 className="text-lg font-semibold text-gray-800">カメラアクセスが必要です</h3>
        <p className="text-gray-600 text-center">
          QRコードをスキャンするためにカメラのアクセス権限を許可してください。
          ブラウザの設定でカメラアクセスを有効にした後、ページを再読み込みしてください。
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ページを再読み込み
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* カメラビデオ */}
      <div className="relative w-full max-w-sm aspect-square bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        
        {/* スキャンエリアのオーバーレイ */}
        <div className="absolute inset-0 border-2 border-white border-opacity-50">
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500"></div>
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500"></div>
        </div>
      </div>

      {/* スキャンステータス */}
      <div className="text-center">
        {isScanning ? (
          <p className="text-blue-600 font-medium animate-pulse">
            QRコードをスキャン中...
          </p>
        ) : (
          <p className="text-gray-600">
            QRコードをカメラに向けてスキャンボタンを押してください
          </p>
        )}
      </div>

      {/* スキャンコントロールボタン */}
      <div className="flex space-x-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>📷</span>
            <span>スキャン開始</span>
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <span>⏹️</span>
            <span>スキャン停止</span>
          </button>
        )}
      </div>
    </div>
  );
}