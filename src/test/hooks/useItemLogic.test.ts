import { renderHook } from '@testing-library/react';
import { type Session } from 'next-auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useItemLogic } from '@/hooks/useItemLogic';

const mockAddOrRemoveItem = vi.fn().mockResolvedValue({ message: 'Done' });
vi.mock('@/actions/items', () => ({
  addOrRemoveItem: (...args: unknown[]): Promise<{ message: string }> =>
    mockAddOrRemoveItem(...args) as Promise<{ message: string }>,
}));
const mockItem = { id: '1', name: 'Test Minion', image: null, owners: [], type: 'minions' as const };
const mockSession = { user: { id: 'user-1', name: 'User', email: 'u@u.com' }, expires: '' } as Session;

describe('useItemLogic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('adds item to localStorage when no session', async () => {
    const { result } = renderHook(() => useItemLogic(mockItem, null));
    await result.current();
    const stored = JSON.parse(localStorage.getItem('userItems') ?? '[]') as { id: string }[];
    expect(stored).toHaveLength(1);
    expect(stored[0]?.id).toBe('1');
  });

  it('removes item from localStorage if already present', async () => {
    localStorage.setItem('userItems', JSON.stringify([mockItem]));
    const { result } = renderHook(() => useItemLogic(mockItem, null));
    await result.current();
    const stored = JSON.parse(localStorage.getItem('userItems') ?? '[]') as { id: string }[];
    expect(stored).toHaveLength(0);
  });

  it('calls addOrRemoveItem when session exists', async () => {
    const { result } = renderHook(() => useItemLogic(mockItem, mockSession));
    await result.current();
    expect(mockAddOrRemoveItem).toHaveBeenCalledWith('minion', '1');
  });
});
