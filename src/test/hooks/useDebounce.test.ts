import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useDebounce from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('does not update before the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'hello' },
    });
    rerender({ value: 'world' });
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe('hello');
  });

  it('updates after the delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'hello' },
    });
    rerender({ value: 'world' });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('world');
  });

  it('resets the timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'hello' },
    });
    rerender({ value: 'wor' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    rerender({ value: 'world' });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('hello');
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('world');
  });
});
