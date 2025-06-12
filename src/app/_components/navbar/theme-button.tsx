'use client';

/**
 * Button to toggle the theme between light and dark mode.
 *
 * @example
 * <ThemeButton />
 */

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa6';

import Button from '@/app/_components/ui/button';

function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Button
      arialabel={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      className="group h-8 w-8 p-0 md:h-full md:w-full md:p-4"
      name={theme === 'dark' ? 'Light' : 'Dark'}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <FaMoon name="light" size={20} className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <FaSun name="dark" size={20} className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
    </Button>
  );
}
export default ThemeButton;
