import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  type Card,
  type Emote,
  type Hairstyle,
  type Minion,
  type Mount,
  type Orchestrion,
  type Spell,
} from 'generated/prisma';
import { describe, expect, it, vi } from 'vitest';

import NavbarMenu from '@/app/_components/navbar/navbar-menu';

vi.mock('@/hooks/useItemSync', () => ({
  __esModule: true,
  default: () => ({
    syncCollection: vi.fn(),
    isSyncing: false,
    getLocalItems: () => [],
  }),
}));

describe('NavbarMenu', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the NavbarMenu component correctly', () => {
    render(<NavbarMenu session={null} />);

    // Check if the menu button is rendered
    expect(screen.getByRole('button', { name: 'Expand menu' })).toBeInTheDocument();
  });

  it('toggles the menu expansion correctly', () => {
    render(<NavbarMenu session={null} />);

    const menuButton = screen.getByRole('button', { name: 'Expand menu' });

    // Expand the menu
    act(() => {
      fireEvent.click(menuButton);
    });
    const menu = screen.getByTestId('expandable-menu');
    expect(menu).toBeVisible();
  });

  it('renders session-based buttons correctly when session is null', () => {
    render(<NavbarMenu session={null} />);
    const menuButton = screen.getByRole('button', { name: 'Expand menu' });

    // Expand the menu
    act(() => {
      fireEvent.click(menuButton);
    });
    // Check if SignInButton is rendered
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();

    // Check if SignOutButton and SyncButton are not rendered
    expect(screen.queryByRole('button', { name: 'Sign Out' })).not.toBeInTheDocument();
  });

  it('renders session-based buttons correctly when session is provided', () => {
    const mockSession = {
      user: {
        id: '1',
        name: 'Test User',
        minions: [] as Minion[],
        mounts: [] as Mount[],
        orchestrions: [] as Orchestrion[],
        emotes: [] as Emote[],
        cards: [] as Card[],
        spells: [] as Spell[],
        hairstyles: [] as Hairstyle[],
      },
      expires: '100000',
    };
    render(<NavbarMenu session={mockSession} />);
    const menuButton = screen.getByRole('button', { name: 'Expand menu' });

    // Expand the menu
    act(() => {
      fireEvent.click(menuButton);
    });
    // Check if SignOutButton and SyncButton are rendered
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();

    // Check if SignInButton is not rendered
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
  });
});
