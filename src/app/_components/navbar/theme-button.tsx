/**
 * Button to toggle the theme between light and dark mode.
 *
 * @example
 * <ThemeButton />
 */

import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa6';

import Button from '@/app/_components/ui/button';

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      arialabel={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      className="group h-6 w-6 p-0 lg:h-8 lg:w-8"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <FaMoon name="light" size={20} className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <FaSun name="dark" size={20} className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </Button>
  );
}
export default ThemeButton;
