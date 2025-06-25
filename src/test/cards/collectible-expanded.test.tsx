import { fireEvent, render, screen } from '@testing-library/react';
import {
  type CardSource,
  type EmoteSource,
  type HairstyleSource,
  type MinionSource,
  type MountSource,
  type OrchestrionSource,
  type SpellSource,
} from 'generated/prisma';
import React from 'react';
import { type ExpandedMinion } from 'types';
import { expect, vi } from 'vitest';

import { ItemCard } from '@/app/_components/ui/cards';
import { useItemOwnership } from '@/hooks/useItemOwnership';
import { useMessage } from '@/hooks/useMessage';

interface ButtonProps {
  arialabel?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

vi.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img data-testid="image" src={props.src} alt={props.alt} />,
}));

vi.mock('@/hooks/useItemOwnership', () => ({
  useItemOwnership: vi.fn(() => ({
    owned: false,
    handleAddOrRemove: vi.fn().mockResolvedValue(undefined),
  })),
}));

vi.mock('@/hooks/useMessage', () => ({
  useMessage: vi.fn(() => vi.fn()),
}));

vi.mock('@/app/_components/ui/button', () => ({
  __esModule: true,
  default: (props: ButtonProps) => <button {...props}>{props.children}</button>,
}));

vi.mock('@/app/_components/source', () => ({
  __esModule: true,
  default: ({
    source,
  }: {
    source: MinionSource | MountSource | OrchestrionSource | SpellSource | EmoteSource | HairstyleSource | CardSource;
  }) => <div data-testid="source">{source.id}</div>,
}));

describe('CollectibleCard', () => {
  const mockItem: ExpandedMinion = {
    id: '1',
    name: 'Minion 1',
    image: '/xivlogo.png',
    owners: [{ id: '1', name: 'Owner 1', image: '', email: '', emailVerified: new Date() }],
    sources: [{ id: '1', type: 'Dungeon', text: 'Halatali', minionId: '1' }],
    description: 'This is a basic minion description.',
    shortDescription: 'A cute minion.',
    tradeable: true,
    behavior: 'Passive',
    race: 'Bug',
    patch: '1.0',
    owned: '10%',
  };

  const mockSession = {
    user: {
      id: '1',
      name: 'User 1',
      image: '',
      email: '',
      minions: [],
      mounts: [],
      orchestrions: [],
      spells: [],
      cards: [],
      emotes: [],
      hairstyles: [],
    },
    expires: '',
  };

  const mockedUseItemOwnership = vi.mocked(useItemOwnership);
  const mockedUseMessage = vi.mocked(useMessage);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders item name, image, and sources', () => {
    render(<ItemCard item={mockItem} type="minions" session={mockSession} />);

    expect(screen.getByText('Minion 1')).toBeInTheDocument();
    expect(screen.getAllByTestId('source')).toHaveLength(1);
    expect(screen.getByAltText('Minion 1')).toHaveAttribute('src', '/xivlogo.png');
  });

  it('shows "Add" button when item is not owned', () => {
    render(<ItemCard item={mockItem} type="minions" session={mockSession} />);

    const button = screen.getByRole('button', { name: /add/i });
    expect(button).toBeInTheDocument();
  });

  it('transitions to "Remove" state after click', async () => {
    const setMessage = vi.fn();
    const handleAddOrRemove = vi.fn().mockResolvedValue(undefined);

    mockedUseItemOwnership.mockReturnValue({
      owned: false,
      handleAddOrRemove,
    });

    mockedUseMessage.mockReturnValue(setMessage);

    render(<ItemCard item={mockItem} type="minions" session={mockSession} />);

    const button = screen.getByRole('button', { name: /add/i });
    fireEvent.click(button);

    expect(setMessage).toHaveBeenCalledWith({
      content: 'Added Minion 1 to your collection.',
    });

    await screen.findByRole('button', { name: /remove/i });
    expect(handleAddOrRemove).toHaveBeenCalled();
  });

  it('handles error and reverts optimistic state', async () => {
    const setMessage = vi.fn();
    const handleAddOrRemove = vi.fn().mockRejectedValue(new Error('Fail'));

    mockedUseItemOwnership.mockReturnValue({
      owned: false,
      handleAddOrRemove,
    });

    mockedUseMessage.mockReturnValue(setMessage);

    render(<ItemCard item={mockItem} type="minions" session={mockSession} />);

    const button = screen.getByRole('button', { name: /add/i });
    fireEvent.click(button);

    await screen.findByRole('button', { name: /add/i });
    expect(setMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        error: true,
      })
    );
  });
});
