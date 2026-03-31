import { render, screen } from '@testing-library/react';
import { type ItemRouteKey } from 'types';
import { describe, expect, it, vi } from 'vitest';

import { ItemSelector } from '@/app/_components/item-selector';

vi.mock('@/hooks/useItemOwnership', () => ({
  __esModule: true,
  useItemOwnership: () => ({
    isOwner: vi.fn().mockReturnValue(true),
  }),
}));

const props = {
  items: [
    {
      id: 'item-id',
      name: 'Item Name',
      image: 'http://example.com/image.png',
      owners: [{ id: 'owner-id' }],
    },
  ],
  type: 'minions' as ItemRouteKey,
  session: null,
};

describe('ItemSelector', () => {
  it('should render correctly', () => {
    render(<ItemSelector items={props.items} type={props.type} session={props.session} />);
    expect(screen.getByRole('button', { name: 'item-view' })).toBeInTheDocument();
  });
});
