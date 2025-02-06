import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { ExpandedMenu } from '@/app/_components/FilterMenu';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Mock } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('FilterMenu', () => {
  let mockPush: Mock;
  let mockHandleFilterChange: Mock;

  beforeEach(() => {
    mockPush = vi.fn();
    mockHandleFilterChange = vi.fn();

    (useRouter as unknown as Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as unknown as Mock).mockReturnValue(new URLSearchParams(''));

    render(<ExpandedMenu filter={false} handleFilterChange={mockHandleFilterChange} />);
  });

  it('renders the component correctly', () => {
    expect(screen.getByTestId('expandable-menu')).toBeInTheDocument();
  });

  it('calls handleFilterChange when filter button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /hide owned/i }));
    expect(mockHandleFilterChange).toHaveBeenCalledWith(true);
  });

  it('updates selected expansion when clicked', () => {
    const expansionButton = screen.getByRole('button', { name: /Heavensward/i });
    fireEvent.click(expansionButton);
    expect(mockPush).toHaveBeenCalledWith('?ex=hw');
  });

  it('removes the expansion query parameter when the same expansion is clicked again', () => {
    const expansionButton = screen.getByRole('button', { name: /Heavensward/i });
    fireEvent.click(expansionButton);
    expect(mockPush).toHaveBeenCalledWith('?ex=hw');

    fireEvent.click(expansionButton);
    expect(mockPush).toHaveBeenCalledWith('?');
  });
});
