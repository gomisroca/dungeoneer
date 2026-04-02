import { type ExpandedInstance } from 'types';
import { describe, expect, it } from 'vitest';

import { getOwnershipStatus } from '@/hooks/useCheckOwnership';

const emptyInstance: ExpandedInstance = {
  id: 1,
  name: 'Test',
  description: '',
  image: null,
  patch: null,
  minions: [],
  mounts: [],
  cards: [],
  orchestrions: [],
  spells: [],
  emotes: [],
  hairstyles: [],
};

const instanceWithItems: ExpandedInstance = {
  ...emptyInstance,
  minions: [{ id: '1', name: 'Minion', owners: [{ id: 'user-1' }] } as never],
};

describe('getOwnershipStatus', () => {
  it('returns empty when instance has no collectibles', () => {
    expect(getOwnershipStatus(emptyInstance, false)).toBe('empty');
  });

  it('returns owned when isOwned is true and has items', () => {
    expect(getOwnershipStatus(instanceWithItems, true)).toBe('owned');
  });

  it('returns not-owned when isOwned is false and has items', () => {
    expect(getOwnershipStatus(instanceWithItems, false)).toBe('not-owned');
  });
});
