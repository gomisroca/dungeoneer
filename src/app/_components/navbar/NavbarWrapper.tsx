import React from 'react';
import { getServerAuthSession } from '@/server/auth';
import StyledLink from '../ui/StyledLink';
import NavbarMenu from './NavbarMenu';

async function Navbar() {
  const session = await getServerAuthSession();
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex flex-row items-start justify-between p-4">
      <StyledLink href="/" className="pointer-events-auto p-2 md:p-4">
        <h1 className="text-lg font-bold md:text-xl">dungeoneer</h1>
      </StyledLink>
      {/* Basic Menu */}
      <NavbarMenu session={session} />
    </div>
  );
}

export default Navbar;
