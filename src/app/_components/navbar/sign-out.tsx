'use client';

/**
 * Sign out button component.
 *
 * @example
 * <SignOutButton />
 */

import { signOut } from 'next-auth/react';
import { MdOutlineExitToApp } from 'react-icons/md';

import Button from '@/app/_components/ui/button';

function SignOutButton() {
  return (
    <Button
      arialabel="Sign Out"
      name="Sign Out"
      onClick={() => signOut()}
      className="h-8 w-8 cursor-pointer p-0 md:h-full md:w-full md:p-4">
      <MdOutlineExitToApp size={20} />
      <span className="sr-only">Sign Out</span>
    </Button>
  );
}

export default SignOutButton;
