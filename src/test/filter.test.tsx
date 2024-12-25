import Filter from '@/app/_components/Filter';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

describe('Filter Component', () => {
  it('renders the Filter component with the button', () => {
    const mockOnFilterChange = vi.fn();
    render(<Filter onFilterChange={mockOnFilterChange} />);

    // Check if button is rendered
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument();
  });

  it('toggles the filter state and calls onFilterChange with the correct argument', () => {
    const mockOnFilterChange = vi.fn();
    render(<Filter onFilterChange={mockOnFilterChange} />);

    const button = screen.getByRole('button', { name: 'Filter' });

    // Initial state should be false, so it should show MdFilterList icon
    expect(button).toContainElement(screen.getByText('Filter'));

    // Simulate clicking the button
    act(() => {
      fireEvent.click(button);
    });

    // After clicking, it should call onFilterChange with true
    expect(mockOnFilterChange).toHaveBeenCalledWith(true);
    // Button should now show MdFilterListOff icon
    expect(button).toContainElement(screen.getByText('Filter Off'));

    // Simulate clicking the button again
    act(() => {
      fireEvent.click(button);
    });

    // After clicking again, it should call onFilterChange with false
    expect(mockOnFilterChange).toHaveBeenCalledWith(false);
    // Button should now show MdFilterList icon again
    expect(button).toContainElement(screen.getByText('Filter'));
  });
});
