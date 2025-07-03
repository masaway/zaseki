'use client';

interface ZoomControlsProps {
  zoomScale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({ zoomScale, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-black bg-opacity-60 rounded-lg p-2">
      <button
        onClick={onZoomIn}
        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors"
        title="ズームイン"
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center transition-colors"
        title="ズームアウト"
      >
        -
      </button>
      <button
        onClick={onReset}
        className="w-8 h-8 bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center justify-center transition-colors text-xs"
        title="リセット"
      >
        ↺
      </button>
      <div className="text-white text-xs text-center mt-1">
        {Math.round(zoomScale * 100)}%
      </div>
    </div>
  );
}