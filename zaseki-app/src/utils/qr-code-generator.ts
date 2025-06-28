import QRCode from 'qrcode';
import { QRCodeData } from '@/lib/supabase';

export interface QRCodeGenerationOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export const qrCodeGenerator = {
  // 座席用QRコードデータを生成
  generateSeatQRData(seatId: string): QRCodeData {
    return {
      seatId: seatId,
      type: 'zaseki-qr',
      version: '1.0'
    };
  },

  // QRコードを画像として生成（Data URL）
  async generateQRCodeImage(
    seatId: string, 
    options: QRCodeGenerationOptions = {}
  ): Promise<string> {
    const qrData = this.generateSeatQRData(seatId);
    const qrDataString = JSON.stringify(qrData);

    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const dataUrl = await QRCode.toDataURL(qrDataString, mergedOptions);
      return dataUrl;
    } catch (error) {
      console.error('QRコードの生成に失敗:', error);
      throw new Error('QRコードの生成に失敗しました');
    }
  },

  // 複数座席のQRコードを一括生成
  async generateMultipleQRCodes(
    seatIds: string[], 
    options: QRCodeGenerationOptions = {}
  ): Promise<Array<{ seatId: string; dataUrl: string }>> {
    const results = [];

    for (const seatId of seatIds) {
      try {
        const dataUrl = await this.generateQRCodeImage(seatId, options);
        results.push({ seatId, dataUrl });
      } catch (error) {
        console.error(`座席 ${seatId} のQRコード生成に失敗:`, error);
        results.push({ seatId, dataUrl: '' });
      }
    }

    return results;
  },

  // QRコードをSVG形式で生成
  async generateQRCodeSVG(
    seatId: string, 
    options: QRCodeGenerationOptions = {}
  ): Promise<string> {
    const qrData = this.generateSeatQRData(seatId);
    const qrDataString = JSON.stringify(qrData);

    const defaultOptions = {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M' as const
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const svg = await QRCode.toString(qrDataString, {
        ...mergedOptions,
        type: 'svg'
      });
      return svg;
    } catch (error) {
      console.error('SVG QRコードの生成に失敗:', error);
      throw new Error('SVG QRコードの生成に失敗しました');
    }
  },

  // 印刷用のQRコードHTMLを生成
  generatePrintableHTML(
    qrCodes: Array<{ seatId: string; dataUrl: string }>,
    options: {
      title?: string;
      itemsPerRow?: number;
      includeLabels?: boolean;
    } = {}
  ): string {
    const {
      title = 'Zaseki QRコード一覧',
      itemsPerRow = 3,
      includeLabels = true
    } = options;

    const qrItems = qrCodes.map(({ seatId, dataUrl }) => `
      <div class="qr-item">
        <img src="${dataUrl}" alt="QR Code for ${seatId}" />
        ${includeLabels ? `<div class="qr-label">座席: ${seatId}</div>` : ''}
      </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: white;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .qr-container {
            display: grid;
            grid-template-columns: repeat(${itemsPerRow}, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .qr-item {
            text-align: center;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            break-inside: avoid;
        }
        .qr-item img {
            max-width: 100%;
            height: auto;
        }
        .qr-label {
            margin-top: 10px;
            font-weight: bold;
            font-size: 14px;
        }
        @media print {
            .qr-container {
                grid-template-columns: repeat(${Math.min(itemsPerRow, 2)}, 1fr);
            }
            .qr-item {
                break-inside: avoid;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p>生成日時: ${new Date().toLocaleString('ja-JP')}</p>
    </div>
    <div class="qr-container">
        ${qrItems}
    </div>
</body>
</html>`;
  },

  // QRコードの妥当性を検証
  validateQRCode(qrDataString: string): boolean {
    try {
      const qrData = JSON.parse(qrDataString) as QRCodeData;
      return (
        qrData.type === 'zaseki-qr' &&
        qrData.version === '1.0' &&
        typeof qrData.seatId === 'string' &&
        qrData.seatId.length > 0
      );
    } catch {
      return false;
    }
  }
};