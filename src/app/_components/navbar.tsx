import Link from 'next/link';
import React from 'react';
import ThemeButton from './themeButton';

function Navbar() {
  return (
    <div className="absolute left-0 right-0 top-0 flex flex-row items-center justify-between p-4">
      <Link
        href="/"
        className="rounded-xl p-3 text-xl font-bold backdrop-blur-sm transition duration-200 ease-in-out hover:bg-primary-300/80 hover:text-background-200 dark:hover:bg-primary-700/80 dark:hover:text-background-800">
        dungeoneer
      </Link>
      {/* Basic Menu */}
      <ThemeButton />
    </div>
  );
}

export default Navbar;
