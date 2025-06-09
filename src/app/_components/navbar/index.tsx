import React from 'react';
import { auth } from '@/server/auth';
import StyledLink from '../ui/StyledLink';
import NavbarMenu from './NavbarMenu';
import dynamic from 'next/dynamic';

// Dynamically import the Message component for SSG and SSR
const Message = dynamic(() => import('@/app/_components/ui/MessagePopup'));

async function Navbar() {
  const session = await auth();
  return (
    <>
      <Message />
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-20 flex flex-row items-start justify-between p-4">
        <StyledLink href="/" className="pointer-events-auto p-2 md:p-4">
          <h1 className="text-lg font-bold md:text-xl">dungeoneer</h1>
        </StyledLink>
        {/* Basic Menu */}
        <NavbarMenu session={session} />
      </div>
    </>
  );
}

export default Navbar;
