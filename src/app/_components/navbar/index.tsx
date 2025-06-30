import dynamic from 'next/dynamic';
import React from 'react';

import NavbarMenu from '@/app/_components/navbar/navbar-menu';
import SilentSignIn from '@/app/_components/navbar/silent-signin';
import Link from '@/app/_components/ui/link';
import { auth } from '@/server/auth';

// Dynamically import the Message component for SSG and SSR
const Message = dynamic(() => import('@/app/_components/ui/message'));

async function Navbar() {
  const session = await auth();
  return (
    <>
      <SilentSignIn session={session} />
      <Message />
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-20 flex flex-row items-start justify-between p-4">
        <Link href="/" className="pointer-events-auto p-2 md:p-4">
          <h1 className="text-lg font-bold md:text-xl">dungeoneer</h1>
        </Link>
        {/* Basic Menu */}
        <NavbarMenu session={session} />
      </div>
    </>
  );
}

export default Navbar;
