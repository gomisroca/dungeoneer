import { render, screen } from '@testing-library/react';
import { type Session } from 'next-auth';
import React from 'react';
import { type ExpandedInstance } from 'types';
import { expect, vi } from 'vitest';

import InstanceListItem from '@/app/instance/[type]/item';
import * as useIsOwnedModule from '@/hooks/useCheckOwnership';

vi.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: { src: string; alt: string }) => <img data-testid="image" src={props.src} alt={props.alt} />,
}));

vi.mock('@/app/_components/item-selector', () => ({
  __esModule: true,
  default: (props: { instance: ExpandedInstance; session: Session | null; compact?: boolean }) => (
    <div data-testid="item-selectors" {...props} />
  ),
}));

describe('InstanceCard', () => {
  const mockInstance: ExpandedInstance = {
    id: 1,
    name: 'TestInstance',
    image: '/sources/Raid.png',
    description: 'This is a basic instance description.',
    patch: '1.0',
    cards: [],
    emotes: [],
    hairstyles: [],
    minions: [],
    mounts: [],
    orchestrions: [],
    spells: [],
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

  beforeEach(() => {
    vi.spyOn(useIsOwnedModule, 'useIsOwned').mockReturnValue(false);
    vi.spyOn(useIsOwnedModule, 'getOwnershipStatus').mockReturnValue('not-owned');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with no ownership and shows no indicator', () => {
    render(<InstanceListItem instance={mockInstance} session={mockSession} />);

    // Main container present
    const container = screen.getByTestId('instance-list-item');
    expect(container).toBeInTheDocument();

    // No check or cross icons
    expect(screen.queryByText('✔')).not.toBeInTheDocument();
    expect(screen.queryByText('✗')).not.toBeInTheDocument();

    // Title is capitalized first letter
    expect(screen.getByText('TestInstance')).toBeInTheDocument();

    // ItemSelectors rendered
    expect(screen.getByTestId('item-selectors')).toBeInTheDocument();
  });

  it('shows check icon and opacity when ownershipStatus is owned', () => {
    vi.spyOn(useIsOwnedModule, 'getOwnershipStatus').mockReturnValue('owned');
    render(<InstanceListItem instance={mockInstance} session={mockSession} />);

    expect(screen.getByText('✔')).toBeInTheDocument();

    const container = screen.getByTestId('instance-list-item');
    expect(container).toHaveClass('opacity-50');
  });

  it('shows cross icon and opacity when ownershipStatus is empty', () => {
    vi.spyOn(useIsOwnedModule, 'getOwnershipStatus').mockReturnValue('empty');
    render(<InstanceListItem instance={mockInstance} session={mockSession} />);

    expect(screen.getByText('✗')).toBeInTheDocument();

    const container = screen.getByTestId('instance-list-item');
    expect(container).toHaveClass('opacity-50');
  });
});
