'use client';

import { useState, useEffect } from 'react';
import { qrCodeGenerator } from '@/utils/qr-code-generator';
import { supabaseApi } from '@/lib/supabase';

export default function QRGeneratorPage() {
  const [seatIds, setSeatIds] = useState<string[]>(['']);
  const [generatedQRCodes, setGeneratedQRCodes] = useState<Array<{ seatId: string; dataUrl: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSeats, setAvailableSeats] = useState<string[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(false);

  const addSeatInput = () => {
    setSeatIds([...seatIds, '']);
  };

  const removeSeatInput = (index: number) => {
    setSeatIds(seatIds.filter((_, i) => i !== index));
  };

  const updateSeatId = (index: number, value: string) => {
    const updated = [...seatIds];
    updated[index] = value;
    setSeatIds(updated);
  };

  // Supabaseから座席データを取得
  useEffect(() => {
    const loadAvailableSeats = async () => {
      setIsLoadingSeats(true);
      try {
        const seats = await supabaseApi.getAllSeats();
        const seatIds = seats.map(seat => seat.seat_id);
        setAvailableSeats(seatIds);
      } catch (error) {
        console.error('座席データの取得に失敗:', error);
        setError('座席データの取得に失敗しました');
      } finally {
        setIsLoadingSeats(false);
      }
    };

    loadAvailableSeats();
  }, []);

  const generateBulkSeatIds = () => {
    // Supabaseから取得した実際の座席IDを使用
    if (availableSeats.length > 0) {
      setSeatIds(availableSeats);
    } else {
      // フォールバック: 従来のハードコード
      const sections = ['A', 'B'];
      const seatPatterns = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', '2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '3-1', '3-2', '3-3', '3-4', '3-5', '3-6'];
      const bulkIds: string[] = [];

      sections.forEach(section => {
        seatPatterns.forEach(pattern => {
          bulkIds.push(`${section}-${pattern}`);
        });
      });

      setSeatIds(bulkIds);
    }
  };

  const generateQRCodes = async () => {
    const validSeatIds = seatIds.filter(id => id.trim() !== '');
    
    if (validSeatIds.length === 0) {
      setError('少なくとも1つの座席IDを入力してください');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const results = await qrCodeGenerator.generateMultipleQRCodes(validSeatIds);
      setGeneratedQRCodes(results);
    } catch (err) {
      console.error('QRコード生成エラー:', err);
      setError('QRコードの生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = (seatId: string, dataUrl: string) => {
    const link = document.createElement('a');
    link.download = `qr-code-${seatId}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllQRCodes = () => {
    generatedQRCodes.forEach(({ seatId, dataUrl }) => {
      if (dataUrl) {
        setTimeout(() => downloadQRCode(seatId, dataUrl), 100);
      }
    });
  };

  const generatePrintablePage = () => {
    const validQRCodes = generatedQRCodes.filter(qr => qr.dataUrl !== '');
    const html = qrCodeGenerator.generatePrintableHTML(validQRCodes);
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">QRコード生成ツール</h1>
        <p className="text-gray-600">座席用のQRコードを生成・管理できます</p>
      </div>

      {/* 座席ID入力セクション */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">座席ID設定</h2>
          <div className="space-x-2">
            <button
              onClick={generateBulkSeatIds}
              disabled={isLoadingSeats}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
            >
              {isLoadingSeats ? '読み込み中...' : `一括生成 (${availableSeats.length > 0 ? availableSeats.length + '席' : 'DB取得'})`}
            </button>
            <button
              onClick={addSeatInput}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              座席を追加
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seatIds.map((seatId, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={seatId}
                onChange={(e) => updateSeatId(index, e.target.value)}
                placeholder={`座席ID ${index + 1}`}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {seatIds.length > 1 && (
                <button
                  onClick={() => removeSeatInput(index)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2"
                >
                  削除
                </button>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={generateQRCodes}
            disabled={isGenerating}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              isGenerating
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isGenerating ? 'QRコード生成中...' : 'QRコードを生成'}
          </button>
        </div>
      </div>

      {/* 生成されたQRコード表示セクション */}
      {generatedQRCodes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              生成されたQRコード ({generatedQRCodes.filter(qr => qr.dataUrl).length}件)
            </h2>
            <div className="space-x-2">
              <button
                onClick={generatePrintablePage}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                印刷用ページを開く
              </button>
              <button
                onClick={downloadAllQRCodes}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                すべてダウンロード
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedQRCodes.map(({ seatId, dataUrl }) => (
              <div key={seatId} className="border border-gray-200 rounded-lg p-4 text-center">
                {dataUrl ? (
                  <>
                    <img
                      src={dataUrl}
                      alt={`QR Code for ${seatId}`}
                      className="mx-auto mb-3 max-w-full h-auto"
                    />
                    <h3 className="font-semibold text-gray-800 mb-2">座席: {seatId}</h3>
                    <button
                      onClick={() => downloadQRCode(seatId, dataUrl)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      ダウンロード
                    </button>
                  </>
                ) : (
                  <div className="text-red-600">
                    <div className="text-4xl mb-2">❌</div>
                    <p className="font-semibold">座席: {seatId}</p>
                    <p className="text-sm">生成に失敗しました</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 使用方法 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">使用方法</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
            <span>座席IDを入力または一括生成ボタンでIDを設定</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
            <span>「QRコードを生成」ボタンでQRコードを作成</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
            <span>個別ダウンロード、一括ダウンロード、または印刷用ページで出力</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
            <span>生成されたQRコードを座席に配置して運用開始</span>
          </div>
        </div>
      </div>
    </div>
  );
}