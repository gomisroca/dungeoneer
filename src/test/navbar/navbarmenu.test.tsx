import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavbarMenu from '@/app/_components/navbar/NavbarMenu';
import {
  type ExpandedCard,
  type ExpandedEmote,
  type ExpandedHairstyle,
  type ExpandedMinion,
  type ExpandedMount,
  type ExpandedOrchestrion,
  type ExpandedSpell,
} from 'types';

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

    // Initially, the menu should be collapsed
    const menu = screen.getByTestId('expandable-menu');
    expect(menu).toHaveClass('max-h-0 opacity-0');
    // Expand the menu
    act(() => {
      fireEvent.click(menuButton);
    });
    expect(menu).toHaveClass('max-h-[600px] overflow-visible opacity-100');

    // Collapse the menu
    act(() => {
      fireEvent.click(menuButton);
    });
    expect(menu).toHaveClass('max-h-0 opacity-0');
  });

  it('renders session-based buttons correctly when session is null', () => {
    render(<NavbarMenu session={null} />);

    // Check if SignInButton is rendered
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();

    // Check if SignOutButton and SyncButton are not rendered
    expect(screen.queryByRole('button', { name: 'Sign Out' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sync Collection' })).not.toBeInTheDocument();
  });

  it('renders session-based buttons correctly when session is provided', () => {
    const mockSession = {
      user: {
        id: '1',
        name: 'Test User',
        minions: [] as ExpandedMinion[],
        mounts: [] as ExpandedMount[],
        orchestrions: [] as ExpandedOrchestrion[],
        emotes: [] as ExpandedEmote[],
        cards: [] as ExpandedCard[],
        spells: [] as ExpandedSpell[],
        hairstyles: [] as ExpandedHairstyle[],
      },
      expires: '100000',
    };
    render(<NavbarMenu session={mockSession} />);

    // Check if SignOutButton and SyncButton are rendered
    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sync Collection' })).toBeInTheDocument();

    // Check if SignInButton is not rendered
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument();
  });
});