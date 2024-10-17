import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { useTheme } from 'next-themes';
import ThemeButton from '@/app/_components/themeButton';

// Mock the useTheme hook
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('Theme Button', () => {
  it('renders the theme button with icons', () => {
    // Mock the theme state as light initially
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeButton />);

    // Check if button and icon are rendered
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dark/i })).toContainHTML('svg');
  });

  it('toggles the theme from light to dark when clicked', () => {
    const setThemeMock = vi.fn();

    // Mock the theme state as light initially
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeButton />);

    const button = screen.getByRole('button', { name: /dark/i });

    // Simulate clicking the button
    fireEvent.click(button);

    // Ensure setTheme is called with 'dark'
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('toggles the theme from dark to light when clicked', () => {
    const setThemeMock = vi.fn();

    // Mock the theme state as dark initially
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeButton />);

    const button = screen.getByRole('button', { name: /light/i });

    // Simulate clicking the button
    fireEvent.click(button);

    // Ensure setTheme is called with 'light'
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
