import { act, fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { describe, expect, it, type Mock, vi } from 'vitest';

import ThemeButton from '@/app/_components/navbar/theme-button';

// Mock the useTheme hook
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('Theme Button', () => {
  it('renders the theme button with icons', () => {
    // Mock the theme state as light initially
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeButton />);

    // Check if button and icon are rendered
    expect(screen.getByRole('button', { name: 'Dark Mode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dark Mode' })).toContainHTML('svg');
  });

  it('toggles the theme from light to dark when clicked', () => {
    const setThemeMock = vi.fn();

    // Mock the theme state as light initially
    (useTheme as Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeButton />);

    const button = screen.getByRole('button', { name: 'Dark Mode' });

    // Simulate clicking the button
    act(() => {
      fireEvent.click(button);
    });

    // Ensure setTheme is called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('toggles the theme from dark to light when clicked', () => {
    const setThemeMock = vi.fn();

    // Mock the theme state as dark initially
    (useTheme as Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeButton />);

    const button = screen.getByRole('button', { name: 'Light Mode' });

    // Simulate clicking the button
    act(() => {
      fireEvent.click(button);
    });

    // Ensure setTheme is called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
