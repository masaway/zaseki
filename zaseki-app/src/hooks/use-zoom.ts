import { useCallback, useRef, useState } from "react";

interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface ZoomControls {
  zoomState: ZoomState;
  handleWheel: (event: React.WheelEvent) => void;
  handleMouseDown: (event: React.MouseEvent) => void;
  handleMouseMove: (event: React.MouseEvent) => void;
  handleMouseUp: () => void;
  resetZoom: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const ZOOM_SENSITIVITY = 0.001;
const ZOOM_STEP = 0.2;

export const useZoom = (initialScale = 1): ZoomControls => {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: initialScale,
    translateX: 0,
    translateY: 0,
  });

  const isDragging = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();

    const currentTarget = event.currentTarget as HTMLElement;
    if (!currentTarget) return;

    const rect = currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setZoomState((prevState) => {
      const delta = -event.deltaY * ZOOM_SENSITIVITY;
      let newScale = prevState.scale + delta;

      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      if (newScale === prevState.scale) return prevState;

      // マウス位置を支点にしたズーム計算
      // transform-origin: centerを考慮した計算
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // マウス位置の中心からの相対位置
      const relativeMouseX = mouseX - centerX;
      const relativeMouseY = mouseY - centerY;

      // 現在のスケールでの実際のマウス位置（transform適用後）
      const actualMouseX =
        (relativeMouseX - prevState.translateX) / prevState.scale;
      const actualMouseY =
        (relativeMouseY - prevState.translateY) / prevState.scale;

      // 新しいスケールでのマウス位置
      const newMouseX = actualMouseX * newScale;
      const newMouseY = actualMouseY * newScale;

      // マウス位置が変わらないようにtranslateを調整
      const newTranslateX = relativeMouseX - newMouseX;
      const newTranslateY = relativeMouseY - newMouseY;

      return {
        scale: newScale,
        translateX: newTranslateX,
        translateY: newTranslateY,
      };
    });
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 0) {
      isDragging.current = true;
      lastMousePosition.current = { x: event.clientX, y: event.clientY };
      event.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = event.clientX - lastMousePosition.current.x;
    const deltaY = event.clientY - lastMousePosition.current.y;

    setZoomState((prevState) => ({
      ...prevState,
      translateX: prevState.translateX + deltaX,
      translateY: prevState.translateY + deltaY,
    }));

    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const resetZoom = useCallback(() => {
    setZoomState({
      scale: 1,
      translateX: 0,
      translateY: 0,
    });
  }, []);

  const zoomIn = useCallback(() => {
    setZoomState((prevState) => ({
      ...prevState,
      scale: Math.min(MAX_SCALE, prevState.scale + ZOOM_STEP),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomState((prevState) => ({
      ...prevState,
      scale: Math.max(MIN_SCALE, prevState.scale - ZOOM_STEP),
    }));
  }, []);

  return {
    zoomState,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetZoom,
    zoomIn,
    zoomOut,
  };
};
