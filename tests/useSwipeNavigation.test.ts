// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';

function touch(x: number, y: number) {
  return { clientX: x, clientY: y };
}

function touchEvent(x: number, y: number) {
  return {
    touches: [touch(x, y)],
    preventDefault: vi.fn(),
  } as unknown as React.TouchEvent;
}

describe('useSwipeNavigation', () => {
  it('calls onSwipedRight on right swipe', () => {
    const onSwipedRight = vi.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipedRight, threshold: 50 })
    );

    result.current.onTouchStart(touchEvent(100, 200));
    result.current.onTouchMove(touchEvent(200, 200));
    result.current.onTouchEnd();

    expect(onSwipedRight).toHaveBeenCalledOnce();
  });

  it('calls onSwipedLeft on left swipe', () => {
    const onSwipedLeft = vi.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipedLeft, threshold: 50 })
    );

    result.current.onTouchStart(touchEvent(200, 200));
    result.current.onTouchMove(touchEvent(100, 200));
    result.current.onTouchEnd();

    expect(onSwipedLeft).toHaveBeenCalledOnce();
  });

  it('does not trigger on vertical movement', () => {
    const onSwipedLeft = vi.fn();
    const onSwipedRight = vi.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipedLeft, onSwipedRight, threshold: 50 })
    );

    result.current.onTouchStart(touchEvent(100, 100));
    result.current.onTouchMove(touchEvent(100, 300));
    result.current.onTouchEnd();

    expect(onSwipedLeft).not.toHaveBeenCalled();
    expect(onSwipedRight).not.toHaveBeenCalled();
  });

  it('does not trigger when below threshold', () => {
    const onSwipedRight = vi.fn();
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipedRight, threshold: 50 })
    );

    result.current.onTouchStart(touchEvent(100, 200));
    result.current.onTouchMove(touchEvent(130, 200));
    result.current.onTouchEnd();

    expect(onSwipedRight).not.toHaveBeenCalled();
  });

  it('calls preventDefault on horizontal move', () => {
    const event1 = touchEvent(100, 200);
    const event2 = touchEvent(200, 200);
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipedRight: vi.fn() })
    );

    result.current.onTouchStart(event1);
    result.current.onTouchMove(event2);

    expect(event2.preventDefault).toHaveBeenCalled();
  });
});
