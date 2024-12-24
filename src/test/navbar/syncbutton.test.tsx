import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SyncButton from '@/app/_components/navbar/SyncButton';

vi.mock('@/hooks/useItemSync', () => ({
  __esModule: true,
  default: () => ({
    syncCollection: vi.fn(),
    isSyncing: false,
    getLocalItems: () => [],
  }),
}));

describe('Sync Button', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the SyncButton component with the button', () => {
    render(<SyncButton session={null} />);

    // Check if button is rendered
    expect(screen.getByRole('button', { name: 'Sync Collection' })).toBeInTheDocument();
  });
});
