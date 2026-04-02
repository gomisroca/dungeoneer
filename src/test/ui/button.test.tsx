import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Button from '@/app/_components/ui/button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn().mockResolvedValue(undefined);
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(onClick).toHaveBeenCalledOnce());
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Click
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows pending state during async onClick', async () => {
    let resolve: () => void;
    const onClick = vi.fn().mockReturnValue(
      new Promise<void>((r) => {
        resolve = r;
      })
    );
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();
    resolve!();
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled());
  });

  it('applies disabled styles when disabled', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('opacity-50');
  });
});
