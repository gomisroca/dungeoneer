import Link from 'next/link';
import React from 'react';
import ThemeButton from './themeButton';

function Navbar() {
  return (
    <div className="absolute left-0 right-0 top-0 flex flex-row items-center justify-between p-4">
      <Link
        href="/"
        className="rounded-xl p-3 text-xl font-bold backdrop-blur-sm transition duration-200 ease-in-out hover:bg-cyan-300 hover:text-stone-900 dark:hover:bg-cyan-700 dark:hover:text-stone-100">
        dungeoneer
      </Link>
      {/* Basic Menu */}
      <ThemeButton />
    </div>
  );
}

export default Navbar;
