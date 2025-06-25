import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LoadingSpinner from '@/app/_components/ui/loading-spinner';

describe('LoadingSpinner', () => {
  it('renders the spinner element', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('includes visually hidden text for accessibility', () => {
    render(<LoadingSpinner />);

    const hiddenText = screen.getByText('Loading...');
    expect(hiddenText).toBeInTheDocument();
    expect(hiddenText).toHaveClass('sr-only');
  });
});
