import { renderHook } from '@testing-library/react';
import { type Session } from 'next-auth';
import { type ExpandedMinion } from 'types';
import { beforeEach, describe, expect, it } from 'vitest';

import { useItemFilter } from '@/hooks/useItemFilter';

const user = { id: 'user-1' };
const session = { user: { id: 'user-1', name: 'U', email: 'u@u.com' }, expires: '' } as Session;

const owned: ExpandedMinion = { id: '1', name: 'Owned', image: null, owners: [user] } as never;
const unowned: ExpandedMinion = { id: '2', name: 'Unowned', image: null, owners: [] } as never;

describe('useItemFilter', () => {
  beforeEach(() => localStorage.clear());

  it('returns all items when filter is false', () => {
    const { result } = renderHook(() => useItemFilter({ items: [owned, unowned], filter: false, session }));
    expect(result.current).toHaveLength(2);
  });

  it('filters out owned items when filter is true with session', () => {
    const { result } = renderHook(() => useItemFilter({ items: [owned, unowned], filter: true, session }));
    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.id).toBe('2');
  });

  it('filters using localStorage when no session', () => {
    localStorage.setItem('userItems', JSON.stringify([{ id: '1' }]));
    const { result } = renderHook(() => useItemFilter({ items: [owned, unowned], filter: true, session: null }));
    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.id).toBe('2');
  });
});
