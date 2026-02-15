import { useRef } from 'react';

type SwipeHandlers = {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
};

type SwipeOptions = {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  threshold?: number;
};

export function useSwipeNavigation({
  onSwipedLeft,
  onSwipedRight,
  threshold = 50,
}: SwipeOptions): SwipeHandlers {
  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const lastXRef = useRef<number | null>(null);
  const directionLockedRef = useRef<'horizontal' | 'vertical' | null>(null);

  const onTouchStart = (e: React.TouchEvent): void => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    lastXRef.current = touch.clientX;
    directionLockedRef.current = null;
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    if (
      startXRef.current === null ||
      startYRef.current === null ||
      directionLockedRef.current === 'vertical'
    )
      return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startXRef.current;
    const deltaY = touch.clientY - startYRef.current;

    if (directionLockedRef.current === null) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        directionLockedRef.current =
          Math.abs(deltaX) >= Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
    }

    if (directionLockedRef.current === 'horizontal') {
      lastXRef.current = touch.clientX;
      e.preventDefault();
    }
  };

  const onTouchEnd = (): void => {
    const startX = startXRef.current;
    const lastX = lastXRef.current;
    const direction = directionLockedRef.current;

    startXRef.current = null;
    startYRef.current = null;
    lastXRef.current = null;
    directionLockedRef.current = null;

    if (startX === null || lastX === null || direction !== 'horizontal') return;

    const deltaX = lastX - startX;
    if (Math.abs(deltaX) < threshold) return;

    if (deltaX > 0) {
      onSwipedRight?.();
    } else {
      onSwipedLeft?.();
    }
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}
