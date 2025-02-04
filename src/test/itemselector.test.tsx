import { render, screen } from '@testing-library/react';
import { expect, describe, it, vi } from 'vitest';
import { ItemSelector } from '@/app/_components/ItemSelector';
import { type ItemType } from 'types';

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
  type: 'minions' as ItemType,
  session: null,
};

describe('ItemSelector', () => {
  it('should render correctly', () => {
    render(<ItemSelector items={props.items} type={props.type} session={props.session} />);
    expect(screen.getByRole('button', { name: 'item-view' })).toBeInTheDocument();
  });
});
