import { act, fireEvent, render, screen } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import { describe, expect, it, vi } from 'vitest';

import SignOutButton from '@/app/_components/navbar/sign-out';

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

describe('SignoutButton', () => {
  it('should render correctly', () => {
    render(<SignOutButton />);

    expect(screen.getByRole('button', { name: 'Sign Out' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Out' })).toContainHTML('svg');
  });

  it('should call signIn function when clicked', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: 'Sign Out' });

    act(() => {
      fireEvent.click(button);
    });

    expect(signOut).toHaveBeenCalled();
  });
});
