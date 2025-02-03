import StyledLink from '@/app/_components/ui/StyledLink';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('StyledLink', () => {
  it('renders the StyledLink component correctly', () => {
    render(
      StyledLink({
        href: '/',
        children: <div>Home</div>,
      })
    );

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
  });

  it('renders the StyledLink component with custom class', () => {
    render(
      StyledLink({
        href: '/',
        children: <div>Home</div>,
        className: 'custom-class',
      })
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveClass('custom-class');
  });

  it('links to the correct href', () => {
    render(
      StyledLink({
        href: '/about',
        children: <div>About</div>,
      })
    );

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  });
});
