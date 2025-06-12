import { act, fireEvent, render, screen } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { describe, expect, it, vi } from 'vitest';

import SignInButton from '@/app/_components/navbar/sign-in';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('SigninButton', () => {
  it('should render correctly', () => {
    render(<SignInButton />);

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toContainHTML('svg');
  });

  it('should call signIn function when clicked', () => {
    render(<SignInButton />);

    const button = screen.getByRole('button', { name: 'Sign In' });

    act(() => {
      fireEvent.click(button);
    });

    expect(signIn).toHaveBeenCalledWith('discord');
  });
});
