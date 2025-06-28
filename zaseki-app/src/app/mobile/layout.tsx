import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zaseki QR - 座席管理システム",
  description: "QRコードで座席管理を行うモバイルアプリ",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#000000",
};

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル専用ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-lg font-bold text-center">Zaseki QR</h1>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 p-4">
        {children}
      </main>

      {/* モバイル専用フッター */}
      <footer className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>© 2024 Zaseki - 座席管理システム</p>
      </footer>
    </div>
  );
}