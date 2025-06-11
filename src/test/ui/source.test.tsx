import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Source from '@/app/_components/ui/source';

const mockSource = {
  id: 'source-id',
  type: 'minion',
  text: 'Minion description',
  minionId: 'minion-id',
};

describe('Source', () => {
  it('renders the Source component correctly', () => {
    render(<Source source={mockSource} />);

    expect(screen.getByAltText(mockSource.type)).toBeInTheDocument();
  });

  it('opens the tooltip when the image is clicked', async () => {
    render(<Source source={mockSource} />);

    const button = screen.getByRole('button', { name: 'minion' });
    act(() => {
      fireEvent.focus(button);
    });

    setTimeout(() => {
      expect(screen.getByText(mockSource.text)).toBeInTheDocument();
    }, 200);
  });
});
