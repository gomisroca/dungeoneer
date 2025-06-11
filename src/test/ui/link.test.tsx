import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Link from '@/app/_components/ui/link';

describe('Link', () => {
  it('renders the Link component correctly', () => {
    render(
      Link({
        href: '/',
        children: <div>Home</div>,
      })
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders the Link component with custom class', () => {
    render(
      Link({
        href: '/',
        children: <div>Home</div>,
        className: 'custom-class',
      })
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('custom-class');
  });

  it('links to the correct href', () => {
    render(
      Link({
        href: '/about',
        children: <div>About</div>,
      })
    );

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });
});
