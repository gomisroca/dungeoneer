'use client';

import { signIn } from 'next-auth/react';
import { FaKey } from 'react-icons/fa6';

import Button from '@/app/_components/ui/button';

function SignInButton() {
  return (
    <Button
      arialabel="Sign In"
      name="Sign In"
      onClick={() => signIn('discord')}
      className="h-8 w-8 p-0 md:h-full md:w-full md:p-4">
      <FaKey size={20} />
      <span className="sr-only">Sign In</span>
    </Button>
  );
}

export default SignInButton;
