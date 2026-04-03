import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

import CollectibleListItem from '@/app/collectible/[type]/item';
import { useItemOwnership } from '@/hooks/useItemOwnership';

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

const mockSetMessage = vi.fn();
vi.mock('jotai', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('jotai')>();
  return { ...actual, useSetAtom: vi.fn(() => mockSetMessage) };
});

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

describe('CollectibleListItem', () => {
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
    user: { id: '1', name: 'User 1', image: '', email: '' },
    expires: '',
  };

  const mockedUseItemOwnership = vi.mocked(useItemOwnership);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders item name, image, and sources', () => {
    render(<CollectibleListItem item={mockItem} type="minions" session={mockSession} />);
    expect(screen.getByText('Minion 1')).toBeInTheDocument();
    expect(screen.getAllByTestId('source')).toHaveLength(1);
    expect(screen.getByAltText('Minion 1')).toHaveAttribute('src', '/xivlogo.png');
  });

  it('calls handleAddOrRemove and updates UI optimistically', async () => {
    const handleAddOrRemove = vi.fn().mockResolvedValue(undefined);
    mockedUseItemOwnership.mockReturnValue({ owned: false, handleAddOrRemove });

    render(<CollectibleListItem item={mockItem} type="minions" session={mockSession} />);

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(mockSetMessage).toHaveBeenCalledWith({ content: 'Added Minion 1 to your collection.' });

    await screen.findByRole('button', { name: /remove/i });
    await waitFor(() => expect(handleAddOrRemove).toHaveBeenCalled());
  });

  it('shows ✔ icon when owned optimistically', async () => {
    render(<CollectibleListItem item={mockItem} type="minions" session={mockSession} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(screen.getByText('✔')).toBeInTheDocument());
  });

  it('restores state and shows error message on failure', async () => {
    const handleAddOrRemove = vi.fn().mockRejectedValue(new Error('Fail'));
    mockedUseItemOwnership.mockReturnValue({ owned: false, handleAddOrRemove });

    render(<CollectibleListItem item={mockItem} type="minions" session={mockSession} />);
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await screen.findByRole('button', { name: /add/i });
    expect(mockSetMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });
});
