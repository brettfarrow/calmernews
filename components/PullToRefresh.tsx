import { useCallback, useEffect, useRef, useState } from 'react';

type PullProgress = {
  progress: number; // 0 to 1+
  isThresholdMet: boolean;
};

type PullToRefreshProps = {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  pullingContent?: React.ReactNode | ((info: PullProgress) => React.ReactNode);
  refreshingContent?: React.ReactNode;
  pullDownThreshold?: number;
  maxPullDistance?: number;
  className?: string;
};

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  pullingContent = null,
  refreshingContent,
  pullDownThreshold = 80,
  maxPullDistance = 140,
  className,
}) => {
  const [pullDistance, setPullDistanceState] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const isMountedRef = useRef(true);

  const threshold = pullDownThreshold > 0 ? pullDownThreshold : 1;
  const maxPull = Math.max(maxPullDistance, threshold);

  // Resolve refreshing content - if undefined, use pullingContent (calling it if it's a function)
  const getRefreshingContent = (): React.ReactNode => {
    if (refreshingContent !== undefined) {
      return refreshingContent;
    }
    if (typeof pullingContent === 'function') {
      return pullingContent({ progress: 1, isThresholdMet: true });
    }
    return pullingContent;
  };

  const setPullDistance = (value: number): void => {
    pullDistanceRef.current = value;
    setPullDistanceState(value);
  };

  // Apply rubber-band damping for a more natural pull feel
  const applyDamping = (distance: number): number => {
    if (distance <= threshold) {
      return distance;
    }
    // Logarithmic damping past threshold creates elastic resistance
    const overpull = distance - threshold;
    const dampedOverpull = Math.log(overpull + 1) * 15;
    return threshold + dampedOverpull;
  };

  const isAtTop = (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.scrollY <= 0;
  };

  const getTouchPoint = (
    event: React.TouchEvent<HTMLDivElement>
  ): { x: number; y: number } => {
    const touch = event.touches[0] ?? event.changedTouches[0];
    return {
      x: touch?.clientX ?? 0,
      y: touch?.clientY ?? 0,
    };
  };

  const resetPull = (): void => {
    setIsPulling(false);
    isPullingRef.current = false;
    startYRef.current = null;
    startXRef.current = null;
  };

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>
  ): void => {
    if (isRefreshing || !isAtTop()) {
      return;
    }
    if (event.touches.length !== 1) {
      return;
    }
    const { x, y } = getTouchPoint(event);
    startXRef.current = x;
    startYRef.current = y;
    isPullingRef.current = true;
    setIsPulling(true);
  };

  const handleTouchMove = (
    event: React.TouchEvent<HTMLDivElement>
  ): void => {
    if (!isPullingRef.current || isRefreshing) {
      return;
    }
    const startY = startYRef.current;
    const startX = startXRef.current;
    if (startY === null || startX === null) {
      return;
    }
    const { x, y } = getTouchPoint(event);
    const deltaY = y - startY;
    const deltaX = x - startX;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      resetPull();
      setPullDistance(0);
      return;
    }

    if (deltaY <= 0) {
      setPullDistance(0);
      return;
    }

    if (!isAtTop()) {
      resetPull();
      setPullDistance(0);
      return;
    }

    setPullDistance(Math.min(deltaY, maxPull));
  };

  const handleRelease = useCallback((): void => {
    if (!isPullingRef.current) {
      return;
    }
    resetPull();
    if (pullDistanceRef.current >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold);
      Promise.resolve(onRefresh())
        .catch(() => {})
        .finally(() => {
          if (!isMountedRef.current) {
            return;
          }
          setIsRefreshing(false);
          setPullDistance(0);
        });
      return;
    }
    setPullDistance(0);
  }, [onRefresh, threshold]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const dampedDistance = applyDamping(pullDistance);
  const translateY = isRefreshing ? threshold : dampedDistance;
  const indicatorOpacity = Math.min(translateY / threshold, 1);
  const indicatorTranslate = Math.min(translateY, threshold) - threshold;
  // Scale indicator from 0.5 to 1 as user pulls
  const indicatorScale = 0.5 + 0.5 * Math.min(translateY / threshold, 1);
  const containerClassName = ['relative', className]
    .filter(Boolean)
    .join(' ');

  // Spring-like easing for natural bounce feel
  const springTransition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out';

  return (
    <div
      className={containerClassName}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleRelease}
      onTouchCancel={handleRelease}
    >
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 flex justify-center"
        style={{
          height: threshold,
          opacity: indicatorOpacity,
          transform: `translateY(${indicatorTranslate}px) scale(${indicatorScale})`,
          transition: isPulling ? 'none' : springTransition,
        }}
      >
        {isRefreshing
          ? getRefreshingContent()
          : typeof pullingContent === 'function'
            ? pullingContent({
                progress: translateY / threshold,
                isThresholdMet: translateY >= threshold,
              })
            : pullingContent}
      </div>
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isPulling ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
export type { PullProgress };
