'use client';

/**
 * Sign out button component.
 *
 * @example
 * <SignOutButton />
 */

import { signOut } from 'next-auth/react';
import Button from '../ui/Button';
import { FaUserLarge } from 'react-icons/fa6';

function SignOutButton() {
  return (
    <Button name="Sign Out" onClick={() => signOut()} className="h-[35px] w-[35px] p-0 md:h-full md:w-full md:p-4">
      <FaUserLarge size={20} />
      <span className="sr-only">Sign Out</span>
    </Button>
  );
}

export default SignOutButton;
