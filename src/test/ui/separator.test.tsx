import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from '@/app/_components/ui/separator';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');

    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveClass('h-[1px] w-full');
  });

  it('renders a vertical separator when specified', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId('separator');

    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('h-full w-[1px]');
  });

  it('applies additional className', () => {
    render(<Separator className="custom-class" data-testid="separator" />);
    const separator = screen.getByTestId('separator');

    expect(separator).toHaveClass('custom-class');
  });

  it('has decorative=true by default (role=none)', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');

    expect(separator).toHaveAttribute('role', 'none');
  });

  it('has role separator when decorative=false', () => {
    render(<Separator decorative={false} data-testid="separator" />);
    const separator = screen.getByTestId('separator');

    expect(separator).toHaveAttribute('role', 'separator');
  });
});
